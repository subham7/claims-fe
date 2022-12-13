import { React, useRef, onChange, useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Stepper,
  Step,
  Backdrop,
  StepButton,
} from "@mui/material";
import Layout2 from "../../src/components/layouts/layout2";
import Web3 from "web3";
import { initiateConnection } from "../../src/utils/safe";
import { useDispatch, useSelector } from "react-redux";
import ProtectRoute from "../../src/utils/auth";
import Step1 from "./Step1";
import Step3 from "./Step3";
import ERC721NonTransferableStep2 from "./ERC721NonTransferableStep2";
import ERC20NonTransferableStep2 from "./ERC20NonTransferableStep2";

const Create = (props) => {
  const uploadInputRef = useRef(null);
  const [clubName, setClubName] = useState(null);
  const [clubSymbol, setClubSymbol] = useState(null);
  const [clubTokenType, setClubTokenType] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState("");
  const [maxContribution, setMaxContribution] = useState("");
  const [mandatoryProposal, setMandatoryProposal] = useState(false);
  const [voteForQuorum, setVoteForQuorum] = useState(0);
  const [depositClose, setDepositClose] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const [membersLeaveDate, setMembersLeaveDate] = useState(null);
  const [minContribution, setMinContribution] = useState("");
  const [voteInFavour, setVoteInFavour] = useState(51);
  const [addressList, setAddressList] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [voteOnFavourErrorMessage, setVoteOnFavourErrorMessage] =
    useState(false);
  const [transferableMembership, setTransferableMembership] = useState(false);
  const [nftPrice, setNftPrice] = useState();
  const [limitSupply, setLimitSupply] = useState();
  const [mintLimit, setMintLimit] = useState(1);
  const [tokenSupply, setTokenSupply] = useState();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const clubID = useSelector((state) => {
    return state.create.clubID;
  });
  const [threshold, setThreshold] = useState(2);
  const dispatch = useDispatch();
  const { wallet } = props;
  const [completed, setCompleted] = useState({});
  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });
  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const usdcConvertDecimal = useSelector((state) => {
    return state.gnosis.tokenDecimal;
  });

  let walletAddress = null;

  const handleChange = (newValue) => {
    setDepositClose(newValue);
  };

  const handleDepositClose = (newValue) => {
    setMembersLeaveDate(newValue.target.value);
  };

  const onSetVoteForQuorum = (event, newValue) => {
    setVoteForQuorum(newValue);
  };

  const onSetVoteOnFavourChange = (event, newValue) => {
    if (newValue < 50) {
      setVoteOnFavourErrorMessage(true);
    }
    if (newValue > 50) {
      setVoteOnFavourErrorMessage(false);
      setVoteInFavour(newValue);
    }
  };

  const minimumSignaturePercentage = (newValue) => {
    if (addressList.length === 1) {
      setThreshold(addressList.length);
    }
    if (addressList.length > 1) {
      setThreshold(Math.ceil(addressList.length * (parseInt(newValue) / 100)));
    }
  };

  const handleLoading = (event) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e, index) => {
    const address = e.target.value;
    const list = [...addressList];
    list[index] = address;
    setAddressList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...addressList];
    list.splice(index, 1);
    setAddressList(list);
  };

  const handleAddClick = () => {
    setAddressList([...addressList, ""]);
  };

  const steps = ["Add basic info", "Select template", "Set rules"];

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    setOpen(true);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === steps.length - 1) {
      const web3 = new Web3(Web3.givenProvider);
      const auth = web3.eth.getAccounts();
      auth.then(
        (result) => {
          walletAddress = result[0];
          addressList.unshift(walletAddress);
          console.log("addressList", addressList);
          initiateConnection(
            addressList,
            threshold,
            dispatch,
            clubName,
            clubSymbol,
            raiseAmount,
            minContribution,
            maxContribution,
            0,
            depositClose,
            0,
            voteForQuorum,
            voteInFavour,
            FACTORY_CONTRACT_ADDRESS,
            USDC_CONTRACT_ADDRESS,
            GNOSIS_TRANSACTION_URL,
            usdcConvertDecimal,
          )
            .then((result) => {
              setLoading(false);
            })
            .catch((error) => {
              setLoading(true);
            });
        },
        (error) => {
          console.log("Error connecting to Wallet!");
        },
      );
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handlePageLoading = () => {
    handleLoading;
  };

  const handleContractClick = (key) => {
    if (key == 0) {
      handleNext();
    }
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  return (
    <Layout2>
      <Grid
        container
        item
        paddingLeft={{ xs: 5, sm: 5, md: 10, lg: 45 }}
        paddingTop={15}
        paddingRight={{ xs: 5, sm: 5, md: 10, lg: 45 }}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width={{ xs: "60%", sm: "70%", md: "80%", lg: "100%" }}
          paddingTop={10}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              // if (isStepOptional(index)) {
              //   labelProps.optional = (
              //     <Typography variant="caption">Optional</Typography>
              //   )
              // }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
                // <Step key={label} {...stepProps}>
                //   <StepLabel {...labelProps}>{label}</StepLabel>
                // </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <>
              <Grid
                container
                md={12}
                justifyContent="center"
                alignContent="center"
              >
                <Grid item>
                  <Typography sx={{ color: "#FFFFFF", fontSize: "30px" }}>
                    Please wait while we are processing your request
                  </Typography>
                </Grid>
              </Grid>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </>
          ) : (
            <>
              {/* {components[activeStep]} */}
              {activeStep === 0 ? (
                <Step1
                  clubName={clubName}
                  setClubName={setClubName}
                  clubSymbol={clubSymbol}
                  setClubSymbol={setClubSymbol}
                  activeStep={activeStep}
                  handleNext={handleNext}
                  clubTokenType={clubTokenType}
                  setClubTokenType={setClubTokenType}
                />
              ) : activeStep === 1 ? (
                clubTokenType === "NFT (Coming soon!)" ? (
                  <ERC721NonTransferableStep2
                    transferableMembership={transferableMembership}
                    setTransferableMembership={setTransferableMembership}
                    nftPrice={nftPrice}
                    setNftPrice={setNftPrice}
                    limitSupply={limitSupply}
                    setLimitSupply={setLimitSupply}
                    mintLimit={mintLimit}
                    setMintLimit={setMintLimit}
                    tokenSupply={tokenSupply}
                    setTokenSupply={setTokenSupply}
                    depositClose={depositClose}
                    setDepositClose={setDepositClose}
                    handleChange={handleChange}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    uploadInputRef={uploadInputRef}
                    activeStep={activeStep}
                    handleNext={handleNext}
                  />
                ) : (
                  <ERC20NonTransferableStep2
                    depositClose={depositClose}
                    setDepositClose={setDepositClose}
                    handleChange={handleChange}
                    minContribution={minContribution}
                    setMinContribution={setMinContribution}
                    maxContribution={maxContribution}
                    setMaxContribution={setMaxContribution}
                    raiseAmount={raiseAmount}
                    setRaiseAmount={setRaiseAmount}
                    activeStep={activeStep}
                    handleNext={handleNext}
                  />
                )
              ) : (
                <Step3
                  voteForQuorum={voteForQuorum}
                  setVoteForQuorum={setVoteForQuorum}
                  onSetVoteForQuorum={onSetVoteForQuorum}
                  onSetVoteOnFavourChange={onSetVoteOnFavourChange}
                  voteInFavour={voteInFavour}
                  setVoteInFavour={setVoteInFavour}
                  voteOnFavourErrorMessage={voteOnFavourErrorMessage}
                  setVoteOnFavourErrorMessage={setVoteOnFavourErrorMessage}
                  handleAddClick={handleAddClick}
                  addressList={addressList}
                  setAddressList={setAddressList}
                  handleInputChange={handleInputChange}
                  handleRemoveClick={handleRemoveClick}
                />
              )}
              <Box
                width={{ xs: "100%", sm: "100%", md: "100%" }}
                paddingTop={10}
                paddingBottom={10}
              >
                {activeStep === 2 ? (
                  <>
                    <Button
                      variant="wideButton"
                      disabled={
                        activeStep === 0
                          ? !clubName || !clubSymbol
                          : activeStep === 2
                          ? !raiseAmount ||
                            !maxContribution ||
                            !voteForQuorum ||
                            !depositClose ||
                            !minContribution ||
                            voteInFavour < 50
                          : // : activeStep === 2
                            //   ? false
                            true
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            </>
          )}
        </Box>
      </Grid>
    </Layout2>
  );
};

export default ProtectRoute(Create);
