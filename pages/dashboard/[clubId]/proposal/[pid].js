import React, { useEffect, useState } from "react";
import Layout1 from "../../../../src/components/layouts/layout1";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Card,
  CardActionArea,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import {
  castVote,
  getProposalDetail,
  getProposalTxHash,
  patchProposalExecuted,
} from "../../../../src/api/proposal";
import { useDispatch, useSelector } from "react-redux";
import { addProposalId } from "../../../../src/redux/reducers/create";
import ClubFetch from "../../../../src/utils/clubFetch";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Image from "next/image";
import tickerIcon from "../../../../public/assets/icons/ticker_icon.svg";
import { calculateDays } from "../../../../src/utils/globalFunctions";
import actionIcon from "../../../../public/assets/icons/action_icon.svg";
import surveyIcon from "../../../../public/assets/icons/survey_icon.svg";
import ReactHtmlParser from "react-html-parser";
import Web3 from "web3";
import { useConnectWallet } from "@web3-onboard/react";
import Erc721Dao from "../../../../src/abis/newArch/erc721Dao.json";
import Erc20Dao from "../../../../src/abis/newArch/erc20Dao.json";
import { SmartContract } from "../../../../src/api/contract";
import { getAssets } from "../../../../src/api/assets";
import { Interface, ethers } from "ethers";
import Web3Adapter from "@safe-global/safe-web3-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import Safe from "@safe-global/safe-core-sdk";

const useStyles = makeStyles({
  clubAssets: {
    fontSize: "42px",
    color: "#FFFFFF",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: "15px",
  },
  passedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
    marginRight: "15px",
  },
  executedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#F75F71",
    borderRadius: "50%",
    marginRight: "15px",
  },
  failedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#D55438",
    borderRadius: "50%",
    marginRight: "15px",
  },
  listFont: {
    fontSize: "20px",
    color: "#C1D3FF",
  },
  listFont2: {
    fontSize: "19px",
    color: "#C1D3FF",
  },
  listFont2Colourless: {
    fontSize: "19px",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  listFont2small: {
    fontSize: "12px",
    color: "#C1D3FF",
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
  },
  cardFont1: {
    fontSize: "19px",
    color: "#EFEFEF",
  },
  successfulMessageText: {
    fontSize: "28px",
    color: "#EFEFEF",
  },
  cardFontYes: {
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "0 5px 0 5px",
  },
  cardFontNo: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "0 5px 0 5px",
  },
  mainCard: {
    borderRadius: "38px",
    border: "1px solid #C1D3FF40;",
    backgroundColor: "#19274B",
  },
  mainCardSelected: {
    borderRadius: "38px",
    border: "1px solid #FFFFFF;",
    backgroundColor: "#19274B",
  },
  mainCardButton: {
    "borderRadius": "38px",
    "border": "1px solid #C1D3FF40;",
    "backgroundColor": "#3B7AFD",
    "&:hover": {
      cursor: "pointer",
    },
  },
  mainCardButtonSuccess: {
    borderRadius: "38px",
    fontSize: "50px",
    color: "#0ABB92",
  },
  mainCardButtonError: {
    fontSize: "50px",
    color: "#D55438",
  },
  seeMoreButton: {
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    backgroundColor: "#19274B",
    display: "flex",
  },
  actionChip: {
    border: "1px solid #0ABB92",
    background: "transparent",
    textTransform: "capitalize",
  },
  surveyChip: {
    border: "1px solid #6C63FF",
    background: "transparent",
    textTransform: "capitalize",
  },
  timeLeftChip: {
    background: "#111D38",
    borderRadius: "5px",
  },
  cardFontActive: {
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "5px 5px 5px 5px",
  },
  cardFontExecuted: {
    fontSize: "16px",
    backgroundColor: "#F75F71",
    padding: "5px 5px 5px 5px",
  },
  cardFontPassed: {
    fontSize: "16px",
    backgroundColor: "#FFB74D",
    padding: "5px 5px 5px 5px",
  },
  cardFontFailed: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "5px 5px 5px 5px",
  },
});

const ProposalDetail = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const { pid, clubId } = router.query;

  const [{ wallet }] = useConnectWallet();
  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

  //   const isGovernanceActive = useSelector((state) => {
  //     return state.gnosis.governanceAllowed;
  //   });
  const isGovernanceActive = true;

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });
  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const daoAddress = useSelector((state) => {
    return state.create.daoAddress;
  });
  const gnosisAddress = useSelector((state) => {
    return state.gnosis.safeAddress;
  });

  console.log(isAdmin);
  const [loader, setLoader] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [governance, setGovernance] = useState(false);
  const [voted, setVoted] = useState(false);
  const [castVoteOption, setCastVoteOption] = useState("");
  const [cardSelected, setCardSelected] = useState(null);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [executionReady, setExecutionReady] = useState(false);
  const [signed, setSigned] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState("");
  const [txHash, setTxHash] = useState();
  const [signedOwners, setSignedOwners] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [tokenFetched, setTokenFetched] = useState(false);
  const [threshold, setThreshold] = useState();

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const getSafeSdk = async () => {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: walletAddress,
    });
    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });
    return safeSdk;
  };

  const getSafeService = async () => {
    const web3 = new Web3(window.web3);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: walletAddress,
    });
    const safeService = new SafeServiceClient({
      txServiceUrl: GNOSIS_TRANSACTION_URL,
      ethAdapter,
    });
    return safeService;
  };

  const isOwner = async () => {
    const safeSdk = await getSafeSdk();
    if (isGovernanceActive === false) {
      if (isAdmin) {
        setGovernance(true);
      } else setGovernance(false);
    } else setGovernance(true);
    const threshold = await safeSdk.getThreshold();
    setThreshold(threshold);
    const proposalTxHash = getProposalTxHash(pid);
    proposalTxHash.then(async (result) => {
      if (
        result.status !== 200 ||
        (result.status === 200 && result.data.length === 0)
      ) {
        setTxHash("");
      } else {
        txHash = result.data[0].txHash;
        setTxHash(result.data[0].txHash);
        const safeService = await getSafeService();
        const tx = await safeService.getTransaction(result.data[0].txHash);
        const ownerAddresses = tx.confirmations.map(
          (confirmOwners) => confirmOwners.owner,
        );
        console.log("ownerAddresses", ownerAddresses);
        const pendingTxs = await safeService.getPendingTransactions(
          gnosisAddress,
        );
        setPendingTxHash(
          pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
          result.data[0].txHash,
        );

        setSignedOwners(ownerAddresses);
        if (ownerAddresses.includes(walletAddress)) {
          setSigned(true);
        }
        if (ownerAddresses.length >= threshold) {
          setExecutionReady(true);
        }
      }
    });
  };
  console.log("governance", governance);
  const checkUserVoted = () => {
    if (walletAddress) {
      //   console.log(walletAddress);
      //   const web3 = new Web3(window.web3);
      //   let userAddress = walletAddress;
      //   userAddress = web3.utils.toChecksumAddress(userAddress);
      let obj = proposalData.vote.find(
        (voteCasted) => voteCasted.voterAddress === walletAddress,
      );
      const isVoted = proposalData.vote.indexOf(obj) >= 0;
      return isVoted;
    }
  };

  const submitVote = () => {
    setLoaderOpen(true);
    const payload = {
      proposalId: pid,
      votingOptionId: castVoteOption,
      voterAddress: walletAddress,
      clubId: clubId,
    };
    const voteSubmit = castVote(payload);
    voteSubmit.then((result) => {
      if (result.status !== 201) {
        setVoted(false);
        setLoaderOpen(false);
      } else {
        fetchData();
        setVoted(true);
        setLoaderOpen(false);
      }
    });
  };

  const fetchData = async () => {
    setLoader(true);
    dispatch(addProposalId(pid));
    const proposalData = getProposalDetail(pid);

    proposalData.then((result) => {
      if (result.status !== 200) {
        setLoader(false);
      } else {
        console.log(proposalData);
        setProposalData(result.data[0]);
      }
    });
    setLoader(false);
  };

  const fetchTokens = () => {
    if (clubId) {
      const tokenData = getAssets(clubId);
      tokenData.then((result) => {
        if (result.status != 200) {
          setTokenFetched(false);
        } else {
          setTokenData(result.data.tokenPriceList);
          setTokenFetched(true);
        }
      });
    }
  };

  const executeFunction = async (proposalStatus) => {
    console.log(proposalStatus);
    setLoaderOpen(true);
    const updateProposal = new SmartContract(
      Erc20Dao,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    console.log("samrt contraccttt", proposalData);
    if (proposalData.commands[0].executionId === 0) {
      let ABI = Erc20Dao.abi;
      let iface = new Interface(ABI);
      console.log(iface);
      let data = iface.encodeFunctionData("mintGTToAddress", [
        [
          ethers.parseUnits(
            proposalData.commands[0].mintGTAmounts.toString(),
            6,
          ),
        ],
        proposalData.commands[0].mintGTAddresses,
      ]);
      console.log(data);
      const response = updateProposal.updateProposalAndExecution(
        data,
        daoAddress,
        gnosisAddress,
        txHash,
        pid,
        tokenFetched ? tokenData : "",
        proposalStatus,
      );
      console.log(response);
      if (proposalStatus === "executed") {
        response.then(
          (result) => {
            result.promiEvent.on("confirmation", () => {
              const updateStatus = patchProposalExecuted(pid);
              updateStatus.then((result) => {
                if (result.status !== 200) {
                  setExecuted(false);
                  setOpenSnackBar(true);
                  setMessage("MintGT execution status update failed!");
                  setFailed(true);
                  setLoaderOpen(false);
                } else {
                  fetchData();
                  setExecuted(true);
                  setOpenSnackBar(true);
                  setMessage("MintGT execution successful!");
                  setFailed(false);
                  setLoaderOpen(false);
                }
              });
            });
          },
          (error) => {
            console.log(error);
            setExecuted(false);
            setOpenSnackBar(true);
            setMessage("MintGT execution failed!");
            setFailed(true);
            setLoaderOpen(false);
          },
        );
      } else {
        await response
          .then(async (result) => {
            setSigned(true);
            setLoaderOpen(false);
          })
          .catch((err) => {
            setSigned(false);
            setMessage("Signature failed!");
            setLoaderOpen(false);
          });
      }
    }
  };

  useEffect(() => {
    fetchData();
    isOwner();
    fetchTokens();
  }, []);
  //   console.log(proposalData);
  if (!wallet && proposalData === null) {
    console.log("loaaadddiinnngg", proposalData);
    return <>loading</>;
  }
  return (
    <>
      <Layout1 page={2}>
        <Grid container spacing={6} paddingLeft={10} paddingTop={10}>
          <Grid item md={8.5}>
            <Grid container spacing={1} onClick={() => router.back()}>
              <Grid item mt={0.5} sx={{ "&:hover": { cursor: "pointer" } }}>
                <KeyboardBackspaceIcon className={classes.listFont} />
              </Grid>
              <Grid item sx={{ "&:hover": { cursor: "pointer" } }} mb={2}>
                <Typography className={classes.listFont}>
                  Back to workstation
                </Typography>
              </Grid>
            </Grid>
            {/* propsal name */}
            <Grid container mb={2}>
              <Grid item>
                <Typography className={classes.clubAssets}>
                  {proposalData?.name}
                </Typography>
              </Grid>
            </Grid>
            {/* chips */}
            <Grid container direction="row" spacing={4}>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Chip
                      className={classes.timeLeftChip}
                      label={
                        <Grid container>
                          <Image src={tickerIcon} alt="ticker-icon" />
                          <Typography ml={1}>
                            {" "}
                            {calculateDays(proposalData?.votingDuration) <= 0
                              ? "Voting closed"
                              : calculateDays(proposalData?.votingDuration) +
                                " days left"}
                          </Typography>
                        </Grid>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <Chip
                      className={
                        proposalData?.type === "action"
                          ? classes.actionChip
                          : classes.surveyChip
                      }
                      label={
                        <Grid container>
                          {proposalData?.type === "action" ? (
                            <Image src={actionIcon} alt="action-icon" />
                          ) : (
                            <Image src={surveyIcon} alt="survey-icon" />
                          )}
                          <Typography ml={1}>{proposalData?.type}</Typography>
                        </Grid>
                      }
                    />
                  </Grid>
                  <Grid item>
                    {" "}
                    <Chip
                      className={
                        proposalData?.status === "active"
                          ? classes.cardFontActive
                          : proposalData?.status === "passed"
                          ? classes.cardFontPassed
                          : proposalData?.status === "executed"
                          ? classes.cardFontExecuted
                          : proposalData?.status === "failed"
                          ? classes.cardFontFailed
                          : classes.cardFontFailed
                      }
                      label={
                        proposalData?.status?.charAt(0).toUpperCase() +
                        proposalData?.status?.slice(1)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* proposal description */}
            <Grid container item className={classes.listFont}>
              <div
                dangerouslySetInnerHTML={{
                  __html: ReactHtmlParser(proposalData?.description),
                }}
              ></div>
            </Grid>

            {/* voting process before Signature */}
            {governance ? (
              <>
                <Grid container mt={6}>
                  <Grid item md={12}>
                    {proposalData?.type === "action" ? (
                      proposalData?.status === "active" ? (
                        <>
                          {checkUserVoted() ? (
                            "asfj"
                          ) : (
                            <Card>
                              <Typography className={classes.cardFont1}>
                                Cast your vote
                              </Typography>
                              <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                              <Stack spacing={2}>
                                {proposalData.votingOptions.map((data, key) => {
                                  return (
                                    <CardActionArea
                                      className={classes.mainCard}
                                      key={key}
                                      disabled={voted}
                                    >
                                      <Card
                                        className={
                                          cardSelected == key
                                            ? classes.mainCardSelected
                                            : classes.mainCard
                                        }
                                        onClick={(e) => {
                                          setCastVoteOption(
                                            data.votingOptionId,
                                          );
                                          setCardSelected(key);
                                        }}
                                      >
                                        <Grid
                                          container
                                          item
                                          justifyContent="center"
                                          alignItems="center"
                                        >
                                          <Typography
                                            className={classes.cardFont1}
                                          >
                                            {data.text}{" "}
                                          </Typography>
                                        </Grid>
                                      </Card>
                                    </CardActionArea>
                                  );
                                })}
                                <CardActionArea
                                  className={classes.mainCard}
                                  disabled={voted}
                                >
                                  <Card
                                    className={
                                      voted
                                        ? classes.mainCardButtonSuccess
                                        : classes.mainCardButton
                                    }
                                    onClick={!voted ? submitVote : null}
                                  >
                                    <Grid
                                      container
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      {voted ? (
                                        <Grid item>
                                          <CheckCircleRoundedIcon />
                                        </Grid>
                                      ) : (
                                        <Grid item></Grid>
                                      )}
                                      <Grid item>
                                        {voted ? (
                                          <Typography
                                            className={classes.cardFont1}
                                            mt={0.5}
                                          >
                                            Successfully voted
                                          </Typography>
                                        ) : (
                                          <Typography
                                            className={classes.cardFont1}
                                          >
                                            Vote now
                                          </Typography>
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Card>
                                </CardActionArea>
                              </Stack>
                            </Card>
                          )}
                        </>
                      ) : proposalData?.status === "passed" ? (
                        isAdmin ? (
                          <Card>
                            {console.log(
                              "pendingTxHash",
                              pendingTxHash === txHash,
                            )}
                            <Card
                              className={
                                executed
                                  ? classes.mainCardButtonSuccess
                                  : classes.mainCardButton
                              }
                              onClick={
                                executionReady
                                  ? pendingTxHash === txHash
                                    ? () => {
                                        executeFunction("executed");
                                      }
                                    : () => {
                                        console.log("rrrrrrrrrrr");
                                        setOpenSnackBar(true);
                                        setFailed(true);
                                        setMessage(
                                          "execute txns with smaller nonce first",
                                        );
                                      }
                                  : () => {
                                      executeFunction("passed");
                                    }
                              }
                            >
                              <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                              >
                                {signed && !executionReady ? (
                                  <Grid item mt={0.5}>
                                    <CheckCircleRoundedIcon />
                                  </Grid>
                                ) : (
                                  <Grid item></Grid>
                                )}

                                {executed ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Executed Successfully
                                    </Typography>
                                  </Grid>
                                ) : null}
                                {executionReady ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Execute Now
                                    </Typography>
                                  </Grid>
                                ) : null}
                                <Grid item>
                                  {signed && !executionReady && !executed ? (
                                    <Grid item>
                                      <Typography className={classes.cardFont1}>
                                        {signed
                                          ? "Signed Succesfully"
                                          : "Sign Now"}
                                      </Typography>
                                    </Grid>
                                  ) : null}
                                  {!signed && !executionReady && !executed ? (
                                    <Grid item>
                                      <Typography className={classes.cardFont1}>
                                        {signed
                                          ? "Signed Succesfully"
                                          : "Sign Now"}
                                      </Typography>
                                    </Grid>
                                  ) : null}
                                  {/* {txHash ? (
                                      <Typography className={classes.cardFont1}>
                                        {signed
                                          ? "Signed Succesfully"
                                          : "Sign Now"}

                                       
                                      </Typography>
                                    ) : (
                                      <Typography className={classes.cardFont1}>
                                        {signed
                                          ? "Signed Succesfully"
                                          : "Sign Now"}
                                      </Typography>
                                    )} */}
                                </Grid>
                              </Grid>
                            </Card>
                          </Card>
                        ) : (
                          <Card sx={{ width: "100%" }}>
                            <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              mt={10}
                              mb={10}
                            >
                              <Grid item mt={0.5}>
                                <CheckCircleRoundedIcon
                                  className={classes.mainCardButtonSuccess}
                                />
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography
                                  className={classes.successfulMessageText}
                                >
                                  Proposal needs to be executed by Admin
                                </Typography>
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography className={classes.listFont2}>
                                  {/* Voted for */}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Card>
                        )
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Layout1>
    </>
  );
};

export default ClubFetch(ProposalDetail);
