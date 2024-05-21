import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Step,
  StepButton,
  Stepper,
} from "@mui/material";
import Button from "@components/ui/button/Button";
import { Fragment, useEffect, useRef, useState } from "react";
import Step1 from "../../src/components/createClubComps/Step1";
import Step3 from "../../src/components/createClubComps/Step3";
import { useFormik } from "formik";
import { tokenType, useStationForType } from "../../src/data/create";
import ERC20Step2 from "../../src/components/createClubComps/ERC20Step2";
import NFTStep2 from "../../src/components/createClubComps/NFTStep2";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
// import ErrorModal from "../../src/components/createClubComps/ErrorModal";
// import SafeDepositLoadingModal from "../../src/components/createClubComps/SafeDepositLoadingModal";
import {
  ERC20Step2ValidationSchema,
  ERC721Step2ValidationSchema,
  step1ValidationSchema,
  step3ValidationSchema,
} from "../../src/components/createClubComps/ValidationSchemas";
// import { setUploadNFTLoading } from "../../src/redux/reducers/gnosis";
import { NFTStorage } from "nft.storage";
import { convertToWeiGovernance } from "../../src/utils/globalFunctions";
import useSafe from "../../src/hooks/useSafe";
import Layout from "../../src/components/layouts/layout";
import { useAccount, useChainId } from "wagmi";
import { ZERO_ADDRESS, ZERO_MERKLE_ROOT } from "utils/constants";
import { NFT_STORAGE_TOKEN } from "api/token";
import useCommonContractMethods from "hooks/useCommonContractMehods";

const Create = () => {
  const steps = ["Basic info", "Contribution rules", "Treasury"];
  const dispatch = useDispatch();
  const uploadInputRef = useRef(null);
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const { address: walletAddress } = useAccount();
  const { getDecimals } = useCommonContractMethods({
    routeNetworkId: networkId,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const { initiateConnection } = useSafe();

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
          return (
            <ERC20Step2
              formik={formikERC20Step2}
              networkId={networkId}
              tokenSymbol={formikStep1.values.clubSymbol}
            />
          );
        } else {
          return (
            <NFTStep2
              formik={formikERC721Step2}
              uploadInputRef={uploadInputRef}
              networkId={networkId}
              tokenSymbol={formikStep1.values.clubSymbol}
            />
          );
        }
      case 2:
        return <Step3 formik={formikStep3} />;
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
      depositToken: "",
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
      depositToken: "",
      pricePerToken: "",
      maxTokensPerUser: "",
      isNftTotalSupplylimited: false,
      totalTokenSupply: "",
      depositClose: dayjs(Date.now() + 3600 * 1000 * 24),
    },

    validationSchema: ERC721Step2ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });

  useEffect(() => {
    formikStep3.setFieldValue("addressList", [walletAddress]);
  }, [walletAddress]);

  const formikStep3 = useFormik({
    initialValues: {
      deploySafe: "newSafe",
      safeAddress: "",
      governance: "non-governance",
      quorum: 1,
      threshold: 51,
      addressList: [walletAddress],
      safeThreshold: 1,
      assetsStoredOnGnosis: true,
    },
    validationSchema: step3ValidationSchema,
    onSubmit: async (values) => {
      setOpen(true);
      setLoader(true);

      if (formikStep1.values.clubTokenType === "NFT") {
        // dispatch(setUploadNFTLoading(true));
        const client = new NFTStorage({
          token: NFT_STORAGE_TOKEN,
        });

        const metadata = await client.store({
          name: formikStep1.values.clubName,
          description: "nft image",
          image: formikERC721Step2.values.nftImage,
        });
        const depositTokenAddress = formikERC721Step2.values.depositToken;

        const decimals = await getDecimals(depositTokenAddress);

        // dispatch(setUploadNFTLoading(false));
        try {
          const params = {
            clubName: formikStep1.values.clubName,
            clubSymbol: formikStep1.values.clubSymbol,
            ownerFeePerDepositPercent: 0 * 100,
            depositClose: dayjs(formikERC721Step2.values.depositClose).unix(),
            quorum: formikStep3.values.quorum * 100,
            threshold: formikStep3.values.threshold * 100,
            safeThreshold: formikStep3.values.safeThreshold ?? 0,
            depositTokenAddress: depositTokenAddress,
            treasuryAddress:
              formikStep3.values.safeAddress.length > 0
                ? formikStep3.values.safeAddress
                : ZERO_ADDRESS,
            maxTokensPerUser: formikERC721Step2.values.maxTokensPerUser,
            distributeAmount: formikERC721Step2.values.isNftTotalSupplylimited
              ? formikERC721Step2.values.totalTokenSupply
              : 0,
            pricePerToken: convertToWeiGovernance(
              formikERC721Step2.values.pricePerToken,
              decimals,
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
            metadata.url,
            formikStep1.values.useStationFor,
            formikStep1.values.email,
            networkId,
            formikERC721Step2.values.nftImage,
            setLoader,
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const depositTokenAddress = formikERC20Step2.values.depositToken;

          const decimals = await getDecimals(depositTokenAddress);

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
              decimals,
            ),
            minDepositPerUser: convertToWeiGovernance(
              formikERC20Step2.values.minDepositPerUser,
              decimals,
            ),
            maxDepositPerUser: convertToWeiGovernance(
              formikERC20Step2.values.maxDepositPerUser,
              decimals,
            ),
            ownerFeePerDepositPercent: 0 * 100,
            depositClose: dayjs(formikERC20Step2.values.depositClose).unix(),
            quorum: formikStep3.values.quorum * 100,
            threshold: formikStep3.values.threshold * 100,
            safeThreshold: formikStep3.values.safeThreshold ?? 0,
            // depositTokenAddress: CHAIN_CONFIG[networkId].usdcAddress,
            depositToken: formikERC20Step2.values.depositToken,
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
            formikStep1.values.useStationFor,
            formikStep1.values.email,
            networkId,
            null,
            setLoader,
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  // <Button onClick={handlePrev}>Prev</Button>;

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
    }
  };

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
            {/* {activeStep === steps.length - 1 &&
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
            ) : ( */}
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
                      <Button onClick={handlePrev}>Prev</Button>
                      <Button onClick={handleSubmit}>Finish</Button>
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
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loader}>
              <CircularProgress />
            </Backdrop>
            {/* )} */}
          </form>
        </Box>
      </Grid>
    </Layout>
  );
};
export default Create;
