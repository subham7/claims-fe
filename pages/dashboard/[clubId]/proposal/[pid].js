import { React, useEffect, useState } from "react"
import Web3 from "web3"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Divider, Stack, TextField, Button, IconButton, Modal, Select, OutlinedInput, MenuItem, TextareaAutosize, Chip, CardActionArea } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useRouter } from "next/router"
import Router, { withRouter } from "next/router"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseIcon from '@mui/icons-material/Close'
import ProgressBar from "../../../../src/components/progressbar"
import { useDispatch, useSelector } from "react-redux"
import { addProposalId } from "../../../../src/redux/reducers/create"
import { getProposalDetail, castVote } from "../../../../src/api/index"

const useStyles = makeStyles({
  clubAssets: {
    fontSize: "42px",
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
    fontSize: "20px",
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
    fontSize: "19px",
    color: "#EFEFEF",
  },
  successfulMessageText: {
    fontSize: "28px",
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
  mainCardSelected: {
    borderRadius: "38px",
    border: "1px solid #FFFFFF;",
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
    fontSize: "50px",
    color: "#0ABB92",
  },
  mainCardButtonError: {
    fontSize: "50px",
    color: "#D55438",
  },
  seeMoreButton: {
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    backgroundColor: "#19274B",
    display: "flex",

  }
})


const ProposalDetail = ({ router }) => {
  // const router = useRouter()
  const { pid } = router.query
  const classes = useStyles()
  const [voted, setVoted] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [proposalData, setProposalData] = useState([])
  const [castVoteOption, setCastVoteOption] = useState(null)
  const clubID = useSelector(state => { return state.create.clubID })
  const [cardSelected, setCardSelected] = useState(null)
  const walletAddress = useSelector(state => { return state.create.value })
  let voteId = null
  const dispatch = useDispatch()

  const fetchData = () => {
    dispatch(addProposalId(pid))
    const proposalData = getProposalDetail(pid)
    proposalData.then((result) => {
      if (result.status != 200) {
        console.log(result.statusText)
        setFetched(false)
      } else {
        setProposalData(result.data)
        setFetched(true)
      }
    })
  }

  const calculateVotePercentage = (voteReceived) => {
    let totalVote = 0
    proposalData[0].votingOptions.map((vote, key) => {
      totalVote += vote.count
    })
    return (voteReceived / totalVote) * 100
  }

  const fetchVotingOptionChoice = (votingOptionAddress) => {
    let obj = proposalData[0].votingOptions.find(voteOption => voteOption.votingOptionId === votingOptionAddress)
    voteId = parseInt(proposalData[0].votingOptions.indexOf(obj))
    return proposalData[0].votingOptions.indexOf(obj)
  }

  useEffect(() => {
    if (!fetched) {
      fetchData()
    }
  }, [fetched])

  const returnHome = () => {
    router.back()
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

  const checkUserVoted = (pid) => {
    const web3 = new Web3(window.web3)
    walletAddress = web3.utils.toChecksumAddress(walletAddress)
    let obj = proposalData[0].vote.find(voteCasted => voteCasted.voterAddress === walletAddress)
    return proposalData[0].vote.indexOf(obj) >= 0 ? true : false
  }

  const fetchUserVoteText = (pid) => {
    const web3 = new Web3(window.web3)
    walletAddress = web3.utils.toChecksumAddress(walletAddress)
    let obj = proposalData[0].vote.find(voteCasted => voteCasted.voterAddress === walletAddress)
    return proposalData[0].vote.indexOf(obj) >= 0 ? true : false
  }

  const handleShowMore = () => {
    router.push("/dashboard", undefined, { shallow: true })
  }

  return (
    <>
      <Layout1 page={2}>
        <Grid container spacing={6} paddingLeft={10} paddingTop={10}>
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
                <Typography className={classes.clubAssets}>{fetched ? proposalData[0].name : null}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={4}>
              <Grid item>
                <Grid container>
                  <Grid items mt={1.2}>
                    {fetched ? <div className={proposalData[0].status === "active" ? classes.activeIllustration : proposalData[0].status === "closed" ? classes.pendingIllustration : classes.closedIllustration}></div> : null}
                  </Grid>
                  <Grid items>
                    <Typography className={classes.listFont}>
                      {fetched ? proposalData[0].status.charAt(0).toUpperCase() + proposalData[0].status.slice(1) : null}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item>
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
                </Grid> */}
            </Grid>
            <Grid container item className={classes.listFont}>
              {fetched ? proposalData[0].description : null}
            </Grid>
            <Grid container mt={6}>
              <Grid item md={12}>
                {voted || fetched && checkUserVoted(pid) ? (
                  <Card sx={{ width: "100%" }}>
                    <Grid container direction="column" justifyContent="center" alignItems="center" mt={10} mb={10}>
                      <Grid item mt={0.5}><CheckCircleRoundedIcon className={classes.mainCardButtonSuccess} /></Grid>
                      <Grid item mt={0.5}>
                        <Typography className={classes.successfulMessageText}>Successfully voted</Typography>
                      </Grid>
                      <Grid item mt={0.5}>
                        <Typography className={classes.listFont2}>
                          {/* Voted for */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ) : fetched ? proposalData[0].status === "closed" ? (
                  <Card sx={{ width: "100%" }}>
                    <Grid container direction="column" justifyContent="center" alignItems="center" mt={10} mb={10}>
                      <Grid item mt={0.5}><CloseIcon className={classes.mainCardButtonError} /></Grid>
                      <Grid item mt={0.5}>
                        <Typography className={classes.successfulMessageText}>Voting Closed</Typography>
                      </Grid>
                      <Grid item mt={0.5}>
                        <Typography className={classes.listFont2}>
                          {/* Voted for */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ) : (<Card>
                  <Typography className={classes.cardFont1}>Cast your vote</Typography>
                  <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                  <Stack spacing={2}>
                    {fetched ? proposalData[0].votingOptions.map((data, key) => {
                      return (
                        <CardActionArea className={classes.mainCard} key={key}>
                          <Card className={cardSelected == key ? classes.mainCardSelected : classes.mainCard} onClick={e => { setCastVoteOption(data.votingOptionId); setCardSelected(key) }}>
                            <Grid container item justifyContent="center" alignItems="center">
                              <Typography className={classes.cardFont1} >{data.text} </Typography>
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
                </Card>) : null}
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
                      {fetched ? proposalData[0].createdBy.substring(0, 6) + ".........." + proposalData[0].createdBy.substring(proposalData[0].createdBy.length - 4) : null}
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
                      {fetched ? new Date(String(proposalData[0].updateDate)).toLocaleDateString() : null}
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
                      {fetched ? new Date(String(proposalData[0].votingDuration)).toLocaleDateString() : null}
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
                {fetched ?
                  proposalData[0].votingOptions.map((vote, key) => {
                    return (
                      <div key={key}>
                        <Grid container>
                          <Grid item>
                            <Typography className={classes.listFont2}>
                              Vote for {vote.text}
                            </Typography>
                          </Grid>
                          <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Typography className={classes.listFont2Colourless}>
                              {vote.count > 0 ? calculateVotePercentage(vote.count) : 0}%
                            </Typography>
                          </Grid>
                        </Grid>
                        <ProgressBar value={vote.count > 0 ? calculateVotePercentage(vote.count) : 0} />
                      </div>
                    )
                  })
                  :
                  null
                }
              </Card>
              <Card>
                <Grid container item mb={2}>
                  <Typography className={classes.listFont}>
                    Votes
                  </Typography>
                </Grid>
                {console.log(proposalData)}
                {fetched ?
                  proposalData[0].vote.length > 0 ?
                    proposalData[0].vote.map((voter, key) => {
                      return (
                        <div key={key}>
                          <Grid container>
                            <Grid item>
                              <Typography className={classes.listFont2Colourless}>
                                {voter.voterAddress.substring(0, 6) + "......" + voter.voterAddress.substring(voter.voterAddress.length - 4)}
                              </Typography>
                            </Grid>
                            <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <Typography className={classes.listFont2Colourless}>
                                Vote for {fetched ? proposalData[0].votingOptions[parseInt(fetchVotingOptionChoice(voter.votingOptionId))].text : null}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container>
                            {/* <Grid item>
                                <Typography className={classes.listFont2small}>
                                  10,000 $DEMO
                                </Typography>
                              </Grid> */}
                            <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                              <Typography className={classes.listFont2small}>
                                Signed on {new Date(voter.createdAt).toLocaleDateString()}
                              </Typography>
                            </Grid>
                          </Grid>
                          <br />
                        </div>
                      )
                    }) : (<Typography className={classes.listFont2Colourless}>No previous votes available</Typography>)
                  : null}
                {fetched && proposalData[0].length > 3 ? (
                  <Grid container item>
                    <Button className={classes.seeMoreButton} fullWidth onClick={handleShowMore}>
                      See more
                    </Button>
                  </Grid>
                ) : null}
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Layout1>
    </>
  )
}

export default withRouter(ProposalDetail)