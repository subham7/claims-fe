import { React, useEffect, useState } from "react"
import Layout from "../../src/components/layouts/layout3"
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
import { connectWallet } from "../../src/utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@mui/styles"
import AddIcon from '@mui/icons-material/Add'
import { style } from "@mui/system"
import Router, { useRouter } from "next/router"
import store from "../../src/redux/store"
import { addClubName, addDaoAddress, addClubID, addClubRoute } from "../../src/redux/reducers/create"
import {checkNetwork} from "../../src/utils/wallet"
import Web3 from "web3";


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
  const [clubData, setClubData] = useState([
    {
      imageUrl: "https://clubprofilepics.s3.ap-south-1.amazonaws.com/04.png",
      name: "TestClub",
      isAdmin: true,
      clubId: "0607fc5d-076c-422f-b1c9-54ba9f252ab9",
    }
  ])
  const [clubOwnerAddress, setClubOwnerAddress] = useState(null)
  const [noWalletMessage, setNoWalletMessage] = useState(null)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider)
    const networkIdRK = '4'
    web3.eth.net.getId()
      .then((networkId) => {
        if (networkId != networkIdRK) {
          setOpen(true)
        }
      })
      .catch((err) => {
        console.log(err)
      });
      setClubOwnerAddress(localStorage.getItem("wallet").substring(0, 6) + ".........." + localStorage.getItem("wallet").substring(localStorage.getItem("wallet").length - 4))
  }, [walletID])

  const handleConnection = async (event) => {
    let wallet = connectWallet(dispatch)
    wallet.then((response) => {
      if (response) {
        setWalletID(localStorage.getItem("wallet"))
        setClubFlow(true)
      } else {
        setClubFlow(false)
      }
    })
  }

  const handleCreateButtonClick = async (event) => {
    const { pathname } = Router
    if (pathname === "/demo") {
      Router.push("/demo/create")
    }
  }

  const handleItemClick = (data) => {
    dispatch(addClubName(data.name))
    dispatch(addClubID(data.clubId))
    dispatch(addClubRoute(data.route))
    router.push(`demo/dashboard/${data.clubId}`, undefined, { shallow: true })
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
                  {clubData.map((club, key) => {
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
                  })}
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
