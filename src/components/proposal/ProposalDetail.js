import React, { useCallback, useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Alert,
  Backdrop,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  castVote,
  getProposalDetail,
  getProposalTxHash,
  patchProposalExecuted,
} from "api/proposal";
import { useSelector } from "react-redux";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import tickerIcon from "../../../public/assets/icons/ticker_icon.svg";
import { calculateDays } from "utils/globalFunctions";
import actionIcon from "../../../public/assets/icons/action_icon.svg";
import surveyIcon from "../../../public/assets/icons/survey_icon.svg";
import ReactHtmlParser from "react-html-parser";

import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import ProposalExecutionInfo from "@components/proposalComps/ProposalExecutionInfo";
import Signators from "@components/proposalComps/Signators";
import ProposalInfo from "@components/proposalComps/ProposalInfo";
import CurrentResults from "@components/proposalComps/CurrentResults";
import ProposalVotes from "@components/proposalComps/ProposalVotes";
import { getSafeSdk, web3InstanceEthereum } from "utils/helper";
import { getNFTsByDaoAddress, retrieveNftListing } from "api/assets";
import SafeAppsSDK from "@safe-global/safe-apps-sdk";
import { useAccount, useNetwork } from "wagmi";
import {
  createRejectSafeTx,
  executeRejectTx,
  fetchABI,
  getEncodedData,
  signRejectTx,
} from "utils/proposal";
import { BsInfoCircleFill } from "react-icons/bs";
import useAppContractMethods from "hooks/useAppContractMethods";
import { queryAllMembersFromSubgraph } from "utils/stationsSubgraphHelper";

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
    fontSize: "18px",
    color: "#C1D3FF",
  },
  listFont2Colourless: {
    fontSize: "18px",
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
    fontSize: "18px",
    color: "#EFEFEF",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
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
    borderRadius: "38px",
    border: "1px solid #C1D3FF40;",
    backgroundColor: "#2D55FF",
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
    background: "#0F0F0F",
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

const ProposalDetail = ({ pid, daoAddress }) => {
  const classes = useStyles();
  const router = useRouter();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const sdk = new SafeAppsSDK({
    allowedDomains: [/gnosis-safe.io$/, /safe.global$/, /5afe.dev$/],
    debug: true,
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const airdropContractAddress = useSelector((state) => {
    return state.gnosis.actionContractAddress;
  });

  const ERC721_Threshold = useSelector((state) => {
    return state.club.erc721ClubDetails.threshold;
  });

  const ERC20_Threshold = useSelector((state) => {
    return state.club.erc20ClubDetails.threshold;
  });

  const Club_Threshold =
    tokenType === "erc20" ? ERC20_Threshold : ERC721_Threshold;

  const [proposalData, setProposalData] = useState(null);
  const [governance, setGovernance] = useState(false);
  const [voted, setVoted] = useState(false);
  const [ownerAddresses, setOwnerAddresses] = useState([]);
  const [castVoteOption, setCastVoteOption] = useState("");
  const [cardSelected, setCardSelected] = useState(null);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [executionReady, setExecutionReady] = useState(false);
  const [signed, setSigned] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState("");
  const [txHash, setTxHash] = useState();
  const [cancelTxHash, setCancelTxHash] = useState();
  const [signedOwners, setSignedOwners] = useState([]);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [members, setMembers] = useState([]);
  const [nftData, setNftData] = useState([]);
  const [isNftSold, setIsNftSold] = useState(false);
  const [isCancelSigned, setIsCancelSigned] = useState(false);
  const [isCancelExecutionReady, setIsCancelExecutionReady] = useState(false);
  const [isCancelExecuted, setIsCancelExecuted] = useState(false);
  const [isRejectTxnSigned, setIsRejectTxnSigned] = useState(false);

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const AIRDROP_ACTION_ADDRESS = useSelector((state) => {
    return state.gnosis.actionContractAddress;
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
  });

  const {
    getNftBalance,
    getERC20TotalSupply,
    getNftOwnersCount,
    updateProposalAndExecution,
  } = useAppContractMethods();

  const getSafeService = useCallback(async () => {
    const web3 = await web3InstanceEthereum();
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: Web3.utils.toChecksumAddress(walletAddress),
    });
    const safeService = new SafeApiKit({
      txServiceUrl: GNOSIS_TRANSACTION_URL,
      ethAdapter,
    });
    return safeService;
  }, [GNOSIS_TRANSACTION_URL, walletAddress]);

  const isOwner = useCallback(async () => {
    if (gnosisAddress) {
      const safeSdk = await getSafeSdk(
        Web3.utils.toChecksumAddress(gnosisAddress),
        Web3.utils.toChecksumAddress(walletAddress),
      );
      const owners = await safeSdk.getOwners();

      const ownerAddressesArray = owners.map((value) =>
        Web3.utils.toChecksumAddress(value),
      );
      setOwnerAddresses(ownerAddressesArray);

      if (isGovernanceActive === false) {
        if (isAdmin) {
          setGovernance(true);
        } else setGovernance(false);
      } else setGovernance(true);
      const threshold = await safeSdk.getThreshold();

      const proposalData = await getProposalDetail(pid);

      if (proposalData.data[0].cancelProposalId) {
        const proposalTxHash = getProposalTxHash(
          proposalData.data[0].cancelProposalId,
        );
        proposalTxHash.then(async (result) => {
          if (
            result.status !== 200 ||
            (result.status === 200 && result.data.length === 0)
          ) {
            setCancelTxHash("");
          } else {
            // txHash = result.data[0].txHash;
            setCancelTxHash(result.data[0].txHash);
            const safeService = await getSafeService();
            const tx = await safeService.getTransaction(result.data[0].txHash);
            const ownerAddresses = tx.confirmations.map(
              (confirmOwners) => confirmOwners.owner,
            );
            if (ownerAddresses.length) {
              setIsRejectTxnSigned(true);
            }
            const pendingTxs = await safeService.getPendingTransactions(
              Web3.utils.toChecksumAddress(gnosisAddress),
            );
            setPendingTxHash(
              pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
            );

            setSignedOwners(ownerAddresses);
            if (ownerAddresses.includes(walletAddress)) {
              setIsCancelSigned(true);
            }
            if (ownerAddresses.length >= threshold) {
              setIsCancelExecutionReady(true);
            }
          }
        });
      }
      const proposalTxHash = getProposalTxHash(pid);
      proposalTxHash.then(async (result) => {
        if (
          result.status !== 200 ||
          (result.status === 200 && result.data.length === 0)
        ) {
          setTxHash("");
        } else {
          // txHash = result.data[0].txHash;
          setTxHash(result.data[0].txHash);
          const safeService = await getSafeService();
          const tx = await safeService.getTransaction(result.data[0].txHash);
          const ownerAddresses = tx.confirmations.map(
            (confirmOwners) => confirmOwners.owner,
          );
          const pendingTxs = await safeService.getPendingTransactions(
            Web3.utils.toChecksumAddress(gnosisAddress),
          );
          setPendingTxHash(
            pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
          );

          setSignedOwners(ownerAddresses);
          if (ownerAddresses.includes(walletAddress)) {
            setSigned(true);
          }
          if (ownerAddresses.length >= threshold) {
            setExecutionReady(true);
          }
        }
        setLoaderOpen(false);
      });
    }
  }, [
    getSafeService,
    gnosisAddress,
    isAdmin,
    isGovernanceActive,
    pid,
    walletAddress,
  ]);

  const checkUserVoted = () => {
    if (walletAddress) {
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
      clubId: daoAddress,
      daoAddress: daoAddress,
    };
    const voteSubmit = castVote(payload, NETWORK_HEX);
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

  const fetchNfts = useCallback(async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(
        isAssetsStoredOnGnosis ? gnosisAddress : daoAddress,
        NETWORK_HEX,
      );
      setNftData(nftsData.data);
    } catch (error) {
      console.log(error);
    }
  }, [NETWORK_HEX, daoAddress, gnosisAddress, isAssetsStoredOnGnosis]);

  const fetchData = useCallback(async () => {
    const proposalData = getProposalDetail(pid);

    proposalData.then((result) => {
      if (result.status !== 200) {
        setFetched(false);
      } else {
        setProposalData(result.data[0]);
        setFetched(true);
      }
    });
  }, [pid]);

  const nftListingExists = async () => {
    const parts = proposalData?.commands[0]?.nftLink?.split("/");

    if (parts) {
      const linkData = parts.slice(-3);
      const nftdata = await retrieveNftListing(
        linkData[0],
        linkData[1],
        linkData[2],
      );
      if (
        !nftdata?.data?.orders.length &&
        proposalData?.commands[0]?.executionId === 8
      ) {
        setIsNftSold(true);
      } else {
        setIsNftSold(false);
      }
    }
  };

  useEffect(() => {
    if (proposalData && proposalData.commands[0]?.executionId === 8) {
      nftListingExists();
    }
  }, [proposalData]);

  const executeFunction = async (proposalStatus) => {
    setLoaderOpen(true);

    const ABI = await fetchABI(
      proposalData.commands[0].executionId,
      clubData.tokenType,
    );

    const {
      data,
      approvalData,
      transactionData,
      membersArray,
      airDropAmountArray,
    } = await getEncodedData({
      getERC20TotalSupply,
      getNftBalance,
      proposalData,
      daoAddress,
      clubData,
      factoryData,
      contractABI: ABI,
      setMembers,
      networkId,
    });

    const response = updateProposalAndExecution(
      data,
      approvalData,
      daoAddress,
      Web3.utils.toChecksumAddress(gnosisAddress),
      txHash,
      pid,
      proposalData.commands[0]?.executionId === 0
        ? proposalData.commands[0]?.airDropToken
        : proposalData.commands[0]?.executionId === 4
        ? proposalData.commands[0]?.customToken
        : proposalData.commands[0]?.executionId === 5
        ? proposalData.commands[0]?.customNft
        : proposalData.commands[0]?.executionId === 14
        ? proposalData.commands[0]?.depositToken
        : proposalData.commands[0]?.executionId === 15
        ? proposalData.commands[0]?.withdrawToken
        : "",
      proposalStatus,
      airdropContractAddress,
      proposalData.commands[0]?.executionId === 3 ||
        proposalData.commands[0]?.executionId === 10 ||
        proposalData.commands[0]?.executionId === 11 ||
        proposalData?.commands[0]?.executionId === 12 ||
        proposalData.commands[0]?.executionId === 13 ||
        proposalData.commands[0]?.executionId === 14
        ? FACTORY_CONTRACT_ADDRESS
        : "",
      GNOSIS_TRANSACTION_URL,
      proposalData,
      membersArray,
      airDropAmountArray,
      transactionData,
    );

    if (proposalStatus === "executed") {
      // fetchData()
      response.then(
        (result) => {
          result.promiEvent.on("confirmation", () => {
            const updateStatus = patchProposalExecuted(pid);
            updateStatus.then((result) => {
              if (result.status !== 200) {
                setExecuted(false);
                setOpenSnackBar(true);
                setMessage("execution status update failed!");
                setFailed(true);
                setLoaderOpen(false);
              } else {
                fetchData();
                setExecuted(true);
                setOpenSnackBar(true);
                setMessage("execution successful!");
                setFailed(false);
                setLoaderOpen(false);
              }
            });
          });
        },
        (error) => {
          console.error(error);
          setExecuted(false);
          setOpenSnackBar(true);
          setMessage("execution failed!");
          setFailed(true);
          setLoaderOpen(false);
        },
      );
    } else {
      await response
        .then(async (result) => {
          setSigned(true);
          isOwner();
        })
        .catch((err) => {
          console.error(err);
          setSigned(false);
          setOpenSnackBar(true);
          setMessage("Signature failed!");
          setFailed(true);
          setLoaderOpen(false);
        });
    }
  };

  const createRejectSafeTransaction = async () => {
    setLoaderOpen(true);
    const response = await createRejectSafeTx({
      pid,
      gnosisTransactionUrl: GNOSIS_TRANSACTION_URL,
      gnosisAddress,
      NETWORK_HEX,
      daoAddress,
      walletAddress,
    });
    if (response) {
      fetchData();
      setIsCancelSigned(true);
      setOpenSnackBar(true);
      setMessage("Signature successful!");
      setFailed(false);
      isOwner();
    } else {
      setIsCancelSigned(false);
      setOpenSnackBar(true);
      setMessage("Signature failed!");
      setFailed(true);
      setLoaderOpen(false);
    }
  };

  const signRejectTransaction = async () => {
    setLoaderOpen(true);

    const cancelPid = proposalData.cancelProposalId;
    const response = await signRejectTx({
      pid: cancelPid,
      walletAddress,
      gnosisTransactionUrl: GNOSIS_TRANSACTION_URL,
      gnosisAddress,
    });
    if (response) {
      fetchData();
      setIsCancelSigned(true);
      setOpenSnackBar(true);
      setMessage("Signature successful!");
      setFailed(false);
      isOwner();
    } else {
      setIsCancelSigned(false);
      setOpenSnackBar(true);
      setMessage("Signature failed!");
      setFailed(true);
      setLoaderOpen(false);
    }
  };

  const executeRejectSafeTransaction = async () => {
    setLoaderOpen(true);
    const response = executeRejectTx({
      pid: proposalData?.cancelProposalId,
      gnosisTransactionUrl: GNOSIS_TRANSACTION_URL,
      gnosisAddress,
      walletAddress,
    });
    response.then(
      (result) => {
        result.promiEvent.on("confirmation", () => {
          const updateStatus = patchProposalExecuted(pid);
          updateStatus.then((result) => {
            if (result.status !== 200) {
              setExecuted(false);
              setOpenSnackBar(true);
              setMessage("execution status update failed!");
              setFailed(true);
              setLoaderOpen(false);
            } else {
              fetchData();
              setExecuted(true);
              setOpenSnackBar(true);
              setMessage("execution successful!");
              setFailed(false);
              setLoaderOpen(false);
            }
          });
        });
      },
      (error) => {
        console.error(error);
        setExecuted(false);
        setOpenSnackBar(true);
        setMessage("execution failed!");
        setFailed(true);
        setLoaderOpen(false);
      },
    );
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  useEffect(() => {
    if (pid) {
      setLoaderOpen(true);
      fetchData();
      fetchNfts();

      isOwner();
    }
  }, [fetchData, fetchNfts, isOwner, pid]);

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const data = await queryAllMembersFromSubgraph(daoAddress, networkId);
        if (data && data?.users) {
          setMembers(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (daoAddress && networkId && walletAddress) {
      fetchAllMembers();
    }
  }, [daoAddress, networkId, walletAddress]);

  if (!walletAddress && proposalData === null) {
    return <>loading</>;
  }

  return (
    <>
      <Grid container spacing={6} paddingTop={2} mb={8}>
        <Grid item md={8.5}>
          {/* back button */}
          <Grid container spacing={1} ml={-4} onClick={() => router.back()}>
            <Grid item mt={0.5} sx={{ "&:hover": { cursor: "pointer" } }}>
              <KeyboardBackspaceIcon className={classes.listFont} />
            </Grid>
            <Grid item sx={{ "&:hover": { cursor: "pointer" } }} mb={2}>
              <Typography className={classes.listFont}>
                Back to all proposals
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
                <Grid item ml={-1}>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid
                        container
                        sx={{ display: "flex", alignItems: "center" }}>
                        <Image src={tickerIcon} alt="ticker-icon" />
                        <Typography ml={1}>
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
                      <Grid
                        container
                        sx={{ display: "flex", alignItems: "center" }}>
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

          {/* Proposal Info and Signators */}
          <Grid container spacing={2} mt={4} mb={3}>
            <ProposalExecutionInfo
              proposalData={proposalData}
              fetched={fetched}
              daoDetails={factoryData}
            />

            {proposalData?.type === "action" && (
              <Signators
                ownerAddresses={ownerAddresses}
                signedOwners={signedOwners}
              />
            )}
          </Grid>

          {/* proposal description */}
          <Typography fontWeight={"500"}>Proposal description</Typography>
          <Grid container item className={classes.listFont}>
            <div
              dangerouslySetInnerHTML={{
                __html: ReactHtmlParser(proposalData?.description),
              }}></div>
          </Grid>
          <br />
          {isNftSold && (
            <div
              style={{
                background: "#D55438 0% 0% no-repeat padding-box",
                opacity: "50%",
                display: "flex",
                alignItems: "center",
                padding: "10px 30px",
                borderRadius: "10px",
              }}>
              <BsInfoCircleFill
                color="#C1D3FF"
                style={{ marginRight: "10px" }}
              />
              <p>
                This item has been sold already, please cancel this proposal
              </p>
            </div>
          )}
          {/* voting process before Signature */}
          {governance || proposalData?.type === "survey" ? (
            <>
              <Grid container mt={6}>
                <Grid item md={12}>
                  {proposalData?.type === "action" ? (
                    proposalData?.status === "active" ? (
                      <>
                        {checkUserVoted() ? (
                          <Card sx={{ width: "100%" }}>
                            <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              mt={10}
                              mb={10}>
                              <Grid item mt={0.5}>
                                <CheckCircleRoundedIcon
                                  className={classes.mainCardButtonSuccess}
                                />
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography
                                  className={classes.successfulMessageText}>
                                  Successfully voted
                                </Typography>
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography className={classes.listFont2}>
                                  {/* Voted for */}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Card>
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
                                    disabled={voted}>
                                    <Card
                                      className={
                                        cardSelected == key
                                          ? classes.mainCardSelected
                                          : classes.mainCard
                                      }
                                      onClick={(e) => {
                                        setCastVoteOption(data.votingOptionId);
                                        setCardSelected(key);
                                      }}>
                                      <Grid
                                        container
                                        item
                                        justifyContent="center"
                                        alignItems="center">
                                        <Typography
                                          className={classes.cardFont1}>
                                          {data.text}{" "}
                                        </Typography>
                                      </Grid>
                                    </Card>
                                  </CardActionArea>
                                );
                              })}
                              <CardActionArea
                                className={classes.mainCard}
                                disabled={voted}>
                                <Card
                                  className={
                                    voted
                                      ? classes.mainCardButtonSuccess
                                      : classes.mainCardButton
                                  }
                                  onClick={!voted ? submitVote : null}>
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center">
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
                                          mt={0.5}>
                                          Successfully voted
                                        </Typography>
                                      ) : (
                                        <Typography
                                          className={classes.cardFont1}>
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
                          {proposalData?.cancelProposalId === undefined && (
                            <Button
                              style={{
                                width: "100%",
                                padding: "1rem 0",
                              }}
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
                              disabled={
                                (!executionReady && signed) ||
                                executed ||
                                isNftSold
                              }>
                              <Grid
                                container
                                justifyContent="center"
                                alignItems="center">
                                {signed && !executionReady ? (
                                  <Grid item mt={0.5}>
                                    <CheckCircleRoundedIcon />
                                  </Grid>
                                ) : (
                                  <Grid item></Grid>
                                )}

                                {executed && signed ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Executed Successfully
                                    </Typography>
                                  </Grid>
                                ) : executionReady ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      Execute Now
                                    </Typography>
                                  </Grid>
                                ) : !executionReady && !executed ? (
                                  <Grid item>
                                    <Typography className={classes.cardFont1}>
                                      {signed
                                        ? "Signed Succesfully"
                                        : "Sign Now"}
                                    </Typography>
                                  </Grid>
                                ) : null}
                              </Grid>
                            </Button>
                          )}

                          {(signed ||
                            isRejectTxnSigned ||
                            signedOwners.length) &&
                            proposalData.commands[0]?.executionId === 8 && (
                              <Button
                                className={
                                  executed
                                    ? classes.mainCardButtonSuccess
                                    : classes.mainCardButton
                                }
                                style={{
                                  marginTop: "20px",
                                  backgroundColor: "#D55438",
                                  width: "100%",
                                  padding: "1rem 0",
                                }}
                                disabled={
                                  (!isCancelExecutionReady && isCancelSigned) ||
                                  isCancelExecuted
                                }
                                onClick={
                                  isCancelExecutionReady
                                    ? pendingTxHash === txHash
                                      ? () => {
                                          executeRejectSafeTransaction();
                                        }
                                      : () => {
                                          setOpenSnackBar(true);
                                          setFailed(true);
                                          setMessage(
                                            "execute txns with smaller nonce first",
                                          );
                                        }
                                    : !isRejectTxnSigned
                                    ? () => {
                                        createRejectSafeTransaction();
                                      }
                                    : () => {
                                        signRejectTransaction();
                                      }
                                }>
                                <Grid item>
                                  {isCancelExecuted && isCancelSigned ? (
                                    <Grid item>
                                      <Typography className={classes.cardFont1}>
                                        Executed Reject Successfully
                                      </Typography>
                                    </Grid>
                                  ) : isCancelExecutionReady ? (
                                    <Grid item>
                                      <Typography className={classes.cardFont1}>
                                        Execute Reject
                                      </Typography>
                                    </Grid>
                                  ) : !isCancelExecutionReady &&
                                    !isCancelExecuted ? (
                                    <Grid item>
                                      <Typography className={classes.cardFont1}>
                                        {isCancelSigned
                                          ? "Cancellation Requested"
                                          : "Request Cancel"}
                                      </Typography>
                                    </Grid>
                                  ) : null}
                                </Grid>
                              </Button>
                            )}
                        </Card>
                      ) : (
                        <Card sx={{ width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                            mb={10}>
                            <Grid item mt={0.5}>
                              <CheckCircleRoundedIcon
                                className={classes.mainCardButtonSuccess}
                              />
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography
                                className={classes.successfulMessageText}>
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
                  ) : proposalData?.type === "survey" ? (
                    proposalData?.type === "survey" ? (
                      proposalData?.status === "active" ? (
                        checkUserVoted(pid) ? (
                          <Card sx={{ width: "100%" }}>
                            <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center"
                              mt={10}
                              mb={10}>
                              <Grid item mt={0.5}>
                                <CheckCircleRoundedIcon
                                  className={classes.mainCardButtonSuccess}
                                />
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography
                                  className={classes.successfulMessageText}>
                                  Successfully voted
                                </Typography>
                              </Grid>
                              <Grid item mt={0.5}>
                                <Typography className={classes.listFont2}>
                                  {/* Voted for */}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Card>
                        ) : (
                          <Card>
                            <Typography className={classes.cardFont1}>
                              Cast your vote
                            </Typography>
                            <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                            <Stack spacing={2}>
                              {fetched
                                ? proposalData?.votingOptions.map(
                                    (data, key) => {
                                      return (
                                        <CardActionArea
                                          className={classes.mainCard}
                                          key={key}
                                          disabled={voted}>
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
                                            }}>
                                            <Grid
                                              container
                                              item
                                              justifyContent="center"
                                              alignItems="center">
                                              <Typography
                                                className={classes.cardFont1}>
                                                {data.text}{" "}
                                              </Typography>
                                            </Grid>
                                          </Card>
                                        </CardActionArea>
                                      );
                                    },
                                  )
                                : null}
                              <CardActionArea
                                className={classes.mainCard}
                                disabled={voted}>
                                <Card
                                  className={
                                    voted
                                      ? classes.mainCardButtonSuccess
                                      : classes.mainCardButton
                                  }
                                  onClick={submitVote}>
                                  <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center">
                                    {voted ? (
                                      <Grid item mt={0.5}>
                                        <CheckCircleRoundedIcon />
                                      </Grid>
                                    ) : (
                                      <Grid item></Grid>
                                    )}
                                    <Grid item>
                                      {voted ? (
                                        <Typography
                                          className={classes.cardFont1}>
                                          Successfully voted
                                        </Typography>
                                      ) : (
                                        <Typography
                                          className={classes.cardFont1}>
                                          Vote now
                                        </Typography>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Card>
                              </CardActionArea>
                            </Stack>
                          </Card>
                        )
                      ) : proposalData[0].status === "failed" ? (
                        <Card sx={{ width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                            mb={10}>
                            <Grid item mt={0.5}>
                              <CloseIcon
                                className={classes.mainCardButtonError}
                              />
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography
                                className={classes.successfulMessageText}>
                                Voting Closed
                              </Typography>
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography className={classes.listFont2}>
                                {/* Voted for */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      ) : proposalData[0].status === "closed" ? (
                        <Card sx={{ width: "100%" }}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            mt={10}
                            mb={10}>
                            <Grid item mt={0.5}>
                              <CloseIcon
                                className={classes.mainCardButtonError}
                              />
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography
                                className={classes.successfulMessageText}>
                                Voting Closed
                              </Typography>
                            </Grid>
                            <Grid item mt={0.5}>
                              <Typography className={classes.listFont2}>
                                {/* Voted for */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      ) : null
                    ) : null
                  ) : null}
                </Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item md={3.5}>
          <Stack spacing={3}>
            <ProposalInfo
              proposalData={proposalData}
              fetched={fetched}
              threshold={Club_Threshold}
              members={members}
              isGovernanceActive={isGovernanceActive}
              ownerAddresses={ownerAddresses}
            />

            {(isGovernanceActive || proposalData?.type === "survey") && (
              <>
                <CurrentResults proposalData={proposalData} fetched={fetched} />
                <ProposalVotes proposalData={proposalData} fetched={fetched} />
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {!failed ? (
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            sx={{ width: "100%" }}>
            {message}
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}>
            {message}
          </Alert>
        )}
      </Snackbar>
      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loaderOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ProposalDetail;
