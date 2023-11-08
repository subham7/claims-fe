import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { queryLatestMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import dayjs from "dayjs";
import DepositInput from "./DepositInput";
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
import { getDocumentsByClubId } from "api/document";
import PublicPageLayout from "@components/common/PublicPageLayout";
import DepositPreRequisites from "../DepositPreRequisites";
import { CHAIN_CONFIG } from "utils/constants";

const DepositInputComponents = ({
  formik,
  tokenDetails,
  isDepositDisabled,
  clubData,
  depositPreRequisitesProps,
}) => {
  return (
    <>
      <DepositPreRequisites {...depositPreRequisitesProps} />
      <DepositInput
        formik={formik}
        tokenDetails={tokenDetails}
        isDisabled={isDepositDisabled}
      />
      <DepositDetails contractData={clubData} tokenDetails={tokenDetails} />
    </>
  );
};

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

  const { approveDeposit, getDecimals, getTokenSymbol, getBalance } =
    useCommonContractMethods();

  const { buyGovernanceTokenERC20DAO } = useAppContractMethods({ daoAddress });
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
          CHAIN_CONFIG[networkId].usdcAddress,
          CHAIN_CONFIG[networkId].factoryContractAddress,
          values.tokenInput,
          tokenDetails?.tokenDecimal,
        );

        await buyGovernanceTokenERC20DAO(
          walletAddress,
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
      const depositTokenAddress = CHAIN_CONFIG[networkId].usdcAddress;
      const decimals = await getDecimals(depositTokenAddress);
      const symbol = await getTokenSymbol(depositTokenAddress);
      const userBalance = await getBalance(depositTokenAddress);

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

  const isDepositDisabled = () => {
    if (
      typeof isSigned !== "undefined" &&
      typeof isW8BenSigned !== "undefined"
    ) {
      if (!isSigned) return true;
      if (!isW8BenSigned) return true;
    }
    const isRemainingTimeInvalid =
      remainingDays < 0 || remainingTimeInSecs <= 0;
    if (isRemainingTimeInvalid) return true;
    if (isTokenGated && !isEligibleForTokenGating) return true;
    if (+clubData?.raiseAmount <= +clubData?.totalAmountRaised) return true;
    if (+remainingClaimAmount <= 0) return true;
    if (
      whitelistUserData?.setWhitelist === true &&
      whitelistUserData?.proof === null
    )
      return true;
    return false;
  };

  useEffect(() => {
    fetchDocs();
  }, [daoAddress, depositConfig?.uploadDocId]);

  useEffect(() => {
    fetchTokenDetails();
  }, []);

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
    <PublicPageLayout
      clubData={clubData}
      tokenDetails={tokenDetails}
      headerProps={{
        contractData: clubData,
        deadline: daoDetails?.depositDeadline,
        tokenDetails: tokenDetails,
        isDeposit: true,
        isActive: active,
      }}
      inputComponents={
        <DepositInputComponents
          clubData={clubData}
          formik={formik}
          isDepositDisabled={isDepositDisabled()}
          tokenDetails={tokenDetails}
          depositPreRequisitesProps={{
            uploadedDocInfo: uploadedDocInfo,
            daoAddress: daoAddress,
            onIsSignedChange: handleIsSignedChange,
            onIsW8BenSignedChange: handleIsW8BenSignedChange,
          }}
        />
      }
      socialData={clubInfo}
      imgUrl={"/assets/images/depositBanner2.png"}
      isDeposit={true}
      bio={clubInfo?.bio}
      eligibilityProps={{
        gatedTokenDetails: gatedTokenDetails,
        isDeposit: true,
        isTokenGated: isTokenGated,
        isWhitelist: whitelistUserData?.setWhitelist,
      }}
      members={members}
      message={message}
      isSuccessfull={depositSuccessfull}
      loading={loading}
      showMessage={showMessage}
    />
  );
};

export default ERC20;
