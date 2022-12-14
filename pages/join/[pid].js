import { React, useState, useEffect } from "react";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import {
  Grid,
  Typography,
  Card,
  Button,
  Stack,
  Divider,
  Input,
  Snackbar,
  Alert,
  Skeleton,
  Backdrop,
  CircularProgress,
  DialogContent,
  Dialog,
  CardMedia,
} from "@mui/material";
import Layout3 from "../../src/components/layouts/layout3";
import ProgressBar from "../../src/components/progressbar";
import { connectWallet, onboard } from "../../src/utils/wallet";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchClub, fetchClubbyDaoAddress } from "../../src/api/club";
import { createUser } from "../../src/api/user";
import {
  getMembersDetails,
  patchUserBalance,
  checkUserByClub,
} from "../../src/api/user";
import Web3 from "web3";
import ImplementationContract from "../../src/abis/implementationABI.json";
import { SmartContract } from "../../src/api/contract";
import { checkNetwork } from "../../src/utils/wallet";
import {
  calculateTreasuryTargetShare,
  convertAmountToWei,
  convertFromWei,
  convertFromWeiGovernance,
  convertToWei,
  convertToWeiGovernance,
} from "../../src/utils/globalFunctions";
import {
  setGovernanceTokenDetails,
  setUSDCTokenDetails,
} from "../../src/redux/reducers/gnosis";

const useStyles = makeStyles({
  valuesStyle: {
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  valuesDimStyle: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#C1D3FF",
  },
  cardRegular: {
    backgroundColor: "#19274B",
    borderRadius: "10px",
    opacity: 1,
  },
  cardJoin: {
    backgroundColor: "#81F5FF",
    borderRadius: "10px",
    opacity: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  dimColor: {
    color: "#C1D3FF",
  },
  connectWalletButton: {
    backgroundColor: "#3B7AFD",
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  depositButton: {
    backgroundColor: "#3B7AFD",
    width: "208px",
    height: "60px",
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  cardSmall: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontFamily: "Whyte",
    fontSize: "18px",
    color: "#111D38",
  },
  JoinText: {
    color: "#111D38",
    fontFamily: "Whyte",
    fontSize: "21px",
    fontWeight: "bold",
  },
  cardLargeFont: {
    "width": "150px",
    "fontSize": "2em",
    "fontWeight": "bold",
    "fontFamily": "Whyte",
    "borderColor": "#142243",
    "borderRadius": "0px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      "margin": 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      "margin": 0,
    },
    "color": "#3B7AFD",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    borderColor: "#111D38",
    opacity: 1,
    border: "1px solid #C1D3FF",
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontFamily: "Whyte",
    fontSize: "14px",
  },
  maxTag: {
    "borderRadius": "17px",
    "width": "98px",
    "height": "34px",
    "opacity": "1",
    "padding": "10px",
    "justifyContent": "center",
    "display": "flex",
    "alignItems": "center",
    "backgroundColor": " #3B7AFD",
    "fontSize": "20px",
    "&:hover": {
      background: "#F5F5F5",
      color: "#3B7AFD",
    },
  },
  openTag: {
    width: "60px",
    height: "20px",
    borderRadius: "11px",
    opacity: "1",
    padding: "10px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0ABB9233",
  },
  openTagFont: {
    paddingTop: "1px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#0ABB92",
    opacity: "1",
  },
  closeTag: {
    width: "60px",
    height: "20px",
    borderRadius: "11px",
    opacity: "1",
    padding: "10px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFB74D0D",
  },
  closeTagFont: {
    padding: "1px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#FFB74D",
    opacity: "1",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontSize: "28px",
  },
});

const Join = (props) => {
  const router = useRouter();
  const { pid } = router.query;
  const daoAddress = pid;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [walletConnected, setWalletConnected] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] =
    useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [minDeposit, setMinDeposit] = useState(0);
  const [maxDeposit, setMaxDeposit] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [quoram, setQuoram] = useState(0);
  const [tokenAPIDetails, settokenAPIDetails] = useState(null); // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false);
  const [clubId, setClubId] = useState(null);
  const [membersFetched, setMembersFetched] = useState(false);
  const [clubTokenMinted, setClubTokenMInted] = useState(0);
  const [members, setMembers] = useState(0);
  const [depositInitiated, setDepositInitiated] = useState(false);
  const [closingDays, setClosingDays] = useState(0);
  const [imageFetched, setImageFetched] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [gnosisAddress, setGnosisAddress] = useState(null);

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const [usdcTokenDecimal, setUsdcTokenDecimal] = useState(0);
  const [governanceConvertDecimal, setGovernanceConvertDecimal] = useState(0);
  const [closingDataFetched, setClosingDataFetched] = useState(false);
  const [minDepositDataFetched, setMinDepositDataFetched] = useState(false);
  const [maxDepositDataFetched, setMaxDepositDataFetched] = useState(false);
  const [totalRaiseAmountDataFetched, setTotalRaiseAmountDataFetched] =
    useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState(null);

  const fetchCustomTokenDecimals = async () => {
    if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
      const usdcContract = new SmartContract(
        ImplementationContract,
        USDC_CONTRACT_ADDRESS,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      const daoContract = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      await usdcContract.obtainTokenDecimals().then((result) => {
        setUsdcTokenDecimal(result);
      });
      await daoContract.obtainTokenDecimals().then((result) => {
        setGovernanceConvertDecimal(result);
      });
    }
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    try {
      window.web3.eth.getAccounts().then((async) => {
        setUserDetails(async[0]);
      });
      return true;
    } catch (err) {
      setUserDetails(null);
      return false;
    }
  };

  const fetchClubData = async () => {
    const clubData = fetchClub(clubId);
    clubData.then((result) => {
      if (result.status != 200) {
        setImageFetched(false);
      } else {
        setImageUrl(result.data[0].imageUrl);
        setImageFetched(true);
      }
    });
  };

  const tokenAPIDetailsRetrieval = async () => {
    let response = await fetchClubbyDaoAddress(pid);
    if (response.data.length > 0) {
      settokenAPIDetails(response.data);
      setClubId(response.data[0].clubId);
      setGnosisAddress(response.data[0].gnosisAddress);
      setApiTokenDetailSet(true);
    } else {
      setApiTokenDetailSet(false);
    }
  };

  const tokenDetailsRetrieval = async () => {
    if (
      tokenAPIDetails &&
      tokenAPIDetails.length > 0 &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      const tokenDetailContract = new SmartContract(
        ImplementationContract,
        tokenAPIDetails[0].daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      await tokenDetailContract.getClubSymbol().then(
        (result) => {
          setTokenSymbol(result);
        },
        (error) => {
          setDataFetched(false);
        },
      );
      await tokenDetailContract.getTotalSupply().then(
        (result) => {
          setTotalSupply(result);
          setClubTokenMInted(
            convertFromWeiGovernance(result, governanceConvertDecimal),
          );
        },
        (error) => {
          setDataFetched(false);
        },
      );
    }
  };

  const fetchMembers = () => {
    if (clubId) {
      const membersData = getMembersDetails(clubId);
      membersData.then((result) => {
        if (result.status != 200) {
          console.log(result.statusText);
          setMembersFetched(false);
        } else {
          setMembers(result.data.length);
          setMembersFetched(true);
        }
      });
    }
  };

  const contractDetailsRetrieval = async () => {
    if (
      daoAddress &&
      !closingDataFetched &&
      !minDepositDataFetched &&
      !maxDepositDataFetched &&
      !totalRaiseAmountDataFetched &&
      userDetails &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      const governorDetailContract = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      await governorDetailContract.getDepositCloseTime().then(
        (result) => {
          setClosingDays(
            Math.round(
              (new Date(parseInt(result) * 1000) - new Date()) /
              (1000 * 60 * 60 * 24),
            ),
          );
          setClosingDataFetched(true);
        },
        (error) => {
          console.log(error);
        },
      );
      await governorDetailContract.getMinDepositPerUser().then(
        (result) => {
          setMinDeposit(convertFromWei(parseFloat(result), usdcTokenDecimal));
          setMinDepositDataFetched(true);
        },
        (error) => {
          console.log(error);
        },
      );
      await governorDetailContract.getMaxDepositPerUser().then(
        (result) => {
          setMaxDeposit(convertFromWei(parseInt(result), usdcTokenDecimal));
          setMaxDepositDataFetched(true);
        },
        (error) => {
          console.log(error);
        },
      );
      await governorDetailContract.getTotalRaiseAmount().then(
        (result) => {
          setTotalDeposit(convertFromWei(parseInt(result), usdcTokenDecimal));
          setTotalRaiseAmountDataFetched(true);
        },
        (error) => {
          console.log(error);
        },
      );
    }
  };

  const obtaineWalletBallance = async () => {
    if (
      !fetched &&
      userDetails &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      const usdc_contract = new SmartContract(
        ImplementationContract,
        USDC_CONTRACT_ADDRESS,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      await usdc_contract.balanceOf().then(
        (result) => {
          setWalletBalance(convertFromWei(parseInt(result), usdcTokenDecimal));
          setFetched(true);
        },
        (error) => {
          console.log("Failed to fetch wallet USDC", error);
        },
      );
    }
  };

  const handleConnectWallet = () => {
    try {
      const wallet = connectWallet(dispatch);
      wallet.then((response) => {
        if (response) {
          setWalletConnected(true);
        } else {
          setWalletConnected(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  // useEffect(() => {
  //   const web3 = new Web3(Web3.givenProvider)
  //   const networkIdRK = "4"
  //   web3.eth.net
  //     .getId()
  //     .then((networkId) => {
  //       if (networkId != networkIdRK) {
  //         setOpen(true)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  useEffect(() => {
    if (pid) {
      tokenAPIDetailsRetrieval();
    }
  }, [pid, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    if (tokenAPIDetails && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
      console.log("first");
      tokenDetailsRetrieval();
    }
  }, [tokenAPIDetails, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    if (clubId) {
      fetchClubData();
    }

    if (previouslyConnectedWallet) {
      onboard.connectWallet({ autoSelect: walletAddress });
    }

    if (checkConnection() && walletConnected) {
      obtaineWalletBallance();
      contractDetailsRetrieval();
      fetchMembers();
    }
  }, [previouslyConnectedWallet, walletConnected, clubId]);

  useEffect(() => {
    fetchCustomTokenDecimals();
  }, [daoAddress, USDC_CONTRACT_ADDRESS]);

  const handleDeposit = async () => {
    setDepositInitiated(true);
    const checkUserExists = checkUserByClub(userDetails, clubId);
    const depositAmountConverted = convertToWei(
      depositAmount,
      usdcTokenDecimal,
    );
    checkUserExists.then((result) => {
      if (result.data === false) {
        // if the user doesn't exist
        const usdc_contract = new SmartContract(
          ImplementationContract,
          USDC_CONTRACT_ADDRESS,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const dao_contract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const usdc_response = usdc_contract.approveDeposit(
          daoAddress,
          depositAmountConverted,
          usdcTokenDecimal,
        );
        usdc_response.then(
          (result) => {
            const deposit_response = dao_contract.deposit(
              USDC_CONTRACT_ADDRESS,
              depositAmountConverted,
            );
            deposit_response.then((result) => {
              const data = {
                userAddress: userDetails,
                clubs: [
                  {
                    clubId: clubId,
                    isAdmin: 0,
                    balance: depositAmountConverted,
                  },
                ],
              };
              const createuser = createUser(data);
              createuser.then((result) => {
                if (result.status !== 201) {
                  console.log("Error", result);
                  setAlertStatus("error");
                  setOpenSnackBar(true);
                } else {
                  setAlertStatus("success");
                  setOpenSnackBar(true);
                  router.push(`/dashboard/${clubId}`, undefined, {
                    shallow: true,
                  });
                }
              });
            });
          },
          (error) => {
            console.log("Error", error);
            setAlertStatus("error");
            setOpenSnackBar(true);
          },
        );
      } else {
        // if user exists
        const usdc_contract = new SmartContract(
          ImplementationContract,
          USDC_CONTRACT_ADDRESS,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const dao_contract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        // pass governor contract
        const usdc_response = usdc_contract.approveDeposit(
          daoAddress,
          depositAmountConverted,
          usdcTokenDecimal,
        );
        usdc_response.then(
          (result) => {
            const deposit_response = dao_contract.deposit(
              USDC_CONTRACT_ADDRESS,
              depositAmountConverted,
            );
            deposit_response.then((result) => {
              const patchData = {
                userAddress: userDetails,
                clubId: clubId,
                balance: depositAmountConverted,
              };
              const updateDepositAmount = patchUserBalance(patchData);
              updateDepositAmount.then((result) => {
                if (result.status != 200) {
                  console.log("Error", result);
                  setAlertStatus("error");
                  setOpenSnackBar(true);
                } else {
                  setAlertStatus("success");
                  setOpenSnackBar(true);
                  router.push(`/dashboard/${clubId}`, undefined, {
                    shallow: true,
                  });
                }
              });
            });
          },
          (error) => {
            console.log("Error", error);
            setAlertStatus("error");
            setOpenSnackBar(true);
          },
        );
      }
    });
  };

  const handleInputChange = (newValue) => {
    setDepositAmount(parseInt(newValue));
  };

  const handleMaxButtonClick = async (event) => {
    // value should be the maximum deposit value
    if (maxDepositDataFetched) {
      setDepositAmount(maxDeposit);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleDialogClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleSwitchNetwork = async () => {
    const switched = await checkNetwork();
    if (switched) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Layout3 faucet={true}>
      <Grid
        container
        spacing={2}
        paddingLeft={10}
        paddingTop={15}
        paddingRight={10}
      >
        <Grid item md={7}>
          <Card className={classes.cardRegular}>
            <Grid container spacing={2}>
              <Grid item mt={3} ml={3}>
                <img
                  src={imageFetched ? imageUrl : null}
                  alt="club-image"
                  width="100vw"
                />
              </Grid>
              <Grid item ml={1} mt={4} mb={7}>
                <Stack spacing={0}>
                  <Typography variant="h4">
                    {apiTokenDetailSet ? (
                      tokenAPIDetails[0].name
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                  <Typography variant="h6" className={classes.dimColor}>
                    {dataFetched ? "$" + tokenSymbol : null}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider variant="middle" />
            <Grid container spacing={7}>
              <Grid item ml={4} mt={5} md={3}>
                <Typography variant="p" className={classes.valuesDimStyle}>
                  {walletConnected ? (
                    "Deposits deadline"
                  ) : (
                    <Skeleton variant="rectangular" width={100} height={25} />
                  )}
                </Typography>
                <Grid container mt={2} direction="row">
                  <Grid item>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {closingDataFetched ? (
                        new Date(closingDays)
                          .toJSON()
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("/")
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item ml={1}>
                    {walletConnected ? (
                      closingDataFetched ? (
                        closingDays > 0 ? (
                          <Card className={classes.openTag}>
                            <Typography className={classes.openTagFont}>
                              Open
                            </Typography>
                          </Card>
                        ) : (
                          <Card className={classes.closeTag}>
                            <Typography className={classes.closeTagFont}>
                              Closed
                            </Typography>
                          </Card>
                        )
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item ml={4} mt={5} md={3}>
                <Grid container>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletConnected ? (
                        "Minimum Deposits"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item mt={2}>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {minDepositDataFetched ? (
                        minDeposit + " USDC"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item ml={4} mt={5} md={3}>
                <Grid container>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletConnected ? (
                        "Maximum Deposit"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item mt={2}>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {maxDepositDataFetched ? (
                        maxDeposit + " USDC"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container mt={5}>
              <Grid item ml={4} md={3}>
                <Grid item>
                  <Typography variant="p" className={classes.valuesDimStyle}>
                    {walletConnected ? (
                      "Governance"
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                </Grid>
                <Grid item mt={2}>
                  <Typography variant="p" className={classes.valuesStyle}>
                    {walletConnected ? (
                      "By Voting"
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item ml={5} md={3}>
                <Grid container direction="column">
                  <Grid item>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletConnected ? (
                        "Members"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item mt={2}>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {walletConnected ? (
                        members
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item ml={3} mt={5} mb={2} mr={3}>
              {walletConnected ? (
                <ProgressBar
                  value={
                    totalRaiseAmountDataFetched
                      ? calculateTreasuryTargetShare(
                        clubTokenMinted,
                        totalDeposit,
                      )
                      : 0
                  }
                />
              ) : (
                <Skeleton variant="rectangular" />
              )}
            </Grid>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Grid item ml={1} mt={1} mb={2} md={8}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletConnected ? (
                        "Club Tokens Minted so far"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {walletConnected ? (
                        parseInt(quoram) + " $" + tokenSymbol
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item mt={1} mb={2} mr={3} direction="row">
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletConnected ? (
                        "Total Supply"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {totalRaiseAmountDataFetched ? (
                        totalDeposit + (" $" + tokenSymbol)
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={5}>
          {walletConnected ? (
            <Card className={classes.cardJoin}>
              <Grid container spacing={2}>
                <Grid item ml={2} mt={4} mb={4} className={classes.JoinText}>
                  <Typography variant="h4">Join this Club</Typography>
                </Grid>
                <Divider />
                <Grid
                  item
                  ml={1}
                  mt={4}
                  mb={4}
                  mr={2}
                  xs
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Typography variant="h6" className={classes.JoinText}>
                    {closingDataFetched
                      ? closingDays > 0
                        ? "Closes in " + closingDays + " days"
                        : "Joining Closed"
                      : 0}
                  </Typography>
                </Grid>
              </Grid>
              <Divider variant="middle" sx={{ bgcolor: "#3B7AFD" }} />
              <Grid container spacing={2}>
                <Grid item md={12} mt={2}>
                  <Card className={classes.cardSmall}>
                    <Grid container spacing={2}>
                      <Grid item ml={2} mt={2} mb={0}>
                        <Typography className={classes.cardSmallFont}>
                          USDC
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        ml={2}
                        mt={2}
                        mb={0}
                        xs
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Typography className={classes.cardSmallFont}>
                          Balance: {walletBalance} USDC
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item ml={2} mt={1} mb={2} p={1}>
                        <Input
                          type="number"
                          error={depositAmount === ""}
                          className={classes.cardLargeFont}
                          value={depositAmount}
                          onChange={(e) => handleInputChange(e.target.value)}
                          disabled={closingDays > 0 ? false : true}
                          inputProps={{ style: { fontSize: "1em" } }}
                          InputLabelProps={{ style: { fontSize: "1em" } }}
                        />
                      </Grid>
                      <Grid
                        item
                        ml={2}
                        mt={1}
                        mb={1}
                        xs
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          className={classes.maxTag}
                          onClick={handleMaxButtonClick}
                        >
                          Max
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12} mt={2}>
                  <Card className={classes.cardWarning}>
                    <Typography className={classes.JoinText}>
                      Clubs can have same names or symbols, please make sure to
                      trust the sender for the link before depositing.
                    </Typography>
                  </Card>
                </Grid>
                <Grid item container ml={1} mt={1} mb={1}>
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleDeposit}
                    disabled={closingDays > 0 ? false : true}
                  >
                    Deposit
                  </Button>
                </Grid>
              </Grid>
            </Card>
          ) : (
            <Card className={classes.cardJoin} height={"full"}>
              <>
                <Grid
                  flex
                  flexDirection="column"
                  container
                  justifyContent={"space-between"}
                  height={"100%"}
                >
                  <Grid margin={"25px"}>
                    <Typography className={classes.JoinText}>
                      {" "}
                      Join this station by depositing your funds{" "}
                    </Typography>
                  </Grid>
                  <Grid sx={{ display: "flex", flexDirection: "row" }}>
                    <Grid mt={"300px"} ml={4}>
                      <Button variant="primary" onClick={handleConnectWallet}>
                        Connect
                      </Button>
                    </Grid>
                    <Grid mt={"50px"}>
                      <CardMedia
                        image="/assets/images/joinstation.png"
                        component="img"
                        alt="ownership_share"
                        className={classes.media}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            </Card>
          )}
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {alertStatus === "success" ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Transaction Successfull!
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Transaction Failed!
          </Alert>
        )}
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ overflow: "hidden", backgroundColor: "#19274B" }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            mt={3}
          >
            <Grid item pl={15}>
              <img src="/assets/images/connected_world_wuay.svg" width="80%" />
            </Grid>
            <Grid item m={3}>
              <Typography className={classes.dialogBox}>
                You are in the wrong network, please switch to the correct
                network by clicking the button provided below
              </Typography>
            </Grid>
            <Grid item m={3}>
              <Button
                variant="primary"
                onClick={() => {
                  handleSwitchNetwork();
                }}
              >
                Switch Network
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={depositInitiated}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout3>
  );
};

export default Join;
