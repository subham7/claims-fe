import { React, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import Layout1 from "../../../../src/components/layouts/layout1";
import {
  Box,
  Card,
  Grid,
  Typography,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Button,
  IconButton,
  Modal,
  Select,
  OutlinedInput,
  MenuItem,
  TextareaAutosize,
  Chip,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  CardActionArea,
  CircularProgress,
  Backdrop,
  Link,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { fontStyle } from "@mui/system";
import SimpleSelectButton from "../../../../src/components/simpleSelectButton";
import {
  proposalType,
  commandTypeList,
  proposalDisplayOptions,
} from "../../../../src/data/dashboard";
import { getAssets } from "../../../../src/api/assets";
import {
  createProposal,
  getProposal,
  getProposalTxHash,
} from "../../../../src/api/proposal";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { useRouter, withRouter } from "next/router";
import USDCContract from "../../../../src/abis/usdcTokenContract.json";
import ImplementationContract from "../../../../src/abis/implementationABI.json";
import ClubFetch from "../../../../src/utils/clubFetch";
import Web3Adapter from "@safe-global/safe-web3-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import {
  calculateDays,
  convertToWei,
  convertToWeiGovernance,
} from "../../../../src/utils/globalFunctions";
import proposalImg from "../../../../public/assets/images/proposals.png";
import ProposalCard from "./ProposalCard";
import Safe from "@safe-global/safe-core-sdk";
import { setGovernanceAllowed } from "../../../../src/redux/reducers/gnosis";
import { fetchClubbyDaoAddress } from "../../../../src/api/club";

import dynamic from "next/dynamic";

const QuillEditor = dynamic(
  () => {
    return import("../../../../src/components/quillEditor");
  },
  { ssr: false },
);
import "react-quill/dist/quill.snow.css";
import ReactHtmlParser from "react-html-parser";
import { SmartContract } from "../../../../src/api/contract";
import { useConnectWallet } from "@web3-onboard/react";
// import QuillEditor from "../../../../src/components/quillEditor";

const useStyles = makeStyles({
  proposalInfoCard: {
    background: proposalImg,
    backgroundColor: "#C9CBFF",
  },
  proposalImg: {
    position: "relative",
  },
  clubAssets: {
    fontFamily: "Whyte",
    fontSize: "48px",
    color: "#FFFFFF",
  },
  addButton: {
    width: "11vw",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
  },
  addButton2: {
    width: "242px",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
    fontSize: "22px",
    fontFamily: "Whyte",
  },
  searchField: {
    "width": "28.5vw",
    "height": "55px",
    "color": "#C1D3FF",
    "background": "#111D38 0% 0% no-repeat padding-box",
    "border": "1px solid #C1D3FF40",
    "borderRadius": "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  allIllustration: {
    width: "12px",
    height: "12px",
    marginRight: "15px",
    backgroundColor: "#3B7AFD",
    borderRadius: "50%",
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
    fontSize: "22px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardFont1: {
    fontSize: "24px",
    color: "#EFEFEF",
    fontFamily: "Whyte",
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
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  cardDropDown: {
    width: "340px",
  },
  cardTextBox: {
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  proposalCard: {
    backgroundColor: "#142243",
    padding: 0,
    margin: 0,
  },
  mainCard: {
    borderRadius: "10px",
    border: "1px solid #C1D3FF40",
    backgroundColor: "#142243",
  },
  daysFont: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#FFFFFF",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#111D38",
    width: "90%",
  },
  banner: {
    width: "100%",
  },
});

const Proposal = () => {
  const router = useRouter();
  const { clubId, create_proposal } = router.query;
  const classes = useStyles();
  const daoAddress = useSelector((state) => {
    return state.create.daoAddress;
  });
  const clubID = clubId;
  const tresuryAddress = useSelector((state) => {
    return state.create.tresuryAddress;
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState([]);
  const [duration, setDuration] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const [minDate, setMinDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState();
  const [type, setType] = useState(proposalType[0].type);
  const [openCard, setOpenCard] = useState(false);
  const [commandList, setCommandList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [failed, setFailed] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [proposalData, setProposalData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [customTokenAddresses, setCustomTokenAddresses] = useState([]);
  const [customTokenAmounts, setCustomTokenAmounts] = useState([]);
  const [customToken, setCustomToken] = useState("");
  const [quorumValue, setQuorumValue] = useState(0);
  const [thresholdValue, setThresholdValue] = useState(0);
  const [searchProposal, setSearchProposal] = useState("");
  const [airDropAmount, setAirDropAmount] = useState(0);
  const [airDropToken, setAirDropToken] = useState("");
  const [airDropTokenValue, setAirDropTokenValue] = useState("");
  const [airDropCarryFee, setAirDropCarryFee] = useState(0);
  const [executiveRoles, setExecutiveRoles] = useState([]);
  const [mintGtAddress, setMintGtAddress] = useState([]);
  const [mintGTAmounts, setMintGtAmount] = useState([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [sendEthAddresses, setSendEthAddresses] = useState([]);
  const [sendEthAmounts, setSendEthAmounts] = useState([]);
  const [surveyOption, setSurveyOption] = useState([]);
  const [surveyValue, setSurveyValue] = useState("");
  const [tokenData, setTokenData] = useState([]);
  const [tokenFetched, setTokenFetched] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [selectedListItem, setSelectedListItem] = useState("");
  const [enableSubmitButton, setEnableSubmitButton] = useState(false);
  const [count, setCount] = useState(0);
  const [executionTransaction, setExecutionTransaction] = useState();
  const [tokenType, setTokenType] = useState(null);
  const [governance, setGovernance] = useState();
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [airdropTokenError, setairdropTokenError] = useState(false);
  const [airdropError, setAirdropError] = useState(false);
  const [airdropErrorMessage, setAirdropErrorMesage] = useState();
  const [carryFeeError, setCarryFeeError] = useState();
  const [quorumError, setQuorumError] = useState();
  const [thresholdError, setThresholdError] = useState();
  const [customTokenError, setCustomTokenError] = useState();
  const [customTokenAmountError, setCustomTokenAmountError] = useState();
  const [customTokenAddressesError, setCustomTokenAddressesError] = useState();
  const [customTokenErrorMesage, setCustomTokenErrorMesage] = useState();
  const defaultOptions = [
    {
      text: "Yes",
    },
    {
      text: "No",
    },
    {
      text: "Abstain",
    },
  ];

  const [{ wallet }] = useConnectWallet();

  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const isGovernanceActive = useSelector((state) => {
    return state.gnosis.governanceAllowed;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });
  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const usdcTokenSymbol = useSelector((state) => {
    return state.gnosis.tokenSymbol;
  });
  const usdcTokenDecimal = useSelector((state) => {
    return state.gnosis.tokenDecimal;
  });
  const usdcGovernanceTokenDecimal = useSelector((state) => {
    return state.gnosis.governanceTokenDecimal;
  });

  const gnosisAddress = useSelector((state) => {
    return state.gnosis.safeAddress;
  });
  const getSafeService = async () => {
    const web3 = new Web3(window.ethereum);
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
  useEffect(async () => {
    setLoaderOpen(true);
    if (gnosisAddress && GNOSIS_TRANSACTION_URL) {
      await getExecutionTransaction();
      setLoaderOpen(false);
    }
    setLoaderOpen(false);
  }, [gnosisAddress, GNOSIS_TRANSACTION_URL]);

  const fetchTokenType = async () => {
    const response = await fetchClubbyDaoAddress(daoAddress);
    if (response.data.length > 0) {
      setTokenType(response.data[0].tokenType);
    }
  };

  useEffect(() => {
    if (daoAddress) {
      fetchTokenType();
    }
  }, [daoAddress, GNOSIS_TRANSACTION_URL, USDC_CONTRACT_ADDRESS]);

  const fetchTokens = () => {
    if (clubID) {
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

  const isGovernanceAllowed = async () => {
    console.log("here");
    const safeSdk = await getSafeSdk();
    console.log("innnnnn is governanceeee allloweedddd");
    const ownerAddresses = await safeSdk.getOwners();
    console.log(ownerAddresses);
    const smallOwnerAddresses = [];
    ownerAddresses.map((w) => smallOwnerAddresses.push(w.toLowerCase()));

    if (isGovernanceActive === false) {
      if (smallOwnerAddresses.includes(walletAddress)) {
        console.log("issss adminnnnnn");
        setGovernance(true);
      } else {
        console.log("noooottt governance");
        setGovernance(false);
      }
    } else {
      setGovernance(true);
    }
  };

  const getExecutionTransaction = async () => {
    console.log("hereeeeee11111111111");
    const safeService = await getSafeService();
    const proposalData = getProposal(clubID);
    const pendingTxs = await safeService.getPendingTransactions(gnosisAddress);
    console.log("pendingTxs", pendingTxs);
    const count = pendingTxs.count;
    proposalData.then(async (result) => {
      Promise.all(
        result.data.map(async (proposal) => {
          const proposalTxHash = await getProposalTxHash(proposal.proposalId);
          console.log(proposalTxHash?.data[0]?.txHash);
          if (proposalTxHash.data[0]) {
            proposal["safeTxHash"] = proposalTxHash?.data[0].txHash;
            if (
              proposalTxHash.data[0].txHash ===
              pendingTxs?.results[count - 1]?.safeTxHash
            ) {
              setExecutionTransaction(proposal);
            }
          }
        }),
      );
    });
    // proposalData?.map(async (proposal) => {
    //   const proposalTxHash = await getProposalTxHash(proposal.proposalId);
    //   console.log("proposalTxHash", proposalTxHash);
    //   if (proposalTxHash?.data[0]?.txHash) {
    //     const safeService = await getSafeService();
    //     const pendingTxs = await safeService.getPendingTransactions(
    //       gnosisAddress,
    //     );
    //     console.log("pendingTxs", pendingTxs);
    //     const count = pendingTxs.count;
    //     if (
    //       proposalTxHash.data[0].txHash ===
    //       pendingTxs?.results[count - 1]?.safeTxHash
    //     ) {
    //       setExecutionTransaction(proposal);
    //     }
    //   }
    // });
  };

  const fetchData = async () => {
    const proposalData = getProposal(clubID);
    proposalData.then(async (result) => {
      if (result.status != 200) {
        setFetched(false);
      } else {
        setProposalData(result.data);
        setFetched(true);
        console.log("gnosisAddress", gnosisAddress);

        Promise.all(
          result.data.map(async (proposal) => {
            const proposalTxHash = await getProposalTxHash(proposal.proposalId);
            if (proposalTxHash.data[0]) {
              proposal["safeTxHash"] = proposalTxHash?.data[0].txHash;
            }
          }),
        );
        setLoaderOpen(false);
      }
    });
  };
  // console.log("ProposalData", proposalData);
  const fetchFilteredData = async (type) => {
    setSelectedListItem(type);
    if (type !== "all") {
      const proposalData = getProposal(clubID, type);
      proposalData.then((result) => {
        if (result.status != 200) {
          setFetched(false);
        } else {
          setProposalData(result.data);
          setFetched(true);
        }
      });
    } else {
      setLoaderOpen(true);
      fetchData();
    }
  };

  const handleNext = async (event) => {
    setLoaderOpen(true);
    setDescriptionError(false);
    if (type === proposalType[0].type) {
      // for execution of Survey
      const options = [];
      for (let i = 1; i < surveyOption.length + 1; i++) {
        if (i === [...surveyOption, surveyValue].length - 1) {
          options.push({ text: surveyValue });
        }
        if (typeof surveyOption[i] !== "undefined") {
          options.push({ text: surveyOption[i] });
        }
      }
      setOpen(false);
      const payload = {
        name: title,
        description: description,
        createdBy: walletAddress,
        clubId: clubID,
        votingDuration: new Date(duration).toISOString(),
        votingOptions: options,
        type: "survey",
      };
      const createRequest = createProposal(payload);
      createRequest.then((result) => {
        if (result.status !== 201) {
          setLoaderOpen(false);
          setOpenSnackBar(true);
          setFailed(true);
          return false;
        } else {
          setLoaderOpen(true);
          fetchData();
          setOpenSnackBar(true);
          setFailed(false);
          setOpen(false);
          return result.data;
        }
      });
    } else {
      setOpen(false);
      if (name === commandTypeList[0].commandText) {
        //errors
        // console.log("description", description);
        if (title.length === 0) {
          console.log("ttitle");
          setTitleError(true);
          setOpen(true);
        } else if (description?.length === 0 || description === undefined) {
          console.log("description", description);
          setDescriptionError(true);
          setOpen(true);
        } else if (airDropTokenValue.length === 0) {
          console.log("airdrop token error");
          setairdropTokenError(true);
          setOpen(true);
        } else if (airdropError || airDropAmount === 0) {
          console.log("airdrop token error");
          setAirdropError(true);
          if (airDropAmount === 0 || airDropAmount.length === 0) {
            console.log("herreee");
            setAirdropErrorMesage("Airdrop Token is required");
          } else {
            console.log(" in  herreee");
            setAirdropErrorMesage(
              "Airdrop amount should be less than token balane",
            );
          }
          setOpen(true);
        } else if (
          airDropCarryFee.length === 0 ||
          airDropCarryFee <= 0 ||
          airDropCarryFee > 100
        ) {
          console.log("carry fee  error");
          setCarryFeeError(true);
          setOpen(true);
        } else {
          // for airdrop execution
          console.log("airDropTokenValue", airDropTokenValue);
          const airDropTokenDecimal = tokenData?.filter(
            (data) => data.token_address === airDropTokenValue,
          )[0].decimals;

          const airDropTokenSymbol = tokenData?.filter(
            (data) => data.token_address === airDropTokenValue,
          )[0].symbol;

          const airdropTokenBalance = tokenData?.filter(
            (data) => data.token_address === airDropTokenValue,
          )[0]?.value;
          console.log("airdropTokenBalance", airdropTokenBalance);

          console.log("airDropAmount", walletAddress);
          const payload = {
            name: title,
            description: description,
            createdBy: walletAddress,
            clubId: clubID,
            votingDuration: new Date(duration).toISOString(),
            votingOptions: defaultOptions,
            commands: [
              {
                executionId: 0,
                airDropToken: airDropTokenValue,
                airDropAmount: convertToWei(
                  airDropAmount,
                  airDropTokenDecimal,
                ).toString(),
                airDropCarryFee: airDropCarryFee,
                usdcTokenSymbol: airDropTokenSymbol,
                usdcTokenDecimal: airDropTokenDecimal,
                usdcGovernanceTokenDecimal: airDropTokenDecimal,
              },
            ],
            type: "action",
          };
          console.log(
            "payload",
            convertToWei(airDropAmount, airDropTokenDecimal).toString(),
          );
          const createRequest = createProposal(payload);
          createRequest.then((result) => {
            if (result.status !== 201) {
              setOpenSnackBar(true);
              setFailed(true);
            } else {
              // console.log(result.data)
              fetchData();
              setOpenSnackBar(true);
              setFailed(false);
              setOpen(false);
            }
          });
        }
      }

      if (name === commandTypeList[1].commandText) {
        let tokenDecimal;
        const governorDetailContract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );

        await governorDetailContract.obtainTokenDecimals().then((result) => {
          tokenDecimal = result;
        });
        console.log("tokenDecimal", tokenDecimal);
        // for mintGT execution
        const payload = {
          name: title,
          description: description,
          createdBy: walletAddress,
          clubId: clubID,
          votingDuration: new Date(duration).toISOString(),
          votingOptions: defaultOptions,
          commands: [
            {
              executionId: 1,
              mintGTAddresses: [mintGtAddress],
              mintGTAmounts: [
                await convertToWeiGovernance(mintGTAmounts, tokenDecimal),
              ],
              usdcTokenSymbol: usdcTokenSymbol,
              usdcTokenDecimal: usdcTokenDecimal,
              usdcGovernanceTokenDecimal: usdcGovernanceTokenDecimal,
            },
          ],
          type: "action",
        };
        const createRequest = createProposal(payload);
        createRequest.then((result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true);
            setFailed(true);
          } else {
            // console.log(result.data)
            fetchData();
            setOpenSnackBar(true);
            setFailed(false);
            setOpen(false);
          }
        });
      }

      // if (name === commandTypeList[2].commandText) {
      //   // for assigner executor role execution
      //   const payload = {
      //     "name": title,
      //     "description": description,
      //     "createdBy": walletAddress,
      //     "clubId": clubID,
      //     "votingDuration": new Date(duration).toISOString(),
      //     "votingOptions": defaultOptions,
      //     "commands": [
      //       {
      //         "executionId": 2,
      //         "executiveRoles": web3.utils.toChecksumAddress(executiveRoles),
      //       }
      //     ],
      //     "type": "action"
      //   }
      //   const createRequest = createProposal(payload)
      //   createRequest.then((result) => {
      //     if (result.status !== 201) {
      //       setOpenSnackBar(true)
      //       setFailed(true)
      //     } else {
      //       // console.log(result.data)
      //       setLoaderOpen(true)
      //       fetchData()
      //       setOpenSnackBar(true)
      //       setFailed(false)
      //       setOpen(false)
      //     }
      //   })
      //
      // }

      if (name === commandTypeList[2].commandText) {
        // For execution of Governance settings
        if (title.length === 0) {
          console.log("ttitle");
          setTitleError(true);
          setOpen(true);
        } else if (description?.length === 0 || description === undefined) {
          console.log("airdrop token error");
          setDescriptionError(true);
          setOpen(true);
        } else if (
          quorumValue.length === 0 ||
          quorumValue <= 0 ||
          quorumValue > 100
        ) {
          setQuorumError(true);
          setOpen(true);
        } else if (
          thresholdValue.length === 0 ||
          thresholdValue < 51 ||
          thresholdValue > 100
        ) {
          setThresholdError(true);
          setOpen(true);
        } else {
          const payload = {
            name: title,
            description: description,
            createdBy: walletAddress,
            clubId: clubID,
            votingDuration: new Date(duration).toISOString(),
            votingOptions: defaultOptions,
            commands: [
              {
                executionId: 2,
                quorum: quorumValue,
                threshold: thresholdValue,
                usdcTokenSymbol: usdcTokenSymbol,
                usdcTokenDecimal: usdcTokenDecimal,
                usdcGovernanceTokenDecimal: usdcGovernanceTokenDecimal,
              },
            ],
            type: "action",
          };
          const createRequest = createProposal(payload);
          createRequest.then((result) => {
            if (result.status !== 201) {
              setOpenSnackBar(true);
              setFailed(true);
            } else {
              setLoaderOpen(true);
              fetchData();
              setOpenSnackBar(true);
              setFailed(false);
              setOpen(false);
            }
          });
        }
        // // For execution of Governance settings
        // if (
        //   thresholdValue > 50 &&
        //   thresholdValue <= 100 &&
        //   quorumValue <= 100
        // ) {

        // } else {
        //   setOpenSnackBar(true);
        //   setFailed(true);
        //   setOpen(false);
        //   setLoaderOpen(false);
        // }
      }

      if (name === commandTypeList[3].commandText) {
        // For execution of update raise amount
        if (title.length === 0) {
          console.log("ttitle");
          setTitleError(true);
          setOpen(true);
        } else if (description?.length === 0 || description === undefined) {
          console.log("airdrop token error");
          setDescriptionError(true);
          setOpen(true);
        } else {
          const payload = {
            name: title,
            description: description,
            createdBy: walletAddress,
            clubId: clubID,
            votingDuration: new Date(duration).toISOString(),
            votingOptions: defaultOptions,
            commands: [
              {
                executionId: 3,
                totalDeposits: convertToWei(totalDeposits, usdcTokenDecimal),
                usdcTokenSymbol: usdcTokenSymbol,
                usdcTokenDecimal: usdcTokenDecimal,
                usdcGovernanceTokenDecimal: usdcGovernanceTokenDecimal,
              },
            ],
            type: "action",
          };
          const createRequest = createProposal(payload);
          createRequest.then((result) => {
            if (result.status !== 201) {
              setOpenSnackBar(true);
              setFailed(true);
            } else {
              // console.log(result.data)
              setLoaderOpen(true);
              fetchData();
              setOpenSnackBar(true);
              setFailed(false);
              setOpen(false);
            }
          });
        }
      }

      if (name === commandTypeList[4].commandText) {
        // for execution of sending custom token
        console.log("custom token", customToken.length);
        if (title.length === 0) {
          setTitleError(true);
          setOpen(true);
        } else if (description?.length === 0 || description === undefined) {
          console.log("airdrop token error");
          setDescriptionError(true);
          setOpen(true);
        } else if (
          customToken.length === 0 ||
          customToken === null ||
          customToken === undefined ||
          customToken === ""
        ) {
          console.log(customToken);
          setCustomTokenError(true);
          setOpen(true);
        } else if (customTokenAddresses.length === 0) {
          setCustomTokenAddressesError(true);
          setOpen(true);
        } else if (customTokenError || customTokenAmounts === 0) {
          console.log("airdrop token error", customTokenAmounts);
          setCustomTokenAmountError(true);
          if (customTokenAmounts === 0 || customTokenAmounts.length === 0) {
            console.log("herreee");
            setCustomTokenErrorMesage("Custom Token is required");
          } else {
            console.log(" in  herreee");
            setCustomTokenErrorMesage(
              "Custom amount should be less than token balane",
            );
          }
          setOpen(true);
        } else {
          console.log("here");
          const payload = {
            name: title,
            description: description,
            createdBy: walletAddress,
            clubId: clubID,
            votingDuration: new Date(duration).toISOString(),
            votingOptions: defaultOptions,
            commands: [
              {
                executionId: 4,
                customToken: customToken,
                customTokenAmounts: [
                  convertToWei(customTokenAmounts, usdcTokenDecimal),
                ],
                customTokenAddresses: [customTokenAddresses],
                usdcTokenSymbol: usdcTokenSymbol,
                usdcTokenDecimal: usdcTokenDecimal,
                usdcGovernanceTokenDecimal: usdcGovernanceTokenDecimal,
              },
            ],
            type: "action",
          };
          const createRequest = createProposal(payload);
          createRequest.then((result) => {
            if (result.status !== 201) {
              setOpenSnackBar(true);
              setFailed(true);
            } else {
              // console.log(result.data)
              fetchData();
              setOpenSnackBar(true);
              setFailed(false);
              setOpen(false);
            }
          });
        }
      }

      // if (name === commandTypeList[7].commandText) {
      //   // For execution send ethereum
      //   const payload = {
      //     "name": title,
      //     "description": description,
      //     "createdBy": walletAddress,
      //     "clubId": clubID,
      //     "votingDuration": new Date(duration).toISOString(),
      //     "votingOptions": defaultOptions,
      //     "commands": [
      //       {
      //         "executionId": 7,
      //         "sendEthAddresses": sendEthAddresses,
      //         "sendEthAmounts": await convertToWeiUSDC(sendEthAmounts, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL),
      //       }
      //     ],
      //     "type": "action"
      //   }
      //   const createRequest = createProposal(payload)
      //   createRequest.then((result) => {
      //     if (result.status !== 201) {
      //       setOpenSnackBar(true)
      //       setFailed(true)
      //     } else {
      //       // console.log(result.data)
      //       fetchData()
      //       setOpenSnackBar(true)
      //       setFailed(false)
      //       setOpen(false)
      //     }
      //   })
      // }
    }
  };

  useEffect(() => {
    if (create_proposal) {
      setOpen(true);
    }
    // if (gnosisAddress) {
    fetchFilteredData("all");
    // }
  }, [clubID, gnosisAddress]);

  useEffect(() => {
    setLoaderOpen(true);
    fetchTokens();

    isGovernanceAllowed();
  }, [clubID]);

  const handleTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value) {
      setType(value);
    }
  };

  const handleFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedListItem(value);
    fetchFilteredData(value);
    console.log("value", value);
  };

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/${proposal.proposalId}`, undefined, {
      shallow: true,
    });
  };

  const handleTokenChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("target", value);
    console.log(
      "token address",
      tokenData.find((token) => token.name === value).token_address,
    );
    setCustomToken(
      tokenData.find((token) => token.name === value).token_address,
    );
  };

  const handleAirDropTokenChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("value", value);
    setAirDropToken(value);
    setAirDropTokenValue(
      tokenData.find((token) => token.name === value).token_address,
    );
    setairdropTokenError(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
    setEnableSubmitButton(true);
  };

  const handleDurationChange = (value) => {
    setDuration(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNewCommand = () => {
    setOpenCard(true);
    setCommandList([...commandList, ""]);
    setCount(1);
  };

  const handleAddNewOption = () => {
    setOpenCard(true);
    setOptionList([...optionList, ""]);
    setSurveyOption([...surveyOption, surveyValue]);
  };

  const handleRemoveClick = (index) => {
    const list = [...commandList];
    list.splice(index, 1);
    setCommandList(list);
    setCount(0);
  };

  const handleRemoveSurveyClick = (index) => {
    const list = [...optionList];
    list.splice(index, 1);
    setOptionList(list);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <>
      <Layout1 page={2}>
        <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
          <Grid item md={8}>
            <Grid
              container
              mb={5}
              direction={{
                xs: "column",
                sm: "column",
                md: "column",
                lg: "row",
              }}
            >
              <Grid item>
                <Typography variant="title">WorkStation</Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: { lg: "flex" },
                  justifyContent: { md: "flex-center", lg: "flex-end" },
                }}
              >
                <Grid container direction="row" spacing={2}>
                  <Grid
                    item
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {/* <TextField
                      value={searchProposal}
                      onChange={(e) => setSearchProposal(e.target.value)}
                      className={classes.searchField}
                      placeholder="Search proposals"
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            type="submit"
                            sx={{ p: "10px" }}
                            aria-label="search"
                          >
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                    /> */}
                    <Select
                      sx={{ height: "80%", textTransform: "capitalize" }}
                      value={selectedListItem}
                      onChange={handleFilterChange}
                      input={<OutlinedInput />}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return "Select a command";
                        }
                        return selected;
                      }}
                      MenuProps={proposalDisplayOptions}
                      style={{
                        borderRadius: "10px",
                        background: "#111D38 0% 0% no-repeat padding-box",
                        width: "30%",
                      }}
                    >
                      {proposalDisplayOptions.map((option) => (
                        <MenuItem
                          key={option.name}
                          value={option.type}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  {governance ? (
                    <Grid item>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          height: "80%",
                        }}
                        onClick={handleClickOpen}
                      >
                        Propose
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {selectedListItem === "all" ? (
                proposalData.length > 0 ? (
                  <>
                    {executionTransaction && (
                      <>
                        <h2>Queued Transactions</h2>
                        {console.log(executionTransaction)}
                        <Grid
                          item
                          onClick={(e) => {
                            handleProposalClick(executionTransaction);
                          }}
                          md={12}
                        >
                          <ProposalCard
                            proposal={executionTransaction}
                            fetched={fetched}
                            executionTransaction={true}
                          />
                        </Grid>
                      </>
                    )}
                    {executionTransaction && <h2>Proposals</h2>}

                    {proposalData.map((proposal, key) => {
                      return (
                        <Grid
                          item
                          key={proposal.id}
                          onClick={(e) => {
                            console.log(proposalData[key]);
                            handleProposalClick(proposalData[key]);
                          }}
                          md={12}
                        >
                          <ProposalCard
                            proposal={proposal}
                            indexKey={key}
                            fetched={fetched}
                          />
                        </Grid>
                      );
                    })}
                  </>
                ) : (
                  <Grid
                    item
                    justifyContent="center"
                    alignItems="center"
                    md={10}
                  >
                    <img
                      src="/assets/images/proposal_banner.png"
                      alt="token-banner"
                      className={classes.banner}
                    />
                  </Grid>
                )
              ) : proposalData.length > 0 ? (
                proposalData.map((proposal, key) => {
                  return (
                    <Grid
                      item
                      key={proposal.id}
                      onClick={(e) => {
                        handleProposalClick(proposalData[key]);
                      }}
                      md={12}
                    >
                      <ProposalCard
                        proposal={proposal}
                        indexKey={key}
                        fetched={fetched}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item justifyContent="center" alignItems="center" md={10}>
                  <Card variant="noProposalCard">
                    <Typography
                      sx={{ fontSize: "1.625em", fontFamily: "Whyte" }}
                      p={3}
                    >
                      No Proposals found
                    </Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Card
              className={classes.proposalInfoCard}
              sx={{ padding: 0, position: "relative" }}
            >
              <Image
                src={proposalImg}
                alt="proposal image"
                className={classes.proposalImg}
              />
              <Typography
                variant="h4"
                sx={{
                  position: "absolute",
                  left: 20,
                  top: 40,
                  color: "#111D38",
                  fontWeight: "normal",
                  width: "70%",
                }}
              >
                Create & execute proposals
              </Typography>
              <Link
                href="/"
                sx={{
                  position: "absolute",
                  color: "#111D38",
                  fontWeight: "normal",
                  width: "70%",
                  textDecoration: "underline",
                  fontSize: "0.875rem",
                  left: 20,
                  bottom: 10,
                }}
              >
                Read Docs
              </Link>

              {/* <Grid container>
                <Grid item>
                  <Typography className={classes.listFont}>
                    Proposals
                  </Typography>
                </Grid>
              </Grid>
              <ListItemButton
                selected={selectedListItem === "all"}
                onClick={() => fetchFilteredData("all")}
              >
                <div className={classes.allIllustration}></div>
                <ListItemText primary="All" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>

              <ListItemButton
                selected={selectedListItem === "active"}
                onClick={() => fetchFilteredData("active")}
              >
                <div className={classes.activeIllustration}></div>
                <ListItemText primary="Active" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>

              <ListItemButton
                selected={selectedListItem === "closed"}
                onClick={() => fetchFilteredData("passed")}
              >
                <div className={classes.passedIllustration}></div>
                <ListItemText primary="Passed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>
              <ListItemButton
                selected={selectedListItem === "executed"}
                onClick={() => fetchFilteredData("executed")}
              >
                <div className={classes.executedIllustration}></div>
                <ListItemText primary="Executed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>
              <ListItemButton
                selected={selectedListItem === "failed"}
                onClick={() => fetchFilteredData("failed")}
              >
                <div className={classes.failedIllustration}></div>
                <ListItemText primary="Failed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton> */}
            </Card>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll="body"
          PaperProps={{ classes: { root: classes.modalStyle } }}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent
            sx={{ overflow: "hidden", backgroundColor: "#19274B" }}
          >
            <Grid container>
              <Grid item m={3}>
                <Typography className={classes.dialogBox}>
                  Create proposal
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} ml={0}>
              <Grid item md={6}>
                <Typography variant="proposalBody">Type of Proposal</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="proposalBody">
                  Proposal deadline
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} ml={2}>
              <Grid item md={6}>
                <Select
                  displayEmpty
                  value={type}
                  onChange={handleTypeChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return proposalType.name;
                    }
                    return selected;
                  }}
                  style={{
                    borderRadius: "10px",
                    background: "#111D38 0% 0% no-repeat padding-box",
                    width: "90%",
                  }}
                >
                  {proposalType.map((value) => (
                    <MenuItem key={value.type} value={value.type}>
                      {value.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    error={duration === null}
                    // className={classes.datePicker}
                    inputFormat="dd/MM/yyyy"
                    value={duration}
                    onChange={(e) => handleDurationChange(e)}
                    renderInput={(params) => (
                      <TextField
                        onKeyDown={(e) => e.preventDefault()}
                        {...params}
                        className={classes.datePicker}
                      />
                    )}
                    minDate={minDate}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container item ml={3} mt={2}>
              <Typography variant="proposalBody">Proposal Title*</Typography>
            </Grid>
            <Grid container item ml={3} mt={2}>
              <TextField
                sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                className={classes.cardTextBox}
                placeholder="Add your one line description here"
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.length < 0) {
                    setTitleError(true);
                  } else {
                    setTitleError(false);
                  }
                }}
                error={titleError}
              />
              {titleError && (
                <FormHelperText error focused>
                  Title is required
                </FormHelperText>
              )}
            </Grid>
            <Grid container item ml={3} mt={2}>
              <Typography variant="proposalBody">
                Proposal description*
              </Typography>
            </Grid>
            <Grid container item ml={3} mt={3} mb={3}>
              <QuillEditor
                onChange={setDescription}
                multiline
                rows={10}
                placeholder="Add full description here"
                style={{
                  width: "95%",
                  height: "auto",
                  backgroundColor: "#19274B",
                  fontSize: "18px",
                  color: "#C1D3FF",
                  fontFamily: "Whyte",
                }}
                error={descriptionError}
              />
              {descriptionError && (
                <FormHelperText error focused mt={10}>
                  Description is required
                </FormHelperText>
              )}
              {/* <TextField
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={10}
                // aria-label="minimum height"
                // minRows={10}
                placeholder="Add full description here"
                style={{
                  width: "95%",
                  height: "auto",
                  backgroundColor: "#19274B",
                  fontSize: "18px",
                  color: "#C1D3FF",
                  fontFamily: "Whyte",
                }}
              /> */}
            </Grid>
            {type === proposalType[0].type ? (
              <>
                <Grid container item ml={3} mt={2} mb={2}>
                  <Typography variant="proposalBody">
                    (Minimum 2 options needed*)
                  </Typography>
                </Grid>
                {!enableSubmitButton ? setEnableSubmitButton(true) : null}
                <Grid item ml={3} mr={2}>
                  <Card className={classes.proposalCard}>
                    {optionList.map((data, key) => {
                      return (
                        <div key={key}>
                          <Grid container item ml={3} mt={2}>
                            <Typography variant="proposalBody">
                              Option #{key + 1}
                            </Typography>
                          </Grid>
                          <Grid
                            container
                            ml={1}
                            mt={1}
                            mb={2}
                            spacing={2}
                            direction="column"
                          >
                            <Grid container direction="row" ml={2}>
                              <Grid item md={10} mb={3}>
                                <TextField
                                  sx={{
                                    width: "90%",
                                    backgroundColor: "#C1D3FF40",
                                  }}
                                  className={classes.cardTextBox}
                                  placeholder="Yes / No / Abstain, etc."
                                  onChange={(e) => {
                                    setSurveyValue(e.target.value);
                                  }}
                                  defaultValue={data.text}
                                />
                              </Grid>
                              <Grid item md={1} mt={1}>
                                <IconButton
                                  aria-label="add"
                                  onClick={(e) => handleRemoveSurveyClick(key)}
                                  mt={1}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}
                  </Card>
                </Grid>
                <Grid container item mt={2} ml={3}>
                  <Button
                    variant="primary"
                    startIcon={<AddCircleRoundedIcon />}
                    onClick={handleAddNewOption}
                    disabled={optionList.length >= 1 && surveyValue === ""}
                  >
                    Add Option
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid container item ml={3} mt={3} mb={2}>
                  <Typography variant="proposalBody">
                    Choose a command for this proposal to execute
                  </Typography>
                </Grid>
                <Grid item ml={3} mr={2}>
                  {openCard ? (
                    <Card className={classes.proposalCard}>
                      {commandList.map((data, key) => {
                        return (
                          <div key={key}>
                            <Grid container item ml={3} mt={2}>
                              <Typography variant="proposalBody">
                                Command #{key + 1}
                              </Typography>
                            </Grid>
                            <Grid container item ml={3} mt={1} mb={3}>
                              <Select
                                displayEmpty
                                value={name}
                                onChange={handleChange}
                                input={<OutlinedInput />}
                                renderValue={(selected) => {
                                  if (selected.length === 0) {
                                    return "Select a command";
                                  }
                                  return selected;
                                }}
                                MenuProps={commandTypeList}
                                style={{
                                  borderRadius: "10px",
                                  background:
                                    "#111D38 0% 0% no-repeat padding-box",
                                  width: "90%",
                                }}
                              >
                                {/* {!isGovernanceActive
                                  ? commandTypeList
                                      .filter((command) => {
                                        return command.commandId !== 2;
                                      })
                                      .map((command) => (
                                        <MenuItem
                                          key={command.commandId}
                                          value={command.commandText}
                                          display={
                                            !isGovernanceActive ? "none" : ""
                                          }
                                        >
                                          {command.commandText}
                                        </MenuItem>
                                      ))
                                  : commandTypeList.map((command) => (
                                      <MenuItem
                                        key={command.commandId}
                                        value={command.commandText}
                                        display={
                                          !isGovernanceActive ? "none" : ""
                                        }
                                      >
                                        {command.commandText}
                                      </MenuItem>
                                    ))} */}
                                {/* {commandTypeList.map((command) => (
                                  <MenuItem
                                    key={command.commandId}
                                    value={command.commandText}
                                  >
                                    {command.commandText}
                                  </MenuItem>
                                ))} */}
                                <MenuItem
                                  key={0}
                                  value="Distribute token to members"
                                >
                                  Distribute token to members
                                </MenuItem>
                                <MenuItem key={1} value="Mint club token">
                                  Mint club token
                                </MenuItem>
                                {isGovernanceActive ? (
                                  <MenuItem
                                    key={2}
                                    value="Update Governance Settings"
                                  >
                                    Update Governance Settings
                                  </MenuItem>
                                ) : null}
                                {tokenType !== "erc721" ? (
                                  <MenuItem
                                    key={3}
                                    value="Change total raise amount"
                                  >
                                    Change total raise amount
                                  </MenuItem>
                                ) : null}

                                <MenuItem
                                  key={4}
                                  value="Send token to an address"
                                >
                                  Send token to an address
                                </MenuItem>
                              </Select>
                              <IconButton
                                aria-label="add"
                                onClick={(e) => handleRemoveClick(key)}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Grid>
                            {name === commandTypeList[0].commandText ? (
                              // airdrop execution
                              <Grid
                                container
                                ml={1}
                                mt={1}
                                mb={2}
                                spacing={2}
                                direction="column"
                              >
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Air drop token*
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Grid item>
                                    <Select
                                      displayEmpty
                                      value={airDropToken}
                                      onChange={handleAirDropTokenChange}
                                      input={<OutlinedInput />}
                                      renderValue={(selected) => {
                                        if (selected.length === 0) {
                                          return "Select a Token";
                                        }
                                        return selected;
                                      }}
                                      MenuProps={tokenData}
                                      style={{
                                        borderRadius: "10px",
                                        background:
                                          "#111D38 0% 0% no-repeat padding-box",
                                        width: "90%",
                                      }}
                                      error={airdropTokenError}
                                    >
                                      {tokenData.map((token) => (
                                        <MenuItem
                                          key={token.name}
                                          value={token.name}
                                        >
                                          {token.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                    {airdropTokenError && (
                                      <FormHelperText error focused>
                                        Airdrop token is required
                                      </FormHelperText>
                                    )}
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Amount*
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0"
                                    onChange={(e) => {
                                      setAirDropAmount(
                                        parseFloat(e.target.value),
                                      );
                                      if (
                                        parseFloat(e.target.value) >
                                        tokenData?.filter(
                                          (data) =>
                                            data.token_address ===
                                            airDropTokenValue,
                                        )[0]?.value
                                      )
                                        setAirdropError(true);
                                      else setAirdropError(false);
                                    }}
                                  />
                                  {airdropError && (
                                    <FormHelperText error focused>
                                      {airdropErrorMessage}
                                    </FormHelperText>
                                  )}
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Carry fee (in %)
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0%"
                                    onChange={(e) => {
                                      setAirDropCarryFee(
                                        parseInt(e.target.value),
                                      );
                                      if (
                                        e.target.value <= 0 ||
                                        e.target.value > 100
                                      )
                                        setCarryFeeError(true);
                                      else setCarryFeeError(false);
                                    }}
                                  />
                                  {carryFeeError && (
                                    <FormHelperText error focused>
                                      Carry Fee should be between 1-100
                                    </FormHelperText>
                                  )}
                                </Grid>
                              </Grid>
                            ) : name === commandTypeList[1].commandText ? (
                              // mintgtto execution
                              <Grid
                                container
                                ml={1}
                                mt={1}
                                mb={2}
                                spacing={2}
                                direction="column"
                              >
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    User address
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0x..."
                                    onChange={(e) =>
                                      setMintGtAddress(e.target.value)
                                    }
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Amount of Tokens
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0"
                                    onChange={(e) =>
                                      setMintGtAmount(parseInt(e.target.value))
                                    }
                                  />
                                </Grid>
                              </Grid>
                            ) : // name === commandTypeList[0].commandText ? (
                            //   // assign executor role execution
                            //   <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                            //     <Grid item>
                            //       <Typography variant="proposalBody">Executor role address</Typography>
                            //     </Grid>
                            //     <Grid item>
                            //       <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                            //         placeholder="0x..." onChange={(e) => setExecutiveRoles(e.target.value)} />
                            //     </Grid>
                            //   </Grid>
                            // ) :
                            name === commandTypeList[2].commandText ? (
                              // update governance settings execution
                              <Grid
                                container
                                ml={1}
                                mt={1}
                                mb={2}
                                spacing={2}
                                direction="column"
                              >
                                <Grid item>
                                  <Typography variant="proposalBody">
                                    Quorum (in %)
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0"
                                    onChange={(e) => {
                                      setQuorumValue(parseInt(e.target.value));
                                      if (
                                        e.target.value <= 0 ||
                                        e.target.value > 100
                                      )
                                        setQuorumError(true);
                                      else setQuorumError(false);
                                    }}
                                    error={quorumError}
                                  />
                                  {quorumError && (
                                    <FormHelperText error focused>
                                      Quorum should be between 1-100
                                    </FormHelperText>
                                  )}
                                </Grid>
                                <Grid item>
                                  <Typography variant="proposalBody">
                                    Threshold (in %)
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0"
                                    onChange={(e) => {
                                      setThresholdValue(
                                        parseInt(e.target.value),
                                      );
                                      if (
                                        e.target.value < 51 ||
                                        e.target.value > 100
                                      ) {
                                        console.log(e.target.value);
                                        setThresholdError(true);
                                      } else setThresholdError(false);
                                    }}
                                    error={thresholdError}
                                  />
                                  {thresholdError && (
                                    <FormHelperText error focused>
                                      Threshold should be between 51-100
                                    </FormHelperText>
                                  )}
                                </Grid>
                              </Grid>
                            ) : name === commandTypeList[3].commandText ? (
                              // update raise amount execution
                              <Grid
                                container
                                ml={1}
                                mt={1}
                                mb={2}
                                spacing={2}
                                direction="column"
                              >
                                <Grid item>
                                  <Typography variant="proposalBody">
                                    Total deposit
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0"
                                    onChange={(e) =>
                                      setTotalDeposits(parseInt(e.target.value))
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
                                  />
                                </Grid>
                              </Grid>
                            ) : name === commandTypeList[4].commandText ? (
                              // send custom token execution
                              <Grid
                                container
                                ml={1}
                                mt={1}
                                mb={2}
                                spacing={2}
                                direction="column"
                              >
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Send token to an address
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Select
                                    displayEmpty
                                    value={customToken}
                                    onChange={handleTokenChange}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => {
                                      if (selected.length === 0) {
                                        return "Select a Token";
                                      }
                                      return selected;
                                    }}
                                    MenuProps={tokenData}
                                    style={{
                                      borderRadius: "10px",
                                      background:
                                        "#111D38 0% 0% no-repeat padding-box",
                                      width: "90%",
                                    }}
                                    error={customTokenError}
                                  >
                                    {tokenData.map((token) => (
                                      <MenuItem
                                        key={token.name}
                                        value={token.name}
                                      >
                                        {token.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {customTokenError && (
                                    <FormHelperText error focused>
                                      Custom token is required
                                    </FormHelperText>
                                  )}
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Receiver&apos;s wallet address
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0x..."
                                    onChange={(e) => {
                                      setCustomTokenAddresses(e.target.value);
                                      if (e.target.value.length === 0)
                                        setCustomTokenAddressesError(true);
                                      else setCustomTokenAddressesError(false);
                                    }}
                                    error={customTokenAddressesError}
                                  />
                                  {customTokenAddressesError && (
                                    <FormHelperText error>
                                      Wallet address required
                                    </FormHelperText>
                                  )}
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.cardFont}>
                                    Amount to be sent
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    sx={{
                                      width: "90%",
                                      backgroundColor: "#C1D3FF40",
                                    }}
                                    className={classes.cardTextBox}
                                    placeholder="0"
                                    onChange={(e) => {
                                      setCustomTokenAmounts(e.target.value);
                                      if (
                                        e.target.value >
                                          tokenData?.filter(
                                            (data) =>
                                              data.token_address ===
                                              customToken,
                                          )[0]?.value ||
                                        e.target.value === ""
                                      ) {
                                        setCustomTokenAmountError(true);
                                      } else setCustomTokenAmountError(false);
                                    }}
                                  />
                                  {customTokenAmountError && (
                                    <FormHelperText error focused>
                                      {(customTokenAmounts === 0 ||
                                        customTokenAmounts.length === 0) &&
                                      customTokenAmountError
                                        ? "Custom Token is required"
                                        : "Custom amount should be less than token balane"}
                                    </FormHelperText>
                                  )}
                                </Grid>
                              </Grid>
                            ) : // :
                            // name === commandTypeList[7].commandText ? (
                            //   // send eth execution
                            //   <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                            //     <Grid item>
                            //       <Typography className={classes.cardFont}>Ethereum address</Typography>
                            //     </Grid>
                            //     <Grid item>
                            //       <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                            //         placeholder="0" onChange={(e) => setSendEthAddresses(e.target.value)} />
                            //     </Grid>
                            //     <Grid item>
                            //       <Typography className={classes.cardFont}>Ethereum amount</Typography>
                            //     </Grid>
                            //     <Grid item>
                            //       <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                            //         placeholder="0" onChange={(e) => setSendEthAmounts(parseFloat(e.target.value))} />
                            //     </Grid>
                            //   </Grid>
                            // )
                            null}
                          </div>
                        );
                      })}
                    </Card>
                  ) : (
                    <></>
                  )}
                </Grid>
                {count < 1 ? (
                  <Grid container item mt={2} ml={3}>
                    <Button
                      variant="primary"
                      startIcon={<AddCircleRoundedIcon />}
                      onClick={handleAddNewCommand}
                    >
                      Add command
                    </Button>
                  </Grid>
                ) : null}
              </>
            )}
            <Grid container>
              <Grid
                item
                mr={2}
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Grid item>
                  <Button variant="cancel" onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item ml={2}>
                  {type === proposalType[0].type ? (
                    duration === null ||
                    title === null ||
                    description === null ||
                    surveyOption.length < 2 ||
                    !enableSubmitButton ? (
                      <Button variant="primary" onClick={handleNext} disabled>
                        Submit
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleNext}>
                        Submit
                      </Button>
                    )
                  ) : duration === null ||
                    title === null ||
                    description === null ||
                    commandList.length < 1 ||
                    !enableSubmitButton ? (
                    <Button variant="primary" onClick={handleNext} disabled>
                      Submit
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleNext}>
                      Submit
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
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
              Proposal Successfully created!
            </Alert>
          ) : (
            <Alert
              onClose={handleSnackBarClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              Proposal creation failed!
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

export default ClubFetch(Proposal);
// import React from "react";

// const Proposal = () => {
//   return <div>Proposal</div>;
// };

// export default Proposal;
