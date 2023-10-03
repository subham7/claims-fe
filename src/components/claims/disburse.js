import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Grid, FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { disburseFormValidation } from "../createClubComps/ValidationSchemas";
import { useAccount, useNetwork } from "wagmi";
import { getTokensList } from "api/token";
import { getUserTokenData, isValidAddress } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import DisburseForm from "@components/claimsPageComps/DisburseForm";

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
  const [showError, setShowError] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [loadingTokens, setLoadingTokens] = useState(false);

  const classes = useStyles();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const router = useRouter();

  const getCurrentAccount = async () => {
    try {
      setLoadingTokens(true);
      if (networkId && walletAddress) {
        const tokensList = await getTokensList(
          CHAIN_CONFIG[networkId].covalentNetworkName,
          walletAddress,
        );

        const data = await getUserTokenData(tokensList?.data?.items, networkId);
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
      description: "",
      selectedToken: "",
      disburseList: "",
    },
    validationSchema: disburseFormValidation,
    onSubmit: (values) => {
      const disburseAddresses = [];
      const disburseAmounts = [];
      values.disburseList.split("\n").forEach((item) => {
        const [address, amount] = item.split(",");
        if (isValidAddress(address) && !isNaN(Number(amount))) {
          disburseAddresses.push(address);
          disburseAmounts.push(Number(amount));
        } else {
          setShowError(true);
          setError("Invalid disburse list format");
        }
      });

      const totalAmount = disburseAmounts.reduce(
        (partialSum, a) => partialSum + a,
        0,
      );

      if (totalAmount > values.selectedToken.balance) {
        setShowError(true);
        setError("Your wallet does not have enough balance for the disburse");
      }
    },
  });

  const showMessageHandler = (setState) => {
    setState(true);
    setTimeout(() => {
      setState(false);
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
          {disburseForm.errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>
                {disburseForm.errors.submit}
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
};

export default CreateDisburse;
