import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Grid, Backdrop, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { disburseFormValidation } from "../createClubComps/ValidationSchemas";
import { useAccount, useNetwork } from "wagmi";
import { getTokensList } from "api/token";
import { getUserTokenData, isValidAddress } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import DisburseForm from "@components/claimsPageComps/DisburseForm";
import { convertToWeiGovernance } from "utils/globalFunctions";
import useDropsContractMethods from "hooks/useDropsContractMethods";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import CustomAlert from "@components/common/CustomAlert";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const CreateDisburse = () => {
  const [tokensInWallet, setTokensInWallet] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccessFull, setIsSuccessFull] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const classes = useStyles();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const router = useRouter();

  const { disburse } = useDropsContractMethods();

  const { approveDeposit } = useCommonContractMethods();

  const getCurrentAccount = async () => {
    try {
      setLoadingTokens(true);
      if (networkId && walletAddress) {
        const tokensList = await getTokensList(
          CHAIN_CONFIG[networkId].covalentNetworkName,
          walletAddress,
        );

        const data = await getUserTokenData(
          tokensList?.data?.items,
          networkId,
          true,
        );
        setTokensInWallet(data?.filter((token) => token.symbol !== null));
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
            showMessageHandler();
            setIsSuccessFull(false);
            throw new Error("Invalid disburse list format");
          }
        });

        if (disburseAddresses.length !== disburseAmounts.length) {
          setLoading(false);
          showMessageHandler();
          setIsSuccessFull(false);
          setMessage("Invalid disburse list format");
          return;
        }

        const totalAmount = disburseAmounts.reduce(
          (partialSum, a) => partialSum + Number(a),
          0,
        );

        if (
          convertToWeiGovernance(totalAmount, selectedToken.decimals) >
          Number(selectedToken.balance)
        ) {
          setLoading(false);
          showMessageHandler();
          setIsSuccessFull(false);
          setMessage(
            "Your wallet does not have enough balance for the disburse",
          );
          return;
        }

        await approveDeposit(
          selectedToken.address,
          CHAIN_CONFIG[networkId].disburseContractAddress,
          convertToWeiGovernance(totalAmount, selectedToken.decimals),
          1, //Passing 1 as the value is already converted
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
        showMessageHandler();
        setIsSuccessFull(true);
        setMessage("Tokens disbursed successfully");

        setTimeout(() => {
          router.push(`/claims/`);
        }, 1000);
      } catch (e) {
        showMessageHandler();
        setIsSuccessFull(false);
        setLoading(false);
        setMessage(e.message);
      }
    },
  });

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

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

        {showMessage && (
          <CustomAlert alertMessage={message} severity={isSuccessFull} />
        )}

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
