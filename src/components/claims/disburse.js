import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Grid, Backdrop, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { disburseFormValidation } from "../createClubComps/ValidationSchemas";
import { useAccount, useChainId } from "wagmi";
import { getTokensList, getTokensListOfManta } from "api/token";
import { getUserTokenData, isValidAddress } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import DisburseForm from "@components/claimsPageComps/DisburseForm";
import { convertToWeiGovernance } from "utils/globalFunctions";
import useDropsContractMethods from "hooks/useDropsContractMethods";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { setAlertData } from "redux/reducers/alert";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const CreateDisburse = () => {
  const classes = useStyles();
  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);
  const router = useRouter();
  const dispatch = useDispatch();

  const { disburse } = useDropsContractMethods();

  const { approveDeposit } = useCommonContractMethods();

  const [tokensInWallet, setTokensInWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const fetchTokens = async () => {
    try {
      if (networkId === "0xa9") {
        const tokensList = await getTokensListOfManta(walletAddress);
        return tokensList?.data?.result;
      }

      const covalentNetworkName = CHAIN_CONFIG[networkId]?.covalentNetworkName;
      if (!covalentNetworkName) {
        throw new Error("Unsupported network ID");
      }

      const tokensList = await getTokensList(
        covalentNetworkName,
        walletAddress,
      );

      return tokensList?.data?.items;
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentAccount = async () => {
    try {
      setLoadingTokens(true);
      if (networkId && walletAddress) {
        const tokenItems = await fetchTokens(networkId, walletAddress);

        const useMantaConfig = networkId === "0xa9";
        const data = await getUserTokenData(
          tokenItems,
          networkId,
          useMantaConfig,
        );

        setTokensInWallet(
          data?.filter(
            (token) => token.symbol !== null && token.symbol !== undefined,
          ),
        );
        setLoadingTokens(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentAccount();
  }, [walletAddress, networkId]);

  const disburseForm = useFormik({
    initialValues: {
      selectedToken: "",
      disburseList: "",
    },
    validationSchema: disburseFormValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { selectedToken } = values;
        const disburseAddresses = [];
        const disburseAmounts = [];

        values.disburseList.split("\n").forEach((item) => {
          const [address, amount] = item.split(",");
          if (
            isValidAddress(address) &&
            !isNaN(Number(amount)) &&
            Number(amount) > 0
          ) {
            disburseAddresses.push(address);
            disburseAmounts.push(Number(amount));
          } else {
            setLoading(false);
            dispatch(
              setAlertData({
                open: true,
                message: "Invalid disburse list format",
                severity: "error",
              }),
            );
          }
        });

        if (disburseAddresses.length !== disburseAmounts.length) {
          setLoading(false);
          dispatch(
            setAlertData({
              open: true,
              message: "Invalid disburse list format",
              severity: "error",
            }),
          );
          return;
        }

        const totalAmount = disburseAmounts.reduce(
          (partialSum, a) => partialSum + a,
          0,
        );

        if (
          convertToWeiGovernance(totalAmount, selectedToken.decimals) >
          Number(selectedToken.balance)
        ) {
          setLoading(false);
          dispatch(
            setAlertData({
              open: true,
              message:
                "Your wallet does not have enough balance for the disburse",
              severity: "error",
            }),
          );
          return;
        }

        await approveDeposit(
          selectedToken.address,
          CHAIN_CONFIG[networkId].disburseContractAddress,
          totalAmount ?? 0,
          selectedToken?.decimals,
        );

        await disburse(
          selectedToken.address === CHAIN_CONFIG[networkId].nativeToken,
          selectedToken.address,
          disburseAddresses,
          disburseAmounts.map((item) =>
            convertToWeiGovernance(item, selectedToken.decimals),
          ),
        );

        setLoading(false);
        dispatch(
          setAlertData({
            open: true,
            message: "Tokens disbursed successfully",
            severity: "success",
          }),
        );

        setTimeout(() => {
          router.push(`/claims/`);
        }, 1000);
      } catch (e) {
        setLoading(false);
        dispatch(
          setAlertData({
            open: true,
            message: e.message,
            severity: "error",
          }),
        );
      }
    },
  });

  return (
    <>
      <div className={classes.container}>
        <Grid container>
          <Grid item xs={12} sx={{ padding: "20px" }}>
            <DisburseForm
              formik={disburseForm}
              tokensInWallet={tokensInWallet}
              isLoading={loadingTokens}
            />
          </Grid>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}>
          <CircularProgress />
        </Backdrop>
      </div>
    </>
  );
};

export default CreateDisburse;
