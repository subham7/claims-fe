import { React, useEffect, useState } from "react"
import Layout from "../src/components/layouts/layout3"
import { Grid, Button, Card, Typography, Divider, Stack, Menu, ListItemButton, Avatar } from "@mui/material"
import { connectWallet } from "../src/utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@mui/styles"
import AddIcon from '@mui/icons-material/Add'
import { style } from "@mui/system"
import Router, { useRouter } from "next/router"
import { fetchClubByUserAddress } from "../src/api/index"
import store from "../src/redux/store"
import { addClubName, addDaoAddress, addClubID, addClubRoute } from "../src/redux/reducers/create"


const useStyles = makeStyles({
  yourClubText: {
    fontSize: "30px",
    color: "#F5F5F5",
    opacity: 1,
  },
  createClubButton: {
    fontSize: "22px",
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
  },
  avatarStyle: {
    width: "5.21vw",
    height: "10.26vh",
    backgroundColor: "#C1D3FF33",
    color: "#C1D3FF",
    fontSize: "3.25rem"
  }
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
  const router = useRouter()

  useEffect(() => {
    setWalletID(localStorage.getItem("wallet"))
  }, [walletID])

  const handleConnection = async (event) => {
    let wallet = connectWallet(dispatch)
    wallet.then((response) => {
      if (response) {
        setClubFlow(true)
        if (!fetched && walletID){
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
    router.push(`/dashboard/${data.clubId}` , undefined, { shallow: true })
  }

  return (
    <Layout>
      <div style={{ padding: "100px 400px" }}>
        {clubFlow ? (
          <Grid container direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item md={8}>
              <Card>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.yourClubText}>
                      Your clubs
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button startIcon={<AddIcon sx={{ fontSize: "22px" }} />} variant="contained" className={classes.createClubButton} onClick={handleCreateButtonClick}>
                      Create club
                    </Button>
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Stack spacing={3}>
                  {fetched ? clubData.map((club, key) => {
                    return (
                      <ListItemButton component="a" key={key} onClick={e => {handleItemClick(clubData[key])}}>
                      <Grid container>
                        <Grid item md={2}>
                          <Avatar className={classes.avatarStyle}>{club.name[0]}</Avatar>
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
                            <Typography className={classes.clubAddress}>{clubOwnerAddress === walletID ? "Owner" : "Member"}</Typography>
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

            <Grid item >
              <img src="/assets/images/start_illustration.svg" />
            </Grid>
            <Grid item m={10}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => handleConnection()}
              >
                Connect Wallet
              </Button>
            </Grid>
          </Grid>

        )}

      </div>
    </Layout>
  )
}
