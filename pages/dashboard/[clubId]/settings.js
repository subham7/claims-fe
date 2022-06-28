import { useEffect, useState } from "react"
import Layout1 from "../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, Avatar, Button, Stack, Skeleton, Divider, TableCell, TableRow, TableHead, Dialog, DialogContent, IconButton } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ProgressBar from "../../../src/components/progressbar"
import Router, { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import { fetchClubbyDaoAddress, USDC_CONTRACT_ADDRESS, FACTORY_CONTRACT_ADDRESS, createUser, getMembersDetails } from "../../../src/api"
import Web3 from "web3"
import USDCContract from "../../../src/abis/usdcTokenContract.json"
import GovernorContract from "../../../src/abis/governorContract.json"
import { SmartContract } from "../../../src/api/index"
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import LinkIcon from '@mui/icons-material/Link'
import ClubFetch from "../../../src/utils/clubFetch"

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
  avatarStyle: {
    width: "5.21vw",
    height: "10.26vh",
    backgroundColor: "#C1D3FF33",
    color: "#C1D3FF",
    fontSize: "3.25rem",
    fontFamily: "Whyte",
  },
  cardRegular: {
    // height: "626px",
    backgroundColor: "#19274B",
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
    width: "150px",
    fontSize: "38px",
    fontWeight: "bold",
    fontFamily: "Whyte",
    color: "#F5F5F5",
    borderColor: "#142243",
    borderRadius: "0px",
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
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
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#0ABB92",
    opacity: "1",
    fontFamily: "Whyte",
  },
  iconColor: {
    color: "#C1D3FF",
  },
  activityLink: {
    color: "#3B7AFD",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    }
  },
  dialogBox: {
    fontSize: "36px"
  },
  modalStyle: {
    width: "792px",
    backgroundColor: '#19274B',
  },
})

const Settings = (props) => {
  // const router = useRouter()
  const classes = useStyles()
  const daoAddress = useSelector(state => { return state.create.daoAddress })
  const dispatch = useDispatch()
  const router = useRouter()
  const [dataFetched, setDataFetched] = useState(false)
  const walletAddress = useSelector(state => { return state.create.value })
  const [tokenDetails, settokenDetails] = useState(null)
  const [tokenAPIDetails, settokenAPIDetails] = useState(null) // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false)
  const [governorDetails, setGovernorDetails] = useState(null)
  const [governorDataFetched, setGovernorDataFetched] = useState(false)
  const [clubId, setClubId] = useState(null)
  const [membersFetched, setMembersFetched] = useState(false)
  const [members, setMembers] = useState(0)
  const [open, setOpen] = useState(false)
  const [minDeposit, setMinDeposit] = useState(0)
  const [minDepositFetched, setMinDepositFetched] = useState(false)
  const [maxDeposit, setMaxDeposit] = useState(0)
  const [maxDepositFetched, setMaxDepositFetched] = useState(false)
  const [membersDetails, setMembersDetails] = useState([])

  const tokenAPIDetailsRetrieval = async () => {
    let response = await fetchClubbyDaoAddress(daoAddress)
    if (response.data.length > 0) {
      settokenAPIDetails(response.data)
      setClubId(response.data[0].clubId)
      setApiTokenDetailSet(true)
    } else {
      setApiTokenDetailSet(false)
    }
  }

  const tokenDetailsRetrieval = async () => {
    if (tokenAPIDetails && tokenAPIDetails.length > 0) {
      const tokenDetailContract = new SmartContract(USDCContract, tokenAPIDetails[0].tokenAddress, undefined)
      await tokenDetailContract.tokenDetails()
        .then((result) => {
          // console.log(result)
          settokenDetails(result)
          setDataFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )
    }
  }

  const fetchMembers = () => {
    if (clubId) {
      const membersData = getMembersDetails(clubId)
      membersData.then((result) => {
        if (result.status != 200) {
          console.log(result.statusText)
          setMembersFetched(false)
        } else {
          setMembersDetails(result.data)
          setMembers(result.data.length)
          setMembersFetched(true)
        }
      })
    }
  }

  const contractDetailsRetrieval = async () => {
    if (daoAddress && !governorDataFetched && !governorDetails && walletAddress) {
      const governorDetailContract = new SmartContract(GovernorContract, daoAddress, undefined)
      await governorDetailContract.getGovernorDetails()
        .then((result) => {
          // console.log(result)
          setGovernorDetails(result)
          setGovernorDataFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )

      // minimum deposit amount from smart contract
      await governorDetailContract.quoram()
        .then((result) => {
          console.log(result)
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
          // console.log(result)
          setMaxDeposit(result)
          setMaxDepositFetched(true)
        },
          (error) => {
            console.log(error)
          }
        )
    }
  }

  const findCurrentMember = () => {
    // console.log(walletAddress)
    // console.log(membersDetails)
    if (membersFetched && membersDetails.length > 0 && walletAddress) {
      let obj = membersDetails.find(member => member.userAddress === walletAddress)
      let pos = membersDetails.indexOf(obj)
      if (pos >= 0) {
        return membersDetails[pos].clubs[0].balance
      }
      return 0
    }
  }

  useEffect(() => {
    tokenAPIDetailsRetrieval()
    tokenDetailsRetrieval()
    contractDetailsRetrieval()
    fetchMembers()

  }, [daoAddress, apiTokenDetailSet, dataFetched, governorDetails, membersFetched])

  const handleClickOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  }

  const handleClose = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <>
      <Layout1 page={5}>
          <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
            <Grid item md={9}>
              <Card className={classes.cardRegular}>
                <Grid container spacing={2}>
                  <Grid item mt={3} ml={3}>
                    <Avatar className={classes.avatarStyle}>{apiTokenDetailSet ? tokenAPIDetails[0].name[0] : null}</Avatar>
                  </Grid>
                  <Grid item ml={1} mt={4} mb={7}>
                    <Stack spacing={0}>
                      <Typography variant="h4">
                        {apiTokenDetailSet ? tokenAPIDetails[0].name : null}
                      </Typography>
                      <Typography variant="h6" className={classes.dimColor}>{dataFetched ? ("$" + tokenDetails[1]) : null}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
                <Divider variant="middle" />
                <Grid container spacing={7}>
                  <Grid item ml={4} mt={5} mb={2}>
                    <Stack spacing={1} alignItems="stretch">
                      <Typography variant="p" className={classes.valuesDimStyle}>Deposits deadline</Typography>
                      <Grid container ml={2} mt={2} mb={2}>
                        <Grid item>
                          <Typography variant="p" className={classes.valuesStyle}>
                            {governorDataFetched ? new Date(parseInt(governorDetails[0]) * 1000).toJSON().slice(0, 10).split('-').reverse().join('/') : null}
                          </Typography>
                        </Grid>
                        <Grid item m={1}>
                          <Card className={classes.openTag}>
                            <Typography className={classes.openTagFont}>
                              Open
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Stack>
                    <br />
                    <Stack spacing={1} alignItems="stretch">
                      <Typography variant="p" className={classes.valuesDimStyle}>Tresury wallet</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>${dataFetched ? tokenDetails[2] / Math.pow(10, 18) : null}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item ml={4} mt={5} mb={2}>
                    <Stack spacing={1} alignItems="stretch">
                      <Typography variant="p" className={classes.valuesDimStyle}>Minimum Deposits</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[1] + " USDC" : null}</Typography>
                    </Stack>
                    <br />
                    <Stack spacing={1} alignItems="stretch">
                      <Typography variant="p" className={classes.valuesDimStyle}>Your ownership</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched && dataFetched ? ((findCurrentMember() / (tokenDetails[2]/ Math.pow(10, 18))).toFixed(2) * 100) : 0}% (${findCurrentMember()} )</Typography>
                    </Stack>
                  </Grid>
                  <Grid item ml={4} mt={5} mb={2}>
                    <Stack spacing={1} alignItems="stretch">
                      <Typography variant="p" className={classes.valuesDimStyle}>Maximum Deposit</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[2] + " USDC" : null} </Typography>
                    </Stack>
                  </Grid>
                  <Grid item ml={4} mt={5} mb={2}>
                    <Stack spacing={1} alignItems="stretch">
                      <Typography variant="p" className={classes.valuesDimStyle}>Members</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{membersFetched ? members : 0}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item ml={3} mt={5} mb={2} mr={3}>
                  <ProgressBar value={governorDataFetched && dataFetched ? parseInt(tokenDetails[2] / Math.pow(10, 18)) / parseInt(governorDetails[4]) * 100 : 0} />
                </Grid>
                <Grid container spacing={2} >
                  <Grid item ml={4} mt={5} mb={2}>
                    <Stack spacing={1}>
                      <Typography variant="p" className={classes.valuesDimStyle}>Club Tokens Minted so far</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{dataFetched ? (tokenDetails[2] / Math.pow(10, 18) + " $" + tokenDetails[1]) : null}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item ml={4} mt={5} mb={2} mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Stack spacing={1}>
                      <Typography variant="p" className={classes.valuesDimStyle}>Total Supply</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched && dataFetched ? governorDetails[4] + (" $" + tokenDetails[1]) : null} </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
              <br />
              <Card className={classes.cardRegular}>
                <Grid container item mb={4} spacing={3} mt={3} ml={3}>
                  <Typography variant="h4">
                    Additional Details
                  </Typography>
                </Grid>
                <Stack spacing={3} ml={3}>
                  <Grid container>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Club contract address</Typography>
                    </Grid>
                    <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }} spacing={1}>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { navigator.clipboard.writeText(daoAddress) }}>
                          <ContentCopyIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { router.push(`https://rinkeby.etherscan.io/address/${daoAddress}`) }}>
                          <LinkIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item mr={4}>
                        <Typography variant="p" className={classes.valuesStyle}>{apiTokenDetailSet ? tokenAPIDetails[0].daoAddress : null}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Treasury wallet address</Typography>
                    </Grid>
                    <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }} spacing={1}>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { navigator.clipboard.writeText(tokenAPIDetails[0].treasuryAddress) }}>
                          <ContentCopyIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { router.push(`https://rinkeby.etherscan.io/address/${tokenAPIDetails[0].treasuryAddress}`) }}>
                          <LinkIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item mr={4}>
                        <Typography variant="p" className={classes.valuesStyle}>{apiTokenDetailSet ? tokenAPIDetails[0].treasuryAddress : null}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  {/* <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Hot wallet address</Typography>
                    </Grid>
                    <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }} spacing={1}>
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
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Accept new member requests?</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>Yes <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Enable/disable withdrawals from treasury wallet</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>Enabled <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />

                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Accept new member requests?</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>Yes <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Accept new member requests?</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>Yes <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Minimum deposit amount for new members</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[1] : null} USDC <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Maximum deposit amount for new members</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[2] : null} USDC <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Minimum votes to validate a proposal</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{minDepositFetched ? minDeposit + "%" : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Minimum supporting votes to pass a proposal</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{maxDepositFetched ? maxDeposit + "%" : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Club’s carry fees</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>No <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Allow deposits till this date</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? new Date(parseInt(governorDetails[0]) * 1000).toJSON().slice(0, 10).split('-').reverse().join('/') : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="p" className={classes.valuesStyle}>Is there a carry fee?</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>No <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={3}></Grid>
          </Grid>
          <Dialog open={open} onClose={handleClose} scroll="body" PaperProps={{ classes: { root: classes.modalStyle } }} fullWidth maxWidth="lg" >
            <DialogContent sx={{ overflow: "hidden", backgroundColor: '#19274B', }} >
              <Grid container justifyContent="center" alignItems="center" direction="column" mt={3}>
                <Grid item>
                  <img src="/assets/images/comingsoon.svg" />
                </Grid>
                <Grid item m={3}>
                  <Typography className={classes.dialogBox}>Hold tight! Coming soon</Typography>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
      </Layout1>
    </>
  )
}

export default ClubFetch(Settings)