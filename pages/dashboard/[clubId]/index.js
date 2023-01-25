import { React, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Layout1 from "../../../src/components/layouts/layout1";
import {
  Box,
  Card,
  Grid,
  Typography,
  CardMedia,
  Stack,
  Button,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  Link,
  CircularProgress,
  Backdrop,
  ListItemButton,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ButtonDropDown from "../../../src/components/buttondropdown";
import CollectionCard from "../../../src/components/cardcontent";
import { useRouter } from "next/router";
import ClubFetch from "../../../src/utils/clubFetch";
import { SmartContract } from "../../../src/api/contract";
import { getProposal } from "../../../src/api/proposal";
import { fetchClubbyDaoAddress } from "../../../src/api/club";
import { getNfts } from "../../../src/api/gnosis";
import { getAssets } from "../../../src/api/assets";
import { getMembersDetails } from "../../../src/api/user";
import ImplementationContact from "../../../src/abis/implementationABI.json";
import { useSelector } from "react-redux";
import {
  calculateDays,
  calculateUserSharePercentage,
  convertAmountToWei,
  convertFromWei,
  convertFromWeiGovernance,
} from "../../../src/utils/globalFunctions";

const useStyles = makeStyles({
  media: {
    position: "absolute",
    bottom: 0,
  },
  firstCard: {
    position: "relative",
    width: "Infinity",
    height: "164px",
    padding: "0px",

    background: "#6A66FF no-repeat",
    variant: "outlined",
  },
  secondCard: {
    position: "relative",
    width: "Infinityvw",
    height: "164px",
    padding: "0px",
    // marginTop: "20px",

    background: "#0ABB92 no-repeat padding-box",
  },
  thirdCard: {
    width: "22vw",
    height: "351px",
  },
  fifthCard: {
    width: "22vw",
    height: "350px",
    background: "#FFFFDD no-repeat padding-box",
  },
  cardOverlay: {
    position: "absolute",
    top: "30px",
    left: "30px",
    right: "30px",
    bottom: "30px",
  },
  cardSharp1: {
    backgroundColor: "#19274B",
    borderRadius: "10px",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    opacity: 1,
    width: "100%",
  },
  cardSharp2: {
    backgroundColor: "#142243",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    opacity: 1,
  },
  card1text1: {
    fontFamily: "Whyte",
    fontSize: "3.4vh",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text2: {
    fontFamily: "Whyte",
    fontSize: "2.2vh",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
    paddingLeft: "10px",
  },
  card1text3: {
    fontFamily: "Whyte",

    fontSize: "15px",
    color: "#C1D3FF",

    opacity: "1",
  },
  card1text4: {
    fontFamily: "Whyte",
    fontWeight: "bold",
    fontSize: "50px",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text5: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card2text1: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text2: {
    fontFamily: "Whyte",
    fontSize: "20px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text3: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#0ABB92",
    opacity: "1",
  },
  card2text4: {
    fontFamily: "Whyte",
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text5: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text6: {
    fontFamily: "Whyte",
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text7: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text8: {
    fontFamily: "Whyte",
    fontSize: "18px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text9: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card3text1: {
    fontSize: "19px",
    fontFamily: "Whyte",
  },
  card3text2: {
    fontFamily: "Whyte",
    fontSize: "19px",
    color: "#0ABB92",
  },
  card3text3: {
    fontFamily: "Whyte",
    width: "354px",
    color: "#C1D3FF",
  },
  card3text4: {
    fontFamily: "Whyte",
    textAlign: "left",
    fontSize: "6px",
    letteSpacing: "0.2px",
    color: "#C1D3FF",
    opacity: "1",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
  },
  inactiveIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#D55438",
    borderRadius: "50%",
  },
  copyButton: {
    width: "68px",
    height: "30px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "15px",
  },
  linkInput: {
    "width": "100%",
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
  divider: {
    paddingLeft: "20%",
  },
  clubAssets: {
    fontFamily: "Whyte",
    fontSize: "40px",
    color: "#FFFFFF",
  },
  fourthCard: {
    width: "22vw",
    borderRadius: "20px",
  },
  pendingIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
  },
  card5text1: {
    fontFamily: "Whyte",
    fontSize: "16px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card5text2: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#EFEFEF",
  },
  searchField: {
    "width": "28.5vw",
    "height": "auto",
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
  iconMetroCoin: {
    width: "70%",
  },
  tableheading: {
    fontFamily: "Whyte",
    color: "#C1D3FF",
    fontSize: "22px",
  },
  tablecontent: {
    fontFamily: "Whyte",
    fontSize: "22px",
    color: "#F5F5F5",
  },
  tablecontent2: {
    fontFamily: "Whyte",
    fontSize: "22px",
  },
  membersTitleSmall: {
    fontFamily: "Whyte",
    fontSize: "24px",
    color: "#FFFFFF",
    backgroundColor: "#19274B",
  },
  banner: {
    width: "100%",
  },
  treasury: {
    width: "100%",
  },
  docimg: {
    right: "0",
    marginLeft: "52%",
    marginTop: "30%",
    width: "60%",
    sx: { position: "absolute", bottom: 0 },
  },
  valueDetailStyle: {
    color: "#81F5FF",
  },
  docs: {
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const Dashboard = () => {
  const router = useRouter();
  const { clubId } = router.query;
  const classes = useStyles();
  const daoAddress = useSelector((state) => {
    return state.create.daoAddress;
  });
  const walletAddress = useSelector((state) => {
    return state.create.value;
  });
  const [tokenDetails, settokenDetails] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [tokenAPIDetails, settokenAPIDetails] = useState(null); // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false);
  const [depositLink, setDepositLink] = useState(null);
  const [governorDetails, setGovernorDetails] = useState(null);
  const [membersFetched, setMembersFetched] = useState(false);
  const [members, setMembers] = useState(0);
  const [membersDetails, setMembersDetails] = useState([]);
  const [activeProposalData, setActiveProposalData] = useState([]);
  const [activeProposalDataFetched, setActiveProposalDataFetched] =
    useState(false);
  const [clubAssetTokenFetched, setClubAssetTokenFetched] = useState(false);
  const [clubAssetTokenData, setClubAssetTokenData] = useState([]);
  const [failed, setFailed] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [ntfData, setNftData] = useState([]);
  const [nftFetched, setNftFetched] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [closingDays, setClosingDays] = useState(null);
  const imageUrl = useSelector((state) => {
    return state.create.clubImageUrl;
  });
  const [memberDeposit, setMemberDeposit] = useState(null);
  const [clubTokenMinted, setClubTokenMInted] = useState(null);
  const [maxTokenMinted, setMaxTokenMinted] = useState(null);
  const [userOwnershipShare, setUserOwnershipShare] = useState(null);
  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const usdcConvertDecimal = useSelector((state) => {
    return state.gnosis.tokenDecimal;
  });
  const governanceConvertDecimal = useSelector((state) => {
    return state.gnosis.governanceTokenDecimal;
  });

  const loadSmartContractData = async () => {
    try {
      const contract = new SmartContract(
        ImplementationContact,
        daoAddress,
        undefined,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      let usdcDetails = await contract.getUsdcDetails(USDC_CONTRACT_ADDRESS);
      let getUserBalance = await contract.checkUserBalance();
      let getGovernorDetails = await contract.getGovernorDetails();
      let getTokenDetails = await contract.tokenDetails();

      // user and admin contributions
      let memberDeposits = convertFromWei(usdcDetails[0], usdcConvertDecimal);
      let adminContribution = convertFromWei(
        usdcDetails[1],
        usdcConvertDecimal,
      );

      let total = memberDeposits + adminContribution;
      setMemberDeposit(total);

      setUserBalance(
        convertFromWeiGovernance(getUserBalance, governanceConvertDecimal),
      );
      setClosingDays(calculateDays(parseInt(getGovernorDetails[0]) * 1000));
      setGovernorDetails(getGovernorDetails);
      setMaxTokenMinted(await convertAmountToWei(getGovernorDetails[4]));

      settokenDetails(getTokenDetails);
      setClubTokenMInted(
        convertFromWeiGovernance(getTokenDetails[2], governanceConvertDecimal),
      );
      setUserOwnershipShare(
        convertFromWeiGovernance(getTokenDetails[2], governanceConvertDecimal),
      );
      setDepositLink(
        typeof window !== "undefined" && window.location.origin
          ? `${window.location.origin}/join/${daoAddress}?dashboard=true`
          : null,
      );
      setDataFetched(true);
    } catch (e) {
      setOpenSnackBar(true);
      setFailed(true);
    }
  };

  useEffect(() => {
    if (daoAddress && USDC_CONTRACT_ADDRESS && GNOSIS_TRANSACTION_URL) {
      loadSmartContractData();
    }
  }, [daoAddress, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL, dataFetched]);

  const checkIsAdmin = () => {
    if (membersFetched && membersDetails.length > 0 && walletAddress) {
      let obj = membersDetails.find(
        (member) => member.userAddress === walletAddress,
      );
      let pos = membersDetails.indexOf(obj);
      if (pos >= 0) {
        if (membersDetails[pos].clubs[0].isAdmin) {
          return true;
        }
      }
      return false;
    }
  };

  const tokenAPIDetailsRetrieval = async () => {
    let response = await fetchClubbyDaoAddress(daoAddress);
    if (response.data.length > 0) {
      settokenAPIDetails(response.data[0]);
      setApiTokenDetailSet(true);
    }
  };

  const fetchMembers = () => {
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

    const nfts = getNfts(daoAddress);
    nfts.then((result) => {
      if (result.status != 200) {
        setNftFetched(false);
      } else {
        setNftData(result.data);
        setNftFetched(true);
      }
    });
  };

  const fetchActiveProposals = () => {
    const activeProposals = getProposal(clubId, "active");
    activeProposals.then((result) => {
      if (result.status != 200) {
        setActiveProposalDataFetched(false);
      } else {
        setActiveProposalData(result.data);
        setActiveProposalDataFetched(true);
      }
    });
  };

  useEffect(() => {
    if (daoAddress) {
      tokenAPIDetailsRetrieval();
    }
  }, [daoAddress, GNOSIS_TRANSACTION_URL, USDC_CONTRACT_ADDRESS]);

  useEffect(() => {
    if (daoAddress) {
      fetchClubAssetToken();
    }
  }, [daoAddress]);

  useEffect(() => {
    if (clubId) {
      fetchMembers();
      fetchActiveProposals();
    }
  }, [clubId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/join/${daoAddress}`
        : null,
    );
  };

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/proposal/${proposal.proposalId}`, undefined, {
      shallow: true,
    });
  };

  const handleMoreClick = () => {
    router.push(`${router.asPath}/proposal`, undefined, { shallow: true });
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  return (
    <>
      <Layout1 page={1} depositUrl={depositLink}>
        <Grid container paddingLeft={10} paddingTop={15} spacing={1}>
          <Grid item spacing={1} xs={9}>
            <Card className={classes.cardSharp1}>
              <Grid container spacing={2}>
                <Grid item ml={3} mt={2}>
                  <img src={imageUrl ?? null} width="100vw" alt="profile_pic" />
                </Grid>
                <Grid item ml={1} mt={4}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {apiTokenDetailSet ? (
                        tokenAPIDetails.name
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                    <Grid container item direction="row" paddingBottom={4}>
                      <Typography variant="regularText2" mr={1}>
                        {membersFetched ? members : 0}
                      </Typography>
                      <Typography variant="regularText2">Members</Typography>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Grid item xs={12}>
                  {/* <Card className={classes.cardSharp2}>
                  <Grid container spacing={2}>
                    <Grid item xs={4} mt={2} mb={3}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography
                            variant="regularText4"
                            fontSize={"18px"}
                            className={classes.valuesDimStyle}
                          >
                            Member Deposits
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            fontWeight="bold"
                            fontSize={"24px"}
                            className={classes.valueDetailStyle}
                          >
                            {memberDeposit !== null ? (
                              Number.isInteger(memberDeposit) ? (
                                parseInt(memberDeposit)
                              ) : (
                                parseFloat(memberDeposit).toFixed(2)
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
                        <Grid item>
                          <Typography
                            variant="regularText4"
                            fontSize={"18px"}
                            className={classes.valueDimStyle}
                          >
                            {" "}
                            USDC{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={4} mt={2} mb={2}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography
                            variant="regularText4"
                            fontSize={"18px"}
                            className={classes.valuesDimStyle}
                          >
                            {" "}
                            Club tokens minted{" "}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            fontWeight="bold"
                            fontSize={"24px"}
                            className={classes.valueDetailStyle}
                          >
                            {clubTokenMinted !== null ? (
                              Number.isInteger(clubTokenMinted) ? (
                                parseInt(clubTokenMinted)
                              ) : (
                                parseFloat(clubTokenMinted).toFixed(2)
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
                        <Grid item>
                          <Typography
                            variant="regularText4"
                            fontSize={"18px"}
                            className={classes.valueDimStyle}
                          >
                            {tokenDetails !== null ? (
                              "$" + tokenDetails[1]
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
                    <Grid item xs={4} mt={2} mb={1}>
                      <Grid>
                        <Grid item>
                          <Typography
                            variant="regularText4"
                            fontSize={"18px"}
                            className={classes.valuesDimStyle}
                          >
                            Max Token Supply
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            fontWeight="bold"
                            fontSize={"24px"}
                            className={classes.valueDetailStyle}
                          >
                            {maxTokenMinted !== null ? (
                              parseInt(maxTokenMinted)
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}{" "}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="regularText4"
                            fontSize={"18px"}
                            className={classes.valueDimStyle}
                          >
                            {tokenDetails !== null ? (
                              "$" + tokenDetails[1]
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
                </Card> */}

                  <Card className={classes.firstCard}>
                    <Grid item mt={3} ml={5}>
                      <Grid container item direction="column">
                        <Typography variant="regularText4" fontSize={"21px"}>
                          Treasury value
                        </Typography>
                        <Typography fontSize={"48px"} fontWeight="bold">
                          $
                          {clubAssetTokenFetched ? (
                            parseInt(clubAssetTokenData.treasuryAmount)
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}
                        </Typography>
                        <CardMedia
                          image="/assets/images/treasurywallet.png"
                          component="img"
                          className={classes.media}
                          alt="ownershipshare"
                          sx={{ position: "absolute", bottom: 0 }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 5, md: 3 }}
                  direction={{ xs: "column", sm: "column", md: "column" }}
                >
                  <Card className={classes.secondCard}>
                    <CardMedia
                      image="/assets/images/ownershipshare.png"
                      component="img"
                      className={classes.media}
                      alt="ownershipshare"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        paddingTop: "4px",
                      }}
                    />
                    <Grid container>
                      <Grid
                        container
                        direction={{ xs: "column", sm: "column", md: "column" }}
                      >
                        <Grid item>
                          <Box className={classes.cardOverlay}>
                            <Typography
                              variant="regularText4"
                              fontSize={"21px"}
                            >
                              My ownership Share
                            </Typography>
                            <Typography fontSize={"48px"} fontWeight="bold">
                              {userBalance !== null &&
                              userOwnershipShare !== null ? (
                                isNaN(
                                  parseInt(
                                    calculateUserSharePercentage(
                                      userBalance,
                                      userOwnershipShare,
                                    ),
                                  ),
                                ) ? (
                                  0
                                ) : (
                                  parseInt(
                                    calculateUserSharePercentage(
                                      userBalance,
                                      userOwnershipShare,
                                    ),
                                  )
                                )
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                              %
                            </Typography>
                            <Typography className={classes.card2text2} mb={1}>
                              {userBalance !== null && tokenDetails !== null ? (
                                Number.isInteger(userBalance) ? (
                                  parseInt(userBalance) +
                                  (" $" + tokenDetails[1])
                                ) : (
                                  parseFloat(userBalance).toFixed(2) +
                                  (" $" + tokenDetails[1])
                                )
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        {/* <CardMedia    className={classes.media}    component=“img”    image=“/assets/images/card_illustration.png”    alt=“abstract background”    sx={{ position: “absolute”, bottom: 0 }}                     />   */}
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Stack>
            </Card>
            <Grid item md={9}>
              <Stack>
                <Grid item>
                  <Stack
                    direction={{ xs: "column", sm: "column" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                  >
                    <Grid container item mt={8}>
                      <Typography className={classes.clubAssets}>
                        Club Assets
                      </Typography>
                    </Grid>
                    {/* <Grid container mt={4}>
                    <Grid item>
                      <ButtonDropDown label="All" />
                    </Grid>
                    <Grid item ml={2}>
                      <TextField
                        className={classes.searchField}
                        placeholder="Search by name or address"
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
                      />
                    </Grid>
                  </Grid> */}
                    <Typography mt={5} mb={5} variant="subHeading">
                      Tokens
                    </Typography>
                    {clubAssetTokenFetched ? (
                      clubAssetTokenData.tokenPriceList.length > 0 ? (
                        //  if the tokens length is > 0 and if the token[0] (by default it will be Ether) is not equal to 0, then show the table
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 809 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="left" variant="tableHeading">
                                  Token
                                </TableCell>
                                <TableCell align="left" variant="tableHeading">
                                  Balance
                                </TableCell>
                                <TableCell align="left" variant="tableHeading">
                                  Value (USD)
                                </TableCell>
                                {/* <TableCell align="left" variant="tableHeading">Day change</TableCell> */}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {clubAssetTokenData.tokenPriceList.map(
                                (data, key) => {
                                  if (data.value !== 0) {
                                    return (
                                      <TableRow
                                        key={key}
                                        sx={{
                                          "&:last-child td, &:last-child th": {
                                            border: 0,
                                          },
                                        }}
                                      >
                                        <TableCell
                                          align="left"
                                          variant="tableBody"
                                        >
                                          <></>
                                          {data.symbol}
                                        </TableCell>
                                        <TableCell
                                          align="left"
                                          variant="tableBody"
                                        >
                                          {data.value}
                                        </TableCell>
                                        <TableCell
                                          align="left"
                                          variant="tableBody"
                                        >
                                          ${data.usd.usdValue}
                                        </TableCell>
                                        {/* <TableCell align="left" variant="tableBody" sx={row.daychange > 0 ? { color: "#0ABB92" } : { color: "#D55438" }}>{row.daychange > 0 ? "+" : ""}{row.daychange}</TableCell> */}
                                      </TableRow>
                                    );
                                  }
                                },
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Grid
                          item
                          justifyContent="center"
                          alignItems="center"
                          md={10}
                        >
                          <img
                            src="/assets/images/tokens_banner.png"
                            alt="token-banner"
                            className={classes.banner}
                          />
                        </Grid>
                      )
                    ) : null}
                    <Typography mt={16} mb={5} variant="subHeading">
                      Collectibles
                    </Typography>
                    <Grid container>
                      {nftFetched ? (
                        ntfData.length > 0 ? (
                          ntfData.map((data, key) => {
                            <Grid item m={1} key={key}>
                              <CollectionCard
                                imageURI={data.logoUri}
                                tokenName={data.tokenName}
                                tokenSymbol={data.tokenSymbol}
                              />
                            </Grid>;
                          })
                        ) : (
                          <Grid
                            item
                            justifyContent="center"
                            alignItems="center"
                            md={10}
                          >
                            <img
                              src="/assets/images/NFT_banner.png"
                              alt="proposal-banner"
                              className={classes.banner}
                            />
                          </Grid>
                        )
                      ) : null}
                    </Grid>
                    {/* <Typography mt={16} mb={5} variant="subHeading">Off-chain investments</Typography>
                    <BasicTable /> */}
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
          <Grid item md={3}>
            <Stack>
              <Card className={classes.fifthCard}>
                <Grid>
                  <Grid>
                    <Grid item>
                      <Typography variant="getStartedClub" fontSize={"36px"}>
                        Get started with your club 👋
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Link
                        color={"#111D38"}
                        variant="Docs"
                        className={classes.docs}
                        onClick={() => {
                          window.open(
                            `https://stationx.substack.com/p/get-started-with-stationx-on-rinkeby`,
                          );
                        }}
                      >
                        Read Docs
                      </Link>

                      <Grid>
                        <CardMedia
                          image="/assets/images/docs.png"
                          component="img"
                          alt="ownership_share"
                          className={classes.docimg}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Stack>

            <Stack mt={2}>
              {checkIsAdmin() ? (
                <Card className={classes.thirdCard}>
                  <Grid container m={2}>
                    <Grid item>
                      <Typography variant="regularText4">
                        Joining link
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      mr={4}
                      xs
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {/*TODO: add closing date*/}
                      {closingDays !== null ? (
                        closingDays > 0 ? (
                          <Grid
                            container
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Grid item mt={1} mr={1}>
                              <div className={classes.activeIllustration}></div>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  color: "#0ABB92",
                                  fontSize: "1.25em",
                                  fontFamily: "Whyte",
                                }}
                              >
                                Active
                              </Typography>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid
                            container
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Grid item mt={1} mr={1}>
                              <div
                                className={classes.inactiveIllustration}
                              ></div>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  color: "#D55438",
                                  fontSize: "1.25em",
                                  fontFamily: "Whyte",
                                }}
                              >
                                In-active
                              </Typography>
                            </Grid>
                          </Grid>
                        )
                      ) : null}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={12} mt={2} ml={1} mr={1}>
                      <TextField
                        className={classes.linkInput}
                        disabled
                        value={
                          typeof window !== "undefined" &&
                          window.location.origin
                            ? `${window.location.origin}/join/${daoAddress}`
                            : null
                        }
                        InputProps={{
                          endAdornment: (
                            <Button
                              variant="contained"
                              className={classes.copyButton}
                              onClick={handleCopy}
                              disabled={closingDays <= 0 ? true : false}
                            >
                              Copy
                            </Button>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={12} mt={4} ml={1} mr={1}>
                      <Typography variant="regularText5">
                        Share this link for new members to join your club and
                        add funds into this club.
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ) : null}
            </Stack>
            <Stack mt={2}>
              <Card className={classes.fourthCard}>
                <Grid container m={2}>
                  <Grid item>
                    <Typography className={classes.card2text1}>
                      Proposals
                    </Typography>
                  </Grid>
                </Grid>
                {activeProposalData.length > 0 ? (
                  <>
                    <Grid container m={1}>
                      <Grid item md={12} mr={2}>
                        {activeProposalDataFetched
                          ? activeProposalData.map((data, key) => {
                              if (key < 3) {
                                return (
                                  <div key={key}>
                                    <ListItemButton
                                      onClick={() =>
                                        handleProposalClick(
                                          activeProposalData[key],
                                        )
                                      }
                                      sx={{ width: "100%" }}
                                    >
                                      <Grid container direction="column">
                                        <Grid item md={12}>
                                          <Typography
                                            className={classes.card5text1}
                                          >
                                            Proposed by{" "}
                                            {data.createdBy.substring(0, 6) +
                                              "......" +
                                              data.createdBy.substring(
                                                data.createdBy.length - 4,
                                              )}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography
                                            className={classes.card5text2}
                                          >
                                            {data.name}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography
                                            className={classes.card5text1}
                                          >
                                            Expired on{" "}
                                            {new Date(
                                              data.votingDuration,
                                            ).toLocaleDateString()}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </ListItemButton>
                                  </div>
                                );
                              }
                            })
                          : null}
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item md={12}>
                        <Button
                          sx={{ width: "100%" }}
                          variant="transparentWhite"
                          onClick={() => handleMoreClick()}
                        >
                          More
                        </Button>
                      </Grid>
                    </Grid>{" "}
                  </>
                ) : (
                  <Grid
                    container
                    pt={10}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography className={classes.card2text1}>
                        No proposals raised yet
                      </Typography>
                    </Grid>
                    {checkIsAdmin() ? (
                      <Grid item pb={15}>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            router.push(
                              {
                                pathname: `/dashboard/${clubId}/proposal`,
                                query: {
                                  create_proposal: true,
                                },
                              },
                              undefined,
                              {
                                shallow: true,
                              },
                            );
                          }}
                        >
                          Create new
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                )}
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Snackbar
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {failed ? (
            <Alert
              onClose={handleSnackBarClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              Error fetching data!
            </Alert>
          ) : null}
        </Snackbar>
      </Layout1>
    </>
  );
};

export default ClubFetch(Dashboard);
