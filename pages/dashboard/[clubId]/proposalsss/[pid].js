// import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
// import CloseIcon from "@mui/icons-material/Close";
// import DoneIcon from "@mui/icons-material/Done";
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
// import {
//   Alert,
//   Backdrop,
//   Button,
//   Card,
//   CardActionArea,
//   Chip,
//   CircularProgress,
//   Divider,
//   Grid,
//   Snackbar,
//   Stack,
//   Typography,
// } from "@mui/material";
// import { makeStyles } from "@mui/styles";
// import Safe from "@safe-global/safe-core-sdk";
// import SafeServiceClient from "@safe-global/safe-service-client";
// import Web3Adapter from "@safe-global/safe-web3-lib";
// import { useConnectWallet } from "@web3-onboard/react";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import { React, useEffect, useState } from "react";
// import ReactHtmlParser from "react-html-parser";
// import { useDispatch, useSelector } from "react-redux";
// import Web3 from "web3";

// import actionIcon from "../../../../public/assets/icons/action_icon.svg";
// import surveyIcon from "../../../../public/assets/icons/survey_icon.svg";
// import tickerIcon from "../../../../public/assets/icons/ticker_icon.svg";
// import ImplementationContract from "../../../../src/abis/implementationABI.json";
// import USDCContract from "../../../../src/abis/usdcTokenContract.json";
// import { getAssets } from "../../../../src/api/assets";
// import { SmartContract } from "../../../../src/api/contract";
// import {
//   castVote,
//   getProposalDetail,
//   getProposalTxHash,
//   patchProposalExecuted,
// } from "../../../../src/api/proposal";
// import { getMembersDetails } from "../../../../src/api/user";
// import Layout1 from "../../../../src/components/layouts/layout1";
// import ProgressBar from "../../../../src/components/progressbar";
// import { addProposalId } from "../../../../src/redux/reducers/create";
// import ClubFetch from "../../../../src/utils/clubFetch";
// import { calculateDays } from "../../../../src/utils/globalFunctions";

// const useStyles = makeStyles({
//   clubAssets: {
//     fontSize: "42px",
//     color: "#FFFFFF",
//   },
//   activeIllustration: {
//     height: "12px",
//     width: "12px",
//     backgroundColor: "#0ABB92",
//     borderRadius: "50%",
//     marginRight: "15px",
//   },
//   passedIllustration: {
//     height: "12px",
//     width: "12px",
//     backgroundColor: "#FFB74D",
//     borderRadius: "50%",
//     marginRight: "15px",
//   },
//   executedIllustration: {
//     height: "12px",
//     width: "12px",
//     backgroundColor: "#F75F71",
//     borderRadius: "50%",
//     marginRight: "15px",
//   },
//   failedIllustration: {
//     height: "12px",
//     width: "12px",
//     backgroundColor: "#D55438",
//     borderRadius: "50%",
//     marginRight: "15px",
//   },
//   listFont: {
//     fontSize: "20px",
//     color: "#C1D3FF",
//   },
//   listFont2: {
//     fontSize: "19px",
//     color: "#C1D3FF",
//   },
//   listFont2Colourless: {
//     fontSize: "19px",
//     color: "#FFFFFF",
//     fontWeight: "bold",
//   },
//   listFont2small: {
//     fontSize: "12px",
//     color: "#C1D3FF",
//   },
//   cardFont: {
//     fontSize: "18px",
//     color: "#C1D3FF",
//   },
//   cardFont1: {
//     fontSize: "19px",
//     color: "#EFEFEF",
//   },
//   successfulMessageText: {
//     fontSize: "28px",
//     color: "#EFEFEF",
//   },
//   cardFontYes: {
//     fontSize: "16px",
//     backgroundColor: "#0ABB92",
//     padding: "0 5px 0 5px",
//   },
//   cardFontNo: {
//     fontSize: "16px",
//     backgroundColor: "#D55438",
//     padding: "0 5px 0 5px",
//   },
//   mainCard: {
//     borderRadius: "38px",
//     border: "1px solid #C1D3FF40;",
//     backgroundColor: "#19274B",
//   },
//   mainCardSelected: {
//     borderRadius: "38px",
//     border: "1px solid #FFFFFF;",
//     backgroundColor: "#19274B",
//   },
//   mainCardButton: {
//     "borderRadius": "38px",
//     "border": "1px solid #C1D3FF40;",
//     "backgroundColor": "#3B7AFD",
//     "&:hover": {
//       cursor: "pointer",
//     },
//   },
//   mainCardButtonSuccess: {
//     borderRadius: "38px",
//     fontSize: "50px",
//     color: "#0ABB92",
//   },
//   mainCardButtonError: {
//     fontSize: "50px",
//     color: "#D55438",
//   },
//   seeMoreButton: {
//     border: "1px solid #C1D3FF40",
//     borderRadius: "10px",
//     backgroundColor: "#19274B",
//     display: "flex",
//   },
//   actionChip: {
//     border: "1px solid #0ABB92",
//     background: "transparent",
//     textTransform: "capitalize",
//   },
//   surveyChip: {
//     border: "1px solid #6C63FF",
//     background: "transparent",
//     textTransform: "capitalize",
//   },
//   timeLeftChip: {
//     background: "#111D38",
//     borderRadius: "5px",
//   },
//   cardFontActive: {
//     fontSize: "16px",
//     backgroundColor: "#0ABB92",
//     padding: "5px 5px 5px 5px",
//   },
//   cardFontExecuted: {
//     fontSize: "16px",
//     backgroundColor: "#F75F71",
//     padding: "5px 5px 5px 5px",
//   },
//   cardFontPassed: {
//     fontSize: "16px",
//     backgroundColor: "#FFB74D",
//     padding: "5px 5px 5px 5px",
//   },
//   cardFontFailed: {
//     fontSize: "16px",
//     backgroundColor: "#D55438",
//     padding: "5px 5px 5px 5px",
//   },
// });

// const ProposalDetail = () => {
//   const router = useRouter();
//   const { pid, clubId } = router.query;
//   const [{ wallet }] = useConnectWallet();

//   let walletAddress;

//   if (typeof window !== "undefined") {
//     const web3 = new Web3(window.web3);
//     walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
//   }

//   const classes = useStyles();
//   const [voted, setVoted] = useState(false);
//   const [fetched, setFetched] = useState(false);
//   const [members, setMembers] = useState([]);
//   const [owner, setOwner] = useState(false);
//   const [ownerAddresses, setOwnerAddresses] = useState([]);
//   const [signedOwners, setSignedOwners] = useState([]);
//   const [threshold, setThreshold] = useState();
//   const [signed, setSigned] = useState(false);
//   const [txHash, setTxHash] = useState();
//   const [executionReady, setExecutionReady] = useState(false);
//   const [pendingTxHash, setPendingTxHash] = useState("");
//   const [membersFetched, setMembersFetched] = useState(false);
//   const [proposalData, setProposalData] = useState([]);
//   const [castVoteOption, setCastVoteOption] = useState("");
//   const clubID = clubId;
//   const [cardSelected, setCardSelected] = useState(null);
//   const [governance, setGovernance] = useState(true);
//   const [tokenData, setTokenData] = useState([]);
//   const [tokenFetched, setTokenFetched] = useState(false);

//   const isGovernanceActive = useSelector((state) => {
//     return state.gnosis.governanceAllowed;
//   });
//   const daoAddress = useSelector((state) => {
//     return state.create.daoAddress;
//   });
//   const gnosisAddress = useSelector((state) => {
//     return state.gnosis.safeAddress;
//   });

//   const [executed, setExecuted] = useState(false);
//   const [message, setMessage] = useState("");
//   const [failed, setFailed] = useState(false);
//   const [openSnackBar, setOpenSnackBar] = useState(false);
//   const tresuryAddress = useSelector((state) => {
//     return state.create.tresuryAddress;
//   });
//   const [loaderOpen, setLoaderOpen] = useState(false);
//   const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
//     return state.gnosis.factoryContractAddress;
//   });
//   const USDC_CONTRACT_ADDRESS = useSelector((state) => {
//     return state.gnosis.usdcContractAddress;
//   });
//   const GNOSIS_TRANSACTION_URL = useSelector((state) => {
//     return state.gnosis.transactionUrl;
//   });

//   let voteId = null;
//   const dispatch = useDispatch();

//   const getSafeSdk = async () => {
//     const web3 = new Web3(window.ethereum);
//     const ethAdapter = new Web3Adapter({
//       web3: web3,
//       signerAddress: walletAddress,
//     });
//     const safeSdk = await Safe.create({
//       ethAdapter: ethAdapter,
//       safeAddress: gnosisAddress,
//     });
//     return safeSdk;
//   };

//   const getSafeService = async () => {
//     const web3 = new Web3(window.web3);
//     const ethAdapter = new Web3Adapter({
//       web3: web3,
//       signerAddress: walletAddress,
//     });
//     const safeService = new SafeServiceClient({
//       txServiceUrl: GNOSIS_TRANSACTION_URL,
//       ethAdapter,
//     });
//     return safeService;
//   };

//   const fetchData = async () => {
//     dispatch(addProposalId(pid));
//     const proposalData = getProposalDetail(pid);
//     proposalData.then((result) => {
//       if (result.status !== 200) {
//         setFetched(false);
//       } else {
//         setProposalData(result.data);
//         setFetched(true);
//       }
//     });
//   };

//   const fetchTokens = () => {
//     if (clubID) {
//       const tokenData = getAssets(clubId);
//       tokenData.then((result) => {
//         if (result.status != 200) {
//           setTokenFetched(false);
//         } else {
//           setTokenData(result.data.tokenPriceList);
//           setTokenFetched(true);
//         }
//       });
//     }
//   };

//   const fetchMembersData = () => {
//     const membersData = getMembersDetails(clubID);
//     membersData.then((result) => {
//       if (result.status !== 200) {
//         setMembersFetched(false);
//       } else {
//         setMembers(result.data);
//         setMembersFetched(true);
//       }
//     });
//   };

//   const calculateVotePercentage = (voteReceived) => {
//     let totalVote = 0;
//     proposalData[0].votingOptions.map((vote, key) => {
//       totalVote += vote.count;
//     });
//     return (voteReceived / totalVote).toFixed(2) * 100;
//   };

//   const fetchVotingOptionChoice = (votingOptionAddress) => {
//     let obj = proposalData[0].votingOptions.find(
//       (voteOption) => voteOption.votingOptionId === votingOptionAddress,
//     );
//     voteId = parseInt(proposalData[0].votingOptions.indexOf(obj));
//     return proposalData[0].votingOptions.indexOf(obj);
//   };

//   useEffect(async () => {
//     setLoaderOpen(true);

//     if (pid && gnosisAddress && GNOSIS_TRANSACTION_URL) {
//       await isOwner();
//       await fetchData();
//     }
//   }, [pid, gnosisAddress, GNOSIS_TRANSACTION_URL]);
//   useEffect(async () => {
//     setLoaderOpen(true);
//     // await isOwner();
//     if (clubId) {
//       fetchMembersData();
//       fetchTokens();
//     }
//   }, [clubId]);

//   useEffect(() => {
//     if (fetched && membersFetched) {
//       setLoaderOpen(false);
//     }
//   }, [fetched, membersFetched]);

//   const returnHome = () => {
//     router.back();
//   };

//   const submitVote = () => {
//     setLoaderOpen(true);
//     const payload = {
//       proposalId: pid,
//       votingOptionId: castVoteOption,
//       voterAddress: walletAddress,
//       clubId: clubID,
//     };
//     const voteSubmit = castVote(payload);
//     voteSubmit.then((result) => {
//       if (result.status !== 201) {
//         setVoted(false);
//         setLoaderOpen(false);
//       } else {
//         fetchData();
//         setVoted(true);
//         setLoaderOpen(false);
//       }
//     });
//   };

//   const isOwner = async () => {
//     const safeSdk = await getSafeSdk();
//     const web3 = new Web3(window.web3);
//     const ownerAddresses = await safeSdk.getOwners();
//     const ownerAddressesArray = ownerAddresses.map((value) =>
//       web3.utils.toChecksumAddress(value),
//     );

//     setOwnerAddresses(ownerAddressesArray);
//     if (ownerAddressesArray.includes(walletAddress)) {
//       setOwner(true);
//     } else {
//       setOwner(false);
//     }
//     if (isGovernanceActive === false) {
//       if (ownerAddressesArray.includes(walletAddress)) {
//         setGovernance(true);
//       } else {
//         setGovernance(false);
//       }
//     }
//     const threshold = await safeSdk.getThreshold();
//     setThreshold(threshold);
//     const proposalTxHash = getProposalTxHash(pid);
//     proposalTxHash.then(async (result) => {
//       if (
//         result.status !== 200 ||
//         (result.status === 200 && result.data.length === 0)
//       ) {
//         setTxHash("");
//       } else {
//         // txHash = result.data[0].txHash;
//         setTxHash(result.data[0].txHash);
//         const safeService = await getSafeService();
//         const tx = await safeService.getTransaction(result.data[0].txHash);
//         const ownerAddresses = tx.confirmations.map(
//           (confirmOwners) => confirmOwners.owner,
//         );
//         console.log("ownerAddresses", ownerAddresses);
//         const pendingTxs = await safeService.getPendingTransactions(
//           gnosisAddress,
//         );
//         setPendingTxHash(
//           pendingTxs?.results[pendingTxs.count - 1]?.safeTxHash,
//           result.data[0].txHash,
//         );

//         setSignedOwners(ownerAddresses);
//         if (ownerAddresses.includes(walletAddress)) {
//           setSigned(true);
//         }
//         if (ownerAddresses.length >= threshold) {
//           setExecutionReady(true);
//         }
//       }
//     });
//   };

//   const executeFunction = async (proposalStatus) => {
//     setLoaderOpen(true);
//     if (proposalData[0].commands[0].executionId === 0) {
//       // for airdrop execution
//       const updateProposal = new SmartContract(
//         ImplementationContract,
//         daoAddress,
//         undefined,
//         USDC_CONTRACT_ADDRESS,
//         GNOSIS_TRANSACTION_URL,
//       );
//       console.log(proposalData[0].commands[0].airDropToken);
//       const response = updateProposal.updateProposalAndExecution(
//         daoAddress,
//         gnosisAddress,
//         proposalData[0].cid,
//         proposalStatus,
//         123444,
//         undefined,
//         proposalData[0].commands[0].airDropToken,
//         [1, 0, 0, 0, 0, 0, 0, 0],
//         undefined,
//         undefined,
//         undefined,
//         proposalData[0].commands[0].airDropAmount,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         proposalData[0].commands[0].airDropCarryFee,
//         [],
//         txHash,
//         pid,
//         tokenFetched ? tokenData : "",
//         [
//           "0x0000000000000000000000000000000000000000",
//           "0x0000000000000000000000000000000000000000",
//           0,
//         ],
//         ["0x0000000000000000000000000000000000000000", "0x"],
//       );
//       if (proposalStatus === "executed") {
//         await response.then(
//           (result) => {
//             result.promiEvent.on("confirmation", () => {
//               const updateStatus = patchProposalExecuted(pid);
//               updateStatus.then((result) => {
//                 if (result.status !== 200) {
//                   setExecuted(false);
//                   setOpenSnackBar(true);
//                   setMessage("Airdrop execution status update failed!");
//                   setFailed(true);
//                   setLoaderOpen(false);
//                 } else {
//                   fetchData();
//                   setExecuted(true);
//                   setOpenSnackBar(true);
//                   setMessage("Airdrop execution successful!");
//                   setFailed(false);
//                   setLoaderOpen(false);
//                 }
//               });
//             });
//           },
//           (error) => {
//             setExecuted(false);
//             setOpenSnackBar(true);
//             setMessage("Airdrop execution failed!");
//             setFailed(true);
//             setLoaderOpen(false);
//           },
//         );
//       } else {
//         await response
//           .then(() => {
//             console.log("in response", response);
//             setSigned(true);
//             setLoaderOpen(false);
//           })
//           .catch((err) => {
//             // console.log("in response error", err);
//             setSigned(false);
//             setOpenSnackBar(true);
//             setFailed(true);
//             // err
//             //   ? setMessage(err)
//             //   : err.message
//             //   ? setMessage(message)
//             //   : setMessage("Signature failed!");
//             err.message
//               ? setMessage(err.message)
//               : err
//               ? setMessage(err)
//               : setMessage("Signature failed!");
//             setLoaderOpen(false);
//           });
//       }
//     }

//     if (proposalData[0].commands[0].executionId === 1) {
//       // for mintGT execution
//       const updateProposal = new SmartContract(
//         ImplementationContract,
//         daoAddress,
//         undefined,
//         USDC_CONTRACT_ADDRESS,
//         GNOSIS_TRANSACTION_URL,
//       );
//       const response = updateProposal.updateProposalAndExecution(
//         daoAddress,
//         gnosisAddress,
//         proposalData[0].cid,
//         proposalStatus,
//         123444,
//         undefined,
//         undefined,
//         [0, 1, 0, 0, 0, 0, 0, 0],
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         [proposalData[0].commands[0].mintGTAmounts.toString()],
//         proposalData[0].commands[0].mintGTAddresses,
//         undefined,
//         undefined,
//         undefined,
//         [],
//         txHash,
//         pid,
//         tokenFetched ? tokenData : "",
//         [
//           "0x0000000000000000000000000000000000000000",
//           "0x0000000000000000000000000000000000000000",
//           0,
//         ],
//         ["0x0000000000000000000000000000000000000000", "0x"],
//       );
//       if (proposalStatus === "executed") {
//         response.then(
//           (result) => {
//             result.promiEvent.on("confirmation", () => {
//               const updateStatus = patchProposalExecuted(pid);
//               updateStatus.then((result) => {
//                 if (result.status !== 200) {
//                   setExecuted(false);
//                   setOpenSnackBar(true);
//                   setMessage("MintGT execution status update failed!");
//                   setFailed(true);
//                   setLoaderOpen(false);
//                 } else {
//                   fetchData();
//                   setExecuted(true);
//                   setOpenSnackBar(true);
//                   setMessage("MintGT execution successful!");
//                   setFailed(false);
//                   setLoaderOpen(false);
//                 }
//               });
//             });
//           },
//           (error) => {
//             console.log(error);
//             setExecuted(false);
//             setOpenSnackBar(true);
//             setMessage("MintGT execution failed!");
//             setFailed(true);
//             setLoaderOpen(false);
//           },
//         );
//       } else {
//         await response
//           .then(async (result) => {
//             setSigned(true);
//             setLoaderOpen(false);
//           })
//           .catch((err) => {
//             setSigned(false);
//             setMessage("Signature failed!");
//             setLoaderOpen(false);
//           });
//       }
//     }
//     // comented from before
//     // if (proposalData[0].commands[0].executionId === 2) {
//     //   const web3 = new Web3(window.web3)
//     //   // for assigner executor role execution
//     //   const updateProposal = new SmartContract(ImplementationContract, daoAddress, undefined, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL)
//     //   const response = updateProposal.updateProposalAndExecution(
//     //     daoAddress,
//     //     gnosisAddress,
//     //     proposalData[0].ipfsHash,
//     //     "Executed",
//     //     123444,
//     //     undefined,
//     //     undefined,
//     //     [0, 0, 1, 0, 0, 0, 0, 0],
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     undefined,
//     //     [web3.utils.toChecksumAddress(proposalData[0].commands[0].executiveRoles)],
//     //   )
//     //   response.then((result) => {
//     //     const updateStatus = patchProposalExecuted(pid)
//     //     updateStatus.then((result) => {
//     //       if (result.status !== 200) {
//     //         setExecuted(false)
//     //         setOpenSnackBar(true)
//     //         setMessage("Assigner executor role status update failed!")
//     //         setFailed(true)
//     //         setLoaderOpen(false)
//     //       } else {
//     //         setExecuted(true)
//     //         setOpenSnackBar(true)
//     //         setMessage("Assigner executor role allocation successful!")
//     //         setFailed(false)
//     //         setLoaderOpen(false)
//     //       }
//     //     })
//     //   }, (error) => {
//     //     setExecuted(false)
//     //     setOpenSnackBar(true)
//     //     setMessage("Assigner executor role allocation failed!")
//     //     setFailed(true)
//     //     setLoaderOpen(false)
//     //   })
//     // }
//     //commented from before ends

//     if (proposalData[0].commands[0].executionId === 2) {
//       // For execution of Governance settings
//       const updateProposal = new SmartContract(
//         ImplementationContract,
//         daoAddress,
//         undefined,
//         USDC_CONTRACT_ADDRESS,
//         GNOSIS_TRANSACTION_URL,
//       );
//       const response = updateProposal.updateProposalAndExecution(
//         daoAddress,
//         gnosisAddress,
//         proposalData[0].cid,
//         proposalStatus,
//         123444,
//         undefined,
//         undefined,
//         [0, 0, 1, 0, 0, 0, 0, 0],
//         proposalData[0].commands[0].quorum,
//         proposalData[0].commands[0].threshold,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         [],
//         txHash,
//         pid,
//         tokenFetched ? tokenData : "",
//         [
//           "0x0000000000000000000000000000000000000000",
//           "0x0000000000000000000000000000000000000000",
//           0,
//         ],
//         ["0x0000000000000000000000000000000000000000", "0x"],
//       );
//       if (proposalStatus === "executed") {
//         response.then(
//           (result) => {
//             result.promiEvent.on("confirmation", () => {
//               const updateStatus = patchProposalExecuted(pid);
//               updateStatus.then((result) => {
//                 if (result.status !== 200) {
//                   setExecuted(false);
//                   setOpenSnackBar(true);
//                   setMessage("Governance settings status update failed!");
//                   setFailed(true);
//                   setLoaderOpen(false);
//                 } else {
//                   fetchData();
//                   setExecuted(true);
//                   setOpenSnackBar(true);
//                   setMessage("Governance settings execution successful!");
//                   setFailed(false);
//                   setLoaderOpen(false);
//                 }
//               });
//             });
//           },
//           (error) => {
//             console.log(error);
//             setExecuted(false);
//             setOpenSnackBar(true);
//             setMessage("Governance settings execution failed!");
//             setFailed(true);
//             setLoaderOpen(false);
//           },
//         );
//       } else {
//         await response
//           .then(async (result) => {
//             setSigned(true);
//             setLoaderOpen(false);
//           })
//           .catch((err) => {
//             setSigned(false);
//             setMessage("Signature failed!");
//             setLoaderOpen(false);
//           });
//       }
//     }

//     if (proposalData[0].commands[0].executionId === 3) {
//       // update raise amount execution
//       const updateProposal = new SmartContract(
//         ImplementationContract,
//         daoAddress,
//         undefined,
//         USDC_CONTRACT_ADDRESS,
//         GNOSIS_TRANSACTION_URL,
//       );
//       const response = updateProposal.updateProposalAndExecution(
//         daoAddress,
//         gnosisAddress,
//         proposalData[0].cid,
//         proposalStatus,
//         123444,
//         undefined,
//         undefined,
//         [0, 0, 0, 1, 0, 0, 0, 0],
//         undefined,
//         undefined,
//         proposalData[0].commands[0].totalDeposits,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         [],
//         txHash,
//         pid,
//         tokenFetched ? tokenData : "",
//         [
//           "0x0000000000000000000000000000000000000000",
//           "0x0000000000000000000000000000000000000000",
//           0,
//         ],
//         ["0x0000000000000000000000000000000000000000", "0x"],
//       );

//       if (proposalStatus === "executed") {
//         response.then(
//           (result) => {
//             result.promiEvent.on("confirmation", () => {
//               const updateStatus = patchProposalExecuted(pid);
//               updateStatus.then((result) => {
//                 if (result.status !== 200) {
//                   setExecuted(false);
//                   setOpenSnackBar(true);
//                   setMessage("Raise amount execution status update failed!");
//                   setFailed(true);
//                   setLoaderOpen(false);
//                 } else {
//                   fetchData();
//                   setExecuted(true);
//                   setOpenSnackBar(true);
//                   setMessage("Update raise amount execution successful!");
//                   setFailed(false);
//                   setLoaderOpen(false);
//                 }
//               });
//             });
//           },
//           (error) => {
//             setExecuted(false);
//             setOpenSnackBar(true);
//             setMessage("Update raise amount execution failed!");
//             setFailed(true);
//             setLoaderOpen(false);
//           },
//         );
//       } else {
//         await response
//           .then(async (result) => {
//             await isOwner();
//             setSigned(true);
//             setLoaderOpen(false);
//           })
//           .catch((err) => {
//             setSigned(false);
//             setMessage("Signature failed!");
//             setLoaderOpen(false);
//           });
//       }
//     }

//     if (proposalData[0].commands[0].executionId === 4) {
//       // send custom token execution
//       const updateProposal = new SmartContract(
//         ImplementationContract,
//         daoAddress,
//         undefined,
//         USDC_CONTRACT_ADDRESS,
//         GNOSIS_TRANSACTION_URL,
//       );
//       const response = updateProposal.updateProposalAndExecution(
//         daoAddress,
//         gnosisAddress,
//         proposalData[0].cid,
//         proposalStatus,
//         123444,
//         proposalData[0].commands[0].customToken,
//         undefined,
//         [0, 0, 0, 0, 1, 0, 0, 0],
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         undefined,
//         proposalData[0].commands[0].customTokenAmounts,
//         proposalData[0].commands[0].customTokenAddresses,
//         undefined,
//         [],
//         txHash,
//         pid,
//         tokenFetched ? tokenData : "",
//         [
//           "0x0000000000000000000000000000000000000000",
//           "0x0000000000000000000000000000000000000000",
//           0,
//         ],
//         ["0x0000000000000000000000000000000000000000", "0x"],
//       );

//       if (proposalStatus === "executed") {
//         response.then(
//           (result) => {
//             result.promiEvent.on("confirmation", () => {
//               const updateStatus = patchProposalExecuted(pid);
//               updateStatus.then((result) => {
//                 if (result.status !== 200) {
//                   setExecuted(false);
//                   setOpenSnackBar(true);
//                   setMessage(
//                     "Send custom token execution status update failed!",
//                   );
//                   setFailed(true);
//                   setLoaderOpen(false);
//                 } else {
//                   fetchData();
//                   setExecuted(true);
//                   setOpenSnackBar(true);
//                   setMessage("Send custom token execution successful!");
//                   setFailed(false);
//                   setLoaderOpen(false);
//                 }
//               });
//             });
//           },
//           (error) => {
//             setExecuted(false);
//             setOpenSnackBar(true);
//             setMessage("Send custom token execution status update failed!");
//             setFailed(true);
//             setLoaderOpen(false);
//           },
//         );
//       } else {
//         await response
//           .then((result) => {
//             setSigned(true);
//             setLoaderOpen(false);
//           })
//           .catch((err) => {
//             setSigned(false);
//             setOpenSnackBar(true);
//             setFailed(true);
//             // err
//             //   ? setMessage(err)
//             //   : err.message
//             //   ? setMessage(message)
//             //   : setMessage("Signature failed!");
//             err.message
//               ? setMessage(err.message)
//               : err
//               ? setMessage(err)
//               : setMessage("Signature failed!");
//             setLoaderOpen(false);
//           });
//       }
//     }
//   };

//   const checkUserVoted = (pid) => {
//     if (walletAddress) {
//       console.log(walletAddress);
//       const web3 = new Web3(window.web3);
//       let userAddress = walletAddress;
//       userAddress = web3.utils.toChecksumAddress(userAddress);
//       let obj = proposalData[0].vote.find(
//         (voteCasted) => voteCasted.voterAddress === userAddress.toLowerCase(),
//       );
//       return proposalData[0].vote.indexOf(obj) >= 0;
//     }
//   };

//   const fetchUserVoteText = (pid) => {
//     if (walletAddress) {
//       let obj = proposalData[0].vote.find(
//         (voteCasted) => voteCasted.voterAddress === walletAddress,
//       );
//       return proposalData[0].vote.indexOf(obj) >= 0;
//     }
//   };

//   const handleShowMore = () => {
//     router.push("/dashboard", undefined, { shallow: true });
//   };

//   const handleSnackBarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpenSnackBar(false);
//   };

//   return (
//     <>
//       <Layout1 page={2}>
//         <Grid container spacing={6} paddingLeft={10} paddingTop={10}>
//           <Grid item md={8.5}>
//             <Grid container spacing={1} onClick={returnHome}>
//               <Grid item mt={0.5} sx={{ "&:hover": { cursor: "pointer" } }}>
//                 <KeyboardBackspaceIcon className={classes.listFont} />
//               </Grid>
//               <Grid item sx={{ "&:hover": { cursor: "pointer" } }} mb={2}>
//                 <Typography className={classes.listFont}>
//                   Back to workstation
//                 </Typography>
//               </Grid>
//             </Grid>
//             <Grid container mb={2}>
//               <Grid item>
//                 <Typography className={classes.clubAssets}>
//                   {fetched ? proposalData[0].name : null}
//                 </Typography>
//               </Grid>
//             </Grid>
//             <Grid container direction="row" spacing={4}>
//               <Grid item>
//                 <Grid container spacing={2}>
//                   <Grid item>
//                     <Chip
//                       className={classes.timeLeftChip}
//                       label={
//                         <Grid container>
//                           <Image src={tickerIcon} alt="ticker-icon" />
//                           <Typography ml={1}>
//                             {" "}
//                             {calculateDays(proposalData[0]?.votingDuration) <= 0
//                               ? "Voting closed"
//                               : calculateDays(proposalData[0]?.votingDuration) +
//                                 " days left"}
//                           </Typography>
//                         </Grid>
//                       }
//                     />
//                   </Grid>
//                   <Grid item>
//                     <Chip
//                       className={
//                         proposalData[0]?.type === "action"
//                           ? classes.actionChip
//                           : classes.surveyChip
//                       }
//                       label={
//                         <Grid container>
//                           {proposalData[0]?.type === "action" ? (
//                             <Image src={actionIcon} alt="action-icon" />
//                           ) : (
//                             <Image src={surveyIcon} alt="survey-icon" />
//                           )}
//                           <Typography ml={1}>
//                             {proposalData[0]?.type}
//                           </Typography>
//                         </Grid>
//                       }
//                     />
//                   </Grid>
//                   <Grid item>
//                     {" "}
//                     <Chip
//                       className={
//                         proposalData[0]?.status === "active"
//                           ? classes.cardFontActive
//                           : proposalData[0]?.status === "passed"
//                           ? classes.cardFontPassed
//                           : proposalData[0]?.status === "executed"
//                           ? classes.cardFontExecuted
//                           : proposalData[0]?.status === "failed"
//                           ? classes.cardFontFailed
//                           : classes.cardFontFailed
//                       }
//                       label={
//                         proposalData[0]?.status.charAt(0).toUpperCase() +
//                         proposalData[0]?.status.slice(1)
//                       }
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid container mt={4} mb={3} spacing={2}>
//               <Grid item md={9}>
//                 {fetched && (
//                   <>
//                     {proposalData[0].commands.length ? (
//                       <Card>
//                         {/* <Grid container item>
//                             <Typography className={classes.listFont2}>
//                               Actions
//                             </Typography>
//                             <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
//                           </Grid> */}

//                         <>
//                           {proposalData[0].commands[0].executionId == 0 ? (
//                             <>
//                               <Grid container item mb={1}>
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   Distribute tokens to a wallet
//                                 </Typography>
//                               </Grid>
//                               <Divider />
//                               <Grid container mt={1}>
//                                 <Grid container spacing={3}>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Token
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {
//                                         proposalData[0].commands[0]
//                                           .usdcTokenSymbol
//                                       }
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Amount
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0]
//                                             .airDropAmount /
//                                           Math.pow(
//                                             10,
//                                             parseInt(
//                                               proposalData[0].commands[0]
//                                                 .usdcTokenDecimal,
//                                             ),
//                                           )
//                                         : null}
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Carry fee
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0]
//                                             .airDropCarryFee
//                                         : null}
//                                       %
//                                     </Typography>
//                                   </Grid>
//                                 </Grid>
//                               </Grid>
//                             </>
//                           ) : proposalData[0].commands[0].executionId == 1 ? (
//                             <>
//                               <Grid container item>
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   Mint governance tokens to a wallet
//                                 </Typography>
//                               </Grid>
//                               <Grid container>
//                                 <Grid item>
//                                   <Typography className={classes.listFont2}>
//                                     Amount
//                                   </Typography>
//                                 </Grid>
//                                 <Grid
//                                   item
//                                   xs
//                                   sx={{
//                                     display: "flex",
//                                     justifyContent: "flex-end",
//                                   }}
//                                 >
//                                   <Typography
//                                     className={classes.listFont2Colourless}
//                                   >
//                                     {fetched
//                                       ? proposalData[0].commands[0]
//                                           .mintGTAmounts[0] /
//                                         Math.pow(
//                                           10,
//                                           parseInt(
//                                             proposalData[0].commands[0]
//                                               .usdcGovernanceTokenDecimal,
//                                           ),
//                                         )
//                                       : null}
//                                   </Typography>
//                                 </Grid>
//                               </Grid>
//                               <Grid container>
//                                 <Grid item>
//                                   <Typography className={classes.listFont2}>
//                                     Recipient
//                                   </Typography>
//                                 </Grid>
//                                 <Grid
//                                   item
//                                   xs
//                                   sx={{
//                                     display: "flex",
//                                     justifyContent: "flex-end",
//                                   }}
//                                 >
//                                   <Typography
//                                     className={classes.listFont2Colourless}
//                                   >
//                                     {fetched
//                                       ? proposalData[0].commands[0]
//                                           .mintGTAddresses[0]
//                                       : null}
//                                   </Typography>
//                                 </Grid>
//                               </Grid>
//                             </>
//                           ) : proposalData[0].commands[0].executionId == 2 ? (
//                             <>
//                               <Grid container item mb={1}>
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   Update governance settings of the club
//                                 </Typography>
//                               </Grid>
//                               <Divider />
//                               <Grid container mt={1}>
//                                 <Grid container spacing={3}>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Quoram
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0].quorum
//                                         : null}
//                                       %
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Threshold
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0].threshold
//                                         : null}
//                                       %
//                                     </Typography>
//                                   </Grid>
//                                 </Grid>
//                               </Grid>
//                             </>
//                           ) : proposalData[0].commands[0].executionId == 3 ? (
//                             <>
//                               <Grid container item mb={1}>
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   Update total raise amount
//                                 </Typography>
//                               </Grid>
//                               <Divider />
//                               <Grid container mt={1}>
//                                 <Grid container spacing={3}>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Total amount
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0]
//                                             .totalDeposits /
//                                           Math.pow(
//                                             10,
//                                             parseInt(
//                                               proposalData[0].commands[0]
//                                                 .usdcTokenDecimal,
//                                             ),
//                                           )
//                                         : null}{" "}
//                                       {
//                                         proposalData[0].commands[0]
//                                           .usdcTokenSymbol
//                                       }
//                                     </Typography>
//                                   </Grid>
//                                 </Grid>
//                               </Grid>
//                             </>
//                           ) : proposalData[0].commands[0].executionId == 4 ? (
//                             <>
//                               <Grid container item mb={1}>
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   Transfer token to a wallet
//                                 </Typography>
//                               </Grid>
//                               <Divider />
//                               <Grid container mt={1}>
//                                 <Grid container spacing={3}>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Amount
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0]
//                                             .customTokenAmounts[0] /
//                                           Math.pow(
//                                             10,
//                                             parseInt(
//                                               proposalData[0].commands[0]
//                                                 .usdcTokenDecimal,
//                                             ),
//                                           )
//                                         : null}{" "}
//                                       {
//                                         proposalData[0].commands[0]
//                                           .usdcTokenSymbol
//                                       }
//                                     </Typography>
//                                   </Grid>
//                                   <Grid item xs={12} md={4}>
//                                     <Typography className={classes.listFont2}>
//                                       Recipient
//                                     </Typography>
//                                     <Typography
//                                       className={classes.listFont2Colourless}
//                                     >
//                                       {fetched
//                                         ? proposalData[0].commands[0].customTokenAddresses[0].slice(
//                                             0,
//                                             6,
//                                           ) +
//                                           "...." +
//                                           proposalData[0].commands[0].customTokenAddresses[0].slice(
//                                             proposalData[0].commands[0]
//                                               .customTokenAddresses[0].length -
//                                               4,
//                                           )
//                                         : null}
//                                     </Typography>
//                                   </Grid>
//                                 </Grid>
//                               </Grid>
//                             </>
//                           ) : null}
//                         </>

//                         {/*<Divider sx={{ marginTop: 2, marginBottom: 3 }} />*/}
//                       </Card>
//                     ) : null}
//                   </>
//                 )}
//               </Grid>
//               <Grid item md={3}>
//                 <Card>
//                   <Grid container item>
//                     <Typography className={classes.listFont2}>
//                       Signators
//                     </Typography>
//                     <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
//                   </Grid>
//                   {ownerAddresses.map((owner) => (
//                     <Grid
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-start",
//                       }}
//                       key={owner}
//                     >
//                       {signedOwners.includes(owner) ? (
//                         <DoneIcon
//                           fill="blue"
//                           sx={{ marginRight: 2, color: "#3B7AFD" }}
//                         />
//                       ) : (
//                         <HelpOutlineIcon sx={{ marginRight: 2 }} />
//                       )}
//                       <Typography>
//                         {owner.slice(0, 6)}.....{owner.slice(-4)}
//                       </Typography>
//                     </Grid>
//                   ))}
//                 </Card>
//               </Grid>
//             </Grid>
//             <Grid container item className={classes.listFont}>
//               {fetched ? (
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: ReactHtmlParser(proposalData[0].description),
//                   }}
//                 >
//                   {/* {console.log(ReactHtmlParser(proposalData[0].description))}
//                   {ReactHtmlParser(proposalData[0].description)} */}
//                 </div>
//               ) : null}
//             </Grid>
//             {governance ? (
//               <>
//                 {" "}
//                 <Grid container mt={6}>
//                   <Grid item md={12}>
//                     {fetched ? (
//                       proposalData[0].type === "action" ? (
//                         proposalData[0].status === "active" ? (
//                           checkUserVoted(pid) ? (
//                             <Card sx={{ width: "100%" }}>
//                               <Grid
//                                 container
//                                 direction="column"
//                                 justifyContent="center"
//                                 alignItems="center"
//                                 mt={10}
//                                 mb={10}
//                               >
//                                 <Grid item mt={0.5}>
//                                   <CheckCircleRoundedIcon
//                                     className={classes.mainCardButtonSuccess}
//                                   />
//                                 </Grid>
//                                 <Grid item mt={0.5}>
//                                   <Typography
//                                     className={classes.successfulMessageText}
//                                   >
//                                     Successfully voted
//                                   </Typography>
//                                 </Grid>
//                                 <Grid item mt={0.5}>
//                                   <Typography className={classes.listFont2}>
//                                     {/* Voted for */}
//                                   </Typography>
//                                 </Grid>
//                               </Grid>
//                             </Card>
//                           ) : (
//                             <Card>
//                               <Typography className={classes.cardFont1}>
//                                 Cast your vote
//                               </Typography>
//                               <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
//                               <Stack spacing={2}>
//                                 {proposalData[0].votingOptions.map(
//                                   (data, key) => {
//                                     return (
//                                       <CardActionArea
//                                         className={classes.mainCard}
//                                         key={key}
//                                         disabled={voted}
//                                       >
//                                         <Card
//                                           className={
//                                             cardSelected == key
//                                               ? classes.mainCardSelected
//                                               : classes.mainCard
//                                           }
//                                           onClick={(e) => {
//                                             setCastVoteOption(
//                                               data.votingOptionId,
//                                             );
//                                             setCardSelected(key);
//                                           }}
//                                         >
//                                           <Grid
//                                             container
//                                             item
//                                             justifyContent="center"
//                                             alignItems="center"
//                                           >
//                                             <Typography
//                                               className={classes.cardFont1}
//                                             >
//                                               {data.text}{" "}
//                                             </Typography>
//                                           </Grid>
//                                         </Card>
//                                       </CardActionArea>
//                                     );
//                                   },
//                                 )}
//                                 <CardActionArea
//                                   className={classes.mainCard}
//                                   disabled={voted}
//                                 >
//                                   <Card
//                                     className={
//                                       voted
//                                         ? classes.mainCardButtonSuccess
//                                         : classes.mainCardButton
//                                     }
//                                     onClick={!voted ? submitVote : null}
//                                   >
//                                     <Grid
//                                       container
//                                       justifyContent="center"
//                                       alignItems="center"
//                                     >
//                                       {voted ? (
//                                         <Grid item>
//                                           <CheckCircleRoundedIcon />
//                                         </Grid>
//                                       ) : (
//                                         <Grid item></Grid>
//                                       )}
//                                       <Grid item>
//                                         {voted ? (
//                                           <Typography
//                                             className={classes.cardFont1}
//                                             mt={0.5}
//                                           >
//                                             Successfully voted
//                                           </Typography>
//                                         ) : (
//                                           <Typography
//                                             className={classes.cardFont1}
//                                           >
//                                             Vote now
//                                           </Typography>
//                                         )}
//                                       </Grid>
//                                     </Grid>
//                                   </Card>
//                                 </CardActionArea>
//                               </Stack>
//                             </Card>
//                           )
//                         ) : proposalData[0].status === "passed" ? (
//                           owner ? (
//                             <Card>
//                               <Card
//                                 className={
//                                   executed
//                                     ? classes.mainCardButtonSuccess
//                                     : classes.mainCardButton
//                                 }
//                                 onClick={
//                                   executionReady
//                                     ? pendingTxHash === txHash
//                                       ? () => {
//                                           executeFunction("executed");
//                                         }
//                                       : () => {
//                                           console.log("rrrrrrrrrrr");
//                                           setOpenSnackBar(true);
//                                           setFailed(true);
//                                           setMessage(
//                                             "execute txns with smaller nonce first",
//                                           );
//                                         }
//                                     : () => {
//                                         executeFunction("passed");
//                                       }
//                                 }
//                               >
//                                 <Grid
//                                   container
//                                   justifyContent="center"
//                                   alignItems="center"
//                                 >
//                                   {signed && !executionReady ? (
//                                     <Grid item mt={0.5}>
//                                       <CheckCircleRoundedIcon />
//                                     </Grid>
//                                   ) : (
//                                     <Grid item></Grid>
//                                   )}

//                                   {executed ? (
//                                     <Grid item>
//                                       <Typography className={classes.cardFont1}>
//                                         Executed Successfully
//                                       </Typography>
//                                     </Grid>
//                                   ) : null}
//                                   {executionReady ? (
//                                     <Grid item>
//                                       <Typography className={classes.cardFont1}>
//                                         Execute Now
//                                       </Typography>
//                                     </Grid>
//                                   ) : null}
//                                   <Grid item>
//                                     {signed && !executionReady && !executed ? (
//                                       <Grid item>
//                                         <Typography
//                                           className={classes.cardFont1}
//                                         >
//                                           {signed
//                                             ? "Signed Succesfully"
//                                             : "Sign Now"}
//                                         </Typography>
//                                       </Grid>
//                                     ) : null}
//                                     {!signed && !executionReady && !executed ? (
//                                       <Grid item>
//                                         <Typography
//                                           className={classes.cardFont1}
//                                         >
//                                           {signed
//                                             ? "Signed Succesfully"
//                                             : "Sign Now"}
//                                         </Typography>
//                                       </Grid>
//                                     ) : null}
//                                     {/* {txHash ? (
//                                       <Typography className={classes.cardFont1}>
//                                         {signed
//                                           ? "Signed Succesfully"
//                                           : "Sign Now"}

//                                       </Typography>
//                                     ) : (
//                                       <Typography className={classes.cardFont1}>
//                                         {signed
//                                           ? "Signed Succesfully"
//                                           : "Sign Now"}
//                                       </Typography>
//                                     )} */}
//                                   </Grid>
//                                 </Grid>
//                               </Card>
//                             </Card>
//                           ) : (
//                             <Card sx={{ width: "100%" }}>
//                               <Grid
//                                 container
//                                 direction="column"
//                                 justifyContent="center"
//                                 alignItems="center"
//                                 mt={10}
//                                 mb={10}
//                               >
//                                 <Grid item mt={0.5}>
//                                   <CheckCircleRoundedIcon
//                                     className={classes.mainCardButtonSuccess}
//                                   />
//                                 </Grid>
//                                 <Grid item mt={0.5}>
//                                   <Typography
//                                     className={classes.successfulMessageText}
//                                   >
//                                     Proposal needs to be executed by Admin
//                                   </Typography>
//                                 </Grid>
//                                 <Grid item mt={0.5}>
//                                   <Typography className={classes.listFont2}>
//                                     {/* Voted for */}
//                                   </Typography>
//                                 </Grid>
//                               </Grid>
//                             </Card>
//                           )
//                         ) : proposalData[0].status === "failed" ? (
//                           <Card sx={{ width: "100%" }}>
//                             <Grid
//                               container
//                               direction="column"
//                               justifyContent="center"
//                               alignItems="center"
//                               mt={10}
//                               mb={10}
//                             >
//                               <Grid item mt={0.5}>
//                                 <CloseIcon
//                                   className={classes.mainCardButtonError}
//                                 />
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography
//                                   className={classes.successfulMessageText}
//                                 >
//                                   Execution Failed
//                                 </Typography>
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography className={classes.listFont2}>
//                                   {/* Voted for */}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                           </Card>
//                         ) : proposalData[0].status === "executed" ? (
//                           <Card sx={{ width: "100%" }}>
//                             <Grid
//                               container
//                               direction="column"
//                               justifyContent="center"
//                               alignItems="center"
//                               mt={10}
//                               mb={10}
//                             >
//                               <Grid item mt={0.5}>
//                                 <CheckCircleRoundedIcon
//                                   className={classes.mainCardButtonSuccess}
//                                 />
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography
//                                   className={classes.successfulMessageText}
//                                 >
//                                   Successfully Executed
//                                 </Typography>
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography className={classes.listFont2}>
//                                   {/* Voted for */}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                           </Card>
//                         ) : null
//                       ) : proposalData[0].type === "survey" ? (
//                         proposalData[0].status === "active" ? (
//                           checkUserVoted(pid) ? (
//                             <Card sx={{ width: "100%" }}>
//                               <Grid
//                                 container
//                                 direction="column"
//                                 justifyContent="center"
//                                 alignItems="center"
//                                 mt={10}
//                                 mb={10}
//                               >
//                                 <Grid item mt={0.5}>
//                                   <CheckCircleRoundedIcon
//                                     className={classes.mainCardButtonSuccess}
//                                   />
//                                 </Grid>
//                                 <Grid item mt={0.5}>
//                                   <Typography
//                                     className={classes.successfulMessageText}
//                                   >
//                                     Successfully voted
//                                   </Typography>
//                                 </Grid>
//                                 <Grid item mt={0.5}>
//                                   <Typography className={classes.listFont2}>
//                                     {/* Voted for */}
//                                   </Typography>
//                                 </Grid>
//                               </Grid>
//                             </Card>
//                           ) : (
//                             <Card>
//                               <Typography className={classes.cardFont1}>
//                                 Cast your vote
//                               </Typography>
//                               <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
//                               <Stack spacing={2}>
//                                 {fetched
//                                   ? proposalData[0].votingOptions.map(
//                                       (data, key) => {
//                                         return (
//                                           <CardActionArea
//                                             className={classes.mainCard}
//                                             key={key}
//                                             disabled={voted}
//                                           >
//                                             <Card
//                                               className={
//                                                 cardSelected == key
//                                                   ? classes.mainCardSelected
//                                                   : classes.mainCard
//                                               }
//                                               onClick={(e) => {
//                                                 setCastVoteOption(
//                                                   data.votingOptionId,
//                                                 );
//                                                 setCardSelected(key);
//                                               }}
//                                             >
//                                               <Grid
//                                                 container
//                                                 item
//                                                 justifyContent="center"
//                                                 alignItems="center"
//                                               >
//                                                 <Typography
//                                                   className={classes.cardFont1}
//                                                 >
//                                                   {data.text}{" "}
//                                                 </Typography>
//                                               </Grid>
//                                             </Card>
//                                           </CardActionArea>
//                                         );
//                                       },
//                                     )
//                                   : null}
//                                 <CardActionArea
//                                   className={classes.mainCard}
//                                   disabled={voted}
//                                 >
//                                   <Card
//                                     className={
//                                       voted
//                                         ? classes.mainCardButtonSuccess
//                                         : classes.mainCardButton
//                                     }
//                                     onClick={submitVote}
//                                   >
//                                     <Grid
//                                       container
//                                       justifyContent="center"
//                                       alignItems="center"
//                                     >
//                                       {voted ? (
//                                         <Grid item mt={0.5}>
//                                           <CheckCircleRoundedIcon />
//                                         </Grid>
//                                       ) : (
//                                         <Grid item></Grid>
//                                       )}
//                                       <Grid item>
//                                         {voted ? (
//                                           <Typography
//                                             className={classes.cardFont1}
//                                           >
//                                             Successfully voted
//                                           </Typography>
//                                         ) : (
//                                           <Typography
//                                             className={classes.cardFont1}
//                                           >
//                                             Vote now
//                                           </Typography>
//                                         )}
//                                       </Grid>
//                                     </Grid>
//                                   </Card>
//                                 </CardActionArea>
//                               </Stack>
//                             </Card>
//                           )
//                         ) : proposalData[0].status === "failed" ? (
//                           <Card sx={{ width: "100%" }}>
//                             <Grid
//                               container
//                               direction="column"
//                               justifyContent="center"
//                               alignItems="center"
//                               mt={10}
//                               mb={10}
//                             >
//                               <Grid item mt={0.5}>
//                                 <CloseIcon
//                                   className={classes.mainCardButtonError}
//                                 />
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography
//                                   className={classes.successfulMessageText}
//                                 >
//                                   Voting Closed
//                                 </Typography>
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography className={classes.listFont2}>
//                                   {/* Voted for */}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                           </Card>
//                         ) : proposalData[0].status === "closed" ? (
//                           <Card sx={{ width: "100%" }}>
//                             <Grid
//                               container
//                               direction="column"
//                               justifyContent="center"
//                               alignItems="center"
//                               mt={10}
//                               mb={10}
//                             >
//                               <Grid item mt={0.5}>
//                                 <CloseIcon
//                                   className={classes.mainCardButtonError}
//                                 />
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography
//                                   className={classes.successfulMessageText}
//                                 >
//                                   Voting Closed
//                                 </Typography>
//                               </Grid>
//                               <Grid item mt={0.5}>
//                                 <Typography className={classes.listFont2}>
//                                   {/* Voted for */}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                           </Card>
//                         ) : null
//                       ) : null
//                     ) : null}
//                   </Grid>
//                 </Grid>
//               </>
//             ) : null}
//           </Grid>
//           <Grid item md={3.5}>
//             <Stack spacing={3}>
//               <Card>
//                 <Grid container>
//                   <Grid item>
//                     <Typography className={classes.listFont2}>
//                       Proposed by
//                     </Typography>
//                   </Grid>
//                   <Grid
//                     item
//                     xs
//                     sx={{ display: "flex", justifyContent: "flex-end" }}
//                   >
//                     <Typography className={classes.listFont2Colourless}>
//                       {fetched
//                         ? proposalData[0].createdBy.substring(0, 6) +
//                           ".........." +
//                           proposalData[0].createdBy.substring(
//                             proposalData[0].createdBy.length - 4,
//                           )
//                         : null}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid container>
//                   <Grid item>
//                     <Typography className={classes.listFont2}>
//                       Voting system
//                     </Typography>
//                   </Grid>
//                   <Grid
//                     item
//                     xs
//                     sx={{ display: "flex", justifyContent: "flex-end" }}
//                   >
//                     <Typography className={classes.listFont2Colourless}>
//                       Single choice
//                     </Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid container>
//                   <Grid item>
//                     <Typography className={classes.listFont2}>
//                       Start date
//                     </Typography>
//                   </Grid>
//                   <Grid
//                     item
//                     xs
//                     sx={{ display: "flex", justifyContent: "flex-end" }}
//                   >
//                     <Typography className={classes.listFont2Colourless}>
//                       {fetched
//                         ? new Date(
//                             String(proposalData[0].updateDate),
//                           ).toLocaleDateString()
//                         : null}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//                 <Grid container>
//                   <Grid item>
//                     <Typography className={classes.listFont2}>
//                       End date
//                     </Typography>
//                   </Grid>
//                   <Grid
//                     item
//                     xs
//                     sx={{ display: "flex", justifyContent: "flex-end" }}
//                   >
//                     <Typography className={classes.listFont2Colourless}>
//                       {fetched
//                         ? new Date(
//                             String(proposalData[0].votingDuration),
//                           ).toLocaleDateString()
//                         : null}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Card>
//               <Card>
//                 <Grid container item mb={2}>
//                   <Typography className={classes.listFont}>
//                     Current results
//                   </Typography>
//                 </Grid>
//                 {fetched ? (
//                   proposalData[0].votingOptions.length > 0 ? (
//                     proposalData[0].votingOptions.map((vote, key) => {
//                       return (
//                         <Grid key={key} sx={{ marginBottom: "10px" }}>
//                           <Grid container>
//                             <Grid item sx={{ display: "flex" }}>
//                               <Typography className={classes.listFont2}>
//                                 {vote.text}
//                               </Typography>
//                               <Typography
//                                 sx={{
//                                   background: "#6475A3",
//                                   paddingX: "10px",
//                                   marginBottom: "5px",
//                                   borderRadius: "5px",
//                                 }}
//                                 mx={1}
//                                 variant="subtitle2"
//                               >
//                                 {vote.count}
//                               </Typography>
//                             </Grid>
//                             <Grid
//                               item
//                               xs
//                               sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                               }}
//                             >
//                               <Typography
//                                 className={classes.listFont2Colourless}
//                               >
//                                 {vote.count > 0
//                                   ? calculateVotePercentage(vote.count)
//                                   : 0}
//                                 %
//                               </Typography>
//                             </Grid>
//                           </Grid>
//                           <ProgressBar
//                             value={
//                               vote.count > 0
//                                 ? calculateVotePercentage(vote.count)
//                                 : 0
//                             }
//                           />
//                         </Grid>
//                       );
//                     })
//                   ) : (
//                     <Typography className={classes.listFont2Colourless}>
//                       No previous results available
//                     </Typography>
//                   )
//                 ) : null}
//               </Card>
//               <Card>
//                 <Grid container item mb={2}>
//                   <Typography className={classes.listFont}>Votes</Typography>
//                 </Grid>
//                 {fetched ? (
//                   proposalData[0].vote.length > 0 ? (
//                     proposalData[0].vote.map((voter, key) => {
//                       if (key < 3) {
//                         return (
//                           <div key={key}>
//                             <Grid container>
//                               <Grid item>
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   {voter.voterAddress.substring(0, 6) +
//                                     "......" +
//                                     voter.voterAddress.substring(
//                                       voter.voterAddress.length - 4,
//                                     )}
//                                 </Typography>
//                               </Grid>
//                               <Grid
//                                 item
//                                 xs
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "flex-end",
//                                 }}
//                               >
//                                 <Typography
//                                   className={classes.listFont2Colourless}
//                                 >
//                                   {fetched
//                                     ? proposalData[0].votingOptions[
//                                         parseInt(
//                                           fetchVotingOptionChoice(
//                                             voter.votingOptionId,
//                                           ),
//                                         )
//                                       ].text
//                                     : null}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                             <Grid container>
//                               {/* <Grid item>
//                                 <Typography className={classes.listFont2small}>
//                                   10,000 $DEMO
//                                 </Typography>
//                               </Grid> */}
//                               <Grid
//                                 item
//                                 xs
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "flex-end",
//                                 }}
//                               >
//                                 <Typography variant="proposalSubHeading">
//                                   Signed on{" "}
//                                   {new Date(
//                                     voter.createdAt,
//                                   ).toLocaleDateString()}
//                                 </Typography>
//                               </Grid>
//                             </Grid>
//                             <br />
//                           </div>
//                         );
//                       }
//                     })
//                   ) : (
//                     <Typography className={classes.listFont2Colourless}>
//                       No previous votes available
//                     </Typography>
//                   )
//                 ) : null}
//                 {fetched && proposalData[0].length >= 0 ? (
//                   <Grid container>
//                     <Grid item md={12}>
//                       <Button
//                         sx={{ width: "100%" }}
//                         variant="transparentWhite"
//                         onClick={() => handleShowMore()}
//                       >
//                         More
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 ) : null}
//               </Card>
//             </Stack>
//           </Grid>
//         </Grid>
//         <Snackbar
//           open={openSnackBar}
//           autoHideDuration={6000}
//           onClose={handleSnackBarClose}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         >
//           {!failed ? (
//             <Alert
//               onClose={handleSnackBarClose}
//               severity="success"
//               sx={{ width: "100%" }}
//             >
//               {message}
//             </Alert>
//           ) : (
//             <Alert
//               onClose={handleSnackBarClose}
//               severity="error"
//               sx={{ width: "100%" }}
//             >
//               {message}
//             </Alert>
//           )}
//         </Snackbar>
//         <Backdrop
//           sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//           open={loaderOpen}
//         >
//           <CircularProgress color="inherit" />
//         </Backdrop>
//       </Layout1>
//     </>
//   );
// };

// export default ClubFetch(ProposalDetail);

import React from "react";

const ProposalDetail = () => {
  return <div>const ProposalDetail </div>;
};

export default ProposalDetail;
