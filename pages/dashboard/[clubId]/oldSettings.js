import { React, useCallback, useEffect, useState } from "react";
import Layout1 from "../../../src/components/layouts/layout1";
import {
  Card,
  Grid,
  Typography,
  Stack,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Backdrop,
  Button,
  Snackbar,
  Alert,
  TextField,
  Paper,
  Switch,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ProgressBar from "../../../src/components/progressbar";
import { useSelector } from "react-redux";
import { getMembersDetails } from "../../../src/api/user";
import ImplementationContract from "../../../src/abis/implementationABI.json";
import { SmartContract } from "../../../src/api/contract";
import { fetchClubbyDaoAddress } from "../../../src/api/club";
import { getAssets } from "../../../src/api/assets";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClubFetch from "../../../src/utils/clubFetch";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import {
  calculateDays,
  calculateTreasuryTargetShare,
  calculateUserSharePercentage,
  convertAmountToWei,
  convertFromWeiGovernance,
  convertToWei,
  convertToWeiGovernance,
} from "../../../src/utils/globalFunctions";
import { settingsOptions } from "../../../src/data/settingsOptions";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import TokenSearch from "../../../src/components/tokenSearch";
import styled from "@emotion/styled";
import nft from "../../../src/abis/nft.json";
import { useConnectWallet } from "@web3-onboard/react";
import {
  getTokenMetadata,
  getTokensDecimalFromAddress,
} from "../../../src/api/token";
import Web3 from "web3";

const useStyles = makeStyles({
  valuesStyle: {
    fontSize: "21px",
    fontWeight: "normal",
    fontFamily: "Whyte",
  },
  valuesDimStyle: {
    fontSize: "21px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardRegular: {
    borderRadius: "10px",
    opacity: 1,
  },
  dimColor: {
    color: "#C1D3FF",
  },
  connectWalletButton: {
    backgroundColor: "#3B7AFD",
    fontSize: "21px",
    fontFamily: "Whyte",
  },
  depositButton: {
    backgroundColor: "#3B7AFD",
    width: "208px",
    height: "60px",
    fontSize: "21px",
    fontFamily: "Whyte",
  },
  cardSmall: {
    backgroundColor: "#111D38",
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontFamily: "Whyte",
    fontSize: "18px",
    color: "#C1D3FF",
  },
  cardLargeFont: {
    "width": "150px",
    "fontSize": "38px",
    "fontWeight": "bold",
    "fontFamily": "Whyte",
    "color": "#F5F5F5",
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
  maxTag: {
    borderRadius: "17px",
    width: "98px",
    height: "34px",
    opacity: "1",
    padding: "10px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: " #3B7AFD",
    fontSize: "20px",
    fontFamily: "Whyte",
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
    paddingTop: "5px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#0ABB92",
    opacity: "1",
    fontFamily: "Whyte",
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
  iconColor: {
    color: "#C1D3FF",
  },
  activityLink: {
    "color": "#3B7AFD",
    "textDecoration": "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
  },
  dialogBox: {
    fontSize: "26px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#111D38",
    width: "95%",
  },
});

const Android12Switch = styled(Switch)(({ theme }) => ({
  "padding": 8,
  "& .MuiSwitch-track": {
    "borderRadius": 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Settings = (props) => {
  const classes = useStyles();
  const daoAddress = useSelector((state) => {
    return state.create.daoAddress;
  });
  const isGovernanceActive = useSelector((state) => {
    return state.gnosis.governanceAllowed;
  });
  const imageUrl = useSelector((state) => {
    return state.create.clubImageUrl;
  });
  const [dataFetched, setDataFetched] = useState(false);

  const [{ wallet }] = useConnectWallet();
  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const [tokenDetails, settokenDetails] = useState(null);
  const [tokenAPIDetails, settokenAPIDetails] = useState(null); // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false);
  const [governorDetails, setGovernorDetails] = useState(null);
  const [governorDataFetched, setGovernorDataFetched] = useState(false);
  const [clubId, setClubId] = useState(null);
  const [membersFetched, setMembersFetched] = useState(false);
  const [members, setMembers] = useState(0);
  const [open, setOpen] = useState(false);
  const [tempOpen, setTempOpen] = useState(false);
  const [minDeposit, setMinDeposit] = useState(0);
  const [quoramValue, setQuoramValue] = useState(0);
  const [thresholdValue, setThresholdValue] = useState(0);
  const [quoramFetched, setQuoramFetched] = useState(false);
  const [thresholdFetched, setThresholdFetched] = useState(false);
  const [maxDeposit, setMaxDeposit] = useState(0);
  const [performanceFee, setPerformanceFee] = useState(0);
  const [performanceFeeValue, setPerformanceFeeValue] = useState(0);
  const [membersDetails, setMembersDetails] = useState([]);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [closingDays, setClosingDays] = useState(0);
  const [userBalance, setUserBalance] = useState("");
  const [userBalanceFetched, setUserBalanceFetched] = useState(false);
  const [clubAssetTokenFetched, setClubAssetTokenFetched] = useState(false);
  const [clubAssetTokenData, setClubAssetTokenData] = useState([]);
  const [userOwnershipShare, setUserOwnershipShare] = useState(0);
  const [clubTokenMinted, setClubTokenMInted] = useState(0);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [settingType, setSettingType] = useState("");
  const [day, setDay] = useState(null);
  const [currentMinDeposit, setCurrentMinDeposit] = useState(0);
  const [currentMaxDeposit, setCurrentMaxDeposit] = useState(0);
  const [tokenSearchOpen, setTokenSearchOpen] = useState(false);
  const [searchTokenAddress, setSearchTokenAddress] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [tokenSymbol, setTokenSymbol] = useState([]);
  const [tokenMinimum, setTokenMinimum] = useState([]);
  const [operationType, setOperationType] = useState([]);
  const [isNFT, setIsNFT] = useState([]);
  const [checked, setChecked] = useState(false);
  const [tokenType, setTokenType] = useState(null);
  const [depositCloseDate, setDepositCloseDate] = useState();
  const [maxTokensPerUser, setMaxTokensPerUser] = useState(null);
  const [totalNftMinted, setTotalNftMinted] = useState(null);
  const [totalNftSupply, setTotalNftSupply] = useState(null);
  const [changedNftSupply, setChangedNftSupply] = useState(null);

  const [totalERC20Supply, setTotalERC20Supply] = useState(null);
  const [nftContractAddress, setNftContractAddress] = useState(null);
  const [isNftTransferable, setIsNftTransferable] = useState(null);
  const [changeNtTransferability, setChangeNtTransferability] = useState(null);
  const [isNftTotalSupplyUnlimited, setIsNftTotalSupplyUnlimited] =
    useState(null);
  const [balanceOfToken, setbalanceOfToken] = useState(null);

  const [tokenGatingAddress, setTokenGatingAddress] = useState(
    "0x0000000000000000000000000000000000000000",
  );
  const [tempGatingAddress, setTempGatingAddress] = useState();
  const [tempGatingAmount, setTempGatingAmount] = useState(0);

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });
  const usdcConvertDecimal = useSelector((state) => {
    return state.gnosis.tokenDecimal;
  });
  const governanceConvertDecimal = useSelector((state) => {
    return state.gnosis.governanceTokenDecimal;
  });

  const fetchUserBalanceAPI = useCallback(async () => {
    if (daoAddress && governanceConvertDecimal) {
      const fetchUserBalance = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      await fetchUserBalance.checkUserBalance().then(
        (result) => {
          setUserBalance(
            convertFromWeiGovernance(result, governanceConvertDecimal),
          );
          setUserBalanceFetched(true);
        },
        (error) => {
          setUserBalanceFetched(false);
        },
      );
    }
  }, [
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    daoAddress,
    governanceConvertDecimal,
  ]);

  const fetchPerformanceFee = async () => {
    if (daoAddress) {
      const fetchFee = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      try {
        const fetched = await fetchFee.performanceFee();
        setPerformanceFeeValue(fetched);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const fetchTokenType = async () => {
    const response = await fetchClubbyDaoAddress(daoAddress);
    if (response.data.length > 0) {
      setTokenType(response.data[0].tokenType);
    }
  };

  const tokenAPIDetailsRetrieval = async () => {
    let response = await fetchClubbyDaoAddress(daoAddress);
    if (response.data.length > 0) {
      settokenAPIDetails(response.data);
      setClubId(response.data[0].clubId);
      setApiTokenDetailSet(true);
    } else {
      setApiTokenDetailSet(false);
    }
  };

  const tokenDetailsRetrieval = async () => {
    if (
      tokenAPIDetails &&
      tokenAPIDetails.length > 0 &&
      governanceConvertDecimal
    ) {
      const tokenDetailContract = new SmartContract(
        ImplementationContract,
        tokenAPIDetails[0].daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      await tokenDetailContract.tokenDetails().then(
        (result) => {
          settokenDetails(result);
          setUserOwnershipShare(convertFromWeiGovernance(result[2], 18));
          // setClubTokenMInted(
          //   convertFromWeiGovernance(result[2], governanceConvertDecimal),
          // );
          // setDataFetched(true);
        },
        (error) => {
          // setDataFetched(false);
        },
      );
    }
  };

  const fetchMembers = () => {
    if (clubId) {
      const membersData = getMembersDetails(clubId);
      membersData.then((result) => {
        if (result.status != 200) {
          setMembersFetched(false);
        } else {
          setMembersDetails(result.data);
          setMembers(result.data.length);
          setMembersFetched(true);
        }
      });
    }
  };

  const fetchClubAssetToken = () => {
    const tokens = getAssets(clubId);
    tokens.then((result) => {
      if (result.status != 200) {
        setClubAssetTokenFetched(false);
      } else {
        setClubAssetTokenData(result.data);
        setClubAssetTokenFetched(true);
      }
    });
  };

  const nftContractDetails = async () => {
    // console.log("hereeeee");
    try {
      let response = await fetchClubbyDaoAddress(daoAddress);
      console.log("ressss", response);
      const nftAddress = response.data[0].nftAddress;
      setNftContractAddress(nftAddress);
      console.log("res", nftAddress);
      const erc721DetailContract = new SmartContract(
        ImplementationContract,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      const nftContract = new SmartContract(
        nft,
        nftAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      console.log(
        "erc721DetailContract",
        erc721DetailContract.contract.methods,
      );
      console.log("nft contract", nftContract.contract.methods);
      await erc721DetailContract.closeDate().then((result) => {
        setDepositCloseDate(result);
        console.log(calculateDays(parseInt(result) * 1000));

        setClosingDays(calculateDays(parseInt(result) * 1000));
      });

      await erc721DetailContract.quoram().then((result) => {
        setQuoramValue(result);
        setQuoramFetched(true);
      });

      await erc721DetailContract.threshold().then((result) => {
        setThresholdValue(result);
        setThresholdFetched(true);
      });

      await nftContract
        .maxTokensPerUser()
        .then((result) => setMaxTokensPerUser(result));

      await nftContract
        .nftOwnersCount()
        .then((result) => setTotalNftMinted(result));

      await nftContract
        .totalNftSupply()
        .then((result) => setTotalNftSupply(result));

      await nftContract
        .isNftTransferable()
        .then((result) => setIsNftTransferable(result));

      await nftContract
        .isNftTotalSupplyUnlimited()
        .then((result) => setIsNftTotalSupplyUnlimited(result));
    } catch (error) {
      console.log(error);
    }
  };
  const contractDetailsRetrieval = useCallback(
    async (refresh = false) => {
      console.log("governanceConvertDecimal", governanceConvertDecimal);
      if (
        (daoAddress &&
          !governorDataFetched &&
          !governorDetails &&
          walletAddress) ||
        refresh
      ) {
        // const governorDetailContract = new SmartContract(
        //   ImplementationContract,
        //   daoAddress,
        //   undefined,
        //   USDC_CONTRACT_ADDRESS,
        //   GNOSIS_TRANSACTION_URL,
        // );

        const governorDetailContract = new SmartContract(
          ImplementationContract,
          daoAddress,
          undefined,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        console.log(
          "governorDetailContract",
          governorDetailContract,
          governanceConvertDecimal,
        );
        setGovernorDataFetched(true);
        setDataFetched(true);
        await governorDetailContract.closeDate().then((result) => {
          setDepositCloseDate(result);
          setClosingDays(calculateDays(parseInt(result) * 1000));
        });

        await governorDetailContract.gatingTokenAddress().then((result) => {
          setTokenGatingAddress(result);
        });

        await governorDetailContract.minDepositPerUser().then((result) => {
          setCurrentMinDeposit(result);
        });

        await governorDetailContract.maxDepositPerUser().then((result) => {
          setCurrentMaxDeposit(result);
        });

        await governorDetailContract.totalRaiseAmount().then((result) => {
          setTotalERC20Supply(result);
        });

        await governorDetailContract.obtainSymbol().then((result) => {
          setTokenSymbol(result);
        });

        await governorDetailContract.balanceOf().then((result) => {
          console.log("aa", result, governanceConvertDecimal);
          setbalanceOfToken(convertFromWeiGovernance(result, 18));
        });

        await governorDetailContract.balanceOf().then((result) => {
          console.log(
            "result",
            convertFromWeiGovernance(result, governanceConvertDecimal),
          );
          // setTokenSymbol(result);
        });

        // await governorDetailContract.getGovernorDetails().then(
        //   (result) => {
        //     // console.log(result)
        //     setGovernorDetails(result);
        //     // setClosingDays(calculateDays(parseInt(result[0]) * 1000));
        //     setGovernorDataFetched(true);
        //     setCurrentMinDeposit(result[1]);
        //     setCurrentMaxDeposit(result[2]);
        //   },
        //   (error) => {
        //     console.log(error);
        //   },
        // );

        // minimum deposit amount from smart contract
        await governorDetailContract.quoram().then(
          (result) => {
            setQuoramValue(result);
            setQuoramFetched(true);
          },
          (error) => {
            setQuoramFetched(false);
          },
        );

        // maximim deposit amount from smart contract
        await governorDetailContract.threshold().then(
          (result) => {
            setThresholdValue(result);
            setThresholdFetched(true);
          },
          (error) => {
            setQuoramFetched(false);
          },
        );

        await governorDetailContract.erc20TokensMinted().then((result) => {
          setClubTokenMInted(convertFromWeiGovernance(result, 18));
        });
      }

      console.log("governanceConvertDecimal", governanceConvertDecimal);
    },
    [
      GNOSIS_TRANSACTION_URL,
      USDC_CONTRACT_ADDRESS,
      daoAddress,
      governanceConvertDecimal,
      governorDataFetched,
      governorDetails,
      walletAddress,
    ],
  );
  const findCurrentMember = () => {
    if (membersFetched && membersDetails.length > 0 && walletAddress) {
      let obj = membersDetails.find(
        (member) => member.userAddress === walletAddress,
      );
      let pos = membersDetails.indexOf(obj);
      if (pos >= 0) {
        return membersDetails[pos].clubs[0].balance;
      }
      return 0;
    }
  };

  const loadData = () => {
    // setLoaderOpen(true);

    console.log("token typeee", tokenType);
    if (tokenType === "erc721") {
      nftContractDetails();
    } else if (tokenType === "erc20NonTransferable") {
      tokenDetailsRetrieval();

      contractDetailsRetrieval(false);
    }
    tokenAPIDetailsRetrieval();
    fetchMembers();

    if (
      apiTokenDetailSet &&
      dataFetched &&
      governorDataFetched &&
      membersFetched
    ) {
      // setLoaderOpen(false);
    }
  };

  useEffect(() => {
    if (daoAddress) {
      fetchTokenType();
    }
  }, [daoAddress, GNOSIS_TRANSACTION_URL, USDC_CONTRACT_ADDRESS]);

  useEffect(() => {
    if (tokenType !== null) {
      loadData();
    }
  }, [
    daoAddress,
    apiTokenDetailSet,
    dataFetched,
    governorDetails,
    membersFetched,
    tokenType,
  ]);

  useEffect(() => {
    // setLoaderOpen(true);
    console.log("data fetched", dataFetched);
    if (dataFetched) {
      fetchUserBalanceAPI();
      fetchPerformanceFee();
      setLoaderOpen(false);
    }
  }, [dataFetched, fetchUserBalanceAPI]);

  useEffect(() => {
    console.log("club id", clubId);
    if (clubId) {
      fetchClubAssetToken();
    }
  }, [clubId]);

  const handleDayChange = (value) => {
    setDay(value);
  };

  const handleDisableTokenGating = async () => {
    setLoaderOpen(true);
    setOpen(false);
    const contract = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );

    const response = contract.disableTokenGating();
    response.then(
      (result) => {
        contractDetailsRetrieval(true);
        setFailed(false);
        setMessage("Token Gating disabled successfully!");
        setOpenSnackBar(true);
        setLoaderOpen(false);
        contractDetailsRetrieval(true);
      },
      (error) => {
        setFailed(true);
        setMessage("Token Gating disabled failed!");
        setOpenSnackBar(true);
        setLoaderOpen(false);
      },
    );
  };
  const handleEnableDisableContribution = async (enabled) => {
    setLoaderOpen(true);
    setOpen(false);
    const contract = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    if (enabled) {
      const response = contract.closeDeposit();
      response.then(
        (result) => {
          setDataFetched(true);
          setFailed(false);
          setMessage("Contributions disabled!");
          setOpenSnackBar(true);
          setLoaderOpen(false);
          contractDetailsRetrieval(true);
        },
        (error) => {
          setFailed(true);
          setMessage("Contributions failed to be disabled!");
          setOpenSnackBar(true);
          setLoaderOpen(false);
        },
      );
    } else {
      const today = new Date();
      const calculateDay = new Date(day);
      const difference = calculateDay.getTime() - today.getTime();
      const dayCalculated = Math.ceil(difference / (1000 * 3600 * 24));
      const response = contract.startDeposit(dayCalculated);
      response.then(
        (result) => {
          setDataFetched(true);
          setOpen(false);
          setFailed(false);
          setMessage("Contributions enabled!");
          setOpenSnackBar(true);
          setLoaderOpen(false);
          contractDetailsRetrieval(true);
        },
        (error) => {
          setOpen(false);
          setFailed(true);
          setMessage("Contributions failed to be enabled!");
          setOpenSnackBar(true);
          setLoaderOpen(false);
        },
      );
    }
  };

  const handleNftTransferability = (val) => {
    console.log(val);
    setLoaderOpen(true);
    setOpen(false);
    const contract = new SmartContract(
      nft,
      nftContractAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    const response = contract.updateNftTransferability(val);
    response.then(
      (result) => {
        nftContractDetails(true);
        setLoaderOpen(false);
        setFailed(false);
        setIsNftTransferable(val);
        setMessage(" NFT Transferablity successfully updated!");
        setOpenSnackBar(true);
      },
      (error) => {
        setLoaderOpen(false);
        setFailed(true);
        setMessage(" NFT Transferablity failed to be updated!");
        setOpenSnackBar(true);
      },
    );
  };

  const handleNFTContractUpdates = async (updateType) => {
    setLoaderOpen(true);
    setOpen(false);
    const contract = new SmartContract(
      nft,
      nftContractAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    console.log("nftContract", contract);
    if (settingsOptions[4].name === updateType) {
      console.log("maxToken", maxTokensPerUser);
      const response = contract.updateMaxTokensPerUser(maxTokensPerUser);
      response.then(
        (result) => {
          nftContractDetails(true);
          setLoaderOpen(false);
          setFailed(false);
          setMessage("Max token per user successfully updated!");
          setOpenSnackBar(true);
        },
        (error) => {
          setLoaderOpen(false);
          setFailed(true);
          setMessage("Max token per user failed to be updated!");
          setOpenSnackBar(true);
        },
      );
    }
    if (settingsOptions[5].name === updateType) {
      // console.log("maxToken", maxTokensPerUser);
      const response = contract.updateTotalSupplyOfToken(changedNftSupply);
      response.then(
        (result) => {
          nftContractDetails(true);
          setLoaderOpen(false);
          setFailed(false);
          setTotalNftSupply(changedNftSupply);
          setMessage("Total NFT Supply successfully updated!");
          setOpenSnackBar(true);
        },
        (error) => {
          setLoaderOpen(false);
          setFailed(true);
          setMessage("Total NFT Supply failed to be updated!");
          setOpenSnackBar(true);
        },
      );
    }
    if (settingsOptions[5].name === updateType) {
      // console.log("maxToken", maxTokensPerUser);
      const response = contract.updateTotalSupplyOfToken(
        changeNtTransferability,
      );
      response.then(
        (result) => {
          nftContractDetails(true);
          setLoaderOpen(false);
          setFailed(false);
          setIsNftTransferable(changeNtTransferability);
          setMessage(" NFT Transferablity successfully updated!");
          setOpenSnackBar(true);
        },
        (error) => {
          setLoaderOpen(false);
          setFailed(true);
          setMessage(" NFT Transferablity failed to be updated!");
          setOpenSnackBar(true);
        },
      );
    }
  };

  const handleContractUpdates = async (updateType) => {
    setLoaderOpen(true);
    setOpen(false);

    const contract = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );

    if (settingsOptions[1].name === updateType) {
      //  case for min update
      const convertedMinDeposit = convertToWei(minDeposit, usdcConvertDecimal);
      if (convertedMinDeposit >= currentMaxDeposit) {
        setLoaderOpen(false);
        setFailed(true);
        setMessage(
          "Minimum deposit should not be greater than or equal to previous maximum deposit!",
        );
        setOpenSnackBar(true);
      } else {
        const response = contract.updateMinMaxDeposit(
          convertedMinDeposit,
          currentMaxDeposit,
        );
        response.then(
          (result) => {
            contractDetailsRetrieval(true);
            setLoaderOpen(false);
            setFailed(false);
            setMessage("Minimum deposit successfully updated!");
            setOpenSnackBar(true);
          },
          (error) => {
            setLoaderOpen(false);
            setFailed(true);
            setMessage("Minimum deposit failed to be updated!");
            setOpenSnackBar(true);
          },
        );
      }
    }
    if (settingsOptions[2].name === updateType) {
      // case for max update
      const convertedMaxDeposit = convertToWei(maxDeposit, usdcConvertDecimal);
      if (convertedMaxDeposit <= currentMinDeposit) {
        setLoaderOpen(false);
        setFailed(true);
        setMessage(
          "Maximum deposit should not be less than or equal to previous minimum deposit!",
        );
        setOpenSnackBar(true);
      } else {
        const response = contract.updateMinMaxDeposit(
          currentMinDeposit,
          convertedMaxDeposit,
        );
        response.then(
          (result) => {
            contractDetailsRetrieval(true);
            setLoaderOpen(false);
            setFailed(false);
            setMessage("Maximum deposit successfully updated!");
            setOpenSnackBar(true);
          },
          (error) => {
            setLoaderOpen(false);
            setFailed(true);
            setMessage("Maximum deposit failed to be updated!");
            setOpenSnackBar(true);
          },
        );
      }
    }
    if (settingsOptions[3].name === updateType) {
      //case for performance update
      if (performanceFee > 100) {
        setLoaderOpen(false);
        setFailed(false);
        setMessage("Performance fee cannot be greater than 100%!");
        setOpenSnackBar(true);
      } else {
        const response = contract.updateOwnerFee(performanceFee);
        response.then(
          (result) => {
            fetchPerformanceFee();
            setLoaderOpen(false);
            setFailed(false);
            setMessage("Performance fee successfully updated!");
            setOpenSnackBar(true);
          },
          (error) => {
            setLoaderOpen(false);
            setFailed(false);
            setMessage("Performance fee failed to be updated!");
            setOpenSnackBar(true);
          },
        );
      }
    }
    if (settingsOptions[7].name === updateType) {
      //case for enable token gating
      const tokenMetadata = await getTokenMetadata(tempGatingAddress);
      if (tempGatingAddress.length === 0) {
        setLoaderOpen(false);
        setFailed(false);
        setMessage("Token gating address cannot be empty");
        setOpenSnackBar(true);
      } else if (tempGatingAmount === 0 || tempGatingAmount === "") {
        setLoaderOpen(false);
        setFailed(false);
        setMessage("Token gating amount cannot be 0");
        setOpenSnackBar(true);
      } else if (tokenMetadata.result) {
        const tokenDecimals = await getTokensDecimalFromAddress(
          tempGatingAddress,
        );
        const response = contract.enableTokenGating(
          tempGatingAddress,
          convertToWeiGovernance(tempGatingAmount, tokenDecimals).toString(),
        );

        response.then(
          (result) => {
            contractDetailsRetrieval(true);
            setLoaderOpen(false);
            setFailed(false);
            setMessage("Token Gating successfully updated!");
            setOpenSnackBar(true);
          },
          (error) => {
            setLoaderOpen(false);
            setFailed(false);
            setMessage("Token Gating failed to be updated!");
            setOpenSnackBar(true);
          },
        );
      } else {
        setLoaderOpen(false);
        setFailed(false);
        setMessage("Enter a valid contract address");
        setOpenSnackBar(true);
      }
    }
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    setTempOpen(true);
  };

  const handleTempClose = (e) => {
    e.preventDefault();
    setTempOpen(false);
  };
  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleSetTokenType = (value) => {
    const index = tokenList.length === 0 ? 0 : tokenList.length;
    const list = [...isNFT];
    if (value === "ERC20") {
      list[index] = false;
    } else {
      list[index] = true;
    }
    setIsNFT(list);
  };

  const handleTokenInputChange = (tokenAddress) => {
    const index = tokenList.length === 0 ? 0 : tokenList.length;
    const list = [...tokenList];
    list[index] = tokenAddress;
    setTokenList(list);
    setTokenSearchOpen(false);
  };

  const handleRemoveTokenClick = (index) => {
    const list = [...tokenList];
    list.splice(index, 1);
    setTokenList(list);
  };

  const handleTokenMinimumChange = (event, key) => {
    const list = [...tokenMinimum];
    list[key] = parseInt(event.target.value);
    setTokenMinimum(list);
  };

  const handleTokenSearchClose = () => {
    setTokenSearchOpen(false);
  };

  const handleOperationTypeChange = (event) => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
    let operation;
    if (event.target.checked) {
      operation = "OR";
    } else {
      operation = "AND";
    }
    let list = [];
    for (let i = 0; i < tokenList.length; i++) {
      list.push(operation);
    }
    setOperationType(list);
  };

  const updateTokenList = () => {
    setLoaderOpen(true);
    const contract = new SmartContract(
      ImplementationContract,
      daoAddress,
      undefined,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    );
    const response = contract.setupTokenGating(
      tokenList,
      tokenMinimum,
      operationType,
      isNFT,
    );
    response.then(
      (result) => {
        setLoaderOpen(false);
        setFailed(false);
        setMessage("Token gating successfull!");
        setOpenSnackBar(true);
      },
      (error) => {
        setLoaderOpen(false);
        setFailed(true);
        setMessage("Issue with adding token to token gating!");
        setOpenSnackBar(true);
      },
    );
  };

  return (
    <>
      <Layout1 page={5}>
        <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
          <Grid item md={9}>
            <Card className={classes.cardRegular}>
              <Grid container spacing={2}>
                <Grid item mt={3} ml={3}>
                  <img src={imageUrl ?? null} width="100vw" alt="profile_pic" />
                </Grid>
                <Grid item ml={1} mt={4} mb={7}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {apiTokenDetailSet ? tokenAPIDetails[0].name : null}
                    </Typography>
                    <Typography variant="h6" className={classes.dimColor}>
                      {dataFetched ? "$" + tokenSymbol : null}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Divider variant="middle" />
              <Paper
                style={{
                  background: "transparent",
                  boxShadow: "none",
                  paddingTop: "50px",
                  paddingLeft: "30px",
                }}
              >
                <Grid container spacing={7}>
                  <Grid item md={3}>
                    <Typography variant="settingText">
                      Deposits deadline
                    </Typography>
                    <Grid container>
                      <Grid item mt={1}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {tokenType === "erc721" && depositCloseDate ? (
                            new Date(parseInt(depositCloseDate) * 1000)
                              ?.toJSON()
                              ?.slice(0, 10)
                              .split("-")
                              .reverse()
                              .join("/")
                          ) : governorDataFetched ? (
                            new Date(parseInt(depositCloseDate) * 1000)
                              ?.toJSON()
                              ?.slice(0, 10)
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
                      <Grid item ml={1} mt={1}>
                        {governorDataFetched || tokenType === "erc721" ? (
                          closingDays > 0 ? (
                            <Card className={classes.openTag}>
                              <Typography className={classes.openTagFont}>
                                Open
                              </Typography>
                            </Card>
                          ) : (
                            <Card className={classes.closeTag}>
                              <Typography className={classes.closeTagFont}>
                                {console.log(depositCloseDate)}
                                Closed
                              </Typography>
                            </Card>
                          )
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      {tokenType === "erc721" ? (
                        <>
                          <Grid container direction="column">
                            <Grid item>
                              <Typography
                                variant="p"
                                className={classes.valuesDimStyle}
                              >
                                Max Token Per User
                              </Typography>
                            </Grid>
                            <Grid item mt={1}>
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {maxTokensPerUser !== null ? (
                                  maxTokensPerUser
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
                        </>
                      ) : (
                        <>
                          <Grid item>
                            <Typography
                              variant="p"
                              className={classes.valuesDimStyle}
                            >
                              Minimum Deposits
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {governorDataFetched ? (
                                convertAmountToWei(
                                  currentMinDeposit.toString(),
                                ) + " USDC"
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      {tokenType === "erc721" ? (
                        <>
                          <Grid item>
                            <Typography
                              variant="p"
                              className={classes.valuesDimStyle}
                            >
                              Is NFT Tranferable
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {isNftTransferable !== null ? (
                                isNftTransferable ? (
                                  "true"
                                ) : (
                                  "false"
                                )
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item>
                            <Typography
                              variant="p"
                              className={classes.valuesDimStyle}
                            >
                              Maximum Deposit
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {governorDataFetched ? (
                                convertAmountToWei(
                                  currentMaxDeposit.toString(),
                                ) + " USDC"
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}{" "}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
                          Members
                        </Typography>
                      </Grid>
                      <Grid item mt={{ lg: 5, xl: 1 }}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {membersFetched ? members : 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="settingText">
                          Treasury wallet
                        </Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          $
                          {clubAssetTokenFetched ? (
                            clubAssetTokenData.treasuryAmount
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
                  <Grid item md={3}>
                    {tokenType === "erc721" ? null : (
                      <Grid container direction="column">
                        <Grid item>
                          <Typography variant="settingText">
                            Your ownership
                          </Typography>
                        </Grid>
                        <Grid item mt={2}>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {balanceOfToken !== null && clubTokenMinted !== null
                              ? isNaN(
                                  parseInt(
                                    calculateUserSharePercentage(
                                      balanceOfToken,
                                      clubTokenMinted,
                                    ),
                                  ),
                                )
                                ? 0
                                : parseInt(
                                    calculateUserSharePercentage(
                                      balanceOfToken,
                                      clubTokenMinted,
                                    ),
                                  )
                              : 0}
                            % ({balanceOfToken} {tokenSymbol})
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  {isGovernanceActive ? (
                    <>
                      {" "}
                      <Grid item md={3}>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="settingText">
                              Threshold
                            </Typography>
                          </Grid>
                          <Grid item mt={2}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {thresholdFetched ? (
                                thresholdValue
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
                      <Grid item md={3}>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="settingText">
                              Quorum
                            </Typography>
                          </Grid>
                          <Grid item mt={2}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {quoramFetched ? (
                                quoramValue
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
                    </>
                  ) : null}
                </Grid>
              </Paper>

              {tokenType === "erc721" ? (
                <>
                  <br />
                  <Grid container spacing={7}>
                    {tokenType === "erc721" ? (
                      <>
                        <Grid item md={3} ml={4}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              NFTs Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {totalNftMinted !== null ? (
                                totalNftMinted
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              Total Supply
                            </Typography>
                            {tokenType === "erc721" ? (
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {totalNftSupply !== null ? (
                                  isNftTotalSupplyUnlimited ? (
                                    "Unlimited"
                                  ) : (
                                    totalNftSupply
                                  )
                                ) : (
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={25}
                                  />
                                )}{" "}
                              </Typography>
                            ) : (
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {governorDataFetched ? (
                                  // convertAmountToWei(totalERC20Supply?.toString()) +
                                  // (" $" + tokenDetails[1])
                                  // convertAmountToWei(String(totalERC20Supply))
                                  ` ${
                                    totalERC20Supply / Math.pow(10, 6)
                                  } ${tokenSymbol}`
                                ) : (
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={25}
                                  />
                                )}{" "}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item md={3} ml={4}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              Club Tokens Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {governorDataFetched ? (
                                parseInt(clubTokenMinted) + " $" + tokenSymbol
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              Total Supply
                            </Typography>
                            {tokenType === "erc721" ? (
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {totalNftSupply !== null ? (
                                  isNftTotalSupplyUnlimited ? (
                                    "Unlimited"
                                  ) : (
                                    totalNftSupply
                                  )
                                ) : (
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={25}
                                  />
                                )}{" "}
                              </Typography>
                            ) : (
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {governorDataFetched ? (
                                  // convertAmountToWei(totalERC20Supply?.toString()) +
                                  // (" $" + tokenDetails[1])
                                  // convertAmountToWei(String(totalERC20Supply))
                                  ` ${
                                    totalERC20Supply / Math.pow(10, 6)
                                  } ${tokenSymbol}`
                                ) : (
                                  <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={25}
                                  />
                                )}{" "}
                              </Typography>
                            )}
                          </Stack>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item ml={3} mt={5} mb={2} mr={3}>
                    <ProgressBar
                      value={
                        clubTokenMinted && totalERC20Supply
                          ? calculateTreasuryTargetShare(
                              clubTokenMinted,
                              totalERC20Supply / 1000000,
                            )
                          : 0
                      }
                    />
                  </Grid>

                  <Grid container spacing={2}>
                    {tokenType === "erc721" ? (
                      <>
                        <Grid item ml={4} mt={1} mb={2}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              NFTs Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {totalNftMinted !== null ? (
                                totalNftMinted
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Stack>
                        </Grid>
                      </>
                    ) : (
                      <Grid item ml={4} mt={1} mb={2}>
                        <Stack spacing={1}>
                          <Typography variant="settingText">
                            Club Tokens Minted so far
                          </Typography>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {governorDataFetched ? (
                              parseInt(clubTokenMinted) + " $" + tokenSymbol
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                          </Typography>
                        </Stack>
                      </Grid>
                    )}

                    <Grid
                      item
                      ml={4}
                      mt={1}
                      mb={2}
                      mr={4}
                      xs
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Stack spacing={1}>
                        <Typography variant="settingText">
                          Total Supply
                        </Typography>
                        {tokenType === "erc721" ? (
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {totalNftSupply !== null ? (
                              isNftTotalSupplyUnlimited ? (
                                "Unlimited"
                              ) : (
                                totalNftSupply
                              )
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}{" "}
                          </Typography>
                        ) : (
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {governorDataFetched ? (
                              // convertAmountToWei(totalERC20Supply?.toString()) +
                              // (" $" + tokenDetails[1])
                              // convertAmountToWei(String(totalERC20Supply))
                              ` ${
                                totalERC20Supply / Math.pow(10, 6)
                              } ${tokenSymbol}`
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}{" "}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </>
              )}
            </Card>
            <br />
            <Card className={classes.cardRegular}>
              <Grid container item mb={4} spacing={3} mt={3} ml={3}>
                <Typography variant="h4">Additional Details</Typography>
              </Grid>
              <Stack spacing={3} ml={3}>
                {tokenType === "erc721" ? (
                  <Grid container>
                    <Grid item>
                      <Typography variant="settingText">
                        NFT contract address
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                      spacing={1}
                    >
                      <Grid item>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            navigator.clipboard.writeText(nftContractAddress);
                          }}
                        >
                          <ContentCopyIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            window.open(
                              `https://rinkeby.etherscan.io/address/${nftContractAddress}`,
                            );
                          }}
                        >
                          <OpenInNewIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item mr={4}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {nftContractAddress !== null ? (
                            nftContractAddress.substring(0, 6) +
                            "......" +
                            nftContractAddress.substring(
                              nftContractAddress.length - 4,
                            )
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
                ) : null}
                <Divider />
                <Grid container>
                  <Grid item>
                    <Typography variant="settingText">
                      Club contract address
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                    spacing={1}
                  >
                    <Grid item>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          navigator.clipboard.writeText(daoAddress);
                        }}
                      >
                        <ContentCopyIcon className={classes.iconColor} />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          window.open(
                            `https://rinkeby.etherscan.io/address/${daoAddress}`,
                          );
                        }}
                      >
                        <OpenInNewIcon className={classes.iconColor} />
                      </IconButton>
                    </Grid>
                    <Grid item mr={4}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {apiTokenDetailSet ? (
                          tokenAPIDetails[0].daoAddress.substring(0, 6) +
                          "......" +
                          tokenAPIDetails[0].daoAddress.substring(
                            tokenAPIDetails[0].daoAddress.length - 4,
                          )
                        ) : tokenType === "erc721" ? (
                          daoAddress.substring(0, 6) +
                          "......" +
                          daoAddress.substring(daoAddress.length - 4)
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

                <Divider />

                {/* <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Hot wallet address</Typography>
                    </Grid>
                    <Grid container sx={{ display: "flex", justifyContent: "flex-end" }} spacing={1}>
                      <Grid item>
                        <ContentCopyIcon className={classes.iconColor} />
                      </Grid>
                      <Grid item>
                        <LinkIcon className={classes.iconColor} />
                      </Grid>
                      <Grid item mr={4}>
                        <Typography variant="p" className={classes.valuesStyle}>0x4e6Apas0j39d2038d02937dsk</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider /> */}

                {/* <Grid container ml={3} mr={4}>
                  <Grid item >
                    <Typography variant="settingText">Accept new member requests?</Typography>
                  </Grid>
                  <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="p" className={classes.valuesStyle}>Yes <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container ml={3} mr={4}>
                  <Grid item >
                    <Typography variant="settingText">Enable/disable withdrawals from treasury wallet</Typography>
                  </Grid>
                  <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="p" className={classes.valuesStyle}>Enabled <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                  </Grid>
                </Grid>
                <Divider />

                <Grid container ml={3} mr={4}>
                  <Grid item >
                    <Typography variant="settingText">Gate contributions?</Typography>
                  </Grid>
                  <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="p" className={classes.valuesStyle}>No <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                  </Grid>
                </Grid>
                <Divider /> */}

                <Grid container ml={3} mr={4}>
                  <Grid item>
                    <Typography variant="settingText">
                      Enable/Disable contributions
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    mr={4}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {governorDataFetched || tokenType === "erc721" ? (
                      closingDays > 0 ? (
                        <Typography variant="p" className={classes.valuesStyle}>
                          Enabled
                          {isAdminUser ? (
                            <a
                              className={classes.activityLink}
                              onClick={(e) => {
                                setSettingType("deposit");
                                setEnabled(true);
                                setOpen(true);
                              }}
                            >
                              {" "}
                              (Disable)
                            </a>
                          ) : null}
                        </Typography>
                      ) : (
                        <Typography variant="p" className={classes.valuesStyle}>
                          Disabled
                          {isAdminUser ? (
                            <a
                              className={classes.activityLink}
                              onClick={(e) => {
                                setSettingType("deposit");
                                setEnabled(false);
                                setOpen(true);
                              }}
                            >
                              {" "}
                              (Enable)
                            </a>
                          ) : null}
                        </Typography>
                      )
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Grid>
                </Grid>
                <Divider />
                <Grid item>
                  <Typography variant="settingText">Token Gating</Typography>
                </Grid>
                <Grid
                  item
                  mr={4}
                  xs
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  {/* {tokenGatingAddress ? ( */}
                  {tokenGatingAddress !==
                  "0x0000000000000000000000000000000000000000" ? (
                    <Typography variant="p" className={classes.valuesStyle}>
                      Enabled
                      {isAdminUser ? (
                        <a
                          className={classes.activityLink}
                          onClick={(e) => {
                            setSettingType("token_gating");
                            setEnabled(true);
                            setOpen(true);
                          }}
                        >
                          {" "}
                          (Disable)
                        </a>
                      ) : null}
                    </Typography>
                  ) : (
                    <Typography variant="p" className={classes.valuesStyle}>
                      Disabled
                      {isAdminUser ? (
                        <a
                          className={classes.activityLink}
                          onClick={(e) => {
                            setSettingType("token_gating");
                            setEnabled(false);
                            setOpen(true);
                          }}
                        >
                          {" "}
                          (Enable)
                        </a>
                      ) : null}
                    </Typography>
                  )}

                  {/* : (
                    <Skeleton variant="rectangular" width={100} height={25} />
                  )} */}
                </Grid>

                <Divider />
                <Grid container ml={3} mr={4}>
                  <Grid item>
                    <Typography variant="settingText">
                      {tokenType === "erc721"
                        ? "Maximum Tokens Per User"
                        : "Minimum deposit amount for new members"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    mr={4}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography variant="p" className={classes.valuesStyle}>
                      {tokenType === "erc721" ? (
                        maxTokensPerUser
                      ) : governorDataFetched ? (
                        `${convertAmountToWei(
                          currentMinDeposit.toString(),
                        )}   USDC`
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                      {isAdminUser ? (
                        <a
                          className={classes.activityLink}
                          onClick={(e) => {
                            if (tokenType === "erc721") {
                              setSettingType("maxTokenPerUser");
                            } else {
                              setSettingType("minDeposit");
                            }
                            setOpen(true);
                          }}
                        >
                          {" "}
                          (change)
                        </a>
                      ) : null}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container ml={3} mr={4}>
                  <Grid item>
                    <Typography variant="settingText">
                      {tokenType === "erc721"
                        ? "Total Supply of NFTs"
                        : "Maximum deposit amount for new members"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    mr={4}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography variant="p" className={classes.valuesStyle}>
                      {tokenType === "erc721" ? (
                        isNftTotalSupplyUnlimited ? (
                          "Unlimited"
                        ) : (
                          totalNftSupply
                        )
                      ) : governorDataFetched ? (
                        `${convertAmountToWei(
                          currentMaxDeposit.toString(),
                        )}   USDC`
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}

                      {isAdminUser ? (
                        <a
                          className={classes.activityLink}
                          onClick={(e) => {
                            if (tokenType === "erc721") {
                              setSettingType("totalNFTSupply");
                            } else {
                              setSettingType("maxDeposit");
                            }
                            setOpen(true);
                          }}
                        >
                          {" "}
                          (change)
                        </a>
                      ) : null}
                    </Typography>
                  </Grid>
                </Grid>

                {tokenType === "erc721" && (
                  <>
                    <Divider />
                    <Grid container ml={3} mr={4}>
                      <Grid item>
                        <Typography variant="settingText">
                          Is NFT transferable
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        mr={4}
                        xs
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Typography variant="p" className={classes.valuesStyle}>
                          {isNftTransferable !== null ? (
                            isNftTransferable ? (
                              "true"
                            ) : (
                              "false"
                            )
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}

                          {isAdminUser ? (
                            <a
                              className={classes.activityLink}
                              onClick={(e) => {
                                setSettingType("isNFTtransferable");
                                setOpen(true);
                              }}
                            >
                              {" "}
                              (change)
                            </a>
                          ) : null}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}

                {/*<Divider />
                <Grid container ml={3} mr={4}>
                  <Grid item >
                    <Typography variant="settingText">Minimum votes to validate a proposal</Typography>
                  </Grid>
                  <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="p" className={classes.valuesStyle}>{minDepositFetched ? minDeposit + "%" : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container ml={3} mr={4}>
                  <Grid item >
                    <Typography variant="settingText">Minimum supporting votes to pass a proposal</Typography>
                  </Grid>
                  <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="p" className={classes.valuesStyle}>{maxDepositFetched ? maxDeposit + "%" : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                  </Grid>
                </Grid> */}

                <Divider />
                <Grid container ml={3} mr={4}>
                  <Grid item>
                    <Typography variant="settingText">
                      Performance fees
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    mr={4}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography variant="p" className={classes.valuesStyle}>
                      {performanceFeeValue}
                      {isAdminUser ? (
                        <a
                          className={classes.activityLink}
                          onClick={(e) => {
                            setSettingType("performanceFee");
                            setOpen(true);
                          }}
                        >
                          <span style={{ color: "#fff" }}>%</span> (change)
                        </a>
                      ) : null}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
                {/* <Grid container ml={3} mr={4}>
                  <Grid item >
                    <Typography variant="settingText">Allow deposits till this date</Typography>
                  </Grid>
                  <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? new Date(parseInt(governorDetails[0]) * 1000).toJSON().slice(0, 10).split('-').reverse().join('/') : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                  </Grid>
                </Grid>
                <Divider /> */}

                {/* <Grid container ml={3} mr={4}>
                  <Grid item>
                    <Typography variant="settingText">Token Gating</Typography>
                  </Grid>
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
                      <Typography className={classes.largeText}>
                        Add more tokens to your club
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
                      <IconButton
                        aria-label="add"
                        onClick={() => setTokenSearchOpen(true)}
                      >
                        <AddCircleOutlinedIcon
                          className={classes.addCircleColour}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {tokenList ? (
                    <Grid container pl={3} pr={1} mt={2} mb={2}>
                      {tokenList.map((data, key) => {
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
                                label="Token address"
                                error={
                                  !/^0x[a-zA-Z0-9]+/gm.test(tokenList[key])
                                }
                                variant="outlined"
                                value={data}
                                onChange={(e) => handleTokenInputChange(e, key)}
                                placeholder={"0x"}
                                sx={{
                                  m: 1,
                                  width: 443,
                                  mt: 1,
                                  borderRadius: "10px",
                                }}
                              />
                              <TextField
                                label="Minimum Amount"
                                error={!/^[0-9]+/gm.test(tokenMinimum[key])}
                                variant="outlined"
                                onChange={(e) =>
                                  handleTokenMinimumChange(e, key)
                                }
                                placeholder={"0"}
                                sx={{
                                  m: 1,
                                  width: 200,
                                  mt: 1,
                                  borderRadius: "10px",
                                }}
                              />
                              <IconButton
                                aria-label="add"
                                onClick={handleRemoveTokenClick}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </>
                        );
                      })}
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
                        <FormControlLabel
                          control={
                            <Android12Switch
                              checked={checked}
                              onChange={handleOperationTypeChange}
                            />
                          }
                          label={"AND / OR"}
                          labelPlacement="top"
                        />
                        {isAdminUser ? (
                          <a
                            className={classes.activityLink}
                            onClick={updateTokenList}
                          >
                            {" "}
                            (Update)
                          </a>
                        ) : null}
                      </Grid>
                    </Grid>
                  ) : null}

                  <TokenSearch
                    tokenSearchOpen={tokenSearchOpen}
                    tokenSearchClose={handleTokenSearchClose}
                    setTokenSearchOpen={setTokenSearchOpen}
                    setSearchTokenAddress={setSearchTokenAddress}
                    searchTokenAddress={searchTokenAddress}
                    handleTokenInputChange={handleTokenInputChange}
                    handleSetTokenType={handleSetTokenType}
                    setLoaderOpen={setLoaderOpen}
                  />
                </Grid>
                <Divider /> */}
              </Stack>
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
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              mt={3}
            >
              <Grid item m={3}>
                {settingsOptions[0].name === settingType ? (
                  enabled ? (
                    <>
                      <Typography className={classes.dialogBox}>
                        Do you want to disable contributions?
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() =>
                              handleEnableDisableContribution(true)
                            }
                          >
                            Disable
                          </Button>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Typography className={classes.dialogBox}>
                        Do you want to enable contributions?
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid
                          container
                          mt={1}
                          mb={2}
                          spacing={2}
                          direction="column"
                        >
                          <Grid item>
                            <Typography variant="proposalBody">
                              Deposit till
                            </Typography>
                          </Grid>
                          <Grid item>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DesktopDatePicker
                                error={day === null}
                                inputFormat="dd/MM/yyyy"
                                value={day}
                                onChange={(e) => handleDayChange(e)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className={classes.datePicker}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() =>
                              handleEnableDisableContribution(false)
                            }
                            disabled={day === null}
                          >
                            Enable
                          </Button>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )
                ) : settingsOptions[1].name === settingType ? (
                  <>
                    <Typography className={classes.dialogBox}>
                      Update minimum deposit amount for new member
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid container item>
                        <TextField
                          sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                          className={classes.cardTextBox}
                          placeholder="Enter the update amount"
                          onChange={(e) => setMinDeposit(e.target.value)}
                        />
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleContractUpdates(settingType)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CancelIcon />}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : settingsOptions[2].name === settingType ? (
                  <>
                    <Typography className={classes.dialogBox}>
                      Update maximum deposit amount for new member
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid container item>
                        <TextField
                          sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                          className={classes.cardTextBox}
                          placeholder="Enter the update amount"
                          onChange={(e) => setMaxDeposit(e.target.value)}
                        />
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleContractUpdates(settingType)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CancelIcon />}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : settingsOptions[3].name === settingType ? (
                  <>
                    <Typography className={classes.dialogBox}>
                      Update performance fee of club (in %)
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid container item>
                        <TextField
                          sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                          className={classes.cardTextBox}
                          placeholder="Enter the performance fee percentage"
                          onChange={(e) => setPerformanceFee(e.target.value)}
                        />
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleContractUpdates(settingType)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CancelIcon />}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : settingsOptions[4].name === settingType ? (
                  <>
                    <Typography className={classes.dialogBox}>
                      Update Max Token per User
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid container item>
                        <TextField
                          sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                          className={classes.cardTextBox}
                          placeholder="Enter new token allowed per user"
                          onChange={(e) => setMaxTokensPerUser(e.target.value)}
                        />
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleNFTContractUpdates(settingType)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CancelIcon />}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : settingsOptions[5].name === settingType ? (
                  <>
                    <Typography className={classes.dialogBox}>
                      Update Total NFT Supply
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid container item>
                        <TextField
                          sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                          className={classes.cardTextBox}
                          placeholder="Enter new NFT Supply"
                          onChange={(e) => setChangedNftSupply(e.target.value)}
                        />
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleNFTContractUpdates(settingType)}
                        >
                          Update
                        </Button>
                      </Grid>
                      <Grid item m={3}>
                        <Button
                          variant="primary"
                          startIcon={<CancelIcon />}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : settingsOptions[6].name === settingType ? (
                  isNftTransferable ? (
                    <>
                      <Typography className={classes.dialogBox}>
                        Do you want to make NFT non-transferable?
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => {
                              handleNftTransferability(false);
                            }}
                          >
                            Disable
                          </Button>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Typography className={classes.dialogBox}>
                        Do you want to make NFT transferable?
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => {
                              handleNftTransferability(true);
                            }}
                          >
                            Enable
                          </Button>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )
                ) : settingsOptions[7].name === settingType ? (
                  tokenGatingAddress ===
                  "0x0000000000000000000000000000000000000000" ? (
                    <>
                      <Typography className={classes.dialogBox}>
                        Enable Token Gating
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={3}
                      >
                        <Grid container item>
                          <TextField
                            sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                            className={classes.cardTextBox}
                            placeholder="Enter token address"
                            onChange={(e) =>
                              setTempGatingAddress(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid container item>
                          <TextField
                            sx={{ width: "95%", backgroundColor: "#C1D3FF40" }}
                            className={classes.cardTextBox}
                            placeholder="Enter token amount"
                            type="number"
                            onChange={(e) =>
                              setTempGatingAmount(e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleContractUpdates(settingType)}
                          >
                            Update
                          </Button>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Typography className={classes.dialogBox}>
                        Do you want to disable token gating ?
                      </Typography>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleDisableTokenGating()}
                          >
                            Disable
                          </Button>
                        </Grid>
                        <Grid item m={3}>
                          <Button
                            variant="primary"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )
                ) : null}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {/* This is the temporary coming soon dialogue */}
        <Dialog
          open={tempOpen}
          onClose={handleTempClose}
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
              <Grid item>
                <img src="/assets/images/comingsoon.svg" />
              </Grid>
              <Grid item m={3}>
                <Typography className={classes.dialogBox}>
                  Hold tight! Coming soon
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loaderOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

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
      </Layout1>
    </>
  );
};

export default ClubFetch(Settings);
