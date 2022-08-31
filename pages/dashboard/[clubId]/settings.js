import {React, useEffect, useState} from "react"
import Layout1 from "../../../src/components/layouts/layout1"
import {
  Card,
  Grid,
  Typography,
  Avatar,
  Stack,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress, Backdrop
} from "@mui/material"
import { makeStyles } from "@mui/styles"
import ProgressBar from "../../../src/components/progressbar"
import Router, { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import {
  USDC_CONTRACT_ADDRESS,
  FACTORY_CONTRACT_ADDRESS,
} from "../../../src/api"
import {getMembersDetails} from "../../../src/api/user"
import Web3 from "web3"
import USDCContract from "../../../src/abis/usdcTokenContract.json"
import ImplementationContract from "../../../src/abis/implementationABI.json"
import { SmartContract } from "../../../src/api/contract"
import {fetchClubbyDaoAddress} from "../../../src/api/club"
import {getAssets} from "../../../src/api/assets"
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ClubFetch from "../../../src/utils/clubFetch"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Image from "next/image";
import {
  calculateDays,
  calculateTreasuryTargetShare,
  calculateUserSharePercentage,
  convertAmountToWei
} from "../../../src/utils/globalFunctions";


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
  const tresuryAddress = useSelector(state => { return state.create.tresuryAddress})
  const dispatch = useDispatch()
  const router = useRouter()
  const imageUrl = useSelector(state => {return state.create.clubImageUrl})
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
  const [loaderOpen, setLoaderOpen] = useState(false)
  const [closingDays, setClosingDays] = useState(0)
  const [userBalance, setUserBalance] = useState('')
  const [userBalanceFetched, setUserBalanceFetched] = useState(false)
  const [clubAssetTokenFetched, setClubAssetTokenFetched] = useState(false)
  const [clubAssetTokenData, setClubAssetTokenData] = useState([])

  const fetchUserBalanceAPI = async () => {
    if (daoAddress) {
      const fetchUserBalance = new SmartContract(ImplementationContract, daoAddress, undefined)
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

  const fetchClubAssetToken = () => {
    const tokens = getAssets(clubId)
    tokens.then((result) => {
      if (result.status != 200) {
        setClubAssetTokenFetched(false)
      } else {
        setClubAssetTokenData(result.data)
        setClubAssetTokenFetched(true)
      }
    })
  }

  const contractDetailsRetrieval = async () => {
    if (daoAddress && !governorDataFetched && !governorDetails && walletAddress) {
      const governorDetailContract = new SmartContract(ImplementationContract, daoAddress, undefined)
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
    setLoaderOpen(true)

    if (dataFetched) {
      fetchUserBalanceAPI()
      setLoaderOpen(false)

    }
  }, [dataFetched])

  useEffect(() => {
    if (clubId) {
      fetchClubAssetToken()
    }
  }, [clubId])

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
                    <img src={imageUrl ?? null} width="100vw" alt="profile_pic"/>
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
                  <Grid item ml={4} mt={5} mb={2} md={2.5}>
                    <Typography variant="settingText">Deposits deadline</Typography>
                    <Grid container>
                      <Grid item mt={1}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {governorDataFetched ? new Date(parseInt(governorDetails[0]) * 1000).toJSON().slice(0, 10).split('-').reverse().join('/') : null}
                        </Typography>
                      </Grid>
                      <Grid item ml={1} mt={1}>
                        {governorDataFetched ?
                        closingDays > 0 ?
                        (<Card className={classes.openTag}>
                          <Typography className={classes.openTagFont}>
                            Open
                          </Typography>
                        </Card>) : (<Card className={classes.closeTag}>
                          <Typography className={classes.closeTagFont}>
                            Closed
                          </Typography>
                        </Card>) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item ml={4} mt={5} md={2.5}>
                    <Grid container>
                      <Grid item>
                        <Typography variant="p" className={classes.valuesDimStyle}>Minimum Deposits</Typography>
                      </Grid>
                      <Grid item mt={1}>
                        <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[1] + " USDC" : null}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item ml={4} mt={5} md={2.5}>
                    <Grid container>
                      <Grid item>
                        <Typography variant="p" className={classes.valuesDimStyle}>Maximum Deposit</Typography>
                      </Grid>
                      <Grid item mt={1}>
                        <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[2] + " USDC" : null} </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item ml={4} mt={5} md={2.5}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="p" className={classes.valuesDimStyle}>Members</Typography>
                      </Grid>
                      <Grid item mt={{ lg: 5, xl: 1}}>
                        <Typography variant="p" className={classes.valuesStyle}>{membersFetched ? members : 0}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container mt={5}>
                  <Grid item  ml={4} md={2.5}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="settingText">Tresury wallet</Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>${clubAssetTokenFetched ? clubAssetTokenData.totalBalance : null}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item ml={4} md={2.5}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="settingText">Your ownership</Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>{userBalanceFetched && dataFetched ? isNaN(calculateUserSharePercentage(userBalance, tokenDetails[2])) ? 0 : (calculateUserSharePercentage(userBalance, tokenDetails[2]))  : 0}% (${userBalance} )</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item ml={3} mt={5} mb={2} mr={3}>
                  <ProgressBar value={governorDataFetched && dataFetched ? calculateTreasuryTargetShare(tokenDetails[2], governorDetails[4]) : 0} />
                </Grid>
                <Grid container spacing={2} >
                  <Grid item ml={4} mt={1} mb={2}>
                    <Stack spacing={1}>
                      <Typography variant="settingText">Club Tokens Minted so far</Typography>
                      <Typography variant="p" className={classes.valuesStyle}>{dataFetched ? ( convertAmountToWei(tokenDetails[2]) + " $" + tokenDetails[1]) : null}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item ml={4} mt={1} mb={2} mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Stack spacing={1}>
                      <Typography variant="settingText">Total Supply</Typography>
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
                      <Typography variant="settingText" >Club contract address</Typography>
                    </Grid>
                    <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }} spacing={1}>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { navigator.clipboard.writeText(daoAddress) }}>
                          <ContentCopyIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { window.open(`https://rinkeby.etherscan.io/address/${daoAddress}`) }}>
                          <OpenInNewIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item mr={4}>
                        <Typography variant="p" className={classes.valuesStyle}>{apiTokenDetailSet ? tokenAPIDetails[0].daoAddress.substring(0, 6) + "......" + tokenAPIDetails[0].daoAddress.substring(tokenAPIDetails[0].daoAddress.length - 4) : null}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Treasury wallet address</Typography>
                    </Grid>
                    <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }} spacing={1}>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { navigator.clipboard.writeText(tokenAPIDetails[0].treasuryAddress) }}>
                          <ContentCopyIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton color="primary" onClick={() => { window.open(`https://rinkeby.etherscan.io/address/${tokenAPIDetails[0].treasuryAddress}`) }}>
                          <OpenInNewIcon className={classes.iconColor} />
                        </IconButton>
                      </Grid>
                      <Grid item mr={4}>
                        <Typography variant="p" className={classes.valuesStyle}>{apiTokenDetailSet ? tokenAPIDetails[0].gnosisAddress.substring(0, 6) + "......" + tokenAPIDetails[0].gnosisAddress.substring(tokenAPIDetails[0].gnosisAddress.length - 4) : null}</Typography>
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
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Enable/Disable contributions</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>Enabled <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Minimum deposit amount for new members</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[1] : null} USDC <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Maximum deposit amount for new members</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? governorDetails[2] : null} USDC <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
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
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Club’s carry fees</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>No <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(propose)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Allow deposits till this date</Typography>
                    </Grid>
                    <Grid item mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography variant="p" className={classes.valuesStyle}>{governorDataFetched ? new Date(parseInt(governorDetails[0]) * 1000).toJSON().slice(0, 10).split('-').reverse().join('/') : null} <a className={classes.activityLink} onClick={(e) => handleClickOpen(e)}>(change)</a></Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container ml={3} mr={4}>
                    <Grid item >
                      <Typography variant="settingText">Is there a carry fee?</Typography>
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

export default ClubFetch(Settings)
