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
  CircularProgress, Backdrop, ListItemButton
} from "@mui/material"
import TextField from "@mui/material/TextField"
import SearchIcon from "@mui/icons-material/Search"
import ButtonDropDown from "../../../src/components/buttondropdown"
import BasicTable from "../../../src/components/table"
import CollectionCard from "../../../src/components/cardcontent"
import Router, { useRouter } from "next/router"
import ClubFetch from "../../../src/utils/clubFetch"
import { SmartContract, fetchClubbyDaoAddress, getMembersDetails, getBalance, getProposal, getTokens, USDC_CONTRACT_ADDRESS } from "../../../src/api"
import GovernorContract from "../../../src/abis/governorContract.json"
import USDCContract from "../../../src/abis/usdcTokenContract.json"
import { useSelector } from "react-redux"

const useStyles = makeStyles({
  media: {
    position: "absolute",
    bottom: 0
  },
  firstCard: {
    position: "relative",
    width: "32vw",
    height: "352px",
    padding: "0px",
    opacity: "1",
    background: "transparent linear-gradient(120deg, #3B7AFD 0%, #011FFD 100%) 0% 0% no-repeat padding-box"
  },
  secondCard: {
    position: "relative",
    width: "32vw",
    height: "352px",
    padding: "0px",
    opacity: "1",
  },
  thirdCard: {
    width: "22vw",
    height: "351px",
  },
  cardOverlay: {
    position: "absolute",
    top: "30px",
    left: "30px",
    right: "30px",
    bottom: "30px",
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
  },
  card1text3: {
    fontFamily: "Whyte",
    paddingTop: "70px",
    fontSize: "22px",
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
    fontSize: "40px",
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
    fontSize: "19px",
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
  copyButton: {
    width: "68px",
    height: "30px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "15px"
  },
  linkInput: {
    width: "18.4vw",
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
})

const Dashboard = (props) => {
  const router = useRouter()
  const { clubId } = router.query
  const classes = useStyles()
  const daoAddress = useSelector(state => {return state.create.daoAddress})
  const walletAddress = useSelector(state => {return state.create.value})
  const tresuryAddress = useSelector(state => { return state.create.tresuryAddress})
  const [clubDetails, setClubDetails] = useState([])
  const [clubDetailsFetched, setClubDetailsFetched] = useState(false)
  const [tokenDetails, settokenDetails] = useState(null)
  const [dataFetched, setDataFetched] = useState(false)
  const [tokenAPIDetails, settokenAPIDetails] = useState(null) // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false)
  const [joinLink, setJoinLink] = useState(null)
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

  const fetchGovernorContractData = async () => {
    if (daoAddress && walletAddress){
      const fetchClubDetails = new SmartContract(GovernorContract, daoAddress, undefined)
      await fetchClubDetails.getGovernorDetails()
      .then((result) => {
        // console.log(result)
        setClubDetails(result)
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
    const tokens = getTokens(tresuryAddress)
    tokens.then((result) => {
      if (result.status != 200) {
        console.log(result.statusText)
        setClubAssetTokenFetched(false)
      } else {
        // console.log(result.data)
        setClubAssetTokenData(result.data)
        setClubAssetTokenFetched(true)
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
          console.log(parseFloat(data.balance) / Math.pow(10, 18))
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

  useEffect(() => {
    setLoaderOpen(true)
    tokenAPIDetailsRetrieval()
    tokenDetailsRetrieval()
    fetchMembers()
    fetchTresuryWallet()
    fetchActiveProposals()
    fetchClubAssetToken()
    fetchGovernorContractData()

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
  
  
  return (
    <>
      <Layout1 page={1}>
        {/* <div style={{ padding: "110px 80px" }}> */}
          <Grid container spacing={1} paddingLeft={10} paddingTop={15}>
            <Grid item md={9}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Card className={classes.firstCard}>
                  <CardMedia
                      className={classes.media}
                      component="img"
                      image="/assets/images/card_illustration.png"
                      alt="abstract background"
                      sx={{ position: "absolute", bottom: 0 }}
                  />
                  <Box className={classes.cardOverlay}>
                    <Typography className={classes.card1text1}>
                      {dataFetched ? tokenDetails[0] : null}
                    </Typography>
                    <Typography className={classes.card1text2}>
                      ${dataFetched ? tokenDetails[1] : null}
                    </Typography>
                    <Typography className={classes.card1text3}>
                      My Share ($)
                    </Typography>
                    <Typography className={classes.card1text4}>
                      {findCurrentMember()}
                    </Typography>
                    <Typography className={classes.card1text5}>
                      {clubDetailsFetched && dataFetched ? isNaN((findCurrentMember() / (tokenDetails[2]/ Math.pow(10, 18))).toFixed(2) * 100) ? 0 : 0: 0}%
                    </Typography>
                  </Box>
                </Card>
                <Card className={classes.secondCard}>
                  <Grid container m={4}>
                    <Grid container spacing={{ xs:2, sm:5, md: 3}} direction={{xs: "column", sm: "column", md: "row" }}>
                      <Grid item mt={4}>
                        <Grid container item direction="column">
                        <img src="/assets/icons/icon-metro-coin.svg" alt="icon-metro-coins" className={classes.iconMetroCoin} />
                        <Typography mt={4} variant="regularText4">
                          Treasury ($)
                        </Typography>
                        <Typography className={classes.card2text2}>
                          {dataFetched ? tokenDetails[2]/ Math.pow(10, 18) : null}
                        </Typography>
                        {/* <Typography className={classes.card2text3}>
                          37%
                        </Typography> */}
                        </Grid>
                      </Grid>
                      <Grid item ml={4}><Divider className={classes.divider} variant="middle" orientation="vertical" /></Grid>
                      <Grid item mt={4} ml={1}>
                        <Grid container item direction="column">
                        <Typography variant="regularText2">
                          Members
                        </Typography>
                        <Typography variant="regularText4">
                          {membersFetched ? members : 0}
                        </Typography>
                        <Typography mt={3} variant="regularText2">
                          Tresury Wallet
                        </Typography>
                        <Typography variant="regularText4">
                          ${dataFetched ? tokenDetails[2]/ Math.pow(10, 18) : null}
                        </Typography>
                        {/* <Typography mt={3} className={classes.card2text8}>
                          Hot Wallet
                        </Typography>
                        <Typography className={classes.card2text9}>
                          $43,206
                        </Typography> */}
                        </Grid>
                      </Grid>

                      <Stack m={4}>
                        
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Stack>
              <Stack>
                <Grid item>
                  <Stack direction={{ xs: 'column', sm: 'column' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Grid container item mt={8}>
                      <Typography className={classes.clubAssets}>Club Assets</Typography>
                    </Grid>
                    <Grid container mt={4}>
                      <Grid items>
                        <ButtonDropDown label="All" />
                      </Grid>
                      <Grid items ml={2}>
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
                          {clubAssetTokenData.length > 0 ? clubAssetTokenData.slice(1).map((data, key) => (
                            <TableRow
                              key={key}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell align="left" variant="tableBody"><></>{data.token.name}</TableCell>
                              <TableCell align="left" variant="tableBody">{data.balance}</TableCell>
                              <TableCell align="left" variant="tableBody">${data.balance}</TableCell>
                              {/* <TableCell align="left" variant="tableBody" sx={row.daychange > 0 ? { color: "#0ABB92" } : { color: "#D55438" }}>{row.daychange > 0 ? "+" : ""}{row.daychange}</TableCell> */}
                            </TableRow>
                          )) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography mt={16} mb={5} variant="subHeading">Collectibles</Typography>
                    <Grid container>
                      <Grid items m={1}>
                        <CollectionCard />
                      </Grid>
                      <Grid items m={1}>
                        <CollectionCard />
                      </Grid>
                      <Grid items m={1}>
                        <CollectionCard />
                      </Grid>
                    </Grid>

                    {/* <Typography mt={16} mb={5} variant="subHeading">Off-chain investments</Typography>
                    <BasicTable /> */}
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack>
                <Card className={classes.thirdCard}>
                  <Grid container m={2}>
                    <Grid items>
                      <Typography variant="regularText4">
                        Joining link
                      </Typography>
                    </Grid>
                    <Grid items mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Grid item mt={1} mr={1}>
                          <div className={classes.activeIllustration}></div>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ color: "#0ABB92", fontSize: "1.25em", fontFamily: "Whyte"}}>
                            Active
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items mt={2} ml={1} mr={1} >
                      <TextField
                        className={classes.linkInput}
                        disabled
                        value={joinLink}
                        InputProps={{
                          endAdornment: <Button variant="contained" className={classes.copyButton} onClick={handleCopy}>Copy</Button>
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items mt={4} ml={1} mr={1} >
                      <Typography variant="regularText5">
                      Share this link for new members to join your club and add funds into this club.
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Stack>
              <Stack mt={2}>
                {activeProposalData.length > 0 ? (
                  <Card className={classes.fourthCard}>
                  <Grid container m={2}>
                    <Grid items>
                      <Typography className={classes.card2text1}>
                        Active proposals
                      </Typography>
                    </Grid>
                    <Grid items mt={1.2} ml={1}>
                      <div className={classes.activeIllustration}></div>
                    </Grid>
                  </Grid>
                  <Grid container m={1}>
                    <Stack >
                      {activeProposalDataFetched ? activeProposalData.map((data, key) => {
                        if (key < 3) {
                          return (
                            <>
                              <ListItemButton key={key} onClick={() => handleProposalClick(activeProposalData[key])}>
                                <Grid container direction="column">
                                  <Grid item>
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
                            </>
                          )
                        }
                        if (key == 4) {
                          return (
                              <ListItemButton onClick={() => handleMoreClick()} >
                                <Typography className={classes.card2text1}>More</Typography>
                              </ListItemButton>
                              )

                        }

                      }) : null}
                    </Stack>
                  </Grid>
                </Card>
                ) : null}
                
              </Stack>
            </Grid>
          </Grid>
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
