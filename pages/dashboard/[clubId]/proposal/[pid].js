import React, { useCallback, useEffect, useState } from "react";
import Layout1 from "../../../../src/components/layouts/layout1";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
  Alert,
  Backdrop,
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
import { useConnectWallet } from "@web3-onboard/react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  castVote,
  getProposalDetail,
  getProposalTxHash,
  patchProposalExecuted,
} from "../../../../src/api/proposal";
import { useDispatch, useSelector } from "react-redux";
import ClubFetch from "../../../../src/utils/clubFetch";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import tickerIcon from "../../../../public/assets/icons/ticker_icon.svg";
import {
  calculateDays,
  convertToWeiGovernance,
} from "../../../../src/utils/globalFunctions";
import actionIcon from "../../../../public/assets/icons/action_icon.svg";
import surveyIcon from "../../../../public/assets/icons/survey_icon.svg";
import ReactHtmlParser from "react-html-parser";
import Erc721Dao from "../../../../src/abis/newArch/erc721Dao.json";
import Erc20Dao from "../../../../src/abis/newArch/erc20Dao.json";
import FactoryContractABI from "../../../../src/abis/newArch/factoryContract.json";
import { SmartContract } from "../../../../src/api/contract";
import { Interface } from "ethers";

import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { subgraphQuery } from "../../../../src/utils/subgraphs";
import {
  QUERY_ALL_MEMBERS,
  QUERY_CLUB_DETAILS,
} from "../../../../src/api/graphql/queries";
import ProposalExecutionInfo from "../../../../src/components/proposalComps/ProposalExecutionInfo";
import Signators from "../../../../src/components/proposalComps/Signators";
import ProposalInfo from "../../../../src/components/proposalComps/ProposalInfo";
import CurrentResults from "../../../../src/components/proposalComps/CurrentResults";
import ProposalVotes from "../../../../src/components/proposalComps/ProposalVotes";
import WrongNetworkModal from "../../../../src/components/modals/WrongNetworkModal";
import { getSafeSdk } from "../../../../src/utils/helper";

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
    borderRadius: "38px",
    border: "1px solid #C1D3FF40;",
    backgroundColor: "#3B7AFD",
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
  const { pid, clubId: daoAddress } = router.query;

  const [{ wallet }] = useConnectWallet();
  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
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

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
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
  const [signedOwners, setSignedOwners] = useState([]);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [daoDetails, setDaoDetails] = useState();
  const [members, setMembers] = useState([]);

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const AIRDROP_ACTION_ADDRESS = useSelector((state) => {
    return state.gnosis.actionContractAddress;
  });

  const CLUB_NETWORK_ID = useSelector((state) => {
    return state.gnosis.clubNetworkId;
  });

  const getSafeService = useCallback(async () => {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: walletAddress,
    });
    const safeService = new SafeApiKit({
      txServiceUrl: GNOSIS_TRANSACTION_URL,
      ethAdapter,
    });
    // const safeService = new SafeServiceClient({
    //   txServiceUrl: GNOSIS_TRANSACTION_URL,
    //   ethAdapter,
    // });
    return safeService;
  }, [GNOSIS_TRANSACTION_URL, walletAddress]);

  const isOwner = useCallback(async () => {
    const safeSdk = await getSafeSdk(gnosisAddress, walletAddress);
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
      setLoaderOpen(false);
    });
  }, [gnosisAddress, isAdmin, isGovernanceActive, pid, walletAddress]);

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

  const fetchData = useCallback(async () => {
    const proposalData = getProposalDetail(pid);

    const membersData = await subgraphQuery(
      SUBGRAPH_URL,
      QUERY_ALL_MEMBERS(daoAddress),
    );
    setMembers(membersData);

    proposalData.then((result) => {
      if (result.status !== 200) {
        setFetched(false);
      } else {
        setProposalData(result.data[0]);
        setFetched(true);
      }
    });
  }, [SUBGRAPH_URL, daoAddress, dispatch, pid]);

  const executeFunction = async (proposalStatus) => {
    setLoaderOpen(true);

    const updateProposal = new SmartContract(
      clubData?.tokenType === "erc20" ? Erc20Dao : Erc721Dao,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );

    let data;
    let approvalData;
    let ABI;
    if (
      proposalData.commands[0].executionId === 0 ||
      proposalData.commands[0].executionId === 4
    ) {
      ABI = [
        "function approve(address spender, uint256 amount)",
        "function contractCalls(address _to, bytes memory _data)",
        "function airDropToken(address _airdropTokenAddress,uint256[] memory _airdropAmountArray,address[] memory _members)",
      ];
    } else if (proposalData.commands[0].executionId === 3) {
      ABI = FactoryContractABI.abi;
    } else if (clubData.tokenType === "erc721") {
      ABI = Erc721Dao.abi;
    } else if (clubData.tokenType === "erc20") {
      ABI = Erc20Dao.abi;
    }
    // if(clubData.tokenType === 'erc721')
    if (proposalData.commands[0].executionId === 0) {
      const membersData = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_ALL_MEMBERS(daoAddress),
      );
      setMembers(membersData);
      let membersArray = [];
      membersData.users.map((member) => membersArray.push(member.userAddress));

      let iface = new Interface(ABI);
      approvalData = iface.encodeFunctionData("approve", [
        AIRDROP_ACTION_ADDRESS,
        proposalData.commands[0].airDropAmount,
      ]);

      let airDropAmountArray = [];
      if (proposalData.commands[0].airDropCarryFee !== 0) {
        const carryFeeAmount =
          (proposalData.commands[0].airDropAmount *
            proposalData.commands[0].airDropCarryFee) /
          100;
        airDropAmountArray = await Promise.all(
          membersArray.map(async (member) => {
            const balance = await updateProposal.nftBalance(
              Web3.utils.toChecksumAddress(member),
            );

            let clubTokensMinted;
            if (clubData.tokenType === "erc20") {
              clubTokensMinted = await updateProposal.totalSupply();
            } else {
              clubTokensMinted = await updateProposal.nftOwnersCount();
            }

            return (
              ((proposalData.commands[0].airDropAmount - carryFeeAmount) *
                balance) /
              clubTokensMinted
            )
              .toFixed(0)
              .toString();
          }),
        );
        airDropAmountArray.unshift(carryFeeAmount.toString());
        membersArray.unshift(
          Web3.utils.toChecksumAddress(proposalData.createdBy),
        );
      } else {
        airDropAmountArray = await Promise.all(
          membersArray.map(async (member) => {
            const balance = await updateProposal.nftBalance(
              Web3.utils.toChecksumAddress(member),
            );

            let clubTokensMinted;
            if (clubData.tokenType === "erc20") {
              clubTokensMinted = await updateProposal.totalSupply();
            } else {
              clubTokensMinted = await updateProposal.nftOwnersCount();
            }

            return (
              (proposalData.commands[0].airDropAmount * balance) /
              clubTokensMinted
            )
              .toFixed(0)
              .toString();
          }),
        );
      }

      data = iface.encodeFunctionData("airDropToken", [
        proposalData.commands[0].airDropToken,
        airDropAmountArray,
        membersArray,
      ]);
    }
    if (proposalData.commands[0].executionId === 1) {
      let iface = new Interface(ABI);

      if (clubData.tokenType === "erc20") {
        data = iface.encodeFunctionData("mintGTToAddress", [
          [proposalData.commands[0].mintGTAmounts.toString()],
          proposalData.commands[0].mintGTAddresses,
        ]);
      } else {
        const clubDetails = await subgraphQuery(
          SUBGRAPH_URL,
          QUERY_CLUB_DETAILS(daoAddress),
        );
        const tokenURI = clubDetails?.stations[0].imageUrl;
        data = iface.encodeFunctionData("mintGTToAddress", [
          proposalData.commands[0].mintGTAmounts,
          [tokenURI],
          proposalData.commands[0].mintGTAddresses,
        ]);
      }
    }

    if (proposalData.commands[0].executionId === 2) {
      let iface = new Interface(ABI);
      data = iface.encodeFunctionData("updateGovernanceSettings", [
        proposalData.commands[0].quorum * 100,
        proposalData.commands[0].threshold * 100,
      ]);
    }
    if (proposalData.commands[0].executionId === 3) {
      let iface = new Interface(ABI);

      data = iface.encodeFunctionData("updateDistributionAmount", [
        convertToWeiGovernance(
          convertToWeiGovernance(proposalData.commands[0].totalDeposits, 6) /
            daoDetails.pricePerToken,
          18,
        ),
        daoAddress,
      ]);
    }
    if (proposalData.commands[0].executionId === 4) {
      let iface = new Interface(ABI);

      approvalData = iface.encodeFunctionData("approve", [
        AIRDROP_ACTION_ADDRESS,
        proposalData.commands[0].customTokenAmounts[0],
      ]);

      data = iface.encodeFunctionData("airDropToken", [
        proposalData.commands[0].customToken,
        proposalData.commands[0].customTokenAmounts,
        proposalData.commands[0].customTokenAddresses,
      ]);
    }

    const updateProposalExecute = new SmartContract(
      clubData?.tokenType === "erc20" ? Erc20Dao : Erc721Dao,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
      true,
    );

    const response = updateProposalExecute.updateProposalAndExecution(
      data,
      approvalData,
      daoAddress,
      Web3.utils.toChecksumAddress(gnosisAddress),
      txHash,
      pid,
      proposalData.commands[0].executionId === 0
        ? proposalData.commands[0].airDropToken
        : proposalData.commands[0].executionId === 4
        ? proposalData.commands[0].customToken
        : "",
      proposalStatus,
      airdropContractAddress,
      proposalData.commands[0].executionId === 3
        ? FACTORY_CONTRACT_ADDRESS
        : "",
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
      isOwner();
    }
  }, [pid]);

  useEffect(() => {
    const fetchFactoryContractDetails = async () => {
      try {
        const factoryContract = new SmartContract(
          FactoryContractABI,
          FACTORY_CONTRACT_ADDRESS,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );

        const factoryData = await factoryContract.getDAOdetails(daoAddress);
        setDaoDetails(factoryData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFactoryContractDetails();
  }, [
    daoAddress,
    FACTORY_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    walletAddress,
  ]);

  if (!wallet && proposalData === null) {
    return <>loading</>;
  }

  return (
    <>
      <Layout1 page={2}>
        <Grid container spacing={6} paddingLeft={10} paddingTop={10}>
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

            {/* Proposal Info and Signators */}
            <Grid container spacing={2} mt={4} mb={3}>
              <ProposalExecutionInfo
                proposalData={proposalData}
                fetched={fetched}
                USDC_CONTRACT_ADDRESS={USDC_CONTRACT_ADDRESS}
                daoDetails={daoDetails}
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

            {/* voting process before Signature */}
            {governance ? (
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
                                (!executionReady && signed) || executed
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

              {isGovernanceActive && (
                <>
                  <CurrentResults
                    proposalData={proposalData}
                    fetched={fetched}
                  />
                  <ProposalVotes
                    proposalData={proposalData}
                    fetched={fetched}
                  />
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {WRONG_NETWORK && <WrongNetworkModal chainId={CLUB_NETWORK_ID} />}

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
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loaderOpen}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout1>
    </>
  );
};

export default ClubFetch(ProposalDetail);
