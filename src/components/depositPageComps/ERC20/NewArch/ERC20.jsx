import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QUERY_CLUB_DETAILS } from "../../../../api/graphql/queries";
import useSmartContractMethods from "../../../../hooks/useSmartContractMethods";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../../../utils/globalFunctions";
import { subgraphQuery } from "../../../../utils/subgraphs";
import About from "../../ERC721/NewArch/About";
import Header from "../../ERC721/NewArch/Header";
import classes from "./ERC20.module.scss";
import * as yup from "yup";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { showWrongNetworkModal } from "../../../../utils/helper";
import { Alert, Backdrop, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import Deposit from "./Deposit";
import ERC20Details from "./ERC20Details";

const ERC20 = ({
  clubInfo,
  daoAddress,
  remainingClaimAmount,
  daoDetails,
  isEligibleForTokenGating,
  isTokenGated,
}) => {
  const [clubData, setClubData] = useState([]);
  const [active, setActive] = useState(false);
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenDecimal: 0,
    userBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [depositSuccessfull, setDepositSuccessfull] = useState(false);

  const [{ wallet }] = useConnectWallet();
  const networkId = wallet?.chains[0].id;
  const router = useRouter();
  const walletAddress = wallet?.accounts[0].address;

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);

  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  // const remainingTimeInHours = day2.diff(day1, "hours");

  const {
    approveDeposit,
    getDecimals,
    getTokenSymbol,
    getBalance,
    buyGovernanceTokenERC20DAO,
  } = useSmartContractMethods();

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
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
        console.log(values.tokenInput);
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
          [],
        );

        setLoading(false);
        setDepositSuccessfull(true);
        router.push(`/dashboard/${daoAddress}`, undefined, {
          shallow: true,
        });
        showMessageHandler();
        formik.values.tokenInput = 0;
      } catch (error) {
        console.log(error);
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
    const fetchSubgraphData = async () => {
      const response = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_CLUB_DETAILS(daoAddress),
      );

      if (response) {
        const { stations } = response;
        setClubData(stations[0]);
      }
    };

    if (daoAddress) {
      fetchSubgraphData();
    }
  }, [SUBGRAPH_URL, daoAddress]);

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
            active={active}
            clubData={clubData}
            clubInfo={clubInfo}
            deadline={daoDetails.depositDeadline}
          />

          <ERC20Details
            clubData={clubData}
            erc20TokenDetails={erc20TokenDetails}
            isTokenGated={isTokenGated}
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
        />
      </div>

      {clubInfo?.bio ? (
        <About bio={clubInfo?.bio} daoAddress={daoAddress} />
      ) : null}

      {showWrongNetworkModal(wallet, networkId)}

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
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ERC20;
