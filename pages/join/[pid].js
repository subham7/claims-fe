import {React, useRef, onChange, useState, useEffect} from "react"
import Image from "next/image"
import { makeStyles } from "@mui/styles"
import { Grid, Typography, Avatar, Card, Button, Stack, Divider, TextField } from "@mui/material"
import Layout3 from "../../src/components/layouts/layout3"
import ProgressBar from "../../src/components/progressbar"
import { connectWallet, setUserChain, onboard } from "../../src/utils/wallet"
import { useDispatch } from "react-redux"
import { useRouter } from "next/router";
import { fetchClub, USDC_CONTRACT_ADDRESS, DAO_CONTRACT_ADDRESS } from "../../src/api";
import store from "../../src/redux/store"
import Web3 from "web3"
import USDCContract from "../../src/abis/usdc.json"
import GovernorContract from "../../src/abis/governor.json"
import { SmartContract } from "../../src/api/index"


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
    fontSize: "38px",
    fontWeight: "bold",
    color: "#F5F5F5",
    borderColor: "#142243",
    borderRadius: "0px"
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
  },
  maxTagFont: {
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

export default  function Join(props) {
  const router = useRouter()
  const { pid } = router.query
  const dispatch = useDispatch()
  const classes = useStyles() 
  const [walletConnected, setWalletConnected] = useState(false)
  const [data, setData] = useState([])
  const [fetched, setFetched] = useState(false)
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [depositAmount, setDepositAmount] = useState("0.0")
  const [daoAddress, setDaoAddress] = useState(null)

  useEffect(() => {
    store.subscribe(() => {
      const { create } = store.getState()
      if (create.value) {
        setPreviouslyConnectedWallet(create.value)
        setWalletBalance(create.value[0][0].balance.rETH)
        setDaoAddress(pid)
      }
      else{
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
      try{
        window.web3.eth.getAccounts()
        .then((async) => {
          setUserDetails(async[0])
        });
      }
      catch(err){
        setUserDetails(null)
      }
    };

    if(!fetched){
      fetchClub(pid)
      .then((result) => {
            result.data.then(
              (data) => {
                setData(data)
                setFetched(true)
              },
              (error) => {
                console.log(error)
              })
          })
        }
    if (previouslyConnectedWallet) {
      onboard.connectWallet({ autoSelect: previouslyConnectedWallet[0] })
    }
        
    checkConnection()
  }, [previouslyConnectedWallet, fetched, pid, userDetails])

  const handleConnectWallet = () => {
    try{
      const wallet = connectWallet(dispatch)
      setWalletConnected(true)
    }
    catch(err){
      console.log(err)
    }
  }

  const handleDeposit = () => {
    const usdc_contract = new SmartContract(USDCContract, USDC_CONTRACT_ADDRESS)
    const approve_contract = new SmartContract(GovernorContract, DAO_CONTRACT_ADDRESS)

    const usdc_response = usdc_contract.approveDeposit(daoAddress, depositAmount)
    usdc_response.then(
      (result) => {
        console.log("Success", result)
        const deposit_response = approve_contract.deposit(daoAddress, depositAmount)
        deposit_response.then((result) => {
          console.log("Result", result)
        })
        .catch((error) => {
          console.log("Error", error)
        })
      },
      (error) => {
        console.log("Error", error)
      }
    )
    
  }

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
                    {/* {data[0].name} */}
                    TAB
                  </Typography>
                  <Typography variant="h6" className={classes.dimColor}> $DEMO</Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider variant="middle"/>
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
                  <Typography variant="p" className={classes.valuesStyle}>1,000 USDC</Typography>
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
                  <Typography variant="p" className={classes.valuesStyle}>10,000 USDC</Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid item ml={3} mt={5} mb={2} mr={3}>
              <ProgressBar />
            </Grid>
            <Grid container spacing={2} >
              <Grid item ml={4} mt={5} mb={2}>
                  <Stack spacing={1}>
                    <Typography variant="p" className={classes.valuesDimStyle}>Club Tokens Minted so far</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>68,000 $DEMO</Typography>
                  </Stack>                
              </Grid>
              <Grid item ml={4} mt={5} mb={2} mr={4} xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                <Stack spacing={1}>
                    <Typography variant="p" className={classes.valuesDimStyle}>Total Supply</Typography>
                    <Typography variant="p" className={classes.valuesStyle}>100,000 $DEMO</Typography>
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
                <Grid item ml={1} mt={4} mb={4} mr={2} xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                  <Typography variant="h6" className={classes.dimColor}> 
                      Closes in 16 days
                    </Typography>
                </Grid>
              </Grid>
              <Divider variant="middle"/>
              <Grid container spacing={2}>
                <Grid item md={12} mt={5}>
                  <Card className={classes.cardSmall}>
                    <Grid container spacing={2}>
                      <Grid item ml={2} mt={2} mb={0}>
                        <Typography className={classes.cardSmallFont}>
                          USDC
                        </Typography>
                      </Grid>
                      <Grid item ml={2} mt={2} mb={0} xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                        <Typography className={classes.cardSmallFont}>
                          Balance: {walletBalance} USDC
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item ml={2} mt={0} mb={2}>
                        <TextField type="number" className={classes.cardLargeFont} value={depositAmount} onChange={(e) => setDepositAmount(parseFloat(e.target.value))}/>
                      </Grid>
                      <Grid item ml={2} mt={2} mb={2} xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                        <Card className={classes.maxTag}>
                          <Typography className={classes.maxTagFont}>
                            Max
                          </Typography>
                        </Card>
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
            )  : (
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
      </div>
    </Layout3>
  )
}
