import { React, useEffect, useState } from "react"
import Web3 from "web3"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../../src/components/layouts/layout1"
import {
  Box,
  Card,
  Grid,
  Typography,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  TextField,
  Button,
  IconButton,
  Modal,
  Select,
  OutlinedInput,
  MenuItem,
  TextareaAutosize,
  Chip,
  CardActionArea,
  Snackbar,
  Alert,
  CircularProgress, Backdrop
} from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useRouter } from "next/router"
import Router, { withRouter } from "next/router"
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseIcon from '@mui/icons-material/Close'
import ProgressBar from "../../../../src/components/progressbar"
import { useDispatch, useSelector } from "react-redux"
import { addProposalId } from "../../../../src/redux/reducers/create"
import { SmartContract } from "../../../../src/api/contract"
import {getProposalDetail, castVote, patchProposalExecuted} from "../../../../src/api/proposal"
import {USDC_CONTRACT_ADDRESS } from "../../../../src/api/index"
import {getMembersDetails} from "../../../../src/api/user"

import USDCContract from "../../../../src/abis/usdcTokenContract.json"
import ClubFetch from "../../../../src/utils/clubFetch"
import implementationABI from "../../../../src/abis/implementationABI.json"

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
  passedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
    marginRight: "15px"
  },
  executedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#F75F71",
    borderRadius: "50%",
    marginRight: "15px"
  },
  failedIllustration: {
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
    borderRadius: "38px",
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


const ProposalDetail = () => {
  const router = useRouter()
  const { pid, clubId } = router.query
  const classes = useStyles()
  const [voted, setVoted] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [members, setMembers] = useState([])
  const [membersFetched, setMembersFetched] = useState(false)
  const [proposalData, setProposalData] = useState([])
  const [castVoteOption, setCastVoteOption] = useState('')
  const clubID = clubId
  const [cardSelected, setCardSelected] = useState(null)
  const walletAddress = useSelector(state => { return state.create.value })
  const daoAddress = useSelector(state => { return state.create.daoAddress })
  const [executed, setExecuted] = useState(false)
  const [message, setMessage] = useState("")
  const [failed, setFailed] = useState(false)
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const tresuryAddress = useSelector(state => { return state.create.tresuryAddress})
  const [loaderOpen, setLoaderOpen] = useState(false)

  let voteId = null
  const dispatch = useDispatch()

  const fetchData = () => {
      dispatch(addProposalId(pid))
      const proposalData = getProposalDetail(pid)
      proposalData.then((result) => {
        if (result.status !== 200) {
          setFetched(false)
        } else {
          setProposalData(result.data)
          setFetched(true)
        }
      })
  }

  const fetchMembersData = () => {
      const membersData = getMembersDetails(clubID)
      membersData.then((result) => {
        if (result.status !== 200) {
          setMembersFetched(false)
        } else {
          setMembers(result.data)
          setMembersFetched(true)
        }
      })
  }

  const calculateVotePercentage = (voteReceived) => {
    let totalVote = 0
    proposalData[0].votingOptions.map((vote, key) => {
      totalVote += vote.count
    })
    return (voteReceived / totalVote).toFixed(2) * 100
  }

  const fetchVotingOptionChoice = (votingOptionAddress) => {
    let obj = proposalData[0].votingOptions.find(voteOption => voteOption.votingOptionId === votingOptionAddress)
    voteId = parseInt(proposalData[0].votingOptions.indexOf(obj))
    return proposalData[0].votingOptions.indexOf(obj)
  }

  useEffect(() => {
    setLoaderOpen(true)
    if (pid) {
      fetchData()
    }
  }, [pid])

  useEffect(() => {
    setLoaderOpen(true)
    if (clubId) {
      fetchMembersData()
    }
  }, [clubId])

  useEffect(() => {
    if (fetched && membersFetched) {
      setLoaderOpen(false)
    }
  }, [fetched, membersFetched])

  const returnHome = () => {
    router.back()
  }

  const submitVote = () => {
    setLoaderOpen(true)
    const web3 = new Web3(window.web3)
    const userAddress = web3.utils.toChecksumAddress(walletAddress)
    const payload = {
      "proposalId": pid,
      "votingOptionId": castVoteOption,
      "voterAddress": userAddress,
      "clubId": clubID
    }
    const voteSubmit = castVote(payload)
    voteSubmit.then((result) => {
      if (result.status !== 201) {
        console.log(result.statusText)
        setVoted(false)
        setLoaderOpen(false)
      } else {
        setVoted(true)
        setLoaderOpen(false)
      }
    })
  }

  const isCurrentUserAdmin = () => {
    if (membersFetched && members.length > 0 && walletAddress) {
      let obj = members.find(member => member.userAddress === walletAddress)
      let pos = members.indexOf(obj)
      if (obj.clubs[0].isAdmin) {
        return true
      } else {
        return false
      }
    }
  }

  const executeNonAdminUser = () => {
    setOpenSnackBar(true)
    setFailed(true)
    setMessage("Only admin of the club is able to execute the proposal!")
  }

  const executeFunction = async() => {
    setLoaderOpen(true)
    if (proposalData[0].commands[0].executionId === 0) {
      // for airdrop execution
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        proposalData[0].commands[0].airDropToken,
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        proposalData[0].commands[0].airDropAmount,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Airdrop execution status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Airdrop execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Airdrop execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }

    if (proposalData[0].commands[0].executionId === 1) {
      // for mintGT execution
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 1, 0, 0, 0, 0, 0, 0, 0],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [proposalData[0].commands[0].mintGTAmounts],
        [proposalData[0].commands[0].mintGTAddresses],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("MintGT execution status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("MintGT execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        console.log(error)
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("MintGT execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }

    if (proposalData[0].commands[0].executionId === 2) {
      const web3 = new Web3(window.web3)
      // for assigner executor role execution
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 0, 1, 0, 0, 0, 0, 0, 0],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [web3.utils.toChecksumAddress(proposalData[0].commands[0].executiveRoles)],
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Assigner executor role status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Assigner executor role allocation successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Assigner executor role allocation failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }
    if (proposalData[0].commands[0].executionId === 3) {
      // For execution of Governance settings
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        proposalData[0].commands[0].quorum,
        proposalData[0].commands[0].threshold,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Governance settings status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Governance settings execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Governance settings execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }

    if (proposalData[0].commands[0].executionId === 4) {
      // start deposit execution
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        undefined,
        undefined,
        proposalData[0].commands[0].day,
        proposalData[0].commands[0].minDeposits,
        proposalData[0].commands[0].maxDeposits,
        proposalData[0].commands[0].totalDeposits,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Start deposit execution status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Start deposit execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Start deposit execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }

    if (proposalData[0].commands[0].executionId === 5) {
      // close deposit execution
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        proposalData[0].commands[0].quorum,
        proposalData[0].commands[0].threshold,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Close deposit execution status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Close deposit execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Close deposit execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }
    if (proposalData[0].commands[0].executionId === 6) {
      // update raise amount execution
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        proposalData[0].commands[0].totalDeposits,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Raise amount execution status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Update raise amount execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Update raise amount execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }

    if (proposalData[0].commands[0].executionId === 7) {
      // send custom token execution
      const sendCustomToken = new SmartContract(implementationABI, daoAddress, undefined)
      const transferApprovalResponse = sendCustomToken.approveDepositGnosis(
        proposalData[0].commands[0].customTokenAddresses,
        proposalData[0].commands[0].customTokenAmounts,
        daoAddress,
        tresuryAddress)
      await transferApprovalResponse.then((result) => {
        result.promiEvent.then((receipt) => {
          console.log(receipt)
          const updateStatus = patchProposalExecuted(pid)
          updateStatus.then((response) => {
            if (response.status !== 200) {
              setExecuted(false)
              setOpenSnackBar(true)
              setMessage("Send custom token execution status update failed!")
              setFailed(true)
              setLoaderOpen(false)
            } else {
              setExecuted(true)
              setOpenSnackBar(true)
              setMessage("Send custom token execution successful!")
              setFailed(false)
              setLoaderOpen(false)
            }
          })
        })
        .catch((error) => {
          setExecuted(false)
          setOpenSnackBar(true)
          setMessage("Send custom token execution status update failed!")
          setFailed(true)
          setLoaderOpen(false)
        })
        },
      (error) => {
        console.log(error)
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Send custom token approval failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }

    if (proposalData[0].commands[0].executionId === 8) {
      // send ethereum
      const updateProposal = new SmartContract(implementationABI, daoAddress, undefined)
      const response = updateProposal.updateProposalAndExecution(
        proposalData[0].ipfsHash,
        "Executed",
        123444,
        undefined,
        undefined,
        [0, 0, 0, 0, 0, 0, 0, 0, 1],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [proposalData[0].commands[0].sendEthAmounts],
        [proposalData[0].commands[0].sendEthAddresses],
        undefined
      )
      response.then((result) => {
        const updateStatus = patchProposalExecuted(pid)
        updateStatus.then((result) => {
          if (result.status !== 200) {
            setExecuted(false)
            setOpenSnackBar(true)
            setMessage("Send ETH execution status update failed!")
            setFailed(true)
            setLoaderOpen(false)
          } else {
            setExecuted(true)
            setOpenSnackBar(true)
            setMessage("Send ETH execution successful!")
            setFailed(false)
            setLoaderOpen(false)
          }
        })
      }, (error) => {
        console.log(error)
        setExecuted(false)
        setOpenSnackBar(true)
        setMessage("Send ETH execution failed!")
        setFailed(true)
        setLoaderOpen(false)
      })
    }
  }

  const checkUserVoted = (pid) => {
    if (walletAddress) {
      const web3 = new Web3(window.web3)
      let userAddress = walletAddress
      userAddress = web3.utils.toChecksumAddress(userAddress)
      let obj = proposalData[0].vote.find(voteCasted => voteCasted.voterAddress === userAddress)
      return proposalData[0].vote.indexOf(obj) >= 0
    }
  }

  const fetchUserVoteText = (pid) => {
    if (walletAddress) {
      const web3 = new Web3(window.web3)
      let userAddress = walletAddress
      userAddress = web3.utils.toChecksumAddress(userAddress)
      let obj = proposalData[0].vote.find(voteCasted => voteCasted.voterAddress === userAddress)
      return proposalData[0].vote.indexOf(obj) >= 0
    }
  }

  const handleShowMore = () => {
    router.push("/dashboard", undefined, { shallow: true })
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false)
  }

  return (
    <>
      <Layout1 page={2}>
        <Grid container spacing={6} paddingLeft={10} paddingTop={10}>
          <Grid item md={8.5}>
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
                  <Grid item mt={1.2}>
                    {fetched ? <div className={
                      proposalData[0].status === "active" ? classes.activeIllustration :
                        proposalData[0].status === "passed" ? classes.passedIllustration :
                          proposalData[0].status === "executed" ? classes.executedIllustration :
                            proposalData[0].status === "failed" ? classes.failedIllustration :
                          classes.failedIllustration}></div> : null}
                  </Grid>
                  <Grid item>
                    <Typography className={classes.listFont}>
                      {fetched ? proposalData[0].status.charAt(0).toUpperCase() + proposalData[0].status.slice(1) : null}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item>
                  <Grid container>
                    <Grid item mt={1.2}>
                      <div className={classes.activeIllustration}></div>
                    </Grid>
                    <Grid item>
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
                {
                  fetched ?
                    proposalData[0].type === "action" ?
                      proposalData[0].status === "active" ?
                        checkUserVoted(pid) ?
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
                          </Card> :
                        <Card>
                          <Typography className={classes.cardFont1}>Cast your vote</Typography>
                          <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                          <Stack spacing={2}>
                            {proposalData[0].votingOptions.map((data, key) => {
                              return (
                                <CardActionArea className={classes.mainCard} key={key} disabled={voted}>
                                  <Card className={cardSelected == key ? classes.mainCardSelected : classes.mainCard} onClick={e => { setCastVoteOption(data.votingOptionId); setCardSelected(key) }}>
                                    <Grid container item justifyContent="center" alignItems="center">
                                      <Typography className={classes.cardFont1} >{data.text} </Typography>
                                    </Grid>
                                  </Card>
                                </CardActionArea>
                              )
                            })}
                            <CardActionArea className={classes.mainCard} disabled={voted}>
                              <Card className={voted ? classes.mainCardButtonSuccess : classes.mainCardButton} onClick={!voted ? submitVote : null}>
                                <Grid container justifyContent="center" alignItems="center">
                                  {voted ? (<Grid item><CheckCircleRoundedIcon /></Grid>) : <Grid item></Grid>}
                                  <Grid item>
                                    {voted ? (<Typography className={classes.cardFont1} mt={0.5} >Successfully voted</Typography>) : (<Typography className={classes.cardFont1}>Vote now</Typography>)}
                                  </Grid>
                                </Grid>
                              </Card>
                            </CardActionArea>
                          </Stack>
                        </Card>
                        :
                        proposalData[0].status === "passed" ?
                          isCurrentUserAdmin() ? (
                            <Card>
                              <Card className={executed ? classes.mainCardButtonSuccess : classes.mainCardButton} onClick={executeFunction}>
                                <Grid container justifyContent="center" alignItems="center">
                                  {executed ? (<Grid item mt={0.5}><CheckCircleRoundedIcon /></Grid>) : <Grid item></Grid>}
                                  <Grid item>
                                    {executed ? (<Typography className={classes.cardFont1} >Executed Successfully</Typography>) : (<Typography className={classes.cardFont1}>Execute Now</Typography>)}
                                  </Grid>
                                </Grid>
                              </Card>
                            </Card>
                          ) : (
                            <Card sx={{ width: "100%" }}>
                              <Grid container direction="column" justifyContent="center" alignItems="center" mt={10} mb={10}>
                                <Grid item mt={0.5}><CheckCircleRoundedIcon className={classes.mainCardButtonSuccess} /></Grid>
                                <Grid item mt={0.5}>
                                  <Typography className={classes.successfulMessageText}>Proposal needs to be executed by Admin</Typography>
                                </Grid>
                                <Grid item mt={0.5}>
                                  <Typography className={classes.listFont2}>
                                    {/* Voted for */}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Card>
                          )
                          :
                          proposalData[0].status === "failed" ?
                            <Card sx={{ width: "100%" }}>
                              <Grid container direction="column" justifyContent="center" alignItems="center" mt={10} mb={10}>
                                <Grid item mt={0.5}><CloseIcon className={classes.mainCardButtonError} /></Grid>
                                <Grid item mt={0.5}>
                                  <Typography className={classes.successfulMessageText}>Execution Failed</Typography>
                                </Grid>
                                <Grid item mt={0.5}>
                                  <Typography className={classes.listFont2}>
                                    {/* Voted for */}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Card>
                            :
                            proposalData[0].status === "executed" ?
                              <Card sx={{ width: "100%" }}>
                                <Grid container direction="column" justifyContent="center" alignItems="center" mt={10} mb={10}>
                                  <Grid item mt={0.5}><CheckCircleRoundedIcon className={classes.mainCardButtonSuccess} /></Grid>
                                  <Grid item mt={0.5}>
                                    <Typography className={classes.successfulMessageText}>Successfully Executed</Typography>
                                  </Grid>
                                  <Grid item mt={0.5}>
                                    <Typography className={classes.listFont2}>
                                      {/* Voted for */}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Card>
                              :
                              null
                      :
                      proposalData[0].type === "survey" ?
                        proposalData[0].status === "active" ?
                          checkUserVoted(pid) ? (
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
                            ) :
                            <Card>
                              <Typography className={classes.cardFont1}>Cast your vote</Typography>
                              <Divider sx={{ marginTop: 2, marginBottom: 3 }} />
                              <Stack spacing={2}>
                                {fetched ? proposalData[0].votingOptions.map((data, key) => {
                                  return (
                                    <CardActionArea className={classes.mainCard} key={key} disabled={voted}>
                                      <Card className={cardSelected == key ? classes.mainCardSelected : classes.mainCard} onClick={e => { setCastVoteOption(data.votingOptionId); setCardSelected(key) }}>
                                        <Grid container item justifyContent="center" alignItems="center">
                                          <Typography className={classes.cardFont1} >{data.text} </Typography>
                                        </Grid>
                                      </Card>
                                    </CardActionArea>
                                  )
                                }) : null}
                                <CardActionArea className={classes.mainCard} disabled={voted}>
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
                          :
                          proposalData[0].status === "failed" ?
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
                            :
                            proposalData[0].status === "closed" ?
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
                              :
                              null
                        : null
                    : null
                }
              </Grid>

            </Grid>
          </Grid>
          <Grid item md={3.5}>
            <Stack spacing={3}>
              <Card>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.listFont2}>
                      Proposed by
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography className={classes.listFont2Colourless}>
                      {fetched ? proposalData[0].createdBy.substring(0, 6) + ".........." + proposalData[0].createdBy.substring(proposalData[0].createdBy.length - 4) : null}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.listFont2}>
                      Voting system
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography className={classes.listFont2Colourless}>
                      Single choice
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.listFont2}>
                      Start date
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography className={classes.listFont2Colourless}>
                      {fetched ? new Date(String(proposalData[0].updateDate)).toLocaleDateString() : null}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.listFont2}>
                      End date
                    </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
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
                  proposalData[0].votingOptions.length > 0 ?
                  proposalData[0].votingOptions.map((vote, key) => {
                    return (
                      <div key={key}>
                        <Grid container>
                          <Grid item>
                            <Typography className={classes.listFont2}>
                              {vote.text}
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
                  : (<Typography className={classes.listFont2Colourless}>No previous results available</Typography>) :
                  null
                }
              </Card>
              <Card>
                <Grid container item mb={2}>
                  <Typography className={classes.listFont}>
                    Votes
                  </Typography>
                </Grid>
                {fetched ?
                  proposalData[0].vote.length > 0 ?
                    proposalData[0].vote.map((voter, key) => {
                      if (key < 3) {
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
                                  {fetched ? proposalData[0].votingOptions[parseInt(fetchVotingOptionChoice(voter.votingOptionId))].text : null}
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
                                <Typography variant="proposalSubHeading">
                                  Signed on {new Date(voter.createdAt).toLocaleDateString()}
                                </Typography>
                              </Grid>
                            </Grid>
                            <br />
                          </div>
                        )
                      }
                    })
                  : (<Typography className={classes.listFont2Colourless}>No previous votes available</Typography>)
                  : null}
                {fetched && proposalData[0].length >= 0 ? (
                  <Grid container>
                    <Grid item md={12}>
                      <Button sx={{ width: "100%"}} variant="transparentWhite"  onClick={() => handleShowMore()}>More</Button>
                    </Grid>
                  </Grid>
                ) : null}
              </Card>
            </Stack>
          </Grid>
        </Grid>
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {!failed ?
            (<Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
              {message}
            </Alert>) :
            (<Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
              {message}
            </Alert>)
          }
        </Snackbar>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loaderOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout1>
    </>
  )
}

export default ClubFetch(ProposalDetail)