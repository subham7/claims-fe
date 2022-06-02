import { React } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../src/components/layouts/layout1"
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
    height: "55px",
    color: "#C1D3FF",
    backgroundColor: "#111D38",
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
      <Layout1 page={3}>
        <div style={{ padding: "110px 80px" }}>
          <Grid container spacing={3}>
            <Grid item md={9}>
              <Grid container mb={10}>
                <Grid item>
                  <Typography className={classes.clubAssets}>Members</Typography>
                </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <TextField
                    className={classes.searchField}
                    placeholder="Search members"
                    InputProps={{
                      endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
                    }}
                  />
                </Grid>
              </Grid>
              <BasicTable />

            </Grid>
          </Grid>
        </div>
      </Layout1>
    </>
  )
}