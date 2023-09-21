import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import Button from "@components/ui/button/Button";
import ProtectRoute from "../../src/utils/auth";
import { Fragment, useRef, useState } from "react";
import Step1 from "../../src/components/createClubComps/Step1";
import Step3 from "../../src/components/createClubComps/Step3";
import { useFormik } from "formik";
import { tokenType, useStationForType } from "../../src/data/create";
import ERC20Step2 from "../../src/components/createClubComps/ERC20Step2";
import NFTStep2 from "../../src/components/createClubComps/NFTStep2";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import ErrorModal from "../../src/components/createClubComps/ErrorModal";
import SafeDepositLoadingModal from "../../src/components/createClubComps/SafeDepositLoadingModal";
import {
  ERC20Step2ValidationSchema,
  ERC721Step2ValidationSchema,
  step1ValidationSchema,
  step3ValidationSchema,
  // step4ValidationSchema,
} from "../../src/components/createClubComps/ValidationSchemas";
import { setUploadNFTLoading } from "../../src/redux/reducers/gnosis";
import { NFTStorage } from "nft.storage";
import { convertToWeiGovernance } from "../../src/utils/globalFunctions";
// import Step4 from "../../src/components/createClubComps/Step4";
// import Web3 from "web3";
// import { fetchClubOwners } from "../../src/api/club";
import useSafe from "../../src/hooks/useSafe";
import Layout from "../../src/components/layouts/layout";
import { useAccount, useNetwork } from "wagmi";
import { ZERO_ADDRESS, ZERO_MERKLE_ROOT } from "utils/constants";

const Create = () => {
  const steps = [
    "Add station info",
    "Set token rules",
    "Governance",
    // "Treasury",
  ];
  const dispatch = useDispatch();
  const uploadInputRef = useRef(null);
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const { address: walletAddress } = useAccount();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);

  const { initiateConnection } = useSafe();

  const GNOSIS_DATA = useSelector((state) => {
    return state.gnosis;
  });

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 formik={formikStep1} />;
      case 1:
        if (
          formikStep1.values.clubTokenType === "Non Transferable ERC20 Token"
        ) {
          return <ERC20Step2 formik={formikERC20Step2} />;
        } else {
          return (
            <NFTStep2
              formik={formikERC721Step2}
              uploadInputRef={uploadInputRef}
            />
          );
        }
      case 2:
        return <Step3 formik={formikStep3} />;
      // case 3:
      //   return <Step4 formik={formikStep4} ownerHelperText={ownerHelperText} />;
      default:
        return "Unknown step";
    }
  };

  const formikStep1 = useFormik({
    initialValues: {
      clubName: "",
      clubSymbol: "",
      clubTokenType: tokenType[0],
      useStationFor: useStationForType[0],
      email: "",
    },
    validationSchema: step1ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });

  const formikERC20Step2 = useFormik({
    initialValues: {
      depositClose: dayjs(Date.now() + 3600 * 1000 * 24),
      minDepositPerUser: "",
      maxDepositPerUser: "",
      totalRaiseAmount: "",
      pricePerToken: "",
    },
    validationSchema: ERC20Step2ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });

  const formikERC721Step2 = useFormik({
    initialValues: {
      nftImage: "",
      isNftTransferable: false,
      pricePerToken: "",
      maxTokensPerUser: "",
      isNftTotalSupplylimited: false,
      totalTokenSupply: "",
      depositClose: dayjs(Date.now() + 300000),
    },

    validationSchema: ERC721Step2ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });

  const formikStep3 = useFormik({
    initialValues: {
      deploySafe: "newSafe",
      safeAddress: "",
      governance: "governance",
      quorum: 1,
      threshold: 51,
      addressList: [walletAddress],
      safeThreshold: 1,
      assetsStoredOnGnosis: true,
    },
    validationSchema: step3ValidationSchema,
    onSubmit: async (values) => {
      setOpen(true);
      if (formikStep1.values.clubTokenType === "NFT") {
        dispatch(setUploadNFTLoading(true));
        const client = new NFTStorage({
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlhMWRFQjEyMjQyYTBlN0VmNTUwNjFlOTAwMTYyMDcxNEFENDBlNDgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NDEyOTI3MzM5MSwibmFtZSI6InN0YXRpb25YIG5mdCJ9.1w-RC7qZ43T2NhjHrtsO_Gmb0Mw1BjJo7GXMciqX5jY",
        });

        const metadata = await client.store({
          name: formikStep1.values.clubName,
          description: "nft image",
          image: formikERC721Step2.values.nftImage,
        });

        dispatch(setUploadNFTLoading(false));
        try {
          const params = {
            clubName: formikStep1.values.clubName,
            clubSymbol: formikStep1.values.clubSymbol,
            ownerFeePerDepositPercent: 0 * 100,
            depositClose: dayjs(formikERC721Step2.values.depositClose).unix(),
            quorum: formikStep3.values.quorum * 100,
            threshold: formikStep3.values.threshold * 100,
            safeThreshold: formikStep3.values.safeThreshold ?? 0,
            depositTokenAddress: GNOSIS_DATA.usdcContractAddress,
            treasuryAddress:
              formikStep3.values.safeAddress.length > 0
                ? formikStep3.values.safeAddress
                : ZERO_ADDRESS,
            maxTokensPerUser: formikERC721Step2.values.maxTokensPerUser,
            distributeAmount: formikERC721Step2.values.isNftTotalSupplylimited
              ? convertToWeiGovernance(
                  formikERC721Step2.values.totalTokenSupply /
                    formikERC721Step2.values.pricePerToken,
                  18,
                )
              : 0,
            pricePerToken: convertToWeiGovernance(
              formikERC721Step2.values.pricePerToken,
              6,
            ),
            isNftTransferable: formikERC721Step2.values.isNftTransferable,
            isNftTotalSupplyUnlimited:
              !formikERC721Step2.values.isNftTotalSupplylimited,
            isGovernanceActive:
              formikStep3.values.governance === "governance" ? true : false,
            assetsStoredOnGnosis: formikStep3.values.assetsStoredOnGnosis,
            allowWhiteList: false,
            merkleRoot: ZERO_MERKLE_ROOT,
          };

          initiateConnection(
            params,
            dispatch,
            formikStep3.values.addressList,
            formikStep1.values.clubTokenType,
            metadata.data.image.pathname,
            metadata.url,
            formikERC721Step2.values.nftImage,
            formikStep1.values.useStationFor,
            formikStep1.values.email,
            networkId,
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const params = {
            clubName: formikStep1.values.clubName,
            clubSymbol: formikStep1.values.clubSymbol,
            distributeAmount: convertToWeiGovernance(
              formikERC20Step2.values.totalRaiseAmount /
                formikERC20Step2.values.pricePerToken,
              18,
            ),
            pricePerToken: convertToWeiGovernance(
              formikERC20Step2.values.pricePerToken,
              6,
            ),
            minDepositPerUser: convertToWeiGovernance(
              formikERC20Step2.values.minDepositPerUser,
              6,
            ),
            maxDepositPerUser: convertToWeiGovernance(
              formikERC20Step2.values.maxDepositPerUser,
              6,
            ),
            ownerFeePerDepositPercent: 0 * 100,
            depositClose: dayjs(formikERC20Step2.values.depositClose).unix(),
            quorum: formikStep3.values.quorum * 100,
            threshold: formikStep3.values.threshold * 100,
            safeThreshold: formikStep3.values.safeThreshold ?? 0,
            depositTokenAddress: GNOSIS_DATA.usdcContractAddress,
            treasuryAddress:
              formikStep3.values.safeAddress.length > 0
                ? formikStep3.values.safeAddress
                : ZERO_ADDRESS,
            isGovernanceActive:
              formikStep3.values.governance === "governance" ? true : false,
            isGtTransferable: false,
            allowWhiteList: false,
            merkleRoot: ZERO_MERKLE_ROOT,
            assetsStoredOnGnosis: formikStep3.values.assetsStoredOnGnosis,
          };

          initiateConnection(
            params,
            dispatch,
            formikStep3.values.addressList,
            formikStep1.values.clubTokenType,
            "",
            "",
            formikStep1.values.useStationFor,
            formikStep1.values.email,
            networkId,
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  // const formikStep4 = useFormik({
  //   initialValues: {
  //     deploySafe: true,
  //     safeAddress: "",
  //   },
  //   validationSchema: step4ValidationSchema,
  //   onSubmit: async (values) => {
  //     setOpen(true);
  //     if (formikStep1.values.clubTokenType === "NFT") {
  //       dispatch(setUploadNFTLoading(true));
  //       const client = new NFTStorage({
  //         token:
  //           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlhMWRFQjEyMjQyYTBlN0VmNTUwNjFlOTAwMTYyMDcxNEFENDBlNDgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NDEyOTI3MzM5MSwibmFtZSI6InN0YXRpb25YIG5mdCJ9.1w-RC7qZ43T2NhjHrtsO_Gmb0Mw1BjJo7GXMciqX5jY",
  //       });

  //       const metadata = await client.store({
  //         name: formikStep1.values.clubName,
  //         description: "nft image",
  //         image: formikERC721Step2.values.nftImage,
  //       });
  //       dispatch(setUploadNFTLoading(false));
  //       try {
  //         const walletAddress = wallet.accounts[0].address;
  //         formikStep3.values.addressList.unshift(walletAddress);

  //         const params = {
  //           clubName: formikStep1.values.clubName,
  //           clubSymbol: formikStep1.values.clubSymbol,
  //           ownerFeePerDepositPercent: 0 * 100,
  //           depositClose: dayjs(formikERC721Step2.values.depositClose).unix(),
  //           quorum: formikStep3.values.quorum * 100,
  //           threshold: formikStep3.values.threshold * 100,
  //           safeThreshold: formikStep3.values.safeThreshold,
  //           depositTokenAddress: GNOSIS_DATA.usdcContractAddress,
  //           treasuryAddress: formikStep4.values.safeAddress
  //             ? formikStep4.values.safeAddress
  //             : "0x0000000000000000000000000000000000000000",
  //           maxTokensPerUser: formikERC721Step2.values.maxTokensPerUser,
  //           distributeAmount: formikERC721Step2.values.isNftTotalSupplylimited
  //             ? convertToWeiGovernance(
  //                 formikERC721Step2.values.totalTokenSupply /
  //                   formikERC721Step2.values.pricePerToken,
  //                 18,
  //               )
  //             : 0,
  //           pricePerToken: convertToWeiGovernance(
  //             formikERC721Step2.values.pricePerToken,
  //             6,
  //           ),
  //           isNftTransferable: formikERC721Step2.values.isNftTransferable,
  //           isNftTotalSupplyUnlimited:
  //             !formikERC721Step2.values.isNftTotalSupplylimited,
  //           isGovernanceActive: formikStep3.values.governance,

  //           allowWhiteList: false,
  //           merkleRoot:
  //             "0x0000000000000000000000000000000000000000000000000000000000000001",
  //         };

  <Button onClick={handlePrev}>Prev</Button>;
  //         initiateConnection(
  //           params,
  //           dispatch,
  //           GNOSIS_DATA.transactionUrl,
  //           formikStep3.values.addressList,
  //           formikStep1.values.clubTokenType,
  //           GNOSIS_DATA.factoryContractAddress,
  //           metadata.data.image.pathname,
  //           metadata.url,
  //         );
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     } else {
  //       try {
  //         const walletAddress = wallet.accounts[0].address;

  //         formikStep3.values.addressList.unshift(walletAddress);
  //         const params = {
  //           clubName: formikStep1.values.clubName,
  //           clubSymbol: formikStep1.values.clubSymbol,
  //           distributeAmount: convertToWeiGovernance(
  //             formikERC20Step2.values.totalRaiseAmount /
  //               formikERC20Step2.values.pricePerToken,
  //             18,
  //           ),
  //           pricePerToken: convertToWeiGovernance(
  //             formikERC20Step2.values.pricePerToken,
  //             6,
  //           ),
  //           minDepositPerUser: convertToWeiGovernance(
  //             formikERC20Step2.values.minDepositPerUser,
  //             6,
  //           ),
  //           maxDepositPerUser: convertToWeiGovernance(
  //             formikERC20Step2.values.maxDepositPerUser,
  //             6,
  //           ),
  //           ownerFeePerDepositPercent: 0 * 100,
  //           depositClose: dayjs(formikERC20Step2.values.depositClose).unix(),
  //           quorum: formikStep3.values.quorum * 100,
  //           threshold: formikStep3.values.threshold * 100,
  //           safeThreshold: formikStep3.values.safeThreshold,
  //           depositTokenAddress: GNOSIS_DATA.usdcContractAddress,
  //           treasuryAddress: formikStep4.values.safeAddress
  //             ? formikStep4.values.safeAddress
  //             : "0x0000000000000000000000000000000000000000",
  //           isGovernanceActive: formikStep3.values.governance,
  //           isGtTransferable: true,
  //           allowWhiteList: false,
  //           merkleRoot:
  //             "0x0000000000000000000000000000000000000000000000000000000000000001",
  //         };
  //         initiateConnection(
  //           params,
  //           dispatch,
  //           GNOSIS_DATA.transactionUrl,
  //           formikStep3.values.addressList,
  //           formikStep1.values.clubTokenType,
  //           GNOSIS_DATA.factoryContractAddress,
  //         );
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   },
  // });

  const handleSubmit = () => {
    switch (activeStep) {
      case 0:
        formikStep1.handleSubmit();
        break;
      case 1:
        if (
          formikStep1.values.clubTokenType === "Non Transferable ERC20 Token"
        ) {
          formikERC20Step2.handleSubmit();
          break;
        } else {
          formikERC721Step2.handleSubmit();
          break;
        }
      case 2:
        formikStep3.handleSubmit();
        break;
      // case 3:
      //   formikStep4.handleSubmit();
    }
  };

  // const getSafeOwners = useCallback(async () => {
  //   setOwnersCheck(false);
  //   setOwnerHelperText("Verifying owners...");
  //   const walletAddress = wallet.accounts[0].address;
  //   let newAddressList = [];
  //   if (
  //     !formikStep3.values.addressList.includes(
  //       Web3.utils.toChecksumAddress(walletAddress),
  //     )
  //   ) {
  //     newAddressList = [
  //       ...formikStep3.values.addressList,
  //       Web3.utils.toChecksumAddress(walletAddress),
  //     ];
  //   } else {
  //     newAddressList = [...formikStep3.values.addressList];
  //   }
  //   let owners;
  //   try {
  //     owners = await fetchClubOwners(
  //       formikStep4.values.safeAddress,
  //       GNOSIS_DATA.transactionUrl,
  //     );
  //     const ownerAddressesArray = owners.data.owners.map((value) =>
  //       Web3.utils.toChecksumAddress(value),
  //     );

  //     ownerAddressesArray.sort((a, b) => a - b);
  //     let sorted_arr1 = ownerAddressesArray.sort((a, b) => a - b);
  //     let sorted_arr2 = newAddressList.sort((a, b) => a - b);

  //     const areArraysEqual = sorted_arr1.every(
  //       (element, index) => element === sorted_arr2[index],
  //     );
  //     if (areArraysEqual) {
  //       setOwnersCheck(true);
  //       setOwnerHelperText("Owners matched");
  //     } else {
  //       setOwnerHelperText(
  //         "Owners of the safe does not match with the admins of the DAO",
  //       );
  //       setOwnersCheck(false);
  //     }
  //   } catch (error) {
  //     setOwnerHelperText("Invalid gnosis address");
  //   }
  // }, [
  //   GNOSIS_DATA.transactionUrl,
  //   formikStep3.values.addressList,
  //   formikStep4.values.safeAddress,
  //   wallet.accounts,
  // ]);

  // useEffect(() => {
  //   if (formikStep4.values.safeAddress && GNOSIS_DATA.transactionUrl) {
  //     getSafeOwners();
  //   }
  // }, [
  //   formikStep4.values.safeAddress,
  //   formikStep3.values.addressList,
  //   GNOSIS_DATA.transactionUrl,
  //   getSafeOwners,
  // ]);

  return (
    <Layout showSidebar={false}>
      <Grid
        container
        item
        paddingX={24}
        justifyContent="center"
        alignItems="center">
        <Box width={{ xs: "60%", sm: "70%", md: "80%", lg: "100%" }}>
          <form noValidate autoComplete="off">
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                return (
                  <Step key={label} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length - 1 &&
            GNOSIS_DATA.setCreateSafeLoading ? (
              <SafeDepositLoadingModal
                open={open}
                title=" Deploying a new safe"
                description=" Please sign & authorise StationX to deploy a new safe for your
                station."
              />
            ) : activeStep === steps.length - 1 &&
              GNOSIS_DATA.createDaoAuthorized ? (
              <SafeDepositLoadingModal
                open={open}
                title="Setting up your station"
                description="Please sign to authorise StationX to deploy this station
              for you."
              />
            ) : activeStep === steps.length - 1 &&
              GNOSIS_DATA.setCreateSafeError ? (
              <>
                {GNOSIS_DATA.setCreateSafeErrorCode === 4001 ? (
                  <ErrorModal isSignRejected />
                ) : (
                  <ErrorModal isError />
                )}
              </>
            ) : activeStep === steps.length - 1 &&
              GNOSIS_DATA.setUploadNFTLoading ? (
              <SafeDepositLoadingModal
                open={open}
                title="Uploading your NFT"
                description="Please wait till we upload the nft."
              />
            ) : (
              <Fragment>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                  mb={8}>
                  {getStepContent(activeStep)}
                  <div className="step-buttons">
                    {!activeStep == 0 && activeStep !== steps.length - 1 && (
                      <div
                        style={{
                          marginTop: "12px",
                        }}>
                        <Button onClick={handlePrev}>Prev</Button>
                      </div>
                    )}
                    {activeStep === steps.length - 1 ? (
                      <>
                        <div className="f-d">
                          <Button onClick={handlePrev}>Prev</Button>
                          <Button onClick={handleSubmit}>Finish</Button>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          marginTop: "12px",
                        }}>
                        <Button onClick={handleSubmit}>Next</Button>
                      </div>
                    )}
                  </div>
                </Grid>
              </Fragment>
            )}
          </form>
        </Box>
      </Grid>
    </Layout>
  );
};
export default ProtectRoute(Create);
