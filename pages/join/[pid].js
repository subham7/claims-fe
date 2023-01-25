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
  IconButton,
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
import ape from "../../public/assets/images/ape.png";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const useStyles = makeStyles({
  valuesStyle: {
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: 3,
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
  const [threshold, setThreshold] = useState(0);
  const [tokenDetails, settokenDetails] = useState(null);
  const [tokenAPIDetails, settokenAPIDetails] = useState(null); // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false);
  const [governorDetails, setGovernorDetails] = useState(null);
  const [governorDataFetched, setGovernorDataFetched] = useState(false);
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
  const [tokenType, setTokenType] = useState();
  const [count, setCount] = useState(1);
  const [priceOfNft, setPriceOfNft] = useState();

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const wallet = useSelector((state) => {
    return state.create.value;
  });

  const [usdcTokenDecimal, setUsdcTokenDecimal] = useState(0);
  const [governanceConvertDecimal, setGovernanceConvertDecimal] = useState(0);

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
    console.log("wallet connection check");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    try {
      window.web3.eth.getAccounts().then((async) => {
        console.log("async");
        setUserDetails(async[0]);
        setWalletConnected(true);
      });
      return true;
    } catch (err) {
      setUserDetails(null);
      setWalletConnected(false);
      return false;
    }
  };

  const fetchClubData = async () => {
    const clubData = fetchClub(clubId);
    console.log("clubData", clubData);
    clubData.then((result) => {
      if (result.status != 200) {
        setImageFetched(false);
      } else {
        setImageUrl(result.data[0].imageUrl);
        setTokenType(result.data[0].tokenType);
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
    console.log(" in tokenDetailsRetrieval");
    if (
      tokenAPIDetails &&
      tokenAPIDetails.length > 0 &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      usdcTokenDecimal
    ) {
      console.log("before tokenDetailContract");
      const tokenDetailContract = await new SmartContract(
        ImplementationContract,
        tokenAPIDetails[0].daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      console.log("after tokenDetailContract");
      await tokenDetailContract.tokenDetails().then(
        async (result) => {
          console.log("result", result);
          settokenDetails(result);
          setClubTokenMInted(
            convertFromWeiGovernance(result[2], governanceConvertDecimal),
          );
          console.log(result[2]);
          setQuoram(
            convertFromWeiGovernance(result[2], governanceConvertDecimal),
          );
          setDataFetched(true);
        },
        (error) => {
          console.log(error);
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

  const erc721ContractDetails = async () => {
    const erc721DetailContract = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    console.log("erc721DetailContract", erc721DetailContract.contract.methods);

    await erc721DetailContract.quoram().then((result) => setQuoram(result));
    await erc721DetailContract
      .threshold()
      .then((result) => setThreshold(result));
    await erc721DetailContract.priceOfNft().then((result) => {
      console.log(result);
      setPriceOfNft(result);
    });
  };

  const contractDetailsRetrieval = async () => {
    if (
      daoAddress &&
      !governorDataFetched &&
      !governorDetails &&
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
      await governorDetailContract.getGovernorDetails().then(
        (result) => {
          console.log(result);
          setGovernorDetails(result);
          setMinDeposit(
            convertFromWei(parseFloat(result[1]), usdcTokenDecimal),
          );
          setMaxDeposit(convertFromWei(parseInt(result[2]), usdcTokenDecimal));
          setTotalDeposit(
            convertFromWei(parseInt(result[4]), usdcTokenDecimal),
          );

          setClosingDays(
            Math.round(
              (new Date(parseInt(result[0]) * 1000) - new Date()) /
                (1000 * 60 * 60 * 24),
            ),
          );
          setGovernorDataFetched(true);
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
    if (
      tokenAPIDetails &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      tokenType === "erc20NonTransferable"
    ) {
      console.log("first");
      tokenDetailsRetrieval();
    }
  }, [tokenAPIDetails, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL]);

  useEffect(() => {
    if (wallet !== null) {
      setPreviouslyConnectedWallet(wallet[0][0].address);
      setUserDetails(wallet[0][0].address);
    }
  }, [previouslyConnectedWallet]);

  useEffect(() => {
    if (clubId) {
      console.log("club data");
      fetchClubData();
    }

    if (previouslyConnectedWallet) {
      console.log("previously connected wallet");
      onboard.connectWallet({ autoSelect: wallet });
    }

    if (checkConnection() && walletConnected) {
      console.log("wallet connected");
      obtaineWalletBallance();

      if (tokenType === "erc721") {
        erc721ContractDetails();
      } else {
        contractDetailsRetrieval();
      }
      fetchMembers();
    }
  }, [previouslyConnectedWallet, walletConnected, clubId, wallet]);

  useEffect(() => {
    fetchCustomTokenDecimals();
  }, [daoAddress, USDC_CONTRACT_ADDRESS]);

  const handleClaimNft = async () => {
    const checkUserExists = checkUserByClub(userDetails, clubId);
    console.log("checkUserExists", checkUserExists);
    // const priceOfNftConverted = convertToWei(
    //   priceOfNft,
    //   usdcTokenDecimal,
    // ).toString();
    const priceOfNftConverted = 1;
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
        console.log("usdc contract", usdc_contract);
        // pass governor contract
        const dao_contract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        console.log("dao_contract", dao_contract);

        // pass governor contract
        const usdc_response = usdc_contract.approveDeposit(
          daoAddress,
          priceOfNftConverted,
          usdcTokenDecimal,
        );
        console.log("usdc_response", usdc_response);

        usdc_response.then(
          (result) => {
            const deposit_response = dao_contract.deposit(
              USDC_CONTRACT_ADDRESS,
              priceOfNftConverted,
              "https://bafybeieftd6z6cxfuwf2vuysxyp7ubiqop5kubjb7ugwpvv2enhrnveaom.ipfs.nftstorage.link",
            );
            deposit_response.then((result) => {
              console.log("deposit response", result);
              const data = {
                userAddress: userDetails,
                clubs: [
                  {
                    clubId: clubId,
                    isAdmin: 0,
                    // balance: depositAmountConverted,
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
      }
    });
  };

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
    if (governorDataFetched) {
      setDepositAmount(convertToWei(governorDetails[2], usdcTokenDecimal));
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
      {tokenType === "erc20NonTransferable" && (
        <>
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
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                      <Typography variant="h6" className={classes.dimColor}>
                        {dataFetched ? "$" + tokenDetails[1] : null}
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
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                    <Grid container mt={2} direction="row">
                      <Grid item>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {governorDataFetched ? (
                            new Date(parseInt(governorDetails[0]) * 1000)
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
                          governorDataFetched ? (
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
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                          {governorDataFetched ? (
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
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                          {governorDataFetched ? (
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
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}
                      >
                        {walletConnected ? (
                          "Governance"
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
                          "By Voting"
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
                  <Grid item ml={5} md={3}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                        governorDataFetched
                          ? calculateTreasuryTargetShare(
                              clubTokenMinted,
                              convertAmountToWei(governorDetails[4]),
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
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                          {walletConnected && tokenDetails ? (
                            parseInt(quoram) + " $" + tokenDetails[1]
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
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                          {governorDataFetched && tokenDetails ? (
                            totalDeposit + (" $" + tokenDetails[1])
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
                    <Grid
                      item
                      ml={2}
                      mt={4}
                      mb={4}
                      className={classes.JoinText}
                    >
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
                        {governorDataFetched
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
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
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
                              onChange={(e) =>
                                handleInputChange(e.target.value)
                              }
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
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
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
                          Clubs can have same names or symbols, please make sure
                          to trust the sender for the link before depositing.
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
                          <Button
                            variant="primary"
                            onClick={handleConnectWallet}
                          >
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
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
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
            <DialogContent
              sx={{ overflow: "hidden", backgroundColor: "#19274B" }}
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                mt={3}
              >
                <Grid item pl={15}>
                  <img
                    src="/assets/images/connected_world_wuay.svg"
                    width="80%"
                  />
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
        </>
      )}

      {tokenType === "erc721" && (
        <>
          <Grid
            container
            spacing={6}
            paddingLeft={10}
            paddingTop={15}
            paddingRight={10}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Grid item md={5}>
              <Image src={ape} alt="nft image" />
            </Grid>
            <Grid item md={5} sx={{}}>
              <Grid container spacing={1.5}>
                <Grid item>
                  <Typography variant="h2" color={"white"} fontWeight="bold">
                    HummingBird Club
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs="auto">
                      <Typography
                        sx={{
                          background: "#0ABB9240",
                          color: "#0ABB92",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 1,
                          paddingLeft: 1,
                          borderRadius: 2,
                          display: "flex",

                          alignItems: "center",
                        }}
                      >
                        <div className={classes.activeIllustration}></div>
                        Active
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <Typography
                        sx={{
                          background: "#142243",
                          color: "#fff",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 1,
                          paddingLeft: 1,
                          borderRadius: 2,
                        }}
                      >
                        Created by 0x24Y7….3R8u
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <MoreHorizIcon
                        sx={{
                          background: "#142243",
                          color: "#fff",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 1,
                          paddingLeft: 1,
                          borderRadius: 2,
                        }}
                        fontSize="large"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item width="100%">
                  {" "}
                  <Typography variant="subtitle1" color="#C1D3FF">
                    Mint closes on 27 November2022 at 1:57pm GMT+5:30
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid container spacing={3}>
                    <Grid item xs={3}>
                      <Typography
                        variant="subtitle1"
                        color="#fff"
                        sx={{ fontWeight: "bold" }}
                      >
                        {quoram}%
                      </Typography>
                      <Typography variant="subtitle2" color="#C1D3FF">
                        Quorum
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        variant="subtitle1"
                        color="#fff"
                        sx={{ fontWeight: "bold" }}
                      >
                        {threshold}%
                      </Typography>
                      <Typography variant="subtitle2" color="#C1D3FF">
                        Threshold
                      </Typography>
                    </Grid>
                    <Grid item xs={4} width="fit-content">
                      <Typography
                        variant="subtitle1"
                        color="#fff"
                        sx={{ fontWeight: "bold" }}
                      >
                        Unlimited
                      </Typography>
                      <Typography variant="subtitle2" color="#C1D3FF">
                        Nfts Remaining
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item width="100%">
                  <Typography variant="subtitle2" color="#C1D3FF">
                    Price
                  </Typography>
                  <Typography
                    variant="h5"
                    color="#fff"
                    sx={{ fontWeight: "bold" }}
                  >
                    {priceOfNft} USDC
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      // flexDirection: "column",
                      justifyContent: "space-between",
                      borderColor: "",
                      border: "1px solid #C1D3FF40",
                      borderRadius: 2,
                      alignItems: "center",
                      background: "#142243",
                      padding: 4,
                    }}
                  >
                    <Grid
                      spacing={3}
                      sx={{
                        background: "#EFEFEF",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "inherit",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <IconButton onClick={() => setCount(count - 1)}>
                        <RemoveIcon sx={{ color: "black", fontSize: 20 }} />
                      </IconButton>
                      <Typography
                        variant="h6"
                        color=""
                        sx={{ fontWeight: "bold" }}
                      >
                        {count}
                      </Typography>
                      <IconButton
                        onClick={() => setCount(count + 1)}
                        color="#000"
                      >
                        <AddIcon sx={{ color: "black", fontSize: 20 }} />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Button onClick={handleClaimNft} sx={{ px: 8 }}>
                        Claim
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    color="#6475A3"
                    sx={{ fontWeight: "light" }}
                  >
                    This station allows maximum of 2 mints per member
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Layout3>
  );
};

export default Join;
