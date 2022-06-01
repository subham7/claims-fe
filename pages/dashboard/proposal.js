import { React } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../src/components/layouts/layout3"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Stack, TextField, Button, IconButton } from "@mui/material"
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
    height: "auto",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  allIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#3B7AFD",
    borderRadius: "50%",
    marginRight: "15px"
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
  }
})

export default function Proposal(props) {
  const classes = useStyles()
  return (
    <>
    <Layout1>
      <div style={{ padding: "110px 80px" }}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography className={classes.clubAssets}>Proposals</Typography>
          </Grid>
          <Grid items xs={4} mt={3}>
            <TextField 
              className={classes.searchField}
              placeholder="Search proposals"
              InputProps={{
                endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
              }}
              />
          </Grid>
          <Grid items xs={2} mt={3}>
            <Button className={classes.addButton} variant="outlined" startIcon={<AddCircleRoundedIcon />}>
              Add new
            </Button>
          </Grid>
          <Grid items xs={2} mt={3}>
            <Card>
              <Grid container>
                <Grid items>
                  <Typography className={classes.listFont}>
                    Assets
                  </Typography>
                </Grid>
              </Grid>
              <ListItemButton component="a" href="#simple-list">
                <div className={classes.allIllustration}></div>
                <ListItemText primary="All" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px"/>
              </ListItemButton>

              <ListItemButton component="a" href="#simple-list">
                <div className={classes.activeIllustration}></div>
                <ListItemText primary="Active" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px"/>
              </ListItemButton>

              <ListItemButton component="a" href="#simple-list">
                <div className={classes.pendingIllustration}></div>
                <ListItemText primary="Pending" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px"/>
              </ListItemButton>
              <ListItemButton component="a" href="#simple-list">
                <div className={classes.closedIllustration}></div>
                <ListItemText primary="Closed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px"/>
              </ListItemButton>
            </Card>
          </Grid>
        </Grid>
        <Grid container>
          <Card sx={{ width: "78%" }}>
            <Grid container>
              <Grid items ml={2} mr={2}>
                <Typography className={classes.cardFont}>
                  Proposed by 0x75ed……34fd
                </Typography>
              </Grid>
              <Grid items ml={1} mr={1}  xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                <Typography className={classes.cardFont}>
                  30% No
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid items ml={2} mr={2}>
                <Typography className={classes.cardFont1}>
                [#7] Buy 2 ETH worth of Evaders in their private round.
                </Typography>
              </Grid>
              <Grid items ml={1} mr={1}  xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                <Typography className={classes.cardFont}>
                  70% Yes
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
              <Grid items ml={1} mr={1}  xs sx= {{ display: "flex", justifyContent:"flex-end" }}>
                <Typography className={classes.cardFont}>
                  5 members voted
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </div>           
    </Layout1>
    </>
    )
}