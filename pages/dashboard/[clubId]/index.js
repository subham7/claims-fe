import { React, useEffect, useState } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, CardMedia, Divider, Stack, TextField, Button, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Table } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ButtonDropDown from "../../../src/components/buttondropdown"
import BasicTable from "../../../src/components/table"
import CollectionCard from "../../../src/components/cardcontent"
import Router, { useRouter } from "next/router"
import ClubFetch from "../../../src/utils/clubFetch"
import { SmartContract, fetchClubbyDaoAddress, getMembersDetails, getBalance, getProposal, getTokens, USDC_CONTRACT_ADDRESS } from "../../../src/api"
import GovernorContract from "../../../src/abis/governor.json"
import USDCContract from "../../../src/abis/usdc.json"
import { useSelector } from "react-redux"

const useStyles = makeStyles({
  firstCard: {
    position: "relative",
    width: "626px",
    height: "352px",
    padding: "0px",
    opacity: "1",
    background: "transparent linear-gradient(120deg, #3B7AFD 0%, #011FFD 100%) 0% 0% no-repeat padding-box"
  },
  secondCard: {
    position: "relative",
    width: "626px",
    height: "352px",
    padding: "0px",
    opacity: "1",
  },
  thirdCard: {
    width: "413px",
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
    fontSize: "34px",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text2: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text3: {
    paddingTop: "70px",
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text4: {
    fontWeight: "bold",
    fontSize: "50px",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text5: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card2text1: {
    fontSize: "22px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text2: {
    fontWeight: "bold",
    fontSize: "40px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text3: {
    fontSize: "22px",
    color: "#0ABB92",
    opacity: "1",
  },
  card2text4: {
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text5: {
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text6: {
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text7: {
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text8: {
    fontSize: "18px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text9: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card3text1: {

  },
  card3text2: {
    fontSize: "19px",
    color: "#0ABB92",
  },
  card3text3: {
    width: "354px",
    color: "#C1D3FF",
  },
  card3text4: {
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
    width: "354px",
    height: "auto",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  divider: {
    paddingLeft: "20%",
  },
  clubAssets: {
    fontSize: "40px",
    color: "#FFFFFF",
  },
  fourthCard: {
    width: "413px",
    borderRadius: "20px"
  },
  pendingIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
  },
  card5text1: {
    fontSize: "16px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card5text2: {
    fontSize: "22px",
    color: "#EFEFEF",
  },
  searchField: {
    width: "548px",
    height: "auto",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  tokensText: {
    fontSize: "30px",
    color: "#F5F5F5",
  },
  iconMetroCoin: {
    width: "81px",
    height: "60px",
  },
  tableheading: {
    color: "#C1D3FF",
    fontSize: "22px",
  },
  tablecontent: {
    fontSize: "22px",
    color: "#F5F5F5",
  },
  tablecontent2: {
    fontSize: "22px",
  },
  membersTitleSmall: {
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
  const [closedProposalData, setClosedProposalData] = useState([])
  const [closedProposalDataFetched, setClosedProposalDataFetched] = useState(false)
  const [clubAssetTokenFetched, setClubAssetTokenFetched] = useState(false)
  const [clubAssetTokenData, setClubAssetTokenData] = useState([])

  const fetchGovernorContractData = async () => {
    if (daoAddress && walletAddress){
      const fetchClubDetails = new SmartContract(GovernorContract, daoAddress, walletAddress)
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
      const tokenDetailContract = new SmartContract(USDCContract, tokenAPIDetails.tokenAddress, walletAddress)
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

  const fetchClosedProposals = () => {
    const closedProposals = getProposal(clubId, "closed")
    closedProposals.then((result) => {
      if (result.status != 200) {
        console.log(result.statusText)
        setClosedProposalDataFetched(false)
      } else {
        setClosedProposalData(result.data)
        setClosedProposalDataFetched(true)
      }
    })
  }

  useEffect(() => {
      tokenAPIDetailsRetrieval()
      tokenDetailsRetrieval()   
      fetchMembers()
      fetchTresuryWallet()
      fetchClosedProposals()
      fetchClubAssetToken()
  }, [daoAddress, walletAddress, dataFetched, apiTokenDetailSet, membersFetched, tresuryWalletBalanceFetched, closedProposalDataFetched, clubAssetTokenFetched])

  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink)
  }
  
  
  return (
    <>
      <Layout1 page={1}>
        <div style={{ padding: "110px 80px" }}>
          <Grid container spacing={2}>
            <Grid item md={9}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                <Card className={classes.firstCard}>
                  <CardMedia
                    component="img"
                    image="/assets/images/card_illustration.png"
                    alt="green iguana"
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
                      10%
                    </Typography>
                  </Box>
                </Card>
                <Card className={classes.secondCard}>
                  <Grid container m={4}>
                    <Grid container>
                      <Stack mt={4}>
                        <img src="/assets/icons/Icon-metro-coins.png" alt="icon-metro-coins" className={classes.iconMetroCoin} />
                        <Typography mt={4} className={classes.card2text1}>
                          Tresury ($)
                        </Typography>
                        <Typography className={classes.card2text2}>
                          {dataFetched ? tokenDetails[2]/ Math.pow(10, 18) : null}
                        </Typography>
                        {/* <Typography className={classes.card2text3}>
                          37%
                        </Typography> */}
                      </Stack>
                      <Divider className={classes.divider} variant="middle" orientation="vertical" />
                      <Stack m={4}>
                        <Typography className={classes.card2text4}>
                          Members
                        </Typography>
                        <Typography className={classes.card2text5}>
                          {membersFetched ? members : 0}
                        </Typography>
                        <Typography mt={3} className={classes.card2text6}>
                          Tresury Wallet
                        </Typography>
                        <Typography className={classes.card2text7}>
                          ${dataFetched ? tokenDetails[2]/ Math.pow(10, 18) : null}
                        </Typography>
                        {/* <Typography mt={3} className={classes.card2text8}>
                          Hot Wallet
                        </Typography>
                        <Typography className={classes.card2text9}>
                          $43,206
                        </Typography> */}
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
                    <Typography mt={5} mb={5} className={classes.tokensText}>Tokens</Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 809 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="left" className={classes.tableheading}>Token</TableCell>
                            <TableCell align="left" className={classes.tableheading}>Balance</TableCell>
                            <TableCell align="left" className={classes.tableheading}>Value (USD)</TableCell>
                            {/* <TableCell align="left" className={classes.tableheading}>Day change</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clubAssetTokenData.length > 0 ? clubAssetTokenData.slice(1).map((data, key) => (
                            <TableRow
                              key={key}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell align="left" className={classes.tablecontent}><></>{data.token.name}</TableCell>
                              <TableCell align="left" className={classes.tablecontent}>{data.balance}</TableCell>
                              <TableCell align="left" className={classes.tablecontent}>${data.balance}</TableCell>
                              {/* <TableCell align="left"className={classes.tablecontent2} sx={row.daychange > 0 ? { color: "#0ABB92" } : { color: "#D55438" }}>{row.daychange > 0 ? "+" : ""}{row.daychange}</TableCell> */}
                            </TableRow>
                          )) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography mt={16} mb={5} className={classes.tokensText}>Collectibles</Typography>
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

                    {/* <Typography mt={16} mb={5} className={classes.tokensText}>Off-chain investments</Typography>
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
                      <Typography className={classes.card3text1}>
                        Joining link
                      </Typography>
                    </Grid>
                    <Grid items mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Grid item mt={1} mr={1}>
                          <div className={classes.activeIllustration}></div>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.card3text2}>
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
                      <Typography className={classes.card3text4}>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Stack>
              <Stack mt={2}>
                {closedProposalData.length > 0 ? (
                  <Card className={classes.fourthCard}>
                  <Grid container m={2}>
                    <Grid items>
                      <Typography className={classes.card2text1}>
                        Closed proposals
                      </Typography>
                    </Grid>
                    <Grid items mt={1.2} ml={1}>
                      <div className={classes.pendingIllustration}></div>
                    </Grid>
                  </Grid>
                  <Grid container m={2}>
                    <Stack >
                      {closedProposalDataFetched ? closedProposalData.map((data, key) => {
                        return (
                          <div key={key}>
                          <Typography className={classes.card5text1} >
                            Proposed by {data.createdBy.substring(0, 6) + "......" + data.createdBy.substring(data.createdBy.length - 4)}
                          </Typography>
                          <Typography className={classes.card5text2}>
                            {data.name}
                          </Typography>
                          <Typography className={classes.card5text1}>
                            Expired on {new Date(data.votingDuration).toLocaleDateString()}
                          </Typography>
                          </div>
                        )
                      }) : null}
                    </Stack>
                  </Grid>
                </Card>
                ) : null}
                
              </Stack>
            </Grid>
          </Grid>
        </div>
      </Layout1>
    </>
  )
}

export default ClubFetch(Dashboard)
