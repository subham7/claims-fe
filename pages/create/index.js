import { React, useRef, onChange, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Grid,
  Item,
  Typography,
  TextField,
  Card,
  Switch,
  FormControlLabel,
  Box,
  Stack,
  Divider,
  Button,
  CircularProgress,
  IconButton,
  Stepper,
  StepLabel,
  Step,
  Backdrop,
  FormControl,
  Select,
  OutlinedInput,
  Menu,
  MenuItem,
  Alert,
  StepButton,
  InputAdornment,
} from "@mui/material";
import styled from "@emotion/styled";
import Layout2 from "../../src/components/layouts/layout2";
import CustomRoundedCard from "../../src/components/roundcard";
import CustomCard from "../../src/components/card";
import CustomSlider from "../../src/components/slider";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadIcon from "@mui/icons-material/Upload";
import ContractCard from "../../src/components/contractCard";
import {
  contractList,
  tokenType,
  dateTill,
  exitDates,
} from "../../src/data/create";
import Link from "next/link";
import SimpleSelectButton from "../../src/components/simpleSelectButton";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Web3 from "web3";
import Web3Adapter from "@safe-global/safe-web3-lib";
import { initiateConnection } from "../../src/utils/safe";
import { useDispatch, useSelector } from "react-redux";
import ProtectRoute from "../../src/utils/auth";
import { addClubID } from "../../src/redux/reducers/create";
import InfoIcon from "@mui/icons-material/Info";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Router from "next/router";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px",
  },
  largeText: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  largeText1: {
    fontSize: "2.4vw",
    color: "#FFFFFF",
    fontFamily: "Whyte",
  },
  largeText2: {
    fontSize: "18px",
    color: "#FFFFFF",
    fontFamily: "Whyte",
  },
  wrapTextIcon: {
    fontSize: "18px",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  smallText: {
    fontSize: "16px",
    fontFamily: "Whyte",
    color: "#6475A3",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontSize: "14px",
    fontFamily: "Whyte",
  },
  boldText: {
    fontWeight: "bold",
    fontFamily: "Whyte",
  },
  uploadButton: {
    backgroundColor: "#111D38",
    color: "#3B7AFD",
    fontSize: "18px",
    width: "208px",
    fontFamily: "Whyte",
  },
  cardPadding: {
    margin: 0,
    padding: 0,
    borderRadius: "10px",
  },
  addCircleColour: {
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  large_button: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    fontFamily: "Whyte",
  },
  backButton: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    backgroundColor: "#FFFFFF",
    color: "#3B7AFD",
    fontFamily: "Whyte",
  },
});

const Create = (props) => {
  const classes = useStyles();
  const uploadInputRef = useRef(null);
  const [clubName, setClubName] = useState(null);
  const [clubSymbol, setClubSymbol] = useState(null);
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
      step1();
    }
  }, [redirectToCreate]);

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

  const step1 = () => {
    return (
      <>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item md={8} mt={8}>
            <Typography className={classes.wrapTextIcon}>
              Basic Station info
            </Typography>
            <Typography className={classes.smallText}>
              Name & token symbol of your station are publicly visible on-chain
              & can’t be changed after it is created. This can be your brand
              name or something your community identifies with.
            </Typography>
            <br />
            <Typography className={classes.wrapTextIcon}>Name</Typography>
            <TextField
              error={clubName === ""}
              className={classes.textField}
              label="Eg: Degen Collective / PurpleDAO / Phoenix club"
              variant="outlined"
              onChange={(e) => setClubName(e.target.value)}
              value={clubName}
            />
            <br />
            <Typography className={classes.wrapTextIcon}>
              Symbol{" "}
              <Box
                sx={{ color: "#6475A3" }}
                fontWeight="Normal"
                display="inline"
              >
                (Ticker)
              </Box>
            </Typography>
            <TextField
              error={clubSymbol === ""}
              className={classes.textField}
              label="Eg: DGC / PDAO / PXC"
              variant="outlined"
              onChange={(e) => setClubSymbol(e.target.value)}
              value={clubSymbol}
            />
            <br />
            <Typography className={classes.smallText}>
              You can choose to make your token public or private along with
              other rules in the next steps.
            </Typography>
            <Grid
              container
              wrap="nowrap"
              spacing={0}
              justify="center"
              alignItems="center"
              direction="row"
            >
              <Grid item xs={0} mt={2}>
                <Button
                  variant="wideButton"
                  disabled={activeStep === 0 ? !clubName || !clubSymbol : false}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  const step2 = () => {
    return (
      <>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item md={12} mt={8}>
            <Typography className={classes.largeText1}>
              Select your station&apos;s objective
            </Typography>
            <br />
            <Typography className={classes.largeText}>
              We’ve curated unique templates for likewise objectives so you can
              only focus on achieving them while we take care of the rest.
            </Typography>
          </Grid>
          {contractList.map((data, key) => {
            return (
              <Grid
                item
                md={6}
                key={key}
                onClick={() => handleContractClick(key)}
              >
                <ContractCard
                  contractHeading={data.contractHeading}
                  contractSubHeading={data.contractSubHeading}
                  contractImage={data.image}
                  star={data.star}
                  inactive={data.inactive}
                  backgroundColour={data.backgroundColour}
                  comingSoonEnabled={data.comingSoonEnabled}
                />
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  };

  const step3 = () => {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item md={12} mt={8}>
            <Typography className={classes.largeText1}>
              Set rules for your station
            </Typography>
            <br />
            <Typography className={classes.largeText}>
              All parameters (except token name, symbol & art) can be edited
              from the dashboard.
            </Typography>
            <br />
            <br />
            <Typography className={classes.largeText} mb={2}>
              Set token type
            </Typography>
            <Typography className={classes.smallText} mb={2}>
              Token type that best suits your objective. For example: ERC721 for
              membership based communities, Non-transferrable ERC20 for a
              syndicate cap-table, transferrable ERC20 for a public DAO, etc.
              Transferability allows trading of tokens in public markets.
            </Typography>
            <Card className={classes.cardPadding}>
              <Grid container pl={3} pr={1}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Token type
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <SimpleSelectButton data={tokenType} />
                </Grid>
              </Grid>
            </Card>
            <br />
            <Typography className={classes.largeText} mt={3} mb={2}>
              Add governance
            </Typography>
            <Typography className={classes.smallText} mb={2}>
              Default mechanism is one wallet = one vote irrespective of number
              of tokens held. Stations can raise & vote proposals to conduct
              surveys, know community&apos;s sentiment & execute seamless
              actions (such a airdrop tokens, reward members, etc) required
              day-to-day.
            </Typography>
            <br />
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Do you want to enable Governance?
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={governance}
                        onChange={handleOperationTypeChange}
                      />
                    }
                    label="NO / YES"
                    labelPlacement="top"
                  />
                </Grid>
              </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding} mb={2}>
              <Grid
                container
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                pl={3}
                pr={1}
                mt={2}
                mb={2}
              >
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    % of votes needed
                  </Box>{" "}
                  to consider any proposal raised{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    (Quorum)
                  </Box>{" "}
                </Typography>
              </Grid>
              <Grid container item md={11.3} mt={4} ml={4} mb={4}>
                <CustomSlider
                  onChange={onSetVoteForQuorum}
                  value={voteForQuorum}
                />
              </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding} mb={2}>
              <Grid
                container
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                pl={3}
                pr={1}
                mt={2}
                mb={2}
              >
                <Typography className={classes.largeText2}>
                  Min.{" "}
                  <Box
                    sx={{ color: "#3B7AFD" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    % of votes needed
                  </Box>{" "}
                  out of all votes to pass a proposal{" "}
                  <Box
                    sx={{ color: "#6475A3" }}
                    fontWeight="fontWeightBold"
                    display="inline"
                  >
                    (Threshold)
                  </Box>{" "}
                </Typography>
              </Grid>
              <Grid container item md={11.3} mt={4} ml={4} mb={4}>
                <CustomSlider
                  onChange={onSetVoteOnFavourChange}
                  value={voteInFavour}
                  defaultValue={voteInFavour}
                  min={51}
                  max={100}
                />
              </Grid>
              {voteOnFavourErrorMessage ? (
                <Grid container md={11.3} mt={4} ml={4} mb={4}>
                  <Grid item>
                    <InfoIcon sx={{ color: "#D55438" }} />
                  </Grid>
                  <Grid item mt={0.2} ml={0.5}>
                    <Typography variant="p" sx={{ color: "#D55438" }}>
                      Minumum votes in support to pass a proposal should be
                      greater than 50%
                    </Typography>
                  </Grid>
                </Grid>
              ) : null}
            </Card>

            <Typography className={classes.smallText} mt={3} mb={2}>
              Threshold & quorum % can be edited later by raising a proposal.
            </Typography>
            <br />

            <Typography className={classes.largeText} mt={3} mb={2}>
              Set deposit rules for members
            </Typography>
            <Typography className={classes.smallText} mb={2}>
              Any new deposits will not be accepted after the last date and/or
              funding target is met. Admins can extend deposit dates from
              dashboard by an onchain transaction requiring gas.
            </Typography>
            <Card className={classes.cardPadding}>
              <Grid container pl={3} pr={1}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Last date for members to deposit & join
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      error={depositClose === null}
                      inputFormat="dd/MM/yyyy"
                      value={depositClose}
                      onChange={(e) => handleChange(e)}
                      renderInput={(params) => (
                        <TextField
                          onKeyDown={(e) => e.preventDefault()}
                          place
                          {...params}
                          sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                        />
                      )}
                      minDate={minDate}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Card>

            <br />
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Min. deposit amount per wallet
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    error={
                      minContribution < 0 ||
                      minContribution === null ||
                      minContribution % 1 !== 0 ||
                      typeof minContribution === "undefined"
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">USDC</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    onChange={(e) => {
                      setMinContribution(e.target.value);
                    }}
                    value={minContribution}
                    sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                    placeholder={"$100"}
                  />
                </Grid>
              </Grid>
            </Card>

            <br />
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Max. deposit amount per wallet
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    error={
                      maxContribution < 0 ||
                      maxContribution === null ||
                      maxContribution % 1 !== 0 ||
                      typeof maxContribution === "undefined" ||
                      parseInt(maxContribution) < parseInt(minContribution)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">USDC</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    onChange={(e) => setMaxContribution(e.target.value)}
                    value={maxContribution}
                    sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                    placeholder={"$1,000"}
                  />
                </Grid>
              </Grid>
            </Card>

            <br />
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Total amount your Station is raising
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    error={
                      raiseAmount < 0 ||
                      raiseAmount === null ||
                      raiseAmount % 1 !== 0 ||
                      typeof raiseAmount === "undefined" ||
                      parseInt(raiseAmount) < parseInt(maxContribution) ||
                      parseInt(raiseAmount) < parseInt(minContribution)
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ color: "#C1D3FF" }}
                        >
                          USDC
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    onChange={(e) => setRaiseAmount(e.target.value)}
                    value={raiseAmount}
                    sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                    placeholder={"$10,000"}
                  />
                </Grid>
              </Grid>
            </Card>
            <Typography className={classes.largeText} mt={4} mb={2}>
              Add more admins/signators who can manage setting & sign
              transactions
            </Typography>
            <Typography className={classes.smallText} mb={2}>
              Once your Station/Community passes a proposal, StationX
              automatically creates an on-chain transaction of the proposal.
              Signers can sign and execute such transactions from the dashboard.
            </Typography>
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography className={classes.largeText2}>
                    Add more wallets that will sign & authorise transactions
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                  mr={3}
                >
                  <IconButton aria-label="add" onClick={handleAddClick}>
                    <AddCircleOutlinedIcon
                      className={classes.addCircleColour}
                    />
                  </IconButton>
                </Grid>
              </Grid>
              {addressList.length > 0 ? (
                <Grid container pl={3} pr={1} mt={2} mb={2}>
                  {addressList.map((data, key) => {
                    return (
                      <>
                        <Grid
                          item
                          xs
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                          key={key}
                        >
                          <TextField
                            label={"Signature " + (key + 1).toString()}
                            error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                            variant="outlined"
                            onChange={(e) => handleInputChange(e, key)}
                            placeholder={"0x"}
                            sx={{
                              m: 1,
                              width: 443,
                              mt: 1,
                              borderRadius: "10px",
                            }}
                          />
                          <IconButton
                            aria-label="add"
                            onClick={handleRemoveClick}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              ) : null}
            </Card>
            <br />
            <Typography className={classes.smallText} mt={4} mb={2}>
              Note: Once added, admins can’t be changed in this version of the
              product.
            </Typography>

            {/*<Card className={classes.cardPadding} mb={2}>*/}
            {/*  <Grid container item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} pl={3} pr={1} mt={2} mb={2}>*/}
            {/*    <Typography className={classes.largeText}>*/}
            {/*      Minimum signatures needed to <Box sx={{ color: "#FFFFFF" }} fontWeight='fontWeightBold' display='inline'>pass</Box> any transaction*/}
            {/*    </Typography>*/}
            {/*  </Grid>*/}
            {/*  <Grid container item md={11.3} mt={4} ml={4} mb={4}>*/}
            {/*  <TextField*/}
            {/*    error={(threshold > addressList.length || threshold < 1) && addressList.length > 0}*/}
            {/*    variant="outlined"*/}
            {/*    onChange={(e) => setThreshold(e.target.value)}*/}
            {/*    value={threshold}*/}
            {/*    sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px", }}*/}
            {/*  />*/}
            {/*    /!* <CustomSlider onChange={e => minimumSignaturePercentage(e.target.value)} value={threshold} /> *!/*/}
            {/*  </Grid>*/}
            {/*</Card>*/}

            {/* <Typography className={classes.largeText} mt={4} mb={2}>
              Other
            </Typography>
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                  <Typography className={classes.largeText}>
                    Add a carry fee
                  </Typography>
                </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <FormControlLabel control={<Switch />} onChange={(e) => setMandatoryProposal(e.target.value)} value={mandatoryProposal} label="" />
                </Grid>
              </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding}>
              <Grid container pl={3} pr={1}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                  <Typography className={classes.largeText}>
                  Allow members to exit (from date of deposit)
                  </Typography>
                </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <FormControl sx={{ m: 1, width: 443, mt: 1 }}>
                  <Select
                    displayEmpty
                    value={value}
                    onChange={handleDepositClose}
                    input={<OutlinedInput />}
                    MenuProps={MenuProps}
                    style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", }}
                  >
                    {exitDates.map((value) => (
                      <MenuItem
                        key={value.text}
                        value={String(value.date)}
                        >
                        {value.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
              </Grid>
            </Card> */}
          </Grid>
        </Grid>
      </>
    );
  };

  const components = [step1(), step2(), step3()];
  return (
    <Layout2>
      {activeStep > 2 ? (
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
                  <Typography variant="regularText4" sx={{ color: "#fff" }}>
                    Please sign & authorise StationX to deploy a new safe for
                    your station.
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
                  <Typography variant="regularText4" sx={{ color: "#fff" }}>
                    Please sign to authorise StationX to deploy this station for
                    you.
                  </Typography>
                </Grid>
                <Grid item paddingTop="30px">
                  <CircularProgress color="inherit" />
                </Grid>
              </Grid>
            </Card>
          ) : null}
        </Backdrop>
      ) : (
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

                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length > 2 ? (
              <></>
            ) : (
              <>
                {components[activeStep]}
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
                              !depositClose ||
                              !minContribution
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
      )}
    </Layout2>
  );
};

export default ProtectRoute(Create);
// export default Create
