import { React } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Stack, TextField, Button, IconButton, Image } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'

const useStyles = makeStyles({
  clubAssets: {
    fontSize: "48px",
    color: "#FFFFFF",
  },
  addButton: {
    width: "208px",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
  },
  searchField: {
    width: "548px",
    height: "55px",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  allIllustration: {
    width: "21px",
    height: "21px",
    marginRight: "15px",
    // background: `transparent url('${coin_icon.src}') 0% 0% no-repeat padding-box`,
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: "15px"
  },
  pendingIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
    marginRight: "15px"
  },
  closedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#D55438",
    borderRadius: "50%",
    marginRight: "15px"
  },
  listFont: {
    fontSize: "22px",
    color: "#C1D3FF"
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
  },
  cardFont1: {
    fontSize: "24px",
    color: "#EFEFEF",
  },
  cardFontYes: {
    fontSize: "18px",
    color: "#0ABB92",
  },
  cardFontNo: {
    fontSize: "18px",
    color: "#D55438",
  }
})

export default function Proposal(props) {
  const classes = useStyles()
  return (
    <>
      <Layout1 page={3}>
        <div style={{ padding: "110px 80px" }}>
          <Grid container spacing={3}>
            <Grid item md={9}>
              <Grid container mb={5}>
                <Grid item>
                  <Typography className={classes.clubAssets}>Proposals</Typography>
                </Grid>
                <Grid item spacing={2} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Stack direction="row" spacing={4}>
                    <TextField
                      className={classes.searchField}
                      placeholder="Search proposals"
                      InputProps={{
                        endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
                      }}
                    />
                    <Button className={classes.addButton} variant="outlined" startIcon={<AddCircleRoundedIcon />}>
                      Add new
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Card>
                <Grid container>
                  <Grid items ml={2} mr={2}>
                    <Typography className={classes.cardFont}>
                      Proposed by 0x75ed……34fd
                    </Typography>
                  </Grid>
                  <Grid items ml={1} mr={1} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography className={classes.cardFontYes}>
                      70% Yes
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid items ml={2} mr={2}>
                    <Typography className={classes.cardFont1}>
                      [#7] Buy 2 ETH worth of Evaders in their private round.
                    </Typography>
                  </Grid>
                  <Grid items ml={1} mr={1} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography className={classes.cardFontNo}>
                      30% No
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid items ml={2} mr={2}>
                    <Grid container>
                      <Grid items mt={1.2}>
                        <div className={classes.activeIllustration}></div>
                      </Grid>
                      <Grid items>
                        <Typography className={classes.listFont}>
                          Active
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid items ml={1} mr={1} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography className={classes.cardFont}>
                      5 members voted
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card>
                <Grid container>
                  <Grid items>
                    <Typography className={classes.listFont}>
                      Assets
                    </Typography>
                  </Grid>
                </Grid>
                <ListItemButton component="a" href="#simple-list">
                  <img src="/assets/icons/coins.png" alt="coins" className={classes.allIllustration} />
                  <ListItemText primary="All" className={classes.listFont} />
                  <ArrowForwardIosIcon fontSize="5px" />
                </ListItemButton>

                <ListItemButton component="a" href="#simple-list">
                  <div className={classes.activeIllustration}></div>
                  <ListItemText primary="Active" className={classes.listFont} />
                  <ArrowForwardIosIcon fontSize="5px" />
                </ListItemButton>

                <ListItemButton component="a" href="#simple-list">
                  <div className={classes.pendingIllustration}></div>
                  <ListItemText primary="Pending" className={classes.listFont} />
                  <ArrowForwardIosIcon fontSize="5px" />
                </ListItemButton>
                <ListItemButton component="a" href="#simple-list">
                  <div className={classes.closedIllustration}></div>
                  <ListItemText primary="Closed" className={classes.listFont} />
                  <ArrowForwardIosIcon fontSize="5px" />
                </ListItemButton>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Layout1>
    </>
  )
}