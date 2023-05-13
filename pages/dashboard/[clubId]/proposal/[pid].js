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
import { addProposalId } from "../../../../src/redux/reducers/create";
import ClubFetch from "../../../../src/utils/clubFetch";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import tickerIcon from "../../../../public/assets/icons/ticker_icon.svg";
import {
  calculateDays,
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../../../src/utils/globalFunctions";
import actionIcon from "../../../../public/assets/icons/action_icon.svg";
import surveyIcon from "../../../../public/assets/icons/survey_icon.svg";
import ReactHtmlParser from "react-html-parser";
import Erc721Dao from "../../../../src/abis/newArch/erc721Dao.json";
import Erc20Dao from "../../../../src/abis/newArch/erc20Dao.json";
import FactoryContractABI from "../../../../src/abis/newArch/factoryContract.json";
import { SmartContract } from "../../../../src/api/contract";
import { getAssets, getAssetsByDaoAddress } from "../../../../src/api/assets";
import { Interface, ethers } from "ethers";

import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { subgraphQuery } from "../../../../src/utils/subgraphs";
import { QUERY_ALL_MEMBERS } from "../../../../src/api/graphql/queries";
import { NEW_FACTORY_ADDRESS } from "../../../../src/api";
import { AIRDROP_ACTION_ADDRESS } from "../../../../src/api";
import ProposalExecutionInfo from "../../../../src/components/proposalComps/ProposalExecutionInfo";
import Signators from "../../../../src/components/proposalComps/Signators";
import ProposalInfo from "../../../../src/components/proposalComps/ProposalInfo";
import CurrentResults from "../../../../src/components/proposalComps/CurrentResults";
import ProposalVotes from "../../../../src/components/proposalComps/ProposalVotes";
import { fetchClubbyDaoAddress } from "../../../../src/api/club";

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
  const { pid, clubId: daoAddress } = router.query;
  console.log("pid", pid);

  const [{ wallet }] = useConnectWallet();
  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

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

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  console.log(isAdmin);
  const [loader, setLoader] = useState(false);
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
  const [tokenData, setTokenData] = useState([]);
  const [tokenFetched, setTokenFetched] = useState(false);
  const [threshold, setThreshold] = useState();
  const [fetched, setFetched] = useState(false);

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const getSafeSdk = useCallback(async () => {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: walletAddress,
    });
    console.log("ethAdapter", ethAdapter);
    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });
    console.log("safeSdk", safeSdk);

    return safeSdk;
  }, [gnosisAddress, walletAddress]);

  const getSafeService = useCallback(async () => {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: walletAddress,
    });
    console.log("GNOSIS_TRANSACTION_URL", GNOSIS_TRANSACTION_URL);
    const safeService = new SafeApiKit({
      txServiceUrl: GNOSIS_TRANSACTION_URL,
      ethAdapter,
    });
    console.log("safeService", safeService);
    // const safeService = new SafeServiceClient({
    //   txServiceUrl: GNOSIS_TRANSACTION_URL,
    //   ethAdapter,
    // });
    return safeService;
  }, [GNOSIS_TRANSACTION_URL, walletAddress]);

  const isOwner = useCallback(async () => {
    const safeSdk = await getSafeSdk();
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

    console.log("Threshold", threshold);
    setThreshold(threshold);
    const proposalTxHash = getProposalTxHash(pid);
    proposalTxHash.then(async (result) => {
      if (
        result.status !== 200 ||
        (result.status === 200 && result.data.length === 0)
      ) {
        setTxHash("");
      } else {
        // txHash = result.data[0].txHash;
        console.log(result);
        setTxHash(result.data[0].txHash);
        const safeService = await getSafeService();
        const tx = await safeService.getTransaction(result.data[0].txHash);
        const ownerAddresses = tx.confirmations.map(
          (confirmOwners) => confirmOwners.owner,
        );
        console.log("ownerAddresses", ownerAddresses, gnosisAddress);
        const pendingTxs = await safeService.getPendingTransactions(
          Web3.utils.toChecksumAddress(gnosisAddress),
        );
        console.log(
          pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
          result.data[0].txHash,
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
  }, [
    getSafeSdk,
    getSafeService,
    gnosisAddress,
    isAdmin,
    isGovernanceActive,
    pid,
    walletAddress,
  ]);
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
      clubId: daoAddress,
      daoAddress: daoAddress,
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

  const fetchData = useCallback(async () => {
    setLoader(true);
    dispatch(addProposalId(pid));
    console.log("pid", pid);
    const proposalData = getProposalDetail(pid);

    proposalData.then((result) => {
      if (result.status !== 200) {
        setLoader(false);
        setFetched(false);
      } else {
        console.log(proposalData);
        setProposalData(result.data[0]);
        console.log("NEW DATA", result.data[0]);
        setFetched(true);
      }
    });
    setLoader(false);
  }, [dispatch, pid]);

  const fetchTokens = useCallback(() => {
    if (daoAddress) {
      const tokenData = getAssetsByDaoAddress(daoAddress, NETWORK_HEX);
      tokenData.then((result) => {
        if (result?.status != 200) {
          setTokenFetched(false);
        } else {
          setTokenData(result.data.tokenPriceList);
          setTokenFetched(true);
        }
      });
    }
  }, [NETWORK_HEX, daoAddress]);

  const executeFunction = async (proposalStatus) => {
    console.log(proposalStatus);
    setLoaderOpen(true);
    let updateProposal;
    if (clubData.tokenType === "erc20") {
      updateProposal = new SmartContract(
        Erc20Dao,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
    } else if (clubData.tokenType === "erc721") {
      updateProposal = new SmartContract(
        Erc721Dao,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
    }

    console.log("samrt contraccttt", updateProposal);
    let data;
    let approvalData;
    let ABI;
    console.log(clubData.tokenType);
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
      const membersData = await subgraphQuery(QUERY_ALL_MEMBERS(daoAddress));
      let membersArray = [];
      membersData.users.map((member) => membersArray.push(member.userAddress));
      console.log(membersArray);

      // const erc20DaoContract = new SmartContract(
      //   Erc20Dao,
      //   daoAddress,
      //   walletAddress,
      //   USDC_CONTRACT_ADDRESS,
      //   GNOSIS_TRANSACTION_URL,
      // );
      // console.log("erc20DaoContract", erc20DaoContract);

      let iface = new Interface(ABI);
      console.log(iface);
      // data = iface.encodeFunctionData("airDropToken", [
      //   proposalData.commands[0].airDropToken,
      //   proposalData.commands[0].airDropAmount,
      //   proposalData.commands[0].airDropCarryFee,
      //   membersArray,
      // ]);
      approvalData = iface.encodeFunctionData("approve", [
        AIRDROP_ACTION_ADDRESS,
        proposalData.commands[0].airDropAmount,
      ]);
      console.log("approvalData", approvalData);

      let airDropAmountArray = [];
      if (proposalData.commands[0].airDropCarryFee !== 0) {
        const carryFeeAmount =
          (proposalData.commands[0].airDropAmount *
            proposalData.commands[0].airDropCarryFee) /
          100;
        airDropAmountArray = await Promise.all(
          membersArray.map(async (member) => {
            console.log("member", member);
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
            console.log("member", member);
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

      console.log("airDropAmountArray", airDropAmountArray);

      data = iface.encodeFunctionData("airDropToken", [
        proposalData.commands[0].airDropToken,
        airDropAmountArray,
        membersArray,
      ]);
    }
    if (proposalData.commands[0].executionId === 1) {
      console.log("abi", ABI);
      let iface = new Interface(ABI);
      console.log(iface, ABI);

      if (clubData.tokenType === "erc20") {
        data = iface.encodeFunctionData("mintGTToAddress", [
          [proposalData.commands[0].mintGTAmounts.toString()],
          proposalData.commands[0].mintGTAddresses,
        ]);
      } else {
        console.log("hereee");
        const fetchedData = await fetchClubbyDaoAddress(daoAddress);
        console.log("Fetched Data", fetchedData);
        const tokenURI = fetchedData?.data[0]?.nftMetadataUrl;
        console.log(tokenURI);
        data = iface.encodeFunctionData("mintGTToAddress", [
          [proposalData.commands[0].mintGTAmounts.toString()],
          [tokenURI],
          proposalData.commands[0].mintGTAddresses,
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ]);
      }

      // console.log(data);
    }

    if (proposalData.commands[0].executionId === 2) {
      let iface = new Interface(ABI);
      console.log(iface);
      data = iface.encodeFunctionData("updateGovernanceSettings", [
        proposalData.commands[0].quorum,
        proposalData.commands[0].threshold,
      ]);
      console.log(data);
    }
    if (proposalData.commands[0].executionId === 3) {
      let iface = new Interface(ABI);
      console.log(
        iface,
        convertToWeiGovernance(proposalData.commands[0].totalDeposits, 18),
        daoAddress,
      );
      data = iface.encodeFunctionData("updateDistributionAmount", [
        convertToWeiGovernance(proposalData.commands[0].totalDeposits, 18),
        daoAddress,
      ]);

      console.log(data);
    }
    if (proposalData.commands[0].executionId === 4) {
      // const erc20DaoContract = new SmartContract(
      //   Erc20Dao,
      //   daoAddress,
      //   walletAddress,
      //   USDC_CONTRACT_ADDRESS,
      //   GNOSIS_TRANSACTION_URL,
      // );
      // console.log("erc20DaoContract", erc20DaoContract);

      let iface = new Interface(ABI);
      console.log(iface);

      approvalData = iface.encodeFunctionData("approve", [
        AIRDROP_ACTION_ADDRESS,
        proposalData.commands[0].customTokenAmounts[0],
      ]);
      console.log("approvalData", approvalData);

      data = iface.encodeFunctionData("airDropToken", [
        proposalData.commands[0].customToken,
        proposalData.commands[0].customTokenAmounts,
        proposalData.commands[0].customTokenAddresses,
      ]);

      // data = iface.encodeFunctionData("sendCustomToken", [
      //   proposalData.commands[0].customToken,
      //   proposalData.commands[0].customTokenAmounts,
      //   proposalData.commands[0].customTokenAddresses,
      // ]);
      console.log(data);
    }
    // console.log("data", data);
    const response = updateProposal.updateProposalAndExecution(
      data,
      approvalData,
      proposalData.commands[0].executionId === 3
        ? NEW_FACTORY_ADDRESS
        : daoAddress,
      Web3.utils.toChecksumAddress(gnosisAddress),
      txHash,
      pid,
      proposalData.commands[0].executionId === 0
        ? proposalData.commands[0].airDropToken
        : proposalData.commands[0].executionId === 4
        ? proposalData.commands[0].customToken
        : "",
      proposalStatus,
    );
    console.log(response);
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
    console.log("heree");
    if (pid) {
      fetchData();
      isOwner();
      fetchTokens();
    }
  }, [fetchData, fetchTokens, isOwner, pid]);
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
            {/* back button */}
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

            {/* Proposal Info and Signators */}
            <Grid container spacing={2} mt={4} mb={3}>
              <ProposalExecutionInfo
                proposalData={proposalData}
                fetched={fetched}
                USDC_CONTRACT_ADDRESS={USDC_CONTRACT_ADDRESS}
              />

              <Signators
                ownerAddresses={ownerAddresses}
                signedOwners={signedOwners}
              />
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
          <Grid item md={3.5}>
            <Stack spacing={3}>
              <ProposalInfo proposalData={proposalData} fetched={fetched} />
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
        <Snackbar
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {!failed ? (
            <Alert
              onClose={handleSnackBarClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          ) : (
            <Alert
              onClose={handleSnackBarClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          )}
        </Snackbar>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loaderOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout1>
    </>
  );
};

export default ClubFetch(ProposalDetail);
