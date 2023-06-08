import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, FormHelperText, Alert } from "@mui/material";
import ClaimStep1 from "../../src/components/claimsPageComps/ClaimStep1";
import ClaimStep2 from "../../src/components/claimsPageComps/ClaimStep2";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
import * as yup from "yup";
import { getAssetsByDaoAddress } from "../../src/api/assets";
import { convertToWeiGovernance } from "../../src/utils/globalFunctions";
import { createClaim } from "../../src/api/claims";
import {
  CLAIM_FACTORY_ADDRESS_GOERLI,
  CLAIM_FACTORY_ADDRESS_POLYGON,
} from "../../src/api";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { web3InstanceEthereum } from "../../src/utils/helper";
import useSmartContractMethods from "../../src/hooks/useSmartContractMethods";
import useSmartContract from "../../src/hooks/useSmartContract";
import WrongNetworkModal from "../../src/components/modals/WrongNetworkModal";
import Layout1 from "../../src/components/layouts/layout1";
import Image from "next/image";

const steps = ["Step1", "Step2"];

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const Form = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tokensInWallet, setTokensInWallet] = useState(null);
  const [currentAccount, setCurrentAccount] = useState("");
  const [showError, setShowError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loadingTokens, setLoadingTokens] = useState(false);
  useSmartContract();

  const classes = useStyles();
  const [{ wallet }] = useConnectWallet();

  const networkId = wallet?.chains[0]?.id;
  const walletAddress = wallet?.accounts[0].address;
  const router = useRouter();

  const { claimContract, approveDeposit, getDecimals } =
    useSmartContractMethods();

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const getCurrentAccount = async () => {
    setLoadingTokens(true);
    const web3 = await web3InstanceEthereum();
    const accounts = await web3.eth.getAccounts();
    // const data = await getTokensFromWallet(accounts[0], networkId);
    if (networkId && walletAddress) {
      const tokensList = await getAssetsByDaoAddress(walletAddress, networkId);
      setCurrentAccount(accounts[0]);
      setTokensInWallet(tokensList.data.tokenPriceList);
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    getCurrentAccount();
  }, [walletAddress, networkId]);

  const formik = useFormik({
    initialValues: {
      description: "",
      rollbackAddress: "",
      numberOfTokens: "",
      startDate: dayjs(Date.now() + 300000),
      endDate: dayjs(Date.now() + 600000),
      selectedToken: "", // token Name
      recieveTokens: "immediately", // immediately or later
      walletAddress: "",
      airdropTokenAddress: "", // tokenAddress
      airdropFrom: "contract", // wallet or contract,
      eligible: "csv", // token || csv || everyone
      daoTokenAddress: "", // tokenGated
      maximumClaim: "proRata", // prorata or custom
      customAmount: 0,
      merkleData: [],
      csvObject: [],
    },
    validationSchema: Yup.object().shape({
      description: yup
        .string("Enter one-liner description")
        .required("description is required"),
      rollbackAddress: yup
        .string("Enter rollback address")
        .when("airdropFrom", {
          is: "contract",
          then: () => yup.string().required("Please enter rollback address"),
        }),
      // .required("Rollback address is required"),
      numberOfTokens: yup
        .number()
        .required("Enter amount of tokens")
        .moreThan(0, "Amount should be greater than 0"),
      startDate: yup.date().required("start date is required"),
      endDate: yup
        .date()
        .required("end date is required")
        .min(yup.ref("startDate")),
      selectedToken: yup.object({}).required("Token is required"),
      daoTokenAddress: yup
        .string("Enter dao address")
        .notRequired()
        .when("eligible", {
          is: "token",
          then: () => yup.string().required("Enter token address"),
        }),
      // .required("Dao token is required"),
      customAmount: yup
        .number("Enter custom Amount")
        .notRequired()
        .when("maximumClaim", {
          is: "custom",
          then: () =>
            yup
              .number("Enter custom Amount")
              // .required("Please enter custom amount")
              .moreThan(0, "Amount should be greater than 0")
              .lessThan(yup.ref("numberOfTokens")),
        }),
    }),

    onSubmit: (values) => {
      const claimsContractAddress =
        networkId === "0x89"
          ? CLAIM_FACTORY_ADDRESS_POLYGON
          : CLAIM_FACTORY_ADDRESS_GOERLI;

      const data = {
        description: values.description,
        rollbackAddress: values.rollbackAddress
          ? values.rollbackAddress
          : walletAddress.toLowerCase(),
        numberOfTokens: values.numberOfTokens.toString(),
        startDate: dayjs(values.startDate).format(),
        endDate: dayjs(values.endDate).format(),
        recieveTokens: values.recieveTokens,
        selectedToken: values.selectedToken,
        walletAddress: walletAddress.toLowerCase(),
        airdropTokenAddress: values.airdropTokenAddress,
        airdropFrom: values.airdropFrom,
        eligible: values.eligible,
        daoTokenAddress: values.daoTokenAddress.length
          ? values.daoTokenAddress
          : "0x0000000000000000000000000000000000000000",
        maximumClaim: values.maximumClaim,
        customAmount:
          values.maximumClaim === "custom" ? values.customAmount.toString() : 0,
        merkleData: values.merkleData,
        csvObject: values.csvObject,
      };
      if (activeStep === steps.length - 1) {
        if (data.eligible === "token" || data.eligible === "everyone") {
          // checking maximum claim is prorata or custom
          setLoading(true);
          let maximumClaim;
          if (data.maximumClaim === "custom") {
            maximumClaim = true;
          } else {
            maximumClaim = false;
          }

          let hasAllowanceMechanism;
          if (data.airdropFrom === "wallet") {
            hasAllowanceMechanism = true;
          } else {
            hasAllowanceMechanism = false;
          }

          let eligible;
          if (data.eligible === "token") {
            eligible = 0;
          } else if (data.eligible === "everyone") {
            eligible = 3;
          }

          const loadClaimsContractFactoryData_Token = async () => {
            try {
              const decimals = await getDecimals(data.airdropTokenAddress);

              // if airdroping from contract then approve erc20
              if (!hasAllowanceMechanism) {
                // approve erc20
                await approveDeposit(
                  data.airdropTokenAddress,
                  claimsContractAddress,
                  data.numberOfTokens,
                  decimals, // decimal
                );
              }

              const claimsSettings = [
                data.walletAddress.toLowerCase(),
                data.walletAddress.toLowerCase(),
                data.airdropTokenAddress,
                data.daoTokenAddress,
                hasAllowanceMechanism, // false if token approved function called
                false,
                0,
                true,
                new Date(data.startDate).getTime() / 1000,
                new Date(data.endDate).getTime() / 1000,
                data.rollbackAddress.toLowerCase(),
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                Number(eligible),
                [
                  maximumClaim,
                  convertToWeiGovernance(
                    data.customAmount,
                    decimals,
                  ).toString(),
                  convertToWeiGovernance(
                    data.numberOfTokens,
                    decimals,
                  ).toString(),
                  [],
                ],
                [false, 0],
              ];

              const response = await claimContract(claimsSettings);

              const newClaimContract =
                response.events.NewClaimContract.returnValues._newClaimContract;

              if (hasAllowanceMechanism) {
                await approveDeposit(
                  data.airdropTokenAddress,
                  newClaimContract,
                  data.numberOfTokens.toString(),
                  decimals,
                );
              }

              // post data in api
              const postData = JSON.stringify({
                description: data.description,
                airdropTokenContract: data.airdropTokenAddress,
                airdropTokenSymbol: data.selectedToken.symbol,
                claimContract: newClaimContract,
                totalAmount: data.numberOfTokens,
                endDate: new Date(data.endDate).getTime() / 1000,
                startDate: new Date(data.startDate).getTime() / 1000,
                createdBy: data.walletAddress.toLowerCase(),
                addresses: [],
                networkId: networkId,
              });

              await createClaim(postData);

              setLoading(false);

              setFinish(true);
              showMessageHandler(setFinish);
              setTimeout(() => {
                router.push("/claims");
              }, 3000);
            } catch (err) {
              console.log(err);
              setLoading(false);
              showMessageHandler(setShowError);
              setErrMsg(err.message);
            }
          };

          loadClaimsContractFactoryData_Token();
        } else if (data.eligible === "csv") {
          let hasAllowanceMechanism;
          if (data.airdropFrom === "wallet") {
            hasAllowanceMechanism = true;
          } else {
            hasAllowanceMechanism = false;
          }

          const loadClaimsContractFactoryData_CSV = async () => {
            try {
              const decimals = await getDecimals(data.airdropTokenAddress);
              setLoading(true);

              // if airdroping from contract then approve erc20
              if (!hasAllowanceMechanism) {
                // approve erc20
                await approveDeposit(
                  data.airdropTokenAddress,
                  claimsContractAddress,
                  data.numberOfTokens.toString(),
                  decimals, // decimal
                );
              }

              const tree = new MerkleTree(data.merkleData, keccak256, {
                sort: true,
              });
              const root = tree.getHexRoot();

              const claimsSettings = [
                data.walletAddress.toLowerCase(),
                data.walletAddress.toLowerCase(),
                data.airdropTokenAddress,
                "0x0000000000000000000000000000000000000000",
                hasAllowanceMechanism, // false if token approved function called
                false,
                0,
                true,
                new Date(data.startDate).getTime() / 1000,
                new Date(data.endDate).getTime() / 1000,
                data.rollbackAddress.toLowerCase(),
                root,
                2,
                [
                  false,
                  0,
                  convertToWeiGovernance(
                    data.numberOfTokens,
                    decimals,
                  ).toString(),
                  [],
                ],
                [false, 0],
              ];

              const response = await claimContract(claimsSettings);
              const newClaimContract =
                response.events.NewClaimContract.returnValues._newClaimContract;

              if (hasAllowanceMechanism) {
                await approveDeposit(
                  data.airdropTokenAddress,
                  newClaimContract,
                  data.numberOfTokens.toString(),
                  decimals,
                );
              }

              // post data in api
              const postData = JSON.stringify({
                description: data.description,
                airdropTokenContract: data.airdropTokenAddress,
                airdropTokenSymbol: data.selectedToken.symbol,
                claimContract: newClaimContract,
                totalAmount: data.numberOfTokens,
                endDate: new Date(data.endDate).getTime() / 1000,
                startDate: new Date(data.startDate).getTime() / 1000,
                createdBy: data.walletAddress.toLowerCase(),
                addresses: data.csvObject,
                networkId: networkId,
              });

              await createClaim(postData);

              setLoading(false);
              setFinish(true);
              showMessageHandler(setFinish);
              setTimeout(() => {
                router.push("/claims");
              }, 3000);
            } catch (err) {
              console.log(err);
              setLoading(false);
              showMessageHandler(setShowError);
              setErrMsg(err.message);
            }
          };
          loadClaimsContractFactoryData_CSV();
        }
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    },
  });

  const formContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ClaimStep1
            formik={formik}
            handleNext={handleNext}
            setActiveStep={setActiveStep}
            tokensInWallet={tokensInWallet}
            isLoading={loadingTokens}
          />
        );
      case 1:
        return (
          <ClaimStep2
            formik={formik}
            handleBack={handleBack}
            handleNext={handleNext}
            setActiveStep={setActiveStep}
            finish={finish}
            loading={loading}
          />
        );
    }
  };

  const showMessageHandler = (setState) => {
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 4000);
  };

  return (
    <Layout1 showSidebar={false}>
      <Image
        src="/assets/images/monogram.png"
        alt="StationX"
        height={50}
        width={50}
        style={{ cursor: "pointer", position: "fixed" }}
        onClick={() => {
          router.push("/");
        }}
      />
      <div className={classes.container}>
        <Grid container>
          <Grid item xs={12} sx={{ padding: "20px" }}>
            {formContent(activeStep)}
          </Grid>
          {formik.errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{formik.errors.submit}</FormHelperText>
            </Grid>
          )}
        </Grid>

        {networkId && networkId !== "0x89" && <WrongNetworkModal />}

        {showError && (
          <Alert
            severity="error"
            sx={{
              width: "350px",
              position: "absolute",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            {errMsg}
          </Alert>
        )}

        {finish && (
          <Alert
            severity="success"
            sx={{
              width: "350px",
              position: "absolute",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            {"Airdrop created successfully"}
          </Alert>
        )}
      </div>
    </Layout1>
  );
};

export default Form;
