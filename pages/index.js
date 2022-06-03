import { React, useState } from "react"
import Layout from "../src/components/layouts/layout3"
import { Grid, Button, Card, Typography, Divider, Stack, Menu, ListItemButton } from "@mui/material"
import { connectWallet } from "../src/utils/wallet"
import { useDispatch } from "react-redux"
import { makeStyles } from "@mui/styles"
import AddIcon from '@mui/icons-material/Add'
import { style } from "@mui/system"
import Router from 'next/link'


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
  }
})

export default function app() {
  const dispatch = useDispatch()
  const [clubFlow, setClubFlow] = useState(false)
  const classes = useStyles()

  const handleConnection = async (event) => {
    const wallet = connectWallet(dispatch)
    wallet.then((response) => {
      if (response) {
        setClubFlow(true)
      } else {
        setClubFlow(false)
      }
    })
  }

  const handleCreateButtonClick = async (event) => {
    const { pathname } = Router
      if (pathname == "/" && clubFlow) {
        Router.push("/create")
      }
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
                  <ListItemButton component="a" href="/dashboard">
                    <Grid container>
                      <Grid item md={2}>
                        <img src="/assets/images/finserv_icon@2x.png" alt="club_logo" className={classes.logoImage} />
                      </Grid>
                      <Grid item md={6}>
                        <Stack
                          spacing={0}>
                          <Typography className={classes.yourClubText}>Demo Club</Typography>
                          <Typography className={classes.clubAddress}>0xCE2a.........ef8b</Typography>
                        </Stack>
                      </Grid>
                      <Grid item md={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Stack
                          spacing={0} alignItems="flex-end" justifyContent="flex-end">
                          <Typography className={classes.createClubButton}>1,37,000 USDC</Typography>
                          <Typography className={classes.clubAddress}>Owner</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                  <ListItemButton component="a" href="/dashboard">
                    <Grid container>
                      <Grid item md={2}>
                        <img src="/assets/images/finserv_icon@2x.png" alt="club_logo" className={classes.logoImage} />
                      </Grid>
                      <Grid item md={6}>
                        <Stack
                          spacing={0}>
                          <Typography className={classes.yourClubText}>Demo Club</Typography>
                          <Typography className={classes.clubAddress}>0xCE2a.........ef8b</Typography>
                        </Stack>
                      </Grid>
                      <Grid item md={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Stack
                          spacing={0} alignItems="flex-end" justifyContent="flex-end">
                          <Typography className={classes.createClubButton}>1,37,000 USDC</Typography>
                          <Typography className={classes.clubAddress}>Owner</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </ListItemButton>
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
