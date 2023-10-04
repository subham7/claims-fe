import About from "@components/common/About";
import Eligibility from "@components/common/Eligibility";
import Header from "@components/common/Header";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { queryLatestMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import classes from "../../../components/claims/Claim.module.scss";
import dayjs from "dayjs";
import SocialButtons from "@components/common/SocialButtons";
import DepositInput from "./DepositInput";
import DepositPreRequisites from "../DepositPreRequisites";
import { useFormik } from "formik";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import * as yup from "yup";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import DepositDetails from "./DepositDetails";
import DepositProgress from "./DepositProgress";
import CustomAlert from "@components/common/CustomAlert";
import { getDocumentsByClubId } from "api/document";
import BackdropLoader from "@components/common/BackdropLoader";
import Activity from "@components/common/Activity";

const ERC20 = ({
  clubInfo,
  daoAddress,
  remainingClaimAmount,
  daoDetails,
  isEligibleForTokenGating,
  isTokenGated,
  whitelistUserData,
  networkId,
  gatedTokenDetails,
  depositConfig,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [depositSuccessfull, setDepositSuccessfull] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 6,
    tokenSymbol: "USDC",
    userBalance: 0,
  });
  const [members, setMembers] = useState([]);
  const [uploadedDocInfo, setUploadedDocInfo] = useState({});
  const [isSigned, setIsSigned] = useState(false);
  const [isW8BenSigned, setIsW8BenSigned] = useState(false);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const Deposit_Token_Address = useSelector((state) => {
    return state.club.factoryData.depositTokenAddress;
  });

  const { approveDeposit, getDecimals, getTokenSymbol, getBalance } =
    useCommonContractMethods();

  const { buyGovernanceTokenERC20DAO } = useAppContractMethods();
  const { address: walletAddress } = useAccount();

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const router = useRouter();
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

  const fetchActivities = async () => {
    try {
      const { users } = await queryLatestMembersFromSubgraph(
        daoAddress,
        networkId,
      );
      if (users) setMembers(users);
    } catch (error) {
      console.log(error);
    }
  };

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const handleIsSignedChange = (newValue) => {
    setIsSigned(newValue);
  };

  const handleIsW8BenSignedChange = (newValue) => {
    setIsW8BenSigned(newValue);
  };

  const minValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(
        Number(
          convertFromWeiGovernance(
            clubData?.minDepositAmount,
            tokenDetails?.tokenDecimal,
          ),
        ),
        "Amount should be greater than min deposit",
      )
      .lessThan(
        tokenDetails.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        Number(
          convertFromWeiGovernance(
            clubData?.maxDepositAmount,
            tokenDetails?.tokenDecimal,
          ),
        ),
        "Amount should be less than max deposit",
      ),
  });

  const remainingValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(0.0000001, "Amount should be greater than min deposit")
      .lessThan(
        tokenDetails?.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        remainingClaimAmount,
        "Amount should be less than remaining deposit amount",
      ),
  });

  const formik = useFormik({
    initialValues: {
      tokenInput: 0,
    },
    validationSchema:
      remainingClaimAmount === undefined ? minValidation : remainingValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const inputValue = convertToWeiGovernance(
          values.tokenInput,
          tokenDetails?.tokenDecimal,
        );

        await approveDeposit(
          Deposit_Token_Address,
          FACTORY_CONTRACT_ADDRESS,
          inputValue,
          tokenDetails?.tokenDecimal,
        );

        await buyGovernanceTokenERC20DAO(
          walletAddress,
          daoAddress,
          convertToWeiGovernance(
            (inputValue / +clubData?.pricePerToken).toString(),
            18,
          ),
          whitelistUserData?.proof ? whitelistUserData.proof : [],
        );

        setLoading(false);
        setDepositSuccessfull(true);
        router.push(`/dashboard/${daoAddress}/${networkId}`, undefined, {
          shallow: true,
        });
        showMessageHandler();
        setMessage("Deposit Successful");
        formik.values.tokenInput = 0;
      } catch (error) {
        console.log(error);
        setDepositSuccessfull(false);
        setLoading(false);
        setMessage("Deposit Failed");
        showMessageHandler();
      }
    },
  });

  const fetchTokenDetails = async () => {
    try {
      const decimals = await getDecimals(Deposit_Token_Address);
      const symbol = await getTokenSymbol(Deposit_Token_Address);
      const userBalance = await getBalance(Deposit_Token_Address);

      setTokenDetails({
        tokenSymbol: symbol,
        tokenDecimal: decimals,
        userBalance: convertFromWeiGovernance(userBalance, decimals),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDocs = async () => {
    try {
      const docList = await getDocumentsByClubId(daoAddress.toLowerCase());

      const document = docList.find(
        (doc) => doc.docIdentifier === depositConfig?.uploadDocId,
      );
      setUploadedDocInfo(document);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [daoAddress, depositConfig?.uploadDocId]);

  useEffect(() => {
    if (Deposit_Token_Address) fetchTokenDetails();
  }, [Deposit_Token_Address]);

  useEffect(() => {
    if (daoAddress) {
      fetchActivities();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (day2 >= day1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1]);

  return (
    <main className={classes.main}>
      <section className={classes.leftContainer}>
        <div>
          <Header
            contractData={clubData}
            isActive={active}
            tokenDetails={tokenDetails}
            deadline={daoDetails.depositDeadline}
            isDeposit={true}
          />
          <DepositPreRequisites
            daoAddress={daoAddress}
            uploadedDocInfo={uploadedDocInfo}
            onIsSignedChange={handleIsSignedChange}
            onIsW8BenSignedChange={handleIsW8BenSignedChange}
          />
          <DepositInput
            clubData={clubData}
            isTokenGated={isTokenGated}
            isEligibleForTokenGating={isEligibleForTokenGating}
            remainingDays={remainingDays}
            remainingTimeInSecs={remainingTimeInSecs}
            whitelistUserData={whitelistUserData}
            formik={formik}
            tokenDetails={tokenDetails}
            remainingClaimAmount={remainingClaimAmount}
            isSigned={isSigned}
            isW8BenSigned={isW8BenSigned}
          />
          <DepositDetails contractData={clubData} tokenDetails={tokenDetails} />
        </div>
        <SocialButtons isDeposit={true} data={clubInfo} />
      </section>

      <section className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          {/* {generalInfo?.imageLinks?.banner ? ( */}
          <div className={classes.imageContainer}>
            <Image
              src={"/assets/images/tempBanner.jpg"}
              fill
              alt="Banner Image"
            />
          </div>
          {/* ) : null} */}
        </div>

        <DepositProgress clubData={clubData} tokenDetails={tokenDetails} />

        {clubInfo?.bio && <About bio={clubInfo?.bio} />}

        {clubData && (
          <Eligibility
            gatedTokenDetails={gatedTokenDetails}
            isDeposit={true}
            isTokenGated={isTokenGated}
            isWhitelist={whitelistUserData?.setWhitelist}
          />
        )}

        <Activity
          isDeposit={true}
          activityDetails={members}
          tokenDetails={tokenDetails}
        />
      </section>

      {showMessage ? (
        <CustomAlert alertMessage={message} severity={depositSuccessfull} />
      ) : null}

      <BackdropLoader isOpen={loading} />
    </main>
  );
};

export default ERC20;
