import { FormHelperText, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useChainId } from "wagmi";

import { createClaimCsv, createSnapShot } from "api/claims";
import {
  getTokensList,
  getTokensListBeraChain,
  getTokensListBlast,
  getTokensListBlastMainnet,
  getTokensListOfManta,
} from "api/token";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useDropsContractMethods from "hooks/useDropsContractMethods";
import { setAlertData } from "redux/reducers/alert";
import { CHAIN_CONFIG, ZERO_ADDRESS, ZERO_MERKLE_ROOT } from "utils/constants";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { getUserTokenData } from "utils/helper";
import { getPublicClient } from "utils/viemConfig";

import ClaimStep1 from "../claimsPageComps/ClaimStep1";
import ClaimStep2 from "../claimsPageComps/ClaimStep2";
import {
  claimStep1ValidationSchema,
  claimStep2ValidationSchema,
} from "../createClubComps/ValidationSchemas";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

const CreateClaim = () => {
  const classes = useStyles();
  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);
  const router = useRouter();
  const dispatch = useDispatch();

  const { approveDeposit, getDecimals } = useCommonContractMethods();

  const { claimContract } = useDropsContractMethods();

  const [activeStep, setActiveStep] = useState(0);
  const [tokensInWallet, setTokensInWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [snapshotMerkleData, setSnapshotMerkleData] = useState([]);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const fetchTokens = async (networkId, walletAddress) => {
    try {
      if (networkId === "0xa9") {
        const tokensList = await getTokensListOfManta(walletAddress);
        return tokensList?.data?.result;
      }

      if (networkId === "0x138d5") {
        const tokenList = await getTokensListBeraChain(walletAddress);
        return tokenList?.data?.result;
      }

      if (networkId === "0xa0c71fd") {
        const tokenList = await getTokensListBlast(walletAddress);
        return tokenList?.data?.result;
      }

      if (networkId === "0x13e31") {
        const tokenList = await getTokensListBlastMainnet(walletAddress);
        return tokenList?.data?.result;
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    getCurrentAccount();
  }, [walletAddress, networkId]);

  const fetchLatestBlockNumber = async (tokenGatedNetwork) => {
    const networkToIdMap = {
      "eth-mainnet": "0x1",
      "matic-mainnet": "0x89",
      "bsc-mainnet": "0x38",
    };

    const network = networkToIdMap[tokenGatedNetwork];

    if (!network) {
      console.error(`Unknown network: ${tokenGatedNetwork}`);
      return null;
    }
    const publicClient = getPublicClient(network);

    return publicClient.getBlockNumber();
  };

  const formikStep1 = useFormik({
    initialValues: {
      description: "",
      // rollbackAddress: "",
      numberOfTokens: "",
      startDate: dayjs(Date.now() + 300000).locale("en"),
      endDate: dayjs(Date.now() + 600000).locale("en"),
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
            : ZERO_ADDRESS,
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

      const decimals = await getDecimals(data?.airdropTokenAddress);

      setLoading(true);
      let snapshotData;
      let blockNumber;

      if (data.maximumClaim === "proRata") {
        try {
          const latestBlockNumber = await fetchLatestBlockNumber(
            data?.tokenGatedNetwork,
          );

          if (
            data.blockNumber > 0 &&
            data.blockNumber > Number(latestBlockNumber)
          ) {
            dispatch(
              setAlertData({
                open: true,
                message: "Invalid block number!",
                severity: "error",
              }),
            );
            setLoading(false);
            return;
          }

          blockNumber =
            data.blockNumber > 0 ? data.blockNumber : Number(latestBlockNumber);

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
          dispatch(
            setAlertData({
              open: true,
              message: "Unable to fetch snapshot data",
              severity: "error",
            }),
          );
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
            let tokenGatingDecimals;

            try {
              tokenGatingDecimals = await getDecimals(data?.daoTokenAddress);
            } catch (error) {
              console.log(error);
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
              data.daoTokenAddress !== ZERO_ADDRESS && tokenGatingDecimals
                ? convertToWeiGovernance(
                    data.tokenGatingAmt,
                    tokenGatingDecimals,
                  )
                : data.daoTokenAddress !== ZERO_ADDRESS
                ? data.tokenGatingAmt
                : 0,
              new Date(data.startDate).getTime() / 1000,
              new Date(data.endDate).getTime() / 1000,
              0,
              hasAllowanceMechanism,
              true,
              data.maximumClaim === "proRata"
                ? snapshotData?.merkleRoot
                : ZERO_MERKLE_ROOT,
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
              // Extra parameter here for worldcoin setup
              // [
              //   "0x42FF98C4E85212a5D31358ACbFe76a621b50fC02",
              //   "app_3066124e44753d8dffd50878d8498345",
              //   "claim",
              // ],
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
            dispatch(
              setAlertData({
                open: true,
                message: "Airdrop created successfully",
                severity: "success",
              }),
            );
            setTimeout(() => {
              router.push(`/claims/`);
            }, 1000);
          } catch (err) {
            console.log(err);
            setLoading(false);
            dispatch(
              setAlertData({
                open: true,
                message: err.message,
                severity: "error",
              }),
            );
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
              ZERO_ADDRESS,
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
            dispatch(
              setAlertData({
                open: true,
                message: "Airdrop created successfully",
                severity: "success",
              }),
            );
            setTimeout(() => {
              router.push(`/claims/`);
            }, 3000);
          } catch (err) {
            console.log(err);
            setLoading(false);
            dispatch(
              setAlertData({
                open: true,
                message: err.message,
                severity: "error",
              }),
            );
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
            networkId={networkId}
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
            networkId={networkId}
          />
        );
    }
  };

  return (
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
    </div>
  );
};

export default CreateClaim;
