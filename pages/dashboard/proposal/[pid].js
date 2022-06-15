import { React, useEffect, useState } from "react"
import Web3 from "web3"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Divider, Stack, TextField, Button, IconButton, Modal, Select, OutlinedInput, MenuItem, TextareaAutosize, Chip, CardActionArea } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useRouter } from "next/router"
import Router from "next/router"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ProgressBar from "../../../src/components/progressbar"
import { useDispatch, useSelector } from "react-redux"
import {addProposalId} from "../../../src/redux/reducers/create"
import { getProposalDetail, castVote } from "../../../src/api/index"

const useStyles = makeStyles({
  clubAssets: {
    fontSize: "48px",
    color: "#FFFFFF",
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
  listFont2: {
    fontSize: "19px",
    color: "#C1D3FF"
  },
  listFont2Colourless: {
    fontSize: "19px",
    color: "#FFFFFF"
  },
  listFont2small: {
    fontSize: "12px",
    color: "#C1D3FF"
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
  },
  cardFont1: {
    fontSize: "26px",
    color: "#EFEFEF",
  },
  cardFontYes: {
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "0 5px 0 5px"
  },
  cardFontNo: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "0 5px 0 5px"
  },
  mainCard: {
    borderRadius: "38px",
    border: "1px solid #C1D3FF40;",
    backgroundColor: "#19274B",
  },
  mainCardButton: {
    borderRadius: "38px",
    border: "1px solid #C1D3FF40;",
    backgroundColor: "#3B7AFD",
    "&:hover": {
      cursor: "pointer"
    }
  },
  mainCardButtonSuccess: {
    borderRadius: "38px",
    border: "1px solid #C1D3FF40;",
    backgroundColor: "#0ABB92",
    "&:hover": {
      cursor: "pointer"
    }
  },
  seeMoreButton: {
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    backgroundColor: "#19274B",
    display: "flex",

  }
})


export default function ProposalDetail(props) {
  const router = useRouter()
  const { pid } = router.query
  const classes = useStyles()
  const [voted, setVoted] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [proposalData, setProposalData] = useState([])
  const [castVoteOption, setCastVoteOption] = useState(null)
  const clubID = useSelector(state => {return state.create.clubID})
  let walletAddress = localStorage.getItem("wallet")
  const dispatch = useDispatch()

  const fetchData = () => {
    dispatch(addProposalId(pid))
    const proposalData = getProposalDetail(pid)
    proposalData.then((result) => {
      if (result.status != 200) {
        console.log(result.statusText)
        setFetched(false)
      } else {
        console.log(result.data)
        setProposalData(result.data)
        setFetched(true)
      }
    })
  }

  useEffect(() => {
    if (!fetched) {
      fetchData()
    }
  }, [fetched])

  const returnHome = () => {
    const { pathname } = Router
    router.push("/dashboard/proposal", undefined, { shallow: true })
  }

  const submitVote = () => {
    const web3 = new Web3(window.web3)
    walletAddress = web3.utils.toChecksumAddress(walletAddress)
    const payload = {
      "proposalId": pid,
      "votingOptionId": castVoteOption,
      "voterAddress": walletAddress,
      "clubId": clubID
    }
    const voteSubmit = castVote(payload)
    voteSubmit.then((result) => {
      if (result.status !== 201) {
        console.log(result.statusText)
        setVoted(false)
      } else {
        setVoted(true)
      }
    })
    
  }

  const handleShowMore = () => {
    router.push("/dashboard",undefined, { shallow: true })
  }

  return (
    <>
      <Layout1 page={2}>
        <div style={{ padding: "110px 80px" }}>
          <Grid container spacing={6}>
            <Grid item md={9}>
              <Grid container spacing={1} onClick={returnHome} >
                <Grid item mt={0.5} sx={{ "&:hover": { cursor: "pointer", } }}>
                  <KeyboardBackspaceIcon className={classes.listFont} />
                </Grid>
                <Grid item sx={{ "&:hover": { cursor: "pointer", } }}>
                  <Typography className={classes.listFont}>Back to proposals</Typography>
                </Grid>
              </Grid>
              <Grid container mb={5}>
                <Grid item>
                  <Typography className={classes.clubAssets}>{fetched? proposalData[0].name : null}</Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" spacing={4}>
                <Grid item>
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
                <Grid item>
                  <Grid container>
                    <Grid items mt={1.2}>
                      <div className={classes.activeIllustration}></div>
                    </Grid>
                    <Grid items>
                      <Typography className={classes.listFont}>
                        Share
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item className={classes.listFont}>
              {fetched? proposalData[0].description : null}
              </Grid>
              <Grid container mt={6}>
                <Grid item md={12}>
                  <Card>
                    <Typography className={classes.cardFont1}>Cast your vote</Typography>
                    <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                    <Stack spacing={2}>
                      {fetched ? proposalData[0].votingOptions.map((data, key) => {
                        return (
                        <CardActionArea className={classes.mainCard} key={key}>
                          <Card className={classes.mainCard} onClick={e => {setCastVoteOption(data.votingOptionId)}}>
                            <Grid container item justifyContent="center" alignItems="center">
                              <Typography className={classes.cardFont1} >Vote {data.text} </Typography>
                            </Grid>
                          </Card>
                        </CardActionArea>
                        )
                      }) : null}

                      <CardActionArea className={classes.mainCard}>
                      <Card className={voted ? classes.mainCardButtonSuccess : classes.mainCardButton} onClick={submitVote}>
                        <Grid container justifyContent="center" alignItems="center">
                          {voted ? (<Grid item mt={0.5}><CheckCircleRoundedIcon /></Grid>) : <Grid item></Grid>}
                          <Grid item>
                            {voted ? (<Typography className={classes.cardFont1} >Successfully voted</Typography>) : (<Typography className={classes.cardFont1}>Vote now</Typography>)}
                          </Grid>
                        </Grid>
                      </Card>
                      </CardActionArea>
                      
                      
                    </Stack>
                  </Card>
                </Grid>

              </Grid>
            </Grid>
            <Grid item md={3}>
              <Stack spacing={3}>
                <Card>
                  <Grid container>
                    <Grid items>
                      <Typography className={classes.listFont2}>
                        Proposed by
                      </Typography>
                    </Grid>
                    <Grid items xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        0x75ed……34fd
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items>
                      <Typography className={classes.listFont2}>
                        Voting system
                      </Typography>
                    </Grid>
                    <Grid items xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        Single choice
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items>
                      <Typography className={classes.listFont2}>
                        Start date
                      </Typography>
                    </Grid>
                    <Grid items xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        04 Jun’22, 2:54 PM
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid items>
                      <Typography className={classes.listFont2}>
                        End date
                      </Typography>
                    </Grid>
                    <Grid items xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        07 Jun’22, 2:54 PM
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
                <Card>
                  <Grid container item mb={2}>
                    <Typography className={classes.listFont}>
                      Current results
                    </Typography>
                  </Grid>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2}>
                        Vote for choice 1
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        74.5%
                      </Typography>
                    </Grid>
                  </Grid>
                  <ProgressBar value={74.5} />
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2}>
                        Vote for choice 2
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        13.5%
                      </Typography>
                    </Grid>
                  </Grid>
                  <ProgressBar value={13.5} />

                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2}>
                        Vote for choice 3
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        12%
                      </Typography>
                    </Grid>
                  </Grid>
                  <ProgressBar value={12} />

                </Card>
                <Card>
                  <Grid container item mb={2}>
                    <Typography className={classes.listFont}>
                      Votes
                    </Typography>
                  </Grid>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2Colourless}>
                        trueblocks.eth
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        Vote for choice 1
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2small}>
                        10,000 $DEMO
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2small}>
                        Signed 7 mins ago
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2Colourless}>
                        0xc41d……4tg9
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        Vote for choice 1
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2small}>
                        10,000 $DEMO
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2small}>
                        Signed 27 mins ago
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2Colourless}>
                        0xr46h……cd5q
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2Colourless}>
                        Vote for choice 3
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2small}>
                        5,000 $DEMO
                      </Typography>
                    </Grid>
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Typography className={classes.listFont2small}>
                        Signed 46 mins ago
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container item>
                    <Button className={classes.seeMoreButton} fullWidth onClick={handleShowMore}>
                      See more
                    </Button>
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