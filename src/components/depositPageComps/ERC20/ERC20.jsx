import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import About from "../ERC721/About";
import Header from "../ERC721/Header";
import classes from "./ERC20.module.scss";
import * as yup from "yup";
import { useRouter } from "next/router";
import { Alert, Backdrop, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import Deposit from "./Deposit";
import ERC20Details from "./ERC20Details";
import { useAccount } from "wagmi";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";

const ERC20 = ({
  clubInfo,
  daoAddress,
  remainingClaimAmount,
  daoDetails,
  isEligibleForTokenGating,
  isTokenGated,
  whitelistUserData,
  networkId,
}) => {
  const [active, setActive] = useState(false);
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenDecimal: 0,
    userBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [depositSuccessfull, setDepositSuccessfull] = useState(false);

  const { address: walletAddress } = useAccount();
  const router = useRouter();

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);

  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  // const remainingTimeInHours = day2.diff(day1, "hours");

  const { approveDeposit, getDecimals, getTokenSymbol, getBalance } =
    useCommonContractMethods();

  const { buyGovernanceTokenERC20DAO } = useAppContractMethods();

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const Deposit_Token_Address = useSelector((state) => {
    return state.club.factoryData.depositTokenAddress;
  });

  const minValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(
        Number(
          convertFromWeiGovernance(
            clubData?.minDepositAmount,
            erc20TokenDetails?.tokenDecimal,
          ),
        ),
        "Amount should be greater than min deposit",
      )
      .lessThan(
        erc20TokenDetails.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        Number(
          convertFromWeiGovernance(
            clubData?.maxDepositAmount,
            erc20TokenDetails?.tokenDecimal,
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
        erc20TokenDetails?.tokenBalance,
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
          erc20TokenDetails?.tokenDecimal,
        );

        await approveDeposit(
          Deposit_Token_Address,
          FACTORY_CONTRACT_ADDRESS,
          inputValue,
          erc20TokenDetails?.tokenDecimal,
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
        formik.values.tokenInput = 0;
      } catch (error) {
        console.log(error);
        setDepositSuccessfull(false);
        setLoading(false);
        showMessageHandler();
      }
    },
  });

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const fetchTokenDetails = useCallback(async () => {
    try {
      const decimals = await getDecimals(Deposit_Token_Address);
      const symbol = await getTokenSymbol(Deposit_Token_Address);
      const userBalance = await getBalance(Deposit_Token_Address);

      setErc20TokenDetails({
        tokenSymbol: symbol,
        tokenDecimal: decimals,
        userBalance: convertFromWeiGovernance(userBalance, decimals),
      });
    } catch (error) {
      console.log(error);
    }
  }, [Deposit_Token_Address]);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  useEffect(() => {
    if (day2 >= day1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1]);

  return (
    <div className={classes.pageContainer}>
      <div className={classes.mainContainer}>
        <div className={classes.leftContainer}>
          <Header
            daoAddress={daoAddress}
            active={active}
            clubData={clubData}
            clubInfo={clubInfo}
            deadline={daoDetails.depositDeadline}
          />

          <ERC20Details
            clubData={clubData}
            erc20TokenDetails={erc20TokenDetails}
            isTokenGated={isTokenGated}
            whitelistUserData={whitelistUserData}
          />
        </div>

        <Deposit
          clubData={clubData}
          erc20TokenDetails={erc20TokenDetails}
          formik={formik}
          isEligibleForTokenGating={isEligibleForTokenGating}
          isTokenGated={isTokenGated}
          remainingClaimAmount={remainingClaimAmount}
          remainingDays={remainingDays}
          remainingTimeInSecs={remainingTimeInSecs}
          whitelistUserData={whitelistUserData}
        />
      </div>

      {clubInfo?.bio ? (
        <About bio={clubInfo?.bio} daoAddress={daoAddress} />
      ) : null}

      {depositSuccessfull && showMessage ? (
        <Alert
          severity="success"
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          Transaction Successfull
        </Alert>
      ) : (
        !depositSuccessfull &&
        showMessage && (
          <Alert
            severity="error"
            sx={{
              width: "250px",
              position: "fixed",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            Transaction Failed
          </Alert>
        )
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
};

export default ERC20;
