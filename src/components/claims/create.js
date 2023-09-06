import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Grid, FormHelperText, Alert } from "@mui/material";
import ClaimStep1 from "../claimsPageComps/ClaimStep1";
import ClaimStep2 from "../claimsPageComps/ClaimStep2";
import dayjs from "dayjs";
import { makeStyles } from "@mui/styles";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { createClaimCsv, createSnapShot } from "api/claims";
import { useRouter } from "next/router";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import {
  claimStep1ValidationSchema,
  claimStep2ValidationSchema,
} from "../createClubComps/ValidationSchemas";
import { useAccount, useNetwork } from "wagmi";
import { getTokensList } from "api/token";
import { getUserTokenData } from "utils/helper";
import { CHAIN_CONFIG } from "utils/constants";
import useClaimSmartContracts from "hooks/useClaimSmartContracts";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useDropsContractMethods from "hooks/useDropsContracMethods";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const CreateClaim = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tokensInWallet, setTokensInWallet] = useState(null);
  const [showError, setShowError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [snapshotMerkleData, setSnapshotMerkleData] = useState([]);
  useClaimSmartContracts();

  const classes = useStyles();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const router = useRouter();

  const { approveDeposit, getDecimals } = useCommonContractMethods();

  const { claimContract } = useDropsContractMethods();

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

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

  const fetchLatestBlockNumber = async (tokenGatedNetwork) => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });
      }

      let chain;
      if (tokenGatedNetwork === "eth-mainnet") {
        chain = EvmChain.ETHEREUM;
      } else if (tokenGatedNetwork === "matic-mainnet") {
        chain = EvmChain.POLYGON;
      } else if (tokenGatedNetwork === "bsc-mainnet") {
        chain = EvmChain.BSC;
      }

      const response = await Moralis.EvmApi.block.getDateToBlock({
        date: Date.now(),
        chain,
      });

      return response.toJSON();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formikStep1 = useFormik({
    initialValues: {
      description: "",
      // rollbackAddress: "",
      numberOfTokens: "",
      startDate: dayjs(Date.now() + 300000),
      endDate: dayjs(Date.now() + 600000),
      selectedToken: "", // token Name
      recieveTokens: "immediately", // immediately or later
      walletAddress: "",
      airdropTokenAddress: "", // tokenAddress
      airdropFrom: "contract", // wallet or contract,
    },
    validationSchema: claimStep1ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });

  const formikStep2 = useFormik({
    initialValues: {
      eligible: "everyone", // token || csv || everyone
      daoTokenAddress: "", // tokenGated
      tokenGatingAmt: 0,
      maximumClaim: "custom", // prorata or custom
      customAmount: 1,
      merkleData: [],
      csvObject: [],
      tokenGatedNetwork: "eth-mainnet",
      blockNumber: 0,
    },
    validationSchema: claimStep2ValidationSchema,
    onSubmit: async (values) => {
      const claimsContractAddress = CHAIN_CONFIG[networkId].claimFactoryAddress;

      const data = {
        description: formikStep1.values.description,
        numberOfTokens: formikStep1.values.numberOfTokens.toString(),
        startDate: dayjs(formikStep1.values.startDate).format(),
        endDate: dayjs(formikStep1.values.endDate).format(),
        recieveTokens: formikStep1.values.recieveTokens,
        selectedToken: formikStep1.values.selectedToken,
        walletAddress: walletAddress.toLowerCase(),
        airdropTokenAddress: formikStep1.values.airdropTokenAddress,
        airdropFrom: formikStep1.values.airdropFrom,
        eligible: values?.eligible,
        daoTokenAddress:
          values?.daoTokenAddress.length > 2
            ? values?.daoTokenAddress
            : "0x0000000000000000000000000000000000000000",
        tokenGatingAmt: values?.tokenGatingAmt ? values?.tokenGatingAmt : 0,
        maximumClaim: values?.maximumClaim,
        customAmount:
          values?.maximumClaim === "custom"
            ? values?.customAmount.toString()
            : 0,
        merkleData: values?.merkleData,
        csvObject: values?.csvObject,
        tokenGatedNetwork: values?.tokenGatedNetwork,
        blockNumber: values?.blockNumber,
      };

      const decimals = await getDecimals(data.airdropTokenAddress);

      // fetch Block number

      setLoading(true);
      let snapshotData;
      let blockNumber;

      if (data.maximumClaim === "proRata") {
        try {
          const blockData = await fetchLatestBlockNumber(
            data?.tokenGatedNetwork,
          );

          if (data.blockNumber > 0 && data.blockNumber > blockData.block) {
            showMessageHandler(setShowError);
            setErrMsg("Invalid block number!");
            setLoading(false);
            return;
          }

          blockNumber =
            data.blockNumber > 0 ? data.blockNumber : blockData.block;

          snapshotData = await createSnapShot(
            convertToWeiGovernance(data.numberOfTokens, decimals),
            data.airdropTokenAddress,
            data.daoTokenAddress,
            data.tokenGatedNetwork,
            blockNumber,
            networkId,
          );

          setSnapshotMerkleData(snapshotData);
        } catch (error) {
          console.log(error);
          setErrMsg("Unable to fetch snapshot data");
          showMessageHandler(setShowError);
          setLoading(false);
        }
      }

      let totalNoOfWallets;
      if (data.eligible === "everyone") {
        totalNoOfWallets = 0;
      } else if (data.eligible === "token") {
        if (data.maximumClaim === "proRata") {
          totalNoOfWallets = snapshotData?.numOfTokenHolders;
        } else {
          totalNoOfWallets = 0;
        }
      } else if (data.eligible === "csv") {
        totalNoOfWallets = data?.csvObject?.length;
      }

      if (data.eligible === "token" || data.eligible === "everyone") {
        // checking maximum claim is prorata or custom
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
        if (data.eligible === "token" && data.maximumClaim !== "proRata") {
          eligible = 0;
        } else if (data.eligible === "everyone") {
          eligible = 2;
        } else if (data.maximumClaim === "proRata") {
          eligible = 3;
        }

        const loadClaimsContractFactoryData_Token = async () => {
          try {
            let tokenGatingDecimals = 1;

            if (
              data.daoTokenAddress !==
              "0x0000000000000000000000000000000000000000"
            ) {
              try {
                tokenGatingDecimals = await getDecimals(data.daoTokenAddress);
              } catch (error) {
                console.log(error);
              }
            }

            // if airdroping from contract then approve erc20
            if (!hasAllowanceMechanism) {
              // approve erc20
              await approveDeposit(
                data.airdropTokenAddress,
                claimsContractAddress,
                data.numberOfTokens,
                decimals,
              );
            }

            const claimsSettings = [
              data.description,
              data.walletAddress.toLowerCase(),
              data.walletAddress.toLowerCase(),
              data.airdropTokenAddress,
              data.daoTokenAddress,
              data.daoTokenAddress !==
              "0x0000000000000000000000000000000000000000"
                ? convertToWeiGovernance(
                    data.tokenGatingAmt,
                    tokenGatingDecimals,
                  )
                : 0,
              new Date(data.startDate).getTime() / 1000,
              new Date(data.endDate).getTime() / 1000,
              0,
              hasAllowanceMechanism,
              true,
              data.maximumClaim === "proRata"
                ? snapshotData?.merkleRoot
                : "0x0000000000000000000000000000000000000000000000000000000000000001",
              Number(eligible), // Permission ie. 0 - TG; 1 - Whitelisted; 2 - FreeForALL
              [
                data.maximumClaim === "proRata"
                  ? convertToWeiGovernance(
                      data.numberOfTokens,
                      decimals,
                    ).toString()
                  : convertToWeiGovernance(
                      data.customAmount,
                      decimals,
                    ).toString(),
                convertToWeiGovernance(
                  data.numberOfTokens,
                  decimals,
                ).toString(),
              ],
            ];

            const response = await claimContract(
              claimsSettings,
              totalNoOfWallets,
              data.maximumClaim === "proRata" ? blockNumber : 0,
              data.maximumClaim === "proRata" ? data.tokenGatedNetwork : "",
            );

            const newClaimContract = response.logs[0].address;

            if (hasAllowanceMechanism) {
              await approveDeposit(
                data.airdropTokenAddress,
                newClaimContract,
                data.numberOfTokens.toString(),
                decimals,
              );
            }

            setLoading(false);
            setFinish(true);
            showMessageHandler(setFinish);
            setTimeout(() => {
              router.push(`/claims`);
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
            const decimals = await getDecimals(data?.airdropTokenAddress);
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

            const csvData = data.csvObject
              .filter((item) => item.address)
              .map((item) => {
                return {
                  userAddress: item.address,
                  amount: item.amount,
                };
              });

            // post data in api
            const postData = JSON.stringify({
              snapshot: csvData,
              tokenAddress: data.airdropTokenAddress,
            });

            const responseCreateClaim = await createClaimCsv(
              postData,
              networkId,
            );

            const claimsSettings = [
              data.description,
              data.walletAddress.toLowerCase(),
              data.walletAddress.toLowerCase(),
              data.airdropTokenAddress,
              "0x0000000000000000000000000000000000000000",
              0,
              new Date(data.startDate).getTime() / 1000,
              new Date(data.endDate).getTime() / 1000,
              0,
              hasAllowanceMechanism, // false if token approved function called
              true,
              responseCreateClaim?.merkleRoot,
              1,
              [
                convertToWeiGovernance(
                  data.numberOfTokens,
                  decimals,
                ).toString(),
                convertToWeiGovernance(
                  data.numberOfTokens,
                  decimals,
                ).toString(),
              ],
            ];

            const response = await claimContract(
              claimsSettings,
              totalNoOfWallets,
              0,
              "",
            );

            const newClaimContract = response.logs[0].address;

            if (hasAllowanceMechanism) {
              await approveDeposit(
                data.airdropTokenAddress,
                newClaimContract,
                data.numberOfTokens.toString(),
                decimals,
              );
            }

            setLoading(false);
            setFinish(true);
            showMessageHandler(setFinish);
            setTimeout(() => {
              router.push(`/claims`);
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
    },
  });

  const formContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ClaimStep1
            formik={formikStep1}
            handleNext={handleNext}
            setActiveStep={setActiveStep}
            tokensInWallet={tokensInWallet}
            isLoading={loadingTokens}
          />
        );
      case 1:
        return (
          <ClaimStep2
            formik={formikStep2}
            formikStep1={formikStep1}
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
    <>
      <div className={classes.container}>
        <Grid container>
          <Grid item xs={12} sx={{ padding: "20px" }}>
            {formContent(activeStep)}
          </Grid>
          {formikStep1.errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{formikStep1.errors.submit}</FormHelperText>
            </Grid>
          )}
        </Grid>

        {showError && (
          <Alert
            severity="error"
            sx={{
              width: "350px",
              position: "fixed",
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
              position: "fixed",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            {"Airdrop created successfully"}
          </Alert>
        )}
      </div>
    </>
  );
};

export default CreateClaim;
