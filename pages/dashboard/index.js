import { React } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../src/components/layouts/layout3"
import { Box, Card, Grid, Typography, CardMedia, Divider, Stack, TextField, Button, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ButtonDropDown from "../../src/components/buttondropdown"
import BasicTable from "../../src/components/table"
import CollectionCard from "../../src/components/cardcontent"

const useStyles = makeStyles({
  firstCard: {
    position: "relative",
    width: "626px",
    height: "352px",
    padding: "0px",
    opacity: "1",
    background: "transparent linear-gradient(120deg, #3B7AFD 0%, #011FFD 100%) 0% 0% no-repeat padding-box"
  },
  secondCard: {
    position: "relative",
    width: "626px",
    height: "352px",
    padding: "0px",
    opacity: "1",
  },
  thirdCard: {
    width: "413px",
    height: "351px",
  },
  cardOverlay: {
    position: "absolute",
    top: "30px",
    left: "30px",
    right: "30px",
    bottom: "30px",
  },
  card1text1: {
    fontSize: "34px",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text2: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text3: {
    paddingTop: "70px",
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text4: {
    fontWeight: "bold",
    fontSize: "54px",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text5: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card2text1: {
    fontSize: "22px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text2: {
    fontWeight: "bold",
    fontSize: "46px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text3: {
    fontSize: "22px",
    color: "#0ABB92",
    opacity: "1",
  },
  card2text4: {
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text5: {
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text6: {
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text7: {
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text8: {
    fontSize: "18px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text9: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card3text1: {

  },
  card3text2: {
    fontSize: "19px",
    color: "#0ABB92",
  },
  card3text3: {
    width: "354px",
    color: "#C1D3FF",
  },
  card3text4: {
    textAlign: "left",
    fontSize: "19px",
    letteSpacing: "0.2px",
    color: "#C1D3FF",
    opacity: "1",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
  },
  copyButton: {
    width: "68px",
    height: "30px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "5px"

  },
  linkInput: {
    width: "354px",
    height: "auto",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  divider: {
    paddingLeft: "20%",
  },
  clubAssets: {
    fontSize: "48px",
    color: "#FFFFFF",
  },
  fourthCard: {
    width: "413px",
    height: "545px",
    borderRadius: "20px"
  },
  pendingIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
  },
  card5text1: {
    fontSize: "16px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card5text2: {
    fontSize: "22px",
    color: "#EFEFEF",
  },
  searchField: {
    width: "548px",
    height: "auto",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  tokensText: {
    fontSize: "30px",
    color: "#F5F5F5",
  }
})

export default function Dashboard(props) {
  const classes = useStyles()
  return (
    <>
      <Layout1>
        <div style={{ padding: "110px 80px" }}>
          <Grid container spacing={2}>
            <Grid item md={9}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                <Card className={classes.firstCard}>
                  <CardMedia
                    component="img"
                    image="/assets/images/card_illustration.png"
                    alt="green iguana"
                  />
                  <Box className={classes.cardOverlay}>
                    <Typography className={classes.card1text1}>
                      Demo Club
                    </Typography>
                    <Typography className={classes.card1text2}>
                      $Demo
                    </Typography>
                    <Typography className={classes.card1text3}>
                      My Share ($)
                    </Typography>
                    <Typography className={classes.card1text4}>
                      13,700
                    </Typography>
                    <Typography className={classes.card1text5}>
                      10%
                    </Typography>
                  </Box>
                </Card>
                <Card className={classes.secondCard}>
                  <Grid container m={4}>
                    <Grid container>
                      <Stack mt={4}>
                        <Typography className={classes.card2text1}>
                          ICON
                        </Typography>
                        <Typography mt={4} className={classes.card2text1}>
                          Tresury ($)
                        </Typography>
                        <Typography className={classes.card2text2}>
                          1,37,000
                        </Typography>
                        <Typography className={classes.card2text3}>
                          37%
                        </Typography>
                      </Stack>
                      <Divider className={classes.divider} variant="middle" orientation="vertical" />
                      <Stack m={4}>
                        <Typography className={classes.card2text4}>
                          Members
                        </Typography>
                        <Typography className={classes.card2text5}>
                          8
                        </Typography>
                        <Typography mt={3} className={classes.card2text6}>
                          Tresury Wallet
                        </Typography>
                        <Typography className={classes.card2text7}>
                          $97,600
                        </Typography>
                        <Typography mt={3} className={classes.card2text8}>
                          Hot Wallet
                        </Typography>
                        <Typography className={classes.card2text9}>
                          $43,206
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Stack>
              <Stack>
                <Grid item>
                  <Stack direction={{ xs: 'column', sm: 'column' }} spacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Grid container item mt={8}>
                      <Typography className={classes.clubAssets}>Club Assets</Typography>
                    </Grid>
                    <Grid container mt={4}>
                      <Grid items>
                        <ButtonDropDown label="All" />
                      </Grid>
                      <Grid items ml={2}>
                        <TextField
                          className={classes.searchField}
                          placeholder="Search by name or address"
                          InputProps={{
                            endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
                          }}
                        />``
                      </Grid>
                    </Grid>

                    <Typography mt={5} mb={5} className={classes.tokensText}>Tokens</Typography>
                    <BasicTable />

                    <Typography mt={16} mb={5} className={classes.tokensText}>Collectibles</Typography>
                    <Grid container>
                      <Grid items m={1}>
                        <CollectionCard />
                      </Grid>
                      <Grid items m={1}>
                        <CollectionCard />
                      </Grid>
                      <Grid items m={1}>
                        <CollectionCard />
                      </Grid>
                    </Grid>

                    <Typography mt={16} mb={5} className={classes.tokensText}>Off-chain investments</Typography>
                    <BasicTable />
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
            <Grid item md={3}>
              <Stack>
                <Card className={classes.thirdCard}>
                  <Grid container m={2}>
                    <Grid items>
                      <Typography className={classes.card3text1}>
                        Joining link
                      </Typography>
                    </Grid>
                    <Grid items mr={4} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Grid container xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Grid item mt={1} mr={1}>
                          <div className={classes.activeIllustration}></div>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.card3text2}>
                            Active
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items mt={2} ml={1} mr={1} >
                      <TextField
                        className={classes.linkInput}
                        InputProps={{
                          endAdornment: <Button variant="contained" className={classes.copyButton}>Copy</Button>
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items mt={4} ml={1} mr={1} >
                      <Typography className={classes.card3text4}>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Stack>
              <Stack mt={2}>
                <Card className={classes.fourthCard}>
                  <Grid container m={2}>
                    <Grid items>
                      <Typography className={classes.card2text1}>
                        Pending proposals
                      </Typography>
                    </Grid>
                    <Grid items mt={1.2} ml={1}>
                      <div className={classes.pendingIllustration}></div>
                    </Grid>
                  </Grid>
                  <Grid container m={2}>
                    <Stack >
                      <Typography className={classes.card5text1}>
                        Proposed by 0x75ed……34fd
                      </Typography>
                      <Typography className={classes.card5text2}>
                        [#7] Buy 2 ETH worth of Evaders in their private round.
                      </Typography>
                      <Typography className={classes.card5text1}>
                        Expires on 21/05/22
                      </Typography>

                      <Typography mt={3} className={classes.card5text1}>
                        Proposed by 0x75ed……34fd
                      </Typography>
                      <Typography className={classes.card5text2}>
                        [#7] Buy 2 ETH worth of Evaders in their private round.
                      </Typography>
                      <Typography className={classes.card5text1}>
                        Expires on 21/05/22
                      </Typography>
                    </Stack>
                  </Grid>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </div>
      </Layout1>
    </>
  )
}