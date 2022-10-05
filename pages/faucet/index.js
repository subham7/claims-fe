import { React, useRef, onChange, useState, useEffect } from "react"
import Image from "next/image"
import { makeStyles } from "@mui/styles"
import USDCContract from "../../src/abis/usdcTokenContract.json"
import {
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  TextField,
} from "@mui/material"
import Layout3 from "../../src/components/layouts/layout3"
import { connectWallet, setUserChain, onboard } from "../../src/utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import store from "../../src/redux/store"
import Web3 from "web3"
import { SmartContract } from "../../src/api/contract"
import { calculateTreasuryTargetShare, convertAmountToWei, convertToWei } from "../../src/utils/globalFunctions";

const useStyles = makeStyles({
  valuesStyle: {
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  valuesDimStyle: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#C1D3FF",
  },
  cardRegular: {
    // height: "626px",
    backgroundColor: "#19274B",
    borderRadius: "10px",
    opacity: 1,
  },
  cardJoin: {
    backgroundColor: "#81F5FF",
    borderRadius: "10px",
    opacity: 1,

  },
  dimColor: {
    color: "#C1D3FF",
  },
  connectWalletButton: {
    backgroundColor: "#3B7AFD",
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  depositButton: {
    backgroundColor: "#3B7AFD",
    width: "208px",
    height: "60px",
    fontFamily: "Whyte",
    fontSize: "21px",
  },
  cardSmall: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontFamily: "Whyte",
    fontSize: "18px",
    color: "#111D38",
  },
  JoinText: {
    color: "#111D38",
  },
  cardLargeFont: {
    width: "150px",
    fontSize: "2em",
    fontWeight: "bold",
    fontFamily: "Whyte",
    color: "#F5F5F5",
    borderColor: "#142243",
    borderRadius: "0px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    borderColor: "#111D38",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontFamily: "Whyte",
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
    "&:hover": {
      background: "#F5F5F5",
      color: "#3B7AFD",
    },
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
    paddingTop: "1px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#0ABB92",
    opacity: "1",
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
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontSize: "28px",
  },
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
  },
  wrapTextIcon: {
    fontSize: "18px",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
})

const Faucet = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [failed, setFailed] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] = useState(null)
  const [depositInitiated, setDepositInitiated] = useState(false)
  const [open, setOpen] = useState(false)
  const [FaucetAmount, setFaucetAmount] = useState(5000)
  const [FaucetAddress, setFaucetAddress] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")
  const FACTORY_CONTRACT_ADDRESS = useSelector(state => {
    return state.gnosis.factoryContractAddress
  })
  const USDC_CONTRACT_ADDRESS = useSelector(state => {
    return state.gnosis.usdcContractAddress
  })
  const GNOSIS_TRANSACTION_URL = useSelector(state => {
    return state.gnosis.transactionUrl
  })

  const handleConnectWallet = () => {
    try {
      const wallet = connectWallet(dispatch)
      wallet.then((response) => {
        if (response) {
          setWalletConnected(true)
        } else {
          setWalletConnected(false)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  // useEffect(() => {
  //   const web3 = new Web3(Web3.givenProvider)
  //   const networkIdRK = "4"
  //   web3.eth.net
  //     .getId()
  //     .then((networkId) => {
  //       if (networkId != networkIdRK) {
  //         setOpen(true)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }, [])

  const getAccount = async () => {
    if (localStorage.getItem("isWalletConnected")) {
      setPreviouslyConnectedWallet(localStorage.getItem("wallet"))
    }
    store.subscribe(async () => {
      const { create } = await store.getState()
      if (create.value) {
        setPreviouslyConnectedWallet(create.value)
      }
      else {
        setPreviouslyConnectedWallet(null)
      }
    })
  }
  const getFaucetAddress = async () => {
    var web3
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
    }
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider)
    }
    try {
      web3.eth.getAccounts()
        .then((async) => {
          setFaucetAddress(async[0])
        }
        );
    }
    catch (err) {
      setFaucetAddress(null)
    }
  }

  useEffect(() => {
    handleConnectWallet()
    getFaucetAddress()
  }, [])


  const handleFaucet = async (FaucetAddress, FaucetAmount) => {
    setOpen(true)
    const usdcFaucet = new SmartContract(
      USDCContract,
      USDC_CONTRACT_ADDRESS,
      undefined, USDC_CONTRACT_ADDRESS, GNOSIS_TRANSACTION_URL
    )
    const transaction = usdcFaucet.mint(FaucetAddress, (FaucetAmount).toString())
    transaction.then((response) => {
      setStatusMessage("Token minted successfully!!")
      setOpenSnackBar(true)
      setFailed(false)
      setOpen(false)
    },
    (error) => {
      setStatusMessage("Error minting token!, Please try again later.")
      setOpenSnackBar(true)
      setFailed(true)
      setOpen(false)
    })
  }

  const handleDialogClose = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false)
  }

  
  const importTokenToMetaMask = async () => {
    try {
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: USDC_CONTRACT_ADDRESS,
            symbol: "USDC",
            decimals: 6,
          },
        },
      });

      if (wasAdded) {
        setStatusMessage("Token imported successfully!!")
        setFailed(false)
        setOpenSnackBar(true)
      } else {
        setStatusMessage("Error importing token!, Please try again later.")
        setFailed(true)
        setOpenSnackBar(true)
      }
    } catch (error) {
      setStatusMessage("Error importing token!, Please try again later.")
      setFailed(true)
      setOpenSnackBar(true)
    }
  }

  return (
    <Layout3>
      <Grid
        container
        spacing={2}
        paddingLeft={10}
        paddingTop={15}
        paddingRight={10}
        justifyContent="center"
        alignItems="center"
      >
      </Grid>
      <Grid container direction="row"
        justifyContent="center"
        alignItems="center">
        <Grid item md={8} mt={8}>
          <br />
          <Typography className={classes.wrapTextIcon}>
            You can now mint USDC tokens to your wallet address.
          </Typography>
          <TextField id="outlined-basic" className={classes.textField} disabled marginTop={10} variant="outlined" value={FaucetAddress} />
          <TextField id="outlined-basic" disabled className={classes.textField} label="5000" marginTop={10} variant="outlined" />
          <Grid container direction="row" spacing={4}>
            <Grid item xs={0} mt={2} flex flexDirection="row" justifyContent="space-between">
              <Button
                variant="wideButton"
                onClick={() => handleFaucet(FaucetAddress, FaucetAmount)}
              >
                Mint
              </Button>
            </Grid>
            <Grid item xs={0} mt={2} flex flexDirection="row" justifyContent="space-between">
            <Button variant="transparentWhite" color={"#FFFFFF"} ml={"200px"} onClick={() => { window.open(`https://faucets.chain.link`) }}> Get Eth here</Button>
            </Grid>
            <Grid item xs={0} mt={2} flex flexDirection="row" justifyContent="space-between">
            <Button variant="transparentWhite" color={"#FFFFFF"} ml={"200px"} onClick={() => {importTokenToMetaMask()}}> Import token</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {!failed ?
            (<Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
              {statusMessage}
            </Alert>) :
            (<Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
              {statusMessage}
            </Alert>)
          }
        </Snackbar>
      <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
    </Layout3>
  )
}

export default Faucet
