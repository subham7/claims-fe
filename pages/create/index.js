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
  InputAdornment,
  Card,
} from "@mui/material";
import Router, { useRouter } from "next/router";
import Layout2 from "../../src/components/layouts/layout2";
import Web3 from "web3";
import { initiateConnection } from "../../src/utils/safe";
import { useDispatch, useSelector } from "react-redux";
import ProtectRoute from "../../src/utils/auth";
import Step1 from "./Step1";
import Step3 from "./Step3";
import ERC721NonTransferableStep2 from "./ERC721NonTransferableStep2";
import ERC20NonTransferableStep2 from "./ERC20NonTransferableStep2";
import { NFTStorage, File, Blob } from "nft.storage";
import { convertFromWei } from "../../src/utils/globalFunctions";
import { CleaningServices } from "@mui/icons-material";
import { tokenType } from "../../src/data/create";

const Create = (props) => {
  const router = useRouter();
  const uploadInputRef = useRef(null);
  const [clubName, setClubName] = useState(null);
  const [clubSymbol, setClubSymbol] = useState(null);
  const [clubTokenType, setClubTokenType] = useState(tokenType[0]);
  const [displayImage, setDisplayImage] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState("");
  const [maxContribution, setMaxContribution] = useState("");
  const [mandatoryProposal, setMandatoryProposal] = useState(false);
  const [voteForQuorum, setVoteForQuorum] = useState(1);
  const [depositClose, setDepositClose] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const [minDate, setMinDate] = useState(
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

  const [governance, setGovernance] = useState(true);
  const createDaoGnosisSigned = useSelector((state) => {
    return state.gnosis.createDaoGnosisSigned;
  });
  const createDaoAuthorized = useSelector((state) => {
    return state.gnosis.createDaoAuthorized;
  });
  const redirectToCreate = useSelector((state) => {
    return state.gnosis.redirectToCreate;
  });

  let walletAddress = null;

  useEffect(() => {
    if (redirectToCreate) {
      setActiveStep(0);
      // step1();
      router.push("/create");
    }
  }, [redirectToCreate, router]);

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

  const steps = ["Add basic info", "Set token rules", "Governance"];

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    setOpen(true);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === steps.length - 1) {
      setLoading(true);
      if (clubTokenType === "NFT") {
        const client = new NFTStorage({
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlhMWRFQjEyMjQyYTBlN0VmNTUwNjFlOTAwMTYyMDcxNEFENDBlNDgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NDEyOTI3MzM5MSwibmFtZSI6InN0YXRpb25YIG5mdCJ9.1w-RC7qZ43T2NhjHrtsO_Gmb0Mw1BjJo7GXMciqX5jY",
        });
        // console.log(selectedImage);
        let metadata;
        if (selectedImage) {
          // const image = await client.storeBlob(selectedImage);
          // console.log("image", image);

          metadata = await client.store({
            name: clubName,
            description: "nft image",
            image: selectedImage,
          });
        } else {
          // const imageFile = new File([imageUrl.blob()], imageUrl, {
          //   type: "image/png",
          // });
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], imageUrl, {
            type: blob.type,
          });
          // const image = await client.storeBlob(file);
          // console.log("image", image);
          metadata = await client.store({
            name: clubName,
            description: "nft image",
            image: new File([blob], imageUrl, {
              type: blob.type,
            }),
          });
        }
        // const imageFile = new File([], selectedImage.name, {
        //   type: "image/png",
        // });
        // console.log("imagefile", imageFile);
        // const metadata = await client.storeBlob(selectedImage);
        // const metadata = await client.storeBlob(
        //   new Blob([imageUrl], { type: "image/png" }),
        //   // new File([], imageUrl, { type: "image/png" }),
        // );

        const web3 = new Web3(Web3.givenProvider);
        const auth = web3.eth.getAccounts();
        auth.then(
          (result) => {
            walletAddress = result[0];
            addressList.unshift(walletAddress);
            initiateConnection(
              clubTokenType,
              addressList,
              threshold,
              dispatch,
              clubName,
              clubSymbol,
              0,
              0,
              0,
              0,
              depositClose,
              0,
              voteForQuorum,
              voteInFavour,
              FACTORY_CONTRACT_ADDRESS,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
              usdcConvertDecimal,
              governance,
              true,
              mintLimit,
              limitSupply ? tokenSupply : 1,
              // convertFromWei(nftPrice, usdcConvertDecimal).toString(),
              nftPrice,
              transferableMembership,
              limitSupply ? false : true,
              metadata.data.image.pathname,
              metadata.url,
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
      } else {
        const web3 = new Web3(Web3.givenProvider);
        const auth = web3.eth.getAccounts();
        auth.then(
          (result) => {
            walletAddress = result[0];
            addressList.unshift(walletAddress);
            initiateConnection(
              clubTokenType,
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
              governance,
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

  const handleOperationTypeChange = (event) => {
    if (event.target.checked) {
      setGovernance(true);
    } else {
      setGovernance(false);
    }
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
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  backgroundImage: "url(assets/images/gradients.png)",
                  backgroundPosition: "center center",
                }}
                open={open}
              >
                {createDaoGnosisSigned ? (
                  <Card>
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      sx={{ padding: "10px", width: "547px" }}
                      direction="column"
                    >
                      <Grid item>
                        <img src="assets/images/deployingsafe_img.svg" />
                      </Grid>
                      <Grid
                        item
                        paddingTop="20px"
                        justifyContent="left"
                        justifyItems="left"
                      >
                        <Typography variant="h4" sx={{ color: "#fff" }}>
                          Deploying a new safe
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        paddingTop="20px"
                        justifyContent="left"
                        justifyItems="left"
                      >
                        <Typography
                          variant="regularText4"
                          sx={{ color: "#fff" }}
                        >
                          Please sign & authorise StationX to deploy a new safe
                          for your station.
                        </Typography>
                      </Grid>
                      <Grid item paddingTop="30px">
                        <CircularProgress color="inherit" />
                      </Grid>
                    </Grid>
                  </Card>
                ) : createDaoAuthorized ? (
                  <Card>
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      sx={{ padding: "10px", width: "547px" }}
                      direction="column"
                    >
                      <Grid item>
                        <img src="assets/images/settingup_img.svg" />
                      </Grid>
                      <Grid
                        item
                        paddingTop="20px"
                        justifyContent="left"
                        justifyItems="left"
                      >
                        <Typography variant="h4" sx={{ color: "#fff" }}>
                          Setting up your station
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        paddingTop="20px"
                        justifyContent="left"
                        justifyItems="left"
                      >
                        <Typography
                          variant="regularText4"
                          sx={{ color: "#fff" }}
                        >
                          Please sign to authorise StationX to deploy this
                          station for you.
                        </Typography>
                      </Grid>
                      <Grid item paddingTop="30px">
                        <CircularProgress color="inherit" />
                      </Grid>
                    </Grid>
                  </Card>
                ) : null}
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
                clubTokenType === "NFT" ? (
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
                    minDate={minDate}
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
                  governance={governance}
                  handleOperationTypeChange={handleOperationTypeChange}
                  loading={loading}
                />
              )}
              <Box
                width={{ xs: "100%", sm: "100%", md: "100%" }}
                paddingTop={10}
                paddingBottom={10}
              >
                {activeStep === 2 ? (
                  <>
                    {loading ? (
                      <Button variant="wideButton" disabled>
                        <CircularProgress />
                      </Button>
                    ) : (
                      <Button
                        variant="wideButton"
                        disabled={
                          activeStep === 0
                            ? !clubName || !clubSymbol
                            : activeStep === 2
                            ? // !raiseAmount ||
                              // !maxContribution ||
                              !voteForQuorum ||
                              !depositClose ||
                              // !minContribution ||
                              voteInFavour < 50
                            : // : activeStep === 2
                              //   ? false
                              true
                        }
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    )}
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
    // <Layout2>

    //   {activeStep > 2 ? (
    //     <Backdrop
    //       sx={{
    //         color: "#fff",
    //         zIndex: (theme) => theme.zIndex.drawer + 1,
    //         backgroundImage: "url(assets/images/gradients.png)",
    //         backgroundPosition: "center center",
    //       }}
    //       open={open}
    //     >
    //       {createDaoGnosisSigned ? (
    //         <Card>
    //           <Grid
    //             container
    //             justifyContent="center"
    //             alignItems="center"
    //             sx={{ padding: "10px", width: "547px" }}
    //             direction="column"
    //           >
    //             <Grid item>
    //               <img src="assets/images/deployingsafe_img.svg" />
    //             </Grid>
    //             <Grid
    //               item
    //               paddingTop="20px"
    //               justifyContent="left"
    //               justifyItems="left"
    //             >
    //               <Typography variant="h4" sx={{ color: "#fff" }}>
    //                 Deploying a new safe
    //               </Typography>
    //             </Grid>
    //             <Grid
    //               item
    //               paddingTop="20px"
    //               justifyContent="left"
    //               justifyItems="left"
    //             >
    //               <Typography variant="regularText4" sx={{ color: "#fff" }}>
    //                 Please sign & authorise StationX to deploy a new safe for
    //                 your station.
    //               </Typography>
    //             </Grid>
    //             <Grid item paddingTop="30px">
    //               <CircularProgress color="inherit" />
    //             </Grid>
    //           </Grid>
    //         </Card>
    //       ) : createDaoAuthorized ? (
    //         <Card>
    //           <Grid
    //             container
    //             justifyContent="center"
    //             alignItems="center"
    //             sx={{ padding: "10px", width: "547px" }}
    //             direction="column"
    //           >
    //             <Grid item>
    //               <img src="assets/images/settingup_img.svg" />
    //             </Grid>
    //             <Grid
    //               item
    //               paddingTop="20px"
    //               justifyContent="left"
    //               justifyItems="left"
    //             >
    //               <Typography variant="h4" sx={{ color: "#fff" }}>
    //                 Setting up your station
    //               </Typography>
    //             </Grid>
    //             <Grid
    //               item
    //               paddingTop="20px"
    //               justifyContent="left"
    //               justifyItems="left"
    //             >
    //               <Typography variant="regularText4" sx={{ color: "#fff" }}>
    //                 Please sign to authorise StationX to deploy this station for
    //                 you.
    //               </Typography>
    //             </Grid>
    //             <Grid item paddingTop="30px">
    //               <CircularProgress color="inherit" />
    //             </Grid>
    //           </Grid>
    //         </Card>
    //       ) : null}
    //     </Backdrop>
    //   ) : (
    //     <Grid
    //       container
    //       item
    //       paddingLeft={{ xs: 5, sm: 5, md: 10, lg: 45 }}
    //       paddingTop={15}
    //       paddingRight={{ xs: 5, sm: 5, md: 10, lg: 45 }}
    //       justifyContent="center"
    //       alignItems="center"
    //     >
    //       <Box
    //         width={{ xs: "60%", sm: "70%", md: "80%", lg: "100%" }}
    //         paddingTop={10}
    //       >
    //         <Stepper activeStep={activeStep}>
    //           {steps.map((label, index) => {
    //             const stepProps = {};
    //             const labelProps = {};

    //             if (isStepSkipped(index)) {
    //               stepProps.completed = false;
    //             }
    //             return (
    //               <Step key={label} completed={completed[index]}>
    //                 <StepButton color="inherit" onClick={handleStep(index)}>
    //                   {label}
    //                 </StepButton>
    //               </Step>
    //             );
    //           })}
    //         </Stepper>
    //         {activeStep === steps.length > 2 ? (
    //           <></>
    //         ) : (
    //           <>
    //             {/* {components[activeStep]} */}
    //           {activeStep === 0 ? (
    //             <Step1
    //               clubName={clubName}
    //               setClubName={setClubName}
    //               clubSymbol={clubSymbol}
    //               setClubSymbol={setClubSymbol}
    //               activeStep={activeStep}
    //               handleNext={handleNext}
    //               clubTokenType={clubTokenType}
    //               setClubTokenType={setClubTokenType}
    //             />
    //           ) : activeStep === 1 ? (
    //             clubTokenType === "NFT" ? (
    //               <ERC721NonTransferableStep2
    //                 transferableMembership={transferableMembership}
    //                 setTransferableMembership={setTransferableMembership}
    //                 nftPrice={nftPrice}
    //                 setNftPrice={setNftPrice}
    //                 limitSupply={limitSupply}
    //                 setLimitSupply={setLimitSupply}
    //                 mintLimit={mintLimit}
    //                 setMintLimit={setMintLimit}
    //                 tokenSupply={tokenSupply}
    //                 setTokenSupply={setTokenSupply}
    //                 depositClose={depositClose}
    //                 setDepositClose={setDepositClose}
    //                 handleChange={handleChange}
    //                 selectedImage={selectedImage}
    //                 setSelectedImage={setSelectedImage}
    //                 imageUrl={imageUrl}
    //                 setImageUrl={setImageUrl}
    //                 uploadInputRef={uploadInputRef}
    //                 activeStep={activeStep}
    //                 handleNext={handleNext}
    //               />
    //             ) : (
    //               <ERC20NonTransferableStep2
    //                 depositClose={depositClose}
    //                 setDepositClose={setDepositClose}
    //                 handleChange={handleChange}
    //                 minContribution={minContribution}
    //                 setMinContribution={setMinContribution}
    //                 maxContribution={maxContribution}
    //                 setMaxContribution={setMaxContribution}
    //                 raiseAmount={raiseAmount}
    //                 setRaiseAmount={setRaiseAmount}
    //                 activeStep={activeStep}
    //                 handleNext={handleNext}
    //               />
    //             )
    //           ) : (
    //             <Step3
    //               voteForQuorum={voteForQuorum}
    //               setVoteForQuorum={setVoteForQuorum}
    //               onSetVoteForQuorum={onSetVoteForQuorum}
    //               onSetVoteOnFavourChange={onSetVoteOnFavourChange}
    //               voteInFavour={voteInFavour}
    //               setVoteInFavour={setVoteInFavour}
    //               voteOnFavourErrorMessage={voteOnFavourErrorMessage}
    //               setVoteOnFavourErrorMessage={setVoteOnFavourErrorMessage}
    //               handleAddClick={handleAddClick}
    //               addressList={addressList}
    //               setAddressList={setAddressList}
    //               handleInputChange={handleInputChange}
    //               handleRemoveClick={handleRemoveClick}
    //             />
    //           )}
    //             <Box
    //               width={{ xs: "100%", sm: "100%", md: "100%" }}
    //               paddingTop={10}
    //               paddingBottom={10}
    //             >
    //               {activeStep === 2 ? (
    //                 <>
    //                   <Button
    //                     variant="wideButton"
    //                     disabled={
    //                       activeStep === 0
    //                         ? !clubName || !clubSymbol
    //                         : activeStep === 2
    //                         ? !raiseAmount ||
    //                           !maxContribution ||
    //                           !depositClose ||
    //                           !minContribution
    //                         : // : activeStep === 2
    //                           //   ? false
    //                           true
    //                     }
    //                     onClick={handleNext}
    //                   >
    //                     Next
    //                   </Button>
    //                 </>
    //               ) : (
    //                 <></>
    //               )}
    //             </Box>
    //           </>
    //         )}
    //       </Box>
    //     </Grid>
    //   )}
    // </Layout2>
  );
};

export default ProtectRoute(Create);
