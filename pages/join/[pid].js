import { React, useRef, onChange, useState, useEffect } from "react"
import Image from "next/image"
import { makeStyles } from "@mui/styles"
import { Grid, Typography, Avatar, Card, Button, Stack, Divider, Input, Snackbar, Alert } from "@mui/material"
import Layout3 from "../../src/components/layouts/layout3"
import ProgressBar from "../../src/components/progressbar"
import { connectWallet, setUserChain, onboard } from "../../src/utils/wallet"
import { useDispatch } from "react-redux"
import { useRouter } from "next/router";
import { fetchClub, USDC_CONTRACT_ADDRESS, FACTORY_CONTRACT_ADDRESS } from "../../src/api";
import store from "../../src/redux/store"
import Web3 from "web3"
import USDCContract from "../../src/abis/usdc.json"
import GovernorContract from "../../src/abis/governor.json"
import { SmartContract } from "../../src/api/index"
import {
  addClubName,
  addClubsymbol,
  addDisplayImage,
  addRaiseAmount,
  addMaxContribution,
  addMandatoryProposal,
  addVoteForQuorum,
  addDepositClose,
  addMinContribution,
  addVoteInFavour
} from "../../src/redux/reducers/create"


const useStyles = makeStyles({
  valuesStyle: {
    fontSize: "24px",
  },
  valuesDimStyle: {
    fontSize: "21px",
    color: "#C1D3FF",
  },
  avatarStyle: {
    width: "5.21vw",
    height: "10.26vh",
    backgroundColor: "#C1D3FF33",
    color: "#C1D3FF",
    fontSize: "3.25rem"
  },
  cardRegular: {
    height: "626px",
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
  },
  depositButton: {
    backgroundColor: "#3B7AFD",
    width: "208px",
    height: "60px",
    fontSize: "21px",
  },
  cardSmall: {
    backgroundColor: "#111D38",
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontSize: "18px",
    color: "#C1D3FF",
  },
  cardLargeFont: {
    width: "150px",
    fontSize: "38px",
    fontWeight: "bold",
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
  },
})

export default function Join(props) {
  const router = useRouter()
  const { pid } = router.query
  const dispatch = useDispatch()
  const classes = useStyles()
  const [walletConnected, setWalletConnected] = useState(false)
  const [data, setData] = useState([])
  const [fetched, setFetched] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)
  const [daoAddress, setDaoAddress] = useState(null)
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [alertStatus, setAlertStatus] = useState(null)
  const [minDeposit, setMinDeposit] = useState(0)
  const [maxDeposit, setMaxDeposit] = useState(0)
  const [totalDeposit, setTotalDeposit] = useState(0)
  const [quoram, setQuoram] = useState(0)

  useEffect(() => {
    store.subscribe(() => {
      const { create } = store.getState()
      if (create.value) {
        setPreviouslyConnectedWallet(create.value)
        setDaoAddress(pid)
      }
      else {
        setPreviouslyConnectedWallet(null)
      }
    })
    const checkConnection = async () => {

      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      try {
        window.web3.eth.getAccounts()
          .then((async) => {
            setUserDetails(async[0])
          });
      }
      catch (err) {
        setUserDetails(null)
      }
    };
    
    if (!dataFetched && walletConnected){
      // dispatch(addClubName(result))

      // dispatch(addClubsymbol(data.clubsymbol))
      // dispatch(addDisplayImage(data.displayimage))
      // dispatch(addRaiseAmount(data.raiseamount))
      // dispatch(addMaxContribution(data.maxcontribution))
      // dispatch(addMandatoryProposal(data.mandatoryproposal))
      // dispatch(addVoteForQuorum(data.voteforquorum))
      // dispatch(addMinContribution(data.mincontribution))
      // dispatch(addVoteInFavour(data.voteinfavour))
      // dispatch(addDepositClose(data.depositclose))


      const contract = new SmartContract(GovernorContract, daoAddress, userDetails)
      contract.depositClosed()
      .then((result) => {
          console.log(result)
          setDataFetched(true)
        },
        (error) => {
          console.log(error)
        }
      )
      contract.minDeposit()
      .then((result) => {
          setMinDeposit(result)
          setDataFetched(true)
        },
        (error) => {
          console.log(error)
        }
      )
      contract.maxDeposit()
      .then((result) => {
          setMaxDeposit(result)
          setDataFetched(true)
        },
        (error) => {
          console.log(error)
        }
      )
      contract.totalDeposit()
      .then((result) => {
          setTotalDeposit(result)
          setDataFetched(true)
        },
        (error) => {
          console.log(error)
        }
      )
      contract.quoram()
      .then((result) => {
          setQuoram(result)
          setDataFetched(true)
        },
        (error) => {
          console.log(error)
        }
      )
      contract.maxDeposit()
      .then((result) => {
          setMaxDeposit(result)
          setDataFetched(true)
        },
        (error) => {
          console.log(error)
        }
      )
      fetchClub(pid)
      .then((data) => {
        console.log(result)
        setDataFetched(true)
      },
      (error) => {
        console.log(error)
      }
      )
    }

    if (!fetched) {
    const usdc_contract = new SmartContract(USDCContract, USDC_CONTRACT_ADDRESS, userDetails)
    usdc_contract.balanceOf()
    .then((result) => {
      setWalletBalance(result)
      setFetched(true)
      },
      (error) => {
        console.log("Failed to fetch wallet USDC", error)
      }
    )

    }
    if (previouslyConnectedWallet) {
      onboard.connectWallet({ autoSelect: previouslyConnectedWallet[0] })
    }

    checkConnection()
  }, [previouslyConnectedWallet, fetched, pid, userDetails, dataFetched, daoAddress])

  const handleConnectWallet = () => {
    try {
      const wallet = connectWallet(dispatch)
      setWalletConnected(true)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleDeposit = () => {
    console.log(typeof(depositAmount))
    const usdc_contract = new SmartContract(USDCContract, USDC_CONTRACT_ADDRESS, userDetails)
    // pass governor contract
    const dao_contract = new SmartContract(GovernorContract, daoAddress, userDetails)

    // pass governor contract
    const usdc_response = usdc_contract.approveDeposit(daoAddress, depositAmount)
    usdc_response.then(
      (result) => {
        console.log("Success", result)
        const deposit_response = dao_contract.deposit(USDC_CONTRACT_ADDRESS, depositAmount)
        deposit_response.then((result) => {
          console.log("Result", result)
          setAlertStatus("success")
          setOpenSnackBar(true)  
        })
          .catch((error) => {
            console.log("Error", error)
            setAlertStatus("error")
            setOpenSnackBar(true)
          })
      },
      (error) => {
        console.log("Error", error)
        setAlertStatus("error")
        setOpenSnackBar(true)
      }
    )
  }

  const handleInputChange = (newValue) => {
    setDepositAmount(parseInt(newValue))
  }

  const handleMaxButtonClick = (event) => {
    // value should be the maximum deposit value
    setDepositAmount(parseInt(maxDeposit))
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false)
  };

  return (
    <Layout3>
      <div style={{ padding: "127px 140px" }}>
        <Grid container spacing={2}>
          <Grid item md={7}>
            <Card className={classes.cardRegular}>
              <Grid container spacing={2}>
                <Grid item mt={3} ml={3}>
                  <Avatar className={classes.avatarStyle}>D</Avatar>
                </Grid>
                <Grid item ml={1} mt={4} mb={7}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {/* {fetched ? data[0].name : null} */}
                      TAB
                    </Typography>
                    <Typography variant="h6" className={classes.dimColor}> $DEMO</Typography>
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
                          12/04/2022
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
                    <Typography variant="p" className={classes.valuesDimStyle}>Governance</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>By Voting</Typography>
                  </Stack>
                </Grid>
                <Grid item ml={4} mt={5} mb={2}>
                  <Stack spacing={1} alignItems="stretch">
                    <Typography variant="p" className={classes.valuesDimStyle}>Minimum Deposits</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>{ dataFetched ? minDeposit : 0 } USDC</Typography>
                  </Stack>
                  <br />
                  <Stack spacing={1} alignItems="stretch">
                    <Typography variant="p" className={classes.valuesDimStyle}>Members</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>8</Typography>
                  </Stack>
                </Grid>
                <Grid item ml={4} mt={5} mb={2}>
                  <Stack spacing={1} alignItems="stretch">
                    <Typography variant="p" className={classes.valuesDimStyle}>Maximum Deposit</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>{ dataFetched ? maxDeposit : 0 } USDC</Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Grid item ml={3} mt={5} mb={2} mr={3}>
                <ProgressBar value={ dataFetched ? quoram : 0 } />
              </Grid>
              <Grid container spacing={2} >
                <Grid item ml={4} mt={5} mb={2}>
                  <Stack spacing={1}>
                    <Typography variant="p" className={classes.valuesDimStyle}>Club Tokens Minted so far</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>68,000 $DEMO</Typography>
                  </Stack>
                </Grid>
                <Grid item ml={4} mt={5} mb={2} mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Stack spacing={1}>
                    <Typography variant="p" className={classes.valuesDimStyle}>Total Supply</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>{ dataFetched ? totalDeposit : 0} $DEMO</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item md={5}>
            {walletConnected ? (
              <Card className={classes.cardRegular}>
                <Grid container spacing={2}>
                  <Grid item ml={2} mt={4} mb={4}>
                    <Typography variant="h4">
                      Join this Club
                    </Typography>
                  </Grid>
                  <Grid item ml={1} mt={4} mb={4} mr={2} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="h6" className={classes.dimColor}>
                      Closes in 16 days
                    </Typography>
                  </Grid>
                </Grid>
                <Divider variant="middle" />
                <Grid container spacing={2}>
                  <Grid item md={12} mt={5}>
                    <Card className={classes.cardSmall}>
                      <Grid container spacing={2}>
                        <Grid item ml={2} mt={2} mb={0}>
                          <Typography className={classes.cardSmallFont}>
                            USDC
                          </Typography>
                        </Grid>
                        <Grid item ml={2} mt={2} mb={0} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <Typography className={classes.cardSmallFont}>
                            Balance: {walletBalance} USDC
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item ml={2} mt={0} mb={2}>
                          <Input type="number" error={depositAmount === ""} className={classes.cardLargeFont} value={depositAmount} onChange={(e) => handleInputChange(e.target.value)} />
                        </Grid>
                        <Grid item ml={2} mt={2} mb={2} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button className={classes.maxTag} onClick={handleMaxButtonClick}>
                              Max
                            </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={12} mt={2}>
                    <Card className={classes.cardWarning}>
                      <Typography className={classes.textWarning}>
                        Clubs can have same names or symbols, please make sure to trust the sender for the link before depositing.
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item container ml={1} mt={2}>
                    <Button variant="contained" size="large" className={classes.depositButton} onClick={handleDeposit}>
                      Deposit
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ) : (
              <Card className={classes.cardRegular}>
                <Grid container spacing={2}>
                  <Grid item ml={15} mr={15} mt={5} mb={5}>
                    <Image src="/assets/images/connect_illustration.png" alt="connect_illustration" width="418px" height="377px" />
                  </Grid>
                  <Grid item container ml={1} mt={2}>
                    <Button variant="contained" className={classes.connectWalletButton} onClick={handleConnectWallet}>
                      Connect Wallet
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
          {alertStatus === 'success'? 
            (<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Transaction Successfull!
            </Alert>) : 
            (<Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              Transaction Failed!
            </Alert>)
          }
      </Snackbar>
      </div>
    </Layout3>
  )
}
