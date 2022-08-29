import { React, useEffect, useState } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../src/components/layouts/layout1"
import {
  Box,
  Card,
  Grid,
  Typography,
  CardMedia,
  Divider,
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
  CircularProgress, Backdrop, ListItemButton,
  Snackbar, Alert
} from "@mui/material"
import TextField from "@mui/material/TextField"
import ProgressBar from "../../../src/components/progressbar"
import SearchIcon from "@mui/icons-material/Search"
import ButtonDropDown from "../../../src/components/buttondropdown"
import BasicTable from "../../../src/components/table"
import CollectionCard from "../../../src/components/cardcontent"
import Router, { useRouter } from "next/router"
import ClubFetch from "../../../src/utils/clubFetch"
import { SmartContract } from "../../../src/api/contract"
import { USDC_CONTRACT_ADDRESS } from "../../../src/api"
import { getProposal } from "../../../src/api/proposal"
import { fetchClubbyDaoAddress } from "../../../src/api/club"
import { getNfts, getBalance } from "../../../src/api/gnosis"
import { getAssets } from "../../../src/api/assets"
import { getMembersDetails } from "../../../src/api/user"
import GovernorContract from "../../../src/abis/governorContract.json"
import USDCContract from "../../../src/abis/usdcTokenContract.json"
import { useSelector } from "react-redux"
import Image from "next/image";
import {
  calculateDays,
  calculateTreasuryTargetShare,
  calculateUserSharePercentage,
  convertAmountToWei
} from "../../../src/utils/globalFunctions";


const useStyles = makeStyles({
  media: {
    position: "absolute",
    bottom: 0
  },
  firstCard: {
    position: "relative",
    width: "Infinityvw",
    height: "164px",
    padding: "0px",

    background: "#6A66FF no-repeat",
    variant: "outlined"
  },
  secondCard: {
    position: "relative",
    width: "Infinityvw",
    height: "164px",
    padding: "0px",
    marginTop: "20px",

    background: "#0ABB92 no-repeat padding-box"
  },
  thirdCard: {
    width: "32vw",
    height: "351px",
  },
  fifthCard: {
    width: "22vw",
    height: "351px",
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
    borderRadius: "5px",
    opacity: 1,
  },
  cardSharp2: {
    backgroundColor: "#19274B",
    borderRadius: "5px",


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
    textTransform: "uppercase",
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
    fontWeight: "bold",
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
    borderRadius: "15px"
  },
  linkInput: {
    width: "100%",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
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
    borderRadius: "20px"
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
    width: "28.5vw",
    height: "auto",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  iconMetroCoin: {
    width: "70%"
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
    backgroundColor: "#19274B"
  },
  banner: {
    width: "100%"
  },
  treasury: {
    width: "100%",


  },


})

const Dashboard = (props) => {
  const router = useRouter()
  const { clubId } = router.query
  const classes = useStyles()
  const daoAddress = useSelector(state => { return state.create.daoAddress })
  const walletAddress = useSelector(state => { return state.create.value })
  const tresuryAddress = useSelector(state => { return state.create.tresuryAddress })
  const [clubDetails, setClubDetails] = useState([])
  const [clubDetailsFetched, setClubDetailsFetched] = useState(false)
  const [tokenDetails, settokenDetails] = useState(null)
  const [dataFetched, setDataFetched] = useState(false)
  const [tokenAPIDetails, settokenAPIDetails] = useState(null) // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false)
  const [joinLink, setJoinLink] = useState(null)
  const [governorDetails, setGovernorDetails] = useState(null)
  const [minDeposit, setMinDeposit] = useState(0)
  const [minDepositFetched, setMinDepositFetched] = useState(false)
  const [maxDeposit, setMaxDeposit] = useState(0)
  const [maxDepositFetched, setMaxDepositFetched] = useState(false)
  const [membersFetched, setMembersFetched] = useState(false)
  const [members, setMembers] = useState(0)
  const [membersDetails, setMembersDetails] = useState([])
  const [tresuryWalletBalanceFetched, setTresuryWalletBalanceFetched] = useState(false)
  const [tresuryWalletBalance, setTresuryWalletBalance] = useState([])
  const [activeProposalData, setActiveProposalData] = useState([])
  const [activeProposalDataFetched, setActiveProposalDataFetched] = useState(false)
  const [clubAssetTokenFetched, setClubAssetTokenFetched] = useState(false)
  const [clubAssetTokenData, setClubAssetTokenData] = useState([])
  const [loaderOpen, setLoaderOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [ntfData, setNftData] = useState([])
  const [nftFetched, setNftFetched] = useState(false)
  const [userBalance, setUserBalance] = useState('')
  const [userBalanceFetched, setUserBalanceFetched] = useState(false)
  const [closingDays, setClosingDays] = useState(0)
  const imageUrl = useSelector(state => { return state.create.clubImageUrl })
  const [governorDataFetched, setGovernorDataFetched] = useState(false)


  const fetchUserBalanceAPI = async () => {
    if (daoAddress) {
      const fetchUserBalance = new SmartContract(GovernorContract, daoAddress, undefined)
      await fetchUserBalance.checkUserBalance()
        .then((result) => {
          setUserBalance(web3.utils.fromWei(result, "Mwei"))
          setUserBalanceFetched(true)
        },
          (error) => {
            setUserBalanceFetched(false)
          })
    }
  }

  const fetchGovernorContractData = async () => {
    if (daoAddress && walletAddress) {
      const fetchClubDetails = new SmartContract(GovernorContract, daoAddress, undefined)
      await fetchClubDetails.getGovernorDetails()
        .then((result) => {
          // console.log(result)
          setClubDetails(result)
          setClosingDays(calculateDays(parseInt(result[0]) * 1000))
          setClubDetailsFetched(true)
        },
          (error) => {
            console.log(error)
            setClubDetailsFetched(false)
          }
        )
    }
  }

  const findCurrentMember = () => {
    if (membersFetched && membersDetails.length > 0 && walletAddress) {
      let obj = membersDetails.find(member => member.userAddress === walletAddress)
      let pos = membersDetails.indexOf(obj)
      if (pos >= 0) {
        return membersDetails[pos].clubs[0].balance
      }
      return 0
    }
  }

  const checkIsAdmin = () => {
    if (membersFetched && membersDetails.length > 0 && walletAddress) {
      let obj = membersDetails.find(member => member.userAddress === walletAddress)
      let pos = membersDetails.indexOf(obj)
      if (pos >= 0) {
        if (membersDetails[pos].clubs[0].isAdmin) {
          return true
        }
      }
      return false
    }
  }
  const contractDetailsRetrieval = async () => {
    if (daoAddress && !governorDataFetched && !governorDetails && walletAddress) {
      const governorDetailContract = new SmartContract(GovernorContract, daoAddress, undefined)
      await governorDetailContract.getGovernorDetails()
        .then((result) => {
          // console.log(result)
          setGovernorDetails(result)
          setClosingDays(calculateDays(parseInt(result[0]) * 1000))
          setGovernorDataFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )

      // minimum deposit amount from smart contract
      await governorDetailContract.quoram()
        .then((result) => {
          setMinDeposit(result)
          setMinDepositFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )

      // maximim deposit amount from smart contract
      await governorDetailContract.threshold()
        .then((result) => {
          setMaxDeposit(result)
          setMaxDepositFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )
    }
  }


  const tokenAPIDetailsRetrieval = async () => {
    let response = await fetchClubbyDaoAddress(daoAddress)
    if (response.data.length > 0) {
      // console.log(response.data[0])
      settokenAPIDetails(response.data[0])
      setApiTokenDetailSet(true)
    }
  }

  const tokenDetailsRetrieval = async () => {
    if (tokenAPIDetails && !dataFetched) {
      const tokenDetailContract = new SmartContract(USDCContract, tokenAPIDetails.tokenAddress, undefined)
      await tokenDetailContract.tokenDetails()
        .then((result) => {
          // console.log(result)
          settokenDetails(result)
          setJoinLink(typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/join/${daoAddress}` : null)
          setDataFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )
    }
  }

  const fetchMembers = () => {
    const membersData = getMembersDetails(clubId)
    membersData.then((result) => {
      if (result.status != 200) {
        setMembersFetched(false)
      } else {
        setMembersDetails(result.data)
        setMembers(result.data.length)
        setMembersFetched(true)
      }
    })
  }

  const fetchClubAssetToken = () => {
    const tokens = getAssets(clubId)
    tokens.then((result) => {
      if (result.status != 200) {
        setClubAssetTokenFetched(false)
      } else {
        // console.log(result.data)
        setClubAssetTokenData(result.data)
        setClubAssetTokenFetched(true)
      }
    })

    const nfts = getNfts(tresuryAddress)
    nfts.then((result) => {
      if (result.status != 200) {
        setNftFetched(false)
      } else {
        // console.log(result.data)
        setNftData(result.data)
        setNftFetched(true)
      }
    })
  }

  const fetchTresuryWallet = () => {
    const tresuryWalletData = getBalance(tresuryAddress)
    tresuryWalletData.then((result) => {
      if (result.status != 200) {
        setTresuryWalletBalanceFetched(false)
      } else {
        // console.log(result.data)
        setTresuryWalletBalance(result.data)
        setTresuryWalletBalanceFetched(true)
      }
    })
  }

  const calculateTresuryWalletBalance = () => {
    let sum = 0.0
    if (tresuryWalletBalanceFetched && tresuryWalletBalance.length > 0) {
      console.log(tresuryWalletBalance)
      tresuryWalletBalance.forEach((data, key) => {
        if (data.tokenAddress !== "0x484727B6151a91c0298a9D2b9fD84cE3bc6BC4E3") {
          sum += parseFloat(data.fiatBalance)
        }
        else {
          sum += parseFloat(data.balance) / Math.pow(10, 18)
        }
      })
    }
    return sum
  }

  const fetchActiveProposals = () => {
    const activeProposals = getProposal(clubId, "active")
    activeProposals.then((result) => {
      if (result.status != 200) {
        setActiveProposalDataFetched(false)
      } else {
        setActiveProposalData(result.data)
        setActiveProposalDataFetched(true)
      }
    })
  }

  const importTokenToMetaMask = async () => {
    try {
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAPIDetails.tokenAddress,
            symbol: tokenDetails[1],
            decimals: 18,
          },
        },
      });

      if (wasAdded) {
        setFailed(false)
        setOpenSnackBar(true)
      } else {
        setFailed(true)
        setOpenSnackBar(true)
      }
    } catch (error) {
      console.log(error);
      setFailed(true)
      setOpenSnackBar(true)
    }
  }

  useEffect(() => {
    setLoaderOpen(true)
    if (daoAddress) {
      tokenAPIDetailsRetrieval()
    }
    if (walletAddress && daoAddress) {
      fetchGovernorContractData()
    }
  }, [daoAddress])

  useEffect(() => {
    if (tokenAPIDetails) {
      tokenDetailsRetrieval()
    }
  }, [tokenAPIDetails])


  useEffect(() => {
    setLoaderOpen(true);
    tokenAPIDetailsRetrieval()
    tokenDetailsRetrieval()
    contractDetailsRetrieval()
    fetchMembers()
    if (apiTokenDetailSet && dataFetched && governorDataFetched && membersFetched) {
      setLoaderOpen(false)
    }

  }, [daoAddress, apiTokenDetailSet, dataFetched, governorDetails, membersFetched])
  useEffect(() => {
    if (tresuryAddress) {
      fetchTresuryWallet()
      fetchClubAssetToken()
    }
  }, [tresuryAddress])

  useEffect(() => {
    if (clubId) {
      fetchMembers()
      fetchActiveProposals()
    }
  }, [clubId])

  useEffect(() => {
    setLoaderOpen(true)

    if (dataFetched) {
      fetchUserBalanceAPI()
    }
  }, [dataFetched])

  useEffect(() => {
    if (dataFetched && apiTokenDetailSet && membersFetched && tresuryWalletBalanceFetched && activeProposalDataFetched && clubAssetTokenFetched && clubDetailsFetched) {
      setLoaderOpen(false)
    }
  }, [daoAddress, walletAddress, dataFetched, apiTokenDetailSet, membersFetched, tresuryWalletBalanceFetched, activeProposalDataFetched, clubAssetTokenFetched, clubDetailsFetched])

  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink)
  }

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/proposal/${proposal.proposalId}`, undefined, { shallow: true })
  }

  const handleMoreClick = () => {
    router.push(`${router.asPath}/proposal`, undefined, { shallow: true })
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false)
  }


  return (
    <>
      <Layout1 page={1} depositUrl={joinLink}>
        {/* <div style={{ padding: "110px 80px" }}> */}
        <Grid container spacing={1} paddingLeft={10} paddingTop={15}>
          <Grid item md={9}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Grid item xs={12}>
                <Grid className={classes.cardSharp1} mt={3} >
                  <Grid container spacing={2}>
                    <Grid item mt={3} ml={3} >
                      <img src={imageUrl ?? null} width="100vw" alt="profile_pic" />
                    </Grid>
                    <Grid item ml={1} mt={4} mb={7}>
                      <Stack spacing={0}>
                        <Typography variant="h4">
                          {apiTokenDetailSet ? tokenAPIDetails[0] : null}
                        </Typography>

                        <Typography variant="h6" className={classes.dimColor}>{dataFetched ? ("$" + tokenDetails[1]) : null}</Typography>
                        <Grid container item direction="row"  >
                          <Typography variant="regularText4" sx={{ m: 0.5 }}>
                            {membersFetched ? members : 0}
                          </Typography>
                          <Typography variant="regularText2">
                            Members
                          </Typography>
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>

                </Grid>
                <Grid className={classes.cardSharp2}>

                  <Grid container spacing={7}>

                    <Grid item ml={1} mt={5} md={2.5}   >
                      <Grid container>
                        <Grid item>
                          <Typography variant="p" className={classes.valuesDimStyle}>Member Deposits</Typography>
                        </Grid>
                        <Grid item mt={1}>
                          <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[1] + " USDC" : null}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item ml={4} mt={5} md={2.5} mb={5}>
                      <Grid container>
                        <Grid item>
                          <Typography variant="p" className={classes.valuesDimStyle}> Club tokens minted </Typography>
                        </Grid>
                        <Grid item mt={1}>
                          <Typography variant="p" className={classes.valuesStyle}>{dataFetched ? (convertAmountToWei(tokenDetails[2]) + " $" + tokenDetails[1]) : null}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item ml={2} mt={5} md={2.5} mr={4}>
                      <Grid container>
                        <Grid item>
                          <Typography variant="p" className={classes.valuesDimStyle}>Maximum Token Supply</Typography>
                        </Grid>
                        <Grid item mt={1}>
                          <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched && dataFetched ? governorDetails[4] + (" $" + tokenDetails[1]) : null} </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                  </Grid>



                </Grid>
              </Grid>
              <Grid container spacing={{ xs: 2, sm: 5, md: 3 }} direction={{ xs: "column", sm: "column", md: "column" }}>
                <Card className={classes.firstCard}>

                  <Grid item mt={4} ml={5}>

                    <Grid container item direction="column">

                      <Typography variant="regularText4">
                        Treasury ($)
                      </Typography>
                      <Typography className={classes.card2text2}>
                        {clubAssetTokenFetched ? clubAssetTokenData.totalBalance : null}
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
                <Card className={classes.secondCard}>
                  <CardMedia
                    image="/assets/images/ownershipshare.png"
                    component="img"
                    className={classes.media}
                    alt="ownershipshare"
                    sx={{ position: "absolute", bottom: 0, paddingTop: "4px" }}
                  />
                  <Grid container >
                    <Grid container spacing={{ xs: 2, sm: 5, md: 3 }} direction={{ xs: "column", sm: "column", md: "column" }}>
                      <Grid item mt={4}>
                        <Box className={classes.cardOverlay}>
                          <Typography className={classes.card1text1}>
                            {dataFetched ? tokenDetails[0] : null}
                          </Typography>
                          <Typography className={classes.card1text3}>
                            My ownership Share ($)
                          </Typography>
                          <Typography className={classes.card1text4}>
                            {userBalanceFetched ? userBalance : 0}
                            {/*{findCurrentMember()}*/}
                          </Typography>
                          <Typography className={classes.card1text5}>
                            {userBalanceFetched && dataFetched ? isNaN(calculateUserSharePercentage(userBalance, tokenDetails[2])) ? 0 : (calculateUserSharePercentage(userBalance, tokenDetails[2])) : 0}%
                          </Typography>
                          <Grid container item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="transparent" onClick={importTokenToMetaMask}>Import token</Button>
                          </Grid>
                        </Box>
                      </Grid>
                      {/* <CardMedia    className={classes.media}    component=“img”    image=“/assets/images/card_illustration.png”    alt=“abstract background”    sx={{ position: “absolute”, bottom: 0 }}                     />   */}
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

            </Stack>
            <Stack>
              <Grid item>
                <Stack direction={{ xs: 'column', sm: 'column' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                  <Grid container item mt={8}>
                    <Typography className={classes.clubAssets}>Club Assets</Typography>
                  </Grid>
                  <Grid container mt={4}>
                    <Grid item>
                      <ButtonDropDown label="All" />
                    </Grid>
                    <Grid item ml={2}>
                      <TextField
                        className={classes.searchField}
                        placeholder="Search by name or address"
                        InputProps={{
                          endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Typography mt={5} mb={5} variant="subHeading">Tokens</Typography>
                  {clubAssetTokenFetched ? clubAssetTokenData.tokens.length > 0 ? clubAssetTokenData.tokens[0].balance !== '0' ?
                    //  if the tokens length is > 0 and if the token[0] (by default it will be Ether) is not equal to 0, then show the table
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 809 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="left" variant="tableHeading">Token</TableCell>
                            <TableCell align="left" variant="tableHeading">Balance</TableCell>
                            <TableCell align="left" variant="tableHeading">Value (USD)</TableCell>
                            {/* <TableCell align="left" variant="tableHeading">Day change</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clubAssetTokenData.tokens.length > 0 ? clubAssetTokenData.tokens.map((data, key) => {
                            if (data.value !== 0) {
                              return (
                                <TableRow
                                  key={key}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell align="left" variant="tableBody"><></>
                                    {data.token.name}</TableCell>
                                  <TableCell align="left" variant="tableBody">{data.value}</TableCell>
                                  <TableCell align="left" variant="tableBody">${data.fiatBalance}</TableCell>
                                  {/* <TableCell align="left" variant="tableBody" sx={row.daychange > 0 ? { color: "#0ABB92" } : { color: "#D55438" }}>{row.daychange > 0 ? "+" : ""}{row.daychange}</TableCell> */}
                                </TableRow>
                              )
                            }
                          }
                          ) :
                            null
                          }
                        </TableBody>
                      </Table>
                    </TableContainer> :
                    clubAssetTokenData.tokens.length > 1 ?
                      //  if the token already have Ether, but it's value is 0 and there are other tokens, then display the table excluding the Ether
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 809 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="left" variant="tableHeading">Token</TableCell>
                              <TableCell align="left" variant="tableHeading">Balance</TableCell>
                              <TableCell align="left" variant="tableHeading">Value (USD)</TableCell>
                              {/* <TableCell align="left" variant="tableHeading">Day change</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {clubAssetTokenData.tokens.length > 0 ? clubAssetTokenData.tokens.map((data, key) => {
                              if (data.value !== 0) {
                                return (
                                  <TableRow
                                    key={key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell align="left" variant="tableBody"><></>
                                      {data.token.name}</TableCell>
                                    <TableCell align="left" variant="tableBody">{data.value}</TableCell>
                                    <TableCell align="left" variant="tableBody">${data.fiatBalance}</TableCell>
                                    {/* <TableCell align="left" variant="tableBody" sx={row.daychange > 0 ? { color: "#0ABB92" } : { color: "#D55438" }}>{row.daychange > 0 ? "+" : ""}{row.daychange}</TableCell> */}
                                  </TableRow>
                                )
                              }
                            }
                            ) :
                              null
                            }
                          </TableBody>
                        </Table>
                      </TableContainer> :
                      <Grid item justifyContent="center" alignItems="center" md={10}>
                        <img src="/assets/images/tokens_banner.png" alt="token-banner" className={classes.banner} />
                      </Grid>
                    : null : null}
                  <Typography mt={16} mb={5} variant="subHeading">Collectibles</Typography>
                  <Grid container>
                    {nftFetched ? ntfData.length > 0 ?
                      ntfData.map((data, key) => {
                        <Grid item m={1} key={key}>
                          <CollectionCard imageURI={data.logoUri} tokenName={data.tokenName} tokenSymbol={data.tokenSymbol} />
                        </Grid>
                      })
                      : <Grid item justifyContent="center" alignItems="center" md={10}>
                        <img src="/assets/images/proposal_banner.png" alt="proposal-banner" className={classes.banner} />
                      </Grid>
                      : null
                    }
                  </Grid>
                  {/* <Typography mt={16} mb={5} variant="subHeading">Off-chain investments</Typography>
                    <BasicTable /> */}
                </Stack>
              </Grid>
            </Stack>
          </Grid>
          <Grid item md={3}>
            <Stack>
              <Card className={classes.fifthCard}>
              <Grid >
              <Grid> 
              
             
                    <Grid item>
                      <Typography variant="getStartedClub">
                        Get started with your club 👋
                      </Typography>
                    </Grid>
                    <Grid item   >
                    
                      <Link color={"#111D38 "} variant="Docs" onClick={() => { window.open(`https://stationx.substack.com/p/get-started-with-stationx-on-rinkeby`) }}>Read Docs</Link>
                    
                      <Grid> 
                      <CardMedia
                  image="/assets/images/docs.png"
                  component="img"
                  alt="ownership_share"
                  
                  

                />
                </Grid>
                   
                   
                   
                    </Grid>
                  
                
               
                 
                  </Grid>
                  </Grid>
              </Card>
            </Stack>

            <Stack mt={2}>
              {checkIsAdmin() ? <Card className={classes.fourthCard}>
                <Grid container mt={1} ml={1} justifyContent="space-evenly" direction="row">
                  <Grid item md={9}>
                    <Typography variant="regularText4">
                      Joining link
                    </Typography>
                  </Grid>
                  <Grid item md={3}>
                    {/*TODO: add closing date*/}
                    {clubDetailsFetched ? closingDays > 0 ?
                      <Grid container>
                        <Grid item mt={1} mr={1} >
                          <div className={classes.activeIllustration}></div>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ color: "#0ABB92", fontSize: "1.25em", fontFamily: "Whyte" }}>
                            Active
                          </Typography>
                        </Grid>
                      </Grid> :
                      <Grid container>
                        <Grid item mt={1} mr={1}>
                          <div className={classes.inactiveIllustration}></div>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ color: "#D55438", fontSize: "1.25em", fontFamily: "Whyte" }}>
                            In-active
                          </Typography>
                        </Grid>
                      </Grid> : null
                    }
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item md={12} mt={2} ml={1} mr={1} >
                    <TextField
                      className={classes.linkInput}
                      disabled
                      value={joinLink}
                      InputProps={{
                        endAdornment: <Button
                          variant="contained"
                          className={classes.copyButton}
                          onClick={handleCopy}
                          disabled={closingDays <= 0 ? true : false}>Copy</Button>,
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item md={12} mt={4} ml={1} mr={1} >
                    <Typography variant="regularText5">
                      Share this link for new members to join your club and add funds into this club.
                    </Typography>
                  </Grid>
                </Grid>
              </Card> : null}

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
                {activeProposalData.length > 0 ?
                  <>
                    <Grid container m={1}>
                      <Grid item md={12} mr={2}>
                        {activeProposalDataFetched ? activeProposalData.map((data, key) => {
                          if (key < 3) {
                            return (
                              <div key={key}>
                                <ListItemButton onClick={() => handleProposalClick(activeProposalData[key])} sx={{ width: "100%" }}>
                                  <Grid container direction="column">
                                    <Grid item md={12}>
                                      <Typography className={classes.card5text1} >
                                        Proposed by {data.createdBy.substring(0, 6) + "......" + data.createdBy.substring(data.createdBy.length - 4)}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography className={classes.card5text2}>
                                        {data.name}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography className={classes.card5text1}>
                                        Expired on {new Date(data.votingDuration).toLocaleDateString()}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </ListItemButton>
                              </div>
                            )
                          }
                        }) : null}
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item md={12}>
                        <Button sx={{ width: "100%" }} variant="transparentWhite" onClick={() => handleMoreClick()}>More</Button>
                      </Grid>
                    </Grid> </>
                  :
                  <Grid container pt={10} justifyContent="center" alignItems="center">
                    <Grid item>
                      <Typography className={classes.card2text1}>No proposals raised yet</Typography>
                    </Grid>
                    <Grid item pb={15}>
                      <Button variant="primary" onClick={e => {
                        router.push(
                          {
                            pathname: `/dashboard/${clubId}/proposal`,
                            query: {
                              create_proposal: true
                            }
                          },
                          undefined,
                          {
                            shallow: true
                          })
                      }}>Create new</Button>
                    </Grid>
                  </Grid>
                }
              </Card>

            </Stack>
          </Grid>
        </Grid>
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {!failed ?
            (<Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
              Token imported successfully to your wallet!
            </Alert>) :
            (<Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
              Error occured while importing token to your wallet!
            </Alert>)
          }
        </Snackbar>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loaderOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout1>
    </>
  )
}

export default ClubFetch(Dashboard)
