import { React, useEffect, useState, useRef } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, ListItemButton, Avatar, Stack, TextField, Button, IconButton, Table, TableContainer, TableBody, TableCell, TableRow, TableHead } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import BasicTable from "../../../src/components/table"
import {getMembersDetails} from "../../../src/api/index"
import { useSelector } from "react-redux"
import Paper from '@mui/material/Paper';
import { useRouter } from "next/router"
import jazzicon from "@metamask/jazzicon"
import ClubFetch from "../../../src/utils/clubFetch"


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
  },
  tableheading: {
    color: "#C1D3FF",
    fontSize: "18px",
  },
  tablecontent: {
    fontSize: "18px",
    color: "#F5F5F5",
  },
  tablecontent2: {
    fontSize: "18px",
  },
  membersTitleSmall: {
    fontSize: "24px",
    color: "#FFFFFF",
    backgroundColor: "#19274B"
  },
  activityLink: {
    color: "#C1D3FF",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    }
  },
})

const Members = (props) => {
  const router = useRouter()
  const { clubId } = router.query
  const classes = useStyles()
  const clubID = clubId
  const header = ["Name", "Deposit amount", "Club tokens", "Joined on"]
  const [members, setMembers] = useState([])
  const [fetched, setFetched] = useState(false)
  
  const avatarRef = useRef()

  const generateJazzIcon = (account) => {
      if (account) {
        const addr = account.slice(2, 10)
        const seed = parseInt(addr, 16)
        const icon = jazzicon(35, seed)
        return icon
      }
  }

  const fetchMembers = () => {
    const membersData = getMembersDetails(clubID)
    membersData.then((result) => {
      if (result.status != 200) {
        setFetched(false)
      } else {
        setMembers(result.data)
        setFetched(true)
      }
    })
  }

  useEffect(() => {
    fetchMembers()
  }, [clubID, fetched])

  const handleAddressClick = (event, address) => {
    event.preventDefault()
    router.push(`https://rinkeby.etherscan.io/address/${address}`)
  } 

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

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 809 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {header.map((data, key) => {
                        return <TableCell align="left" className={classes.tableheading} key={key}>{data}</TableCell>
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((data, key) => (
                      <TableRow
                        key={key}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        {/* <TableCell align="left" className={classes.tablecontent}>{generateJazzIcon(data.userAddress)</TableCell> */}
                        <TableCell align="left" className={classes.tablecontent}><a className={classes.activityLink} onClick={(e) => {handleAddressClick(e, data.userAddress)}}> {data.userAddress.substring(0, 6) + "......" + data.userAddress.substring(data.userAddress.length - 4)} </a></TableCell>
                        <TableCell align="left" className={classes.tablecontent}>{data.clubs[0].balance}</TableCell>
                        <TableCell align="left" className={classes.tablecontent}>${data.clubs[0].balance}</TableCell>
                        <TableCell align="left"className={classes.tablecontent2}>{new Date(data.clubs[0].joiningDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      </Layout1>
    </>
  )
}

export default ClubFetch(Members)