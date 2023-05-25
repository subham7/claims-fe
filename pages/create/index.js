import { Box, Button, Grid, Step, StepButton, Stepper } from "@mui/material";
import Layout2 from "../../src/components/layouts/layout2";
import ProtectRoute from "../../src/utils/auth";
import { Fragment, useRef, useState } from "react";
import Step1 from "../../src/components/createClubComps/Step1";
import Step3 from "../../src/components/createClubComps/Step3";
import { useFormik } from "formik";
import { tokenType } from "../../src/data/create";
import ERC20Step2 from "../../src/components/createClubComps/ERC20Step2";
import NFTStep2 from "../../src/components/createClubComps/NFTStep2";
import dayjs from "dayjs";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import { initiateConnection } from "../../src/utils/safe";
import ErrorModal from "../../src/components/createClubComps/ErrorModal";
import SafeDepositLoadingModal from "../../src/components/createClubComps/SafeDepositLoadingModal";
import {
  ERC20Step2ValidationSchema,
  ERC721Step2ValidationSchema,
  step1ValidationSchema,
  step3ValidationSchema,
  step4ValidationSchema,
} from "../../src/components/createClubComps/ValidationSchemas";
import { setUploadNFTLoading } from "../../src/redux/reducers/gnosis";
import { NFTStorage } from "nft.storage";
import { convertToWeiGovernance } from "../../src/utils/globalFunctions";
import WrongNetworkModal from "../../src/components/modals/WrongNetworkModal";
import { useConnectWallet } from "@web3-onboard/react";
import Step4 from "../../src/components/createClubComps/Step4";

const Create = () => {
  const steps = [
    "Add station info",
    "Set token rules",
    "Governance",
    "Treasury",
  ];
  const dispatch = useDispatch();
  const uploadInputRef = useRef(null);
  const [{ wallet }] = useConnectWallet();

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const setCreateSafeLoading = useSelector((state) => {
    return state.gnosis.setCreateSafeLoading;
  });

  const setCreateDaoAuthorized = useSelector((state) => {
    return state.gnosis.createDaoAuthorized;
  });
  const setCreateSafeError = useSelector((state) => {
    return state.gnosis.setCreateSafeError;
  });
  const setCreateSafeErrorCode = useSelector((state) => {
    return state.gnosis.setCreateSafeErrorCode;
  });

  const uploadNFTLoading = useSelector((state) => {
    return state.gnosis.setUploadNFTLoading;
  });

  const networkId = wallet?.chains[0]?.id;

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
      case 3:
        return <Step4 formik={formikStep4} />;
      default:
        return "Unknown step";
    }
  };

  const formikStep1 = useFormik({
    initialValues: {
      clubName: "",
      clubSymbol: "",
      clubTokenType: tokenType[0],
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
      governance: true,
      quorum: 1,
      threshold: 51,
      addressList: [],
    },
    validationSchema: step3ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });

  const formikStep4 = useFormik({
    initialValues: {
      deploySafe: true,
      safeAddress: "",
    },
    validationSchema: step4ValidationSchema,
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
          const walletAddress = Web3.utils.toChecksumAddress(
            wallet.accounts[0].address,
          );
          formikStep3.values.addressList.unshift(walletAddress);

          const params = {
            clubName: formikStep1.values.clubName,
            clubSymbol: formikStep1.values.clubSymbol,
            ownerFeePerDepositPercent: 0 * 100,
            depositClose: dayjs(formikERC721Step2.values.depositClose).unix(),
            quorum: formikStep3.values.quorum * 100,
            threshold: formikStep3.values.threshold * 100,
            depositTokenAddress: USDC_CONTRACT_ADDRESS,
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
            isGovernanceActive: values.governance,

            allowWhiteList: false,
            merkleRoot:
              "0x0000000000000000000000000000000000000000000000000000000000000001",
          };

          initiateConnection(
            params,
            dispatch,
            GNOSIS_TRANSACTION_URL,
            values.addressList,
            formikStep1.values.clubTokenType,
            FACTORY_CONTRACT_ADDRESS,
            metadata.data.image.pathname,
            metadata.url,
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const walletAddress = Web3.utils.toChecksumAddress(
            wallet.accounts[0].address,
          );
          formikStep3.values.addressList.unshift(walletAddress);
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
            depositTokenAddress: USDC_CONTRACT_ADDRESS,
            isGovernanceActive: formikStep3.values.governance,
            isGtTransferable: true,
            allowWhiteList: false,
            merkleRoot:
              "0x0000000000000000000000000000000000000000000000000000000000000001",
          };
          initiateConnection(
            params,
            dispatch,
            GNOSIS_TRANSACTION_URL,
            formikStep3.values.addressList,
            formikStep1.values.clubTokenType,
            FACTORY_CONTRACT_ADDRESS,
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

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
      case 3:
        formikStep4.handleSubmit();
    }
  };
  return (
    <Layout2>
      <Grid
        container
        item
        paddingLeft={{ xs: 5, sm: 5, md: 10, lg: 45 }}
        paddingTop={4}
        paddingRight={{ xs: 5, sm: 5, md: 10, lg: 45 }}
        justifyContent="center"
        alignItems="center">
        <Box
          width={{ xs: "60%", sm: "70%", md: "80%", lg: "100%" }}
          paddingTop={10}>
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
            {activeStep === steps.length - 1 && setCreateSafeLoading ? (
              <SafeDepositLoadingModal
                open={open}
                title=" Deploying a new safe"
                description=" Please sign & authorise StationX to deploy a new safe for your
                station."
              />
            ) : activeStep === steps.length - 1 && setCreateDaoAuthorized ? (
              <SafeDepositLoadingModal
                open={open}
                title="Setting up your station"
                description="Please sign to authorise StationX to deploy this station
              for you."
              />
            ) : activeStep === steps.length - 1 && setCreateSafeError ? (
              <>
                {setCreateSafeErrorCode === 4001 ? (
                  <ErrorModal isSignRejected />
                ) : (
                  <ErrorModal isError />
                )}
              </>
            ) : activeStep === steps.length - 1 && uploadNFTLoading ? (
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
                  justifyContent="flex-end"
                  alignItems="center"
                  mt={2}>
                  {getStepContent(activeStep)}
                  {!activeStep == 0 && activeStep !== steps.length - 1 && (
                    <Button
                      variant="wideButton"
                      sx={{
                        marginTop: "2rem",
                        marginBottom: "6rem",
                        marginRight: "1rem",
                      }}
                      onClick={handlePrev}>
                      Prev
                    </Button>
                  )}
                  {activeStep === steps.length - 1 ? (
                    <>
                      <Button
                        variant="wideButton"
                        sx={{
                          marginTop: "2rem",
                          marginRight: "1rem",
                        }}
                        onClick={handlePrev}>
                        Prev
                      </Button>
                      <Button
                        variant="wideButton"
                        sx={{ marginTop: "2rem" }}
                        onClick={handleSubmit}>
                        Finish
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="wideButton"
                      sx={{ marginTop: "2rem", marginBottom: "6rem" }}
                      onClick={handleSubmit}>
                      Next
                    </Button>
                  )}
                </Grid>
              </Fragment>
            )}
          </form>
        </Box>
      </Grid>

      {networkId !== "0x89" && networkId !== "0x5" ? <WrongNetworkModal /> : ""}
    </Layout2>
  );
};
export default ProtectRoute(Create);
