import { React, useEffect, useState } from "react"
import Layout from "../src/components/layouts/layout3"
import {
  Grid,
  Button,
  Card,
  Typography,
  Divider,
  Stack,
  Menu,
  ListItemButton,
  Avatar,
  DialogContent, Dialog
} from "@mui/material"
import { connectWallet } from "../src/utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@mui/styles"
import AddIcon from '@mui/icons-material/Add'
import { style } from "@mui/system"
import Router, { useRouter } from "next/router"
import { fetchClubByUserAddress } from "../src/api/user"
import store from "../src/redux/store"
import { addClubName, addDaoAddress, addClubID, addClubRoute } from "../src/redux/reducers/create"
import {checkNetwork} from "../src/utils/wallet"
import Web3 from "web3";
import {
  getExpiryTime,
  getJwtToken,
  getRefreshToken,
  setExpiryTime,
  setJwtToken,
  setRefreshToken
} from "../src/utils/auth";
import {loginToken, refreshToken} from "../src/api/auth";


const useStyles = makeStyles({
  yourClubText: {
    fontSize: "30px",
    color: "#F5F5F5",
    opacity: 1,
    fontFamily: "Whyte",
  },
  createClubButton: {
    fontSize: "22px",
    fontFamily: "Whyte",
    borderRadius: "30px"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  logoImage: {
    width: "75px",
    height: "auto",
    maxWidth: "100px",
    minWidth: "50px",
  },
  clubAddress: {
    fontSize: "16px",
    color: "#C1D3FF",
    opacity: 1,
    fontFamily: "Whyte",
  },
  bannerImage: {
    width: "60vh"
  },
  modalStyle: {
    width: "792px",
    backgroundColor: '#19274B',
  },
  dialogBox: {
    fontSize: "28px"
  },
})

export default function App() {
  const dispatch = useDispatch()
  const [clubFlow, setClubFlow] = useState(false)
  const classes = useStyles()
  const [walletID, setWalletID] = useState(null)
  const [clubData, setClubData] = useState([])
  const [clubOwnerAddress, setClubOwnerAddress] = useState(null)
  const [fetched, setFetched] = useState(false)
  const [noWalletMessage, setNoWalletMessage] = useState(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider)
    const networkIdRK = '42'
    web3.eth.net.getId()
      .then((networkId) => {
        if (networkId != networkIdRK) {
          setOpen(true)
        }
      })
      .catch((err) => {
        console.log(err)
      });
    if (!fetched && walletID) {
      const getClubs = fetchClubByUserAddress(walletID)
      getClubs.then((result) => {
        if (result.status != 200) {
          console.log(result.statusText)
        }
        else {
          setClubData(Array.from(result.data.clubs))
          setClubOwnerAddress(result.data.userAddress.substring(0, 6) + ".........." + result.data.userAddress.substring(result.data.userAddress.length - 4))
          setFetched(true)
        }
      })
        .catch((error) => {
          setNoWalletMessage("You don't have any clubs available, please join an existing one or create a new club")
          console.log(error)
        })
    }
  }, [walletID])

  const handleConnection = async (event) => {
    let wallet = connectWallet(dispatch)
    wallet.then((response) => {
      if (response) {
        const getLoginToken = loginToken(localStorage.getItem("wallet"))
        getLoginToken.then((response) => {
          if (response.status !== 200) {
            console.log(response.data.error)
          }
          else {
            setExpiryTime(response.data.tokens.access.expires)
            const expiryTime = getExpiryTime()
            const currentDate = Date()
            setJwtToken(response.data.tokens.access.token)
            setRefreshToken(response.data.tokens.refresh.token)
            if (expiryTime < currentDate) {
              const obtainNewToken = refreshToken(getRefreshToken(), getJwtToken())
              obtainNewToken.then((tokenResponse) => {
                if (response.status !== 200) {
                  console.log(tokenResponse.data.error)
                }
                else {
                  setExpiryTime(tokenResponse.data.tokens.access.expires)
                  setJwtToken(tokenResponse.data.tokens.access.token)
                  setRefreshToken(tokenResponse.data.tokens.refresh.token)
                }
              })
              .catch((error) => {
                console.log(error)
              })
            }
          }
        })
        setWalletID(localStorage.getItem("wallet"))
        setClubFlow(true)
      } else {
        setClubFlow(false)
      }
    })
  }

  const handleCreateButtonClick = async (event) => {
    const { pathname } = Router
    console.log(pathname)
    if (pathname == "/") {
      Router.push("/create")
    }
  }

  const handleItemClick = (data) => {
    console.log(data)
    dispatch(addClubName(data.name))
    dispatch(addDaoAddress(data.daoAddress))
    dispatch(addClubID(data.clubId))
    dispatch(addClubRoute(data.route))
    router.push(`/dashboard/${data.clubId}`, undefined, { shallow: true })
  }

  const handleClose = (e) => {
    e.preventDefault()
    setOpen(false)
  }

  const handleSwitchNetwork = async () => {
    const switched = await checkNetwork()
    if (switched) {
      setOpen(false)
    }
    else {
      setOpen(true)
    }
  }

  return (
    <Layout>
        {clubFlow ? (
          <Grid container direction="row"
            justifyContent="center"
            alignItems="center" mt={20} mb={10} >
            <Grid item md={5}>
              <Card>
                <Grid container mt={2}>
                  <Grid item>
                    <Typography className={classes.yourClubText}>
                      Your clubs
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button startIcon={<AddIcon fontSize="large" />} variant="primary" onClick={handleCreateButtonClick}>
                      Create club
                    </Button>
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Stack spacing={3}>
                  {fetched ? clubData.map((club, key) => {
                    return (
                      <ListItemButton component="a" key={key} onClick={e => { handleItemClick(clubData[key]) }}>
                        <Grid container>
                          <Grid item md={2}>
                            <img src={club.imageUrl} width="80vw" alt="club_image" />
                          </Grid>
                          <Grid item md={6}>
                            <Stack
                              spacing={0}>
                              <Typography className={classes.yourClubText}>{club.name}</Typography>
                              <Typography className={classes.clubAddress}>{clubOwnerAddress}</Typography>
                            </Stack>
                          </Grid>
                          <Grid item md={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Stack
                              spacing={0} alignItems="flex-end" justifyContent="flex-end">
                              <Typography className={classes.createClubButton}></Typography>
                              <Typography className={classes.clubAddress}>{club.isAdmin ? "Admin" : "Member"}</Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItemButton>
                    )
                  }) : <Grid container item justifyContent="center" alignItems="center" ><Typography>{noWalletMessage}</Typography></Grid>}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container direction="column"
            justifyContent="center"
            alignItems="center">

            <Grid item mt={15} >
              <img className={classes.bannerImage} src="/assets/images/start_illustration.svg" />
            </Grid>
            <Grid item mt={4}>
              <Typography variant="mainHeading" >Do more together</Typography>
            </Grid>
            <Grid item mt={4}>
              <Typography variant="regularText">Create or join a club in less than 60 seconds using StationX</Typography>
            </Grid>
            <Grid item m={4}>
              <Button
                variant="primary"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => handleConnection()}
              >
                Connect Wallet
              </Button>
            </Grid>
          </Grid>

        )}
      <Dialog open={open} onClose={handleClose} scroll="body" PaperProps={{ classes: { root: classes.modalStyle } }} fullWidth maxWidth="lg" >
        <DialogContent sx={{ overflow: "hidden", backgroundColor: '#19274B', }} >
          <Grid container justifyContent="center" alignItems="center" direction="column" mt={3}>
            <Grid item pl={15}>
              <img src="/assets/images/connected_world_wuay.svg" width="80%" />
            </Grid>
            <Grid item m={3}>
              <Typography className={classes.dialogBox}>You are in the wrong network, please switch to the correct network by clicking the button provided below</Typography>
            </Grid>
            <Grid item m={3}>
              <Button variant="primary" onClick={() => {handleSwitchNetwork()}}>Switch Network</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
