import About from "@components/claims/About";
import ClaimActivity from "@components/claims/ClaimActivity";
import Eligibility from "@components/claims/Eligibility";
import Header from "@components/claims/Header";
import { Alert, Backdrop, CircularProgress } from "@mui/material";
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

const NewErc20 = ({
  clubInfo,
  daoAddress,
  remainingClaimAmount,
  daoDetails,
  isEligibleForTokenGating,
  isTokenGated,
  whitelistUserData,
  networkId,
  gatedTokenDetails,
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

          <DepositPreRequisites />
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
              src={"/assets/images/claimsBanner.png"}
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

        <ClaimActivity
          isDeposit={true}
          activityDetails={members}
          tokenDetails={tokenDetails}
        />
      </section>

      {showMessage ? (
        <Alert
          severity={depositSuccessfull ? "success" : "error"}
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      ) : null}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>
    </main>
  );
};

export default NewErc20;
