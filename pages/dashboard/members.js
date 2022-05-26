import { React } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../src/components/layouts/layout3"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Stack, TextField, Button, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import BasicTable from "../../src/components/table"

const useStyles = makeStyles({
  clubAssets: {
    fontSize: "48px",
    color: "#FFFFFF",
  },
  membersTitleSmall: {
    fontSize: "24px",
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
  }
})

export default function Members(props) {
  const classes = useStyles()
  return (
    <>
    <Layout1>
      <div style={{ padding: "110px 80px" }}>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Typography className={classes.clubAssets}>Members</Typography>
          </Grid>
          <Grid items xs="auto" mt={3}>
            <TextField 
              className={classes.searchField}
              placeholder="Search proposals"
              InputProps={{
                endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
              }}
              />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={8.5}>
              <BasicTable title={"Members"}/>
          </Grid>
        </Grid>
      </div>           
    </Layout1>
    </>
    )
}