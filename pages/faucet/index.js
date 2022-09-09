import { React, useRef, onChange, useState, useEffect } from "react"
import Image from "next/image"
import { makeStyles } from "@mui/styles"
import USDCFaucet from "../../src/abis/usdcFaucet.json"
import {
  Grid,
  Typography,
  Avatar,
  Card,
  Button,
  Stack,
  Divider,
  Input,
  Snackbar,
  Alert,
  Skeleton,
  Chip,
  Backdrop,
  CircularProgress,
  TextField,
  DialogContent,
  Dialog,
  CardMedia,
} from "@mui/material"
import Layout3 from "../../src/components/layouts/layout3"
import ProgressBar from "../../src/components/progressbar"
import { connectWallet, setUserChain, onboard } from "../../src/utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import {
  USDC_CONTRACT_ADDRESS
} from "../../src/api"
import { fetchClub, fetchClubbyDaoAddress } from "../../src/api/club"
import {createUser} from "../../src/api/user"
import {getMembersDetails, patchUserBalance, checkUserByClub} from "../../src/api/user"
import store from "../../src/redux/store"
import Web3 from "web3"
import ImplementationContract from "../../src/abis/implementationABI.json"
import { SmartContract } from "../../src/api/contract"
import { checkNetwork } from "../../src/utils/wallet"
import {calculateTreasuryTargetShare, convertAmountToWei, convertToWei} from "../../src/utils/globalFunctions";
import { SignalCellularNull } from "@mui/icons-material"

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
  JoinText:{
  color:"#111D38",
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
    borderColor:"#111D38",
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
})

const Join = (props) => {
  const router = useRouter()
  const { pid } = router.query
  const daoAddress = pid
  const dispatch = useDispatch()
  const classes = useStyles()
  const [walletConnected, setWalletConnected] = useState(false)
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] = useState(null)
  const [tokenDetails, settokenDetails] = useState(null)
  const [tokenAPIDetails, settokenAPIDetails] = useState(null) // contains the details extracted from API
  const [apiTokenDetailSet, setApiTokenDetailSet] = useState(false)
  const [governorDetails, setGovernorDetails] = useState(null)
  const [governorDataFetched, setGovernorDataFetched] = useState(false)
  const [clubId, setClubId] = useState(null)
  const [membersFetched, setMembersFetched] = useState(false)
  const [members, setMembers] = useState(0)
  const [depositInitiated, setDepositInitiated] = useState(false)
  const [closingDays, setClosingDays] = useState(0)
  const [imageFetched, setImageFetched] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [open, setOpen] = useState(false)
  const [gnosisAddress, setGnosisAddress] = useState(null)
  const[FaucetAmount,setFaucetAmount] = useState(null)
  const[FaucetAddress,setFaucetAddress]=useState(null)


  
 
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
  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider)
    const networkIdRK = "4"
    web3.eth.net
      .getId()
      .then((networkId) => {
        if (networkId != networkIdRK) {
          setOpen(true)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const getAccount = async () => {
    if ( localStorage.getItem("isWalletConnected")) {
      setPreviouslyConnectedWallet(localStorage.getItem("wallet"))
    }
    store.subscribe(async() => {
      const { create } = await store.getState()
      if (create.value) {
        setPreviouslyConnectedWallet(create.value)

       
      }
      else{
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
    try{
      web3.eth.getAccounts()
      .then((async) => {
        setFaucetAddress(async[0])
      }

    );
  }
  catch(err){
    setFaucetAddress(null)
  }
    
  }

 
 useEffect(() => {
  handleConnectWallet()
  
  getFaucetAddress()
     }, [])
console.log("previouslyConnectedWallet", previouslyConnectedWallet)

console.log(FaucetAddress)


  const handleFaucet = async (FaucetAddress,FaucetAmount) => {

   const usdcFaucet = new SmartContract(
    USDCFaucet,
    USDC_CONTRACT_ADDRESS,
    undefined
   )
const Tx = await usdcFaucet.mint(FaucetAddress,(FaucetAmount ).toString())
   console.log(usdcFaucet)
   console.log("faucet" , usdcFaucet)
  }


  const handleDialogClose = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  const handleSwitchNetwork = async () => {
    const switched = await checkNetwork()
    if (switched) {
      setOpen(false)
    } else {
      setOpen(true)
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
       
          <Card className={classes.cardRegular}>
           
            <Divider variant="middle" />
           
           
           
            <Grid
              container
              spacing={2}
              direction="column"
              justifyContent="space-between"
              alignItems="center"
            >
           
                  <TextField id="outlined-basic"  disabled marginTop={10} variant="outlined" value={FaucetAddress}/>
                  <TextField id="outlined-basic" label="Amount" marginTop={10} onChange={(e) => setFaucetAmount(e.target.value) } variant="outlined" />

                  <Button variant="primary" onClick={ () => handleFaucet  (FaucetAddress,FaucetAmount)}>
                    Mint
                  </Button>
              
             
            </Grid>
          </Card>
        </Grid>
       
      
     
     
     
    </Layout3>
  )
}

export default Join
