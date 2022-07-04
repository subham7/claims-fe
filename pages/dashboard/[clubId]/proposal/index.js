import { React, useEffect, useState } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../../src/components/layouts/layout1"
import {
  Box,
  Card,
  Grid,
  Typography,
  ListItemButton,
  ListItemText,
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
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  CardActionArea,
  CircularProgress, Backdrop
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import CancelIcon from '@mui/icons-material/Cancel';
import { fontStyle } from "@mui/system"
import SimpleSelectButton from "../../../../src/components/simpleSelectButton"
import { proposalType, commandTypeList } from "../../../../src/data/dashboard"
import { createProposal, getProposal, getTokens } from "../../../../src/api/index"
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Web3 from "web3";
import { useSelector } from "react-redux"
import { useRouter, withRouter } from "next/router"
import { SmartContract } from "../../../../src/api/index"
import USDCContract from "../../../../src/abis/usdcTokenContract.json"
import GovernorContract from "../../../../src/abis/governorContract.json"
import ClubFetch from "../../../../src/utils/clubFetch"


const useStyles = makeStyles({
  clubAssets: {
    fontFamily: "Whyte",
    fontSize: "48px",
    color: "#FFFFFF",
  },
  addButton: {
    width: "11vw",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
  },
  addButton2: {
    width: "242px",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
    fontSize: "22px",
    fontFamily: "Whyte",
  },
  searchField: {
    width: "28.5vw",
    height: "55px",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  allIllustration: {
    width: "12px",
    height: "12px",
    marginRight: "15px",
    backgroundColor: "#3B7AFD",
    borderRadius: "50%",
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
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardFont1: {
    fontSize: "24px",
    color: "#EFEFEF",
    fontFamily: "Whyte",
  },
  cardFontActive: {
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "5px 5px 5px 5px"
  },
  cardFontPending: {
    fontSize: "16px",
    backgroundColor: "#FFB74D",
    padding: "5px 5px 5px 5px"
  },
  cardFontFailed: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "5px 5px 5px 5px"
  },
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal"
  },
  cardDropDown: {
    width: "340px"
  },
  cardTextBox: {
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: '#19274B',
  },
  proposalCard: {
    backgroundColor: "#142243",
    padding: 0,
    margin: 0
  },
  mainCard: {
    borderRadius: "10px",
    border: "1px solid #C1D3FF40",
    backgroundColor: "#142243",
  },
  daysFont: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#FFFFFF"
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#111D38",
    width: "90%",
  }
})


const Proposal = () => {
  const router = useRouter()
  const { clubId } = router.query
  const classes = useStyles()
  const daoAddress = useSelector(state => { return state.create.daoAddress })
  const clubID = clubId
  const tresuryAddress = useSelector(state => { return state.create.tresuryAddress})
  const [open, setOpen] = useState(false)
  const [name, setName] = useState([])
  const [duration, setDuration] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState(proposalType[0].type)
  const [openCard, setOpenCard] = useState(false)
  const [commandList, setCommandList] = useState([])
  const [optionList, setOptionList] = useState([])
  const [failed, setFailed] = useState(false)
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [proposalData, setProposalData] = useState([])
  const [fetched, setFetched] = useState(false)
  const [customTokenAddresses, setCustomTokenAddresses] = useState([])
  const [customTokenAmounts, setCustomTokenAmounts] = useState([])
  const [customToken, setCustomToken] = useState('')
  const [quorumValue, setQuorumValue] = useState(0)
  const [thresholdValue, setThresholdValue] = useState(0)
  const [searchProposal, setSearchProposal] = useState('')
  const [airDropAmount, setAirDropAmount] = useState(0)
  const [airDropToken, setAirDropToken] = useState('')
  const [executiveRoles, setExecutiveRoles] = useState([])
  const [mintGtAddress, setMintGtAddress] = useState('')
  const [mintGTAmounts, setMintGtAmount] = useState(0)
  const [day, setDay] = useState(null)
  const [minDeposits, setMinDeposits] = useState(0)
  const [maxDeposits, setMaxDeposits] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [sendEthAddresses, setSendEthAddresses] = useState([])
  const [sendEthAmounts, setSendEthAmounts] = useState([])
  const [surveyOption, setSurveyOption] = useState([])
  const [surveyValue, setSurveyValue] = useState('')
  const [tokenData, setTokenData] = useState([])
  const [tokenFetched, setTokenFetched] = useState(false)
  const [loaderOpen, setLoaderOpen] = useState(false)
  const [selectedListItem, setSelectedListItem] = useState('')
  const [enableSubmitButton, setEnableSubmitButton] = useState(false)
  const [count, setCount] = useState(0)


  const fetchData = () => {
    const proposalData = getProposal(clubID)
    proposalData.then((result) => {
      if (result.status != 200) {
        setFetched(false)
      } else {
        setProposalData(result.data)
        setFetched(true)
        setLoaderOpen(false)
      }
    })

    const tokenData = getTokens(tresuryAddress)
    tokenData.then((result) => {
      if (result.status != 200) {
        setTokenFetched(false)
      } else {
        setTokenData(result.data)
        setTokenFetched(true)
      }
    })
  }

  const fetchFilteredData = (type) => {
    setSelectedListItem(type)
    if (type !== "all") {
      const proposalData = getProposal(clubID, type)
      proposalData.then((result) => {
        if (result.status != 200) {
          setFetched(false)
        } else {
          setProposalData(result.data)
          setFetched(true)
        }
      })
    }
    else {
      setLoaderOpen(true)
      fetchData()
    }
  }

  const handleNext = async (event) => {
    setLoaderOpen(true)
    const web3 = new Web3(window.web3)
    const walletAddress = web3.utils.toChecksumAddress(localStorage.getItem("wallet"))
    if (type === proposalType[0].type) {
      // for execution of Survey
      const options = []
      for (let i = 1; i < surveyOption.length + 1; i++) {
        if (i === [...surveyOption, surveyValue].length - 1) {
          options.push({ "text": surveyValue })
        }
        if (typeof (surveyOption[i]) !== 'undefined') {
          options.push({ "text": surveyOption[i] })
        }
      }
      setOpen(false)
      const payload = {
        "name": title,
        "description": description,
        "createdBy": walletAddress,
        "clubId": clubID,
        "votingDuration": new Date(duration).toISOString(),
        "votingOptions": options,
        "type": "survey",
      }
      const createRequest = createProposal(payload)
      createRequest.then((result) => {
        if (result.status !== 201) {
          setLoaderOpen(false)
          setOpenSnackBar(true)
          setFailed(true)
          return false
        } else {
          setLoaderOpen(true)
          fetchData()
          setOpenSnackBar(true)
          setFailed(false)
          setOpen(false)
          return result.data
        }
      })
    }
    else {
      setOpen(false)
      // if (name === commandTypeList[0].commandText) {
      //   // for airdrop execution
      //   const payload = {
      //     "name": title,
      //     "description": description,
      //     "createdBy": walletAddress,
      //     "clubId": clubID,
      //     "votingDuration": new Date(duration).toISOString(),
      //     "commands": [
      //       {
      //         "executionId": 0,
      //         "airDropToken": airDropToken,
      //         "airDropAmount": airDropAmount,
      //       }
      //     ],
      //     "type": "action"
      //   }
      //   const createRequest = createProposal(payload)
      //   createRequest.then((result) => {
      //     if (result.status !== 201) {
      //       setOpenSnackBar(true)
      //       setFailed(true)
      //     } else {
      //       // console.log(result.data)
      //       fetchData()
      //       setOpenSnackBar(true)
      //       setFailed(false)
      //       setOpen(false)
      //     }
      //   })
      // }

      // if (name === commandTypeList[1].commandText) {
      //   // for mintGT execution
      //   const payload = {
      //     "name": title,
      //     "description": description,
      //     "createdBy": walletAddress,
      //     "clubId": clubID,
      //     "votingDuration": new Date(duration).toISOString(),
      //     "commands": [
      //       {
      //         "executionId": 1,
      //         "mintGTAddresses": mintGtAddress,
      //         "mintGTAmounts": mintGTAmounts,
      //       }
      //     ],
      //     "type": "action"
      //   }
      //   const createRequest = createProposal(payload)
      //   createRequest.then((result) => {
      //     if (result.status !== 201) {
      //       setOpenSnackBar(true)
      //       setFailed(true)
      //     } else {
      //       // console.log(result.data)
      //       fetchData()
      //       setOpenSnackBar(true)
      //       setFailed(false)
      //       setOpen(false)
      //     }
      //   })

      // }

      if (name === commandTypeList[0].commandText) {
        // for assigner executor role execution
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 2,
              "executiveRoles": web3.utils.toChecksumAddress(executiveRoles),
            }
          ],
          "type": "action"
        }
        const createRequest = createProposal(payload)
        createRequest.then((result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true)
            setFailed(true)
          } else {
            // console.log(result.data)
            setLoaderOpen(true)
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })

      }

      if (name === commandTypeList[1].commandText) {
        // For execution of Governance settings
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 3,
              "quorum": quorumValue,
              "threshold": thresholdValue,
            }
          ],
          "type": "action"
        }
        const createRequest = createProposal(payload)
        createRequest.then((result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true)
            setFailed(true)
          } else {
            // console.log(result.data)
            setLoaderOpen(true)
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[2].commandText) {
        const today = new Date()
        const calculateDay = new Date(day)
        const difference = calculateDay.getTime() - today.getTime()
        const dayCalculated = Math.ceil(difference / (1000 * 3600 * 24))
        // For execution of start deposit
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 4,
              "day": dayCalculated,
              "minDeposits": minDeposits,
              "maxDeposits": maxDeposits,
              "totalDeposits": totalDeposits,
            }
          ],
          "type": "action"
        }
        const createRequest = createProposal(payload)
        createRequest.then((result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true)
            setFailed(true)
          } else {
            // console.log(result.data)
            setLoaderOpen(true)
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[3].commandText) {
        // For execution of close deposit
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 5,
              "quorum": quorumValue,
              "threshold": thresholdValue,
            }
          ],
          "type": "action"
        }
        const createRequest = createProposal(payload)
        createRequest.then((result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true)
            setFailed(true)
          } else {
            // console.log(result.data)
            setLoaderOpen(true)
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[4].commandText) {
        // For execution of update raise amount
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 6,
              "totalDeposits": totalDeposits,
            }
          ],
          "type": "action"
        }
        const createRequest = createProposal(payload)
        createRequest.then((result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true)
            setFailed(true)
          } else {
            // console.log(result.data)
            setLoaderOpen(true)
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      // if (name === commandTypeList[7].commandText) {
      //   // for execution of sending custom token
      //   const payload = {
      //     "name": title,
      //     "description": description,
      //     "createdBy": walletAddress,
      //     "clubId": clubID,
      //     "votingDuration": new Date(duration).toISOString(),
      //     "commands": [
      //       {
      //         "executionId": 7,
      //         "customToken": customToken,
      //         "customTokenAmounts": [parseFloat(customTokenAmounts)],
      //         "customTokenAddresses": [customTokenAddresses]
      //       }
      //     ],
      //     "type": "action"
      //   }
      //   const createRequest = createProposal(payload)
      //   createRequest.then((result) => {
      //     if (result.status !== 201) {
      //       setOpenSnackBar(true)
      //       setFailed(true)
      //     } else {
      //       // console.log(result.data)
      //       fetchData()
      //       setOpenSnackBar(true)
      //       setFailed(false)
      //       setOpen(false)
      //     }
      //   })
      // }

      // if (name === commandTypeList[8].commandText) {
      //   // For execution send ethereum
      //   const payload = {
      //     "name": title,
      //     "description": description,
      //     "createdBy": walletAddress,
      //     "clubId": clubID,
      //     "votingDuration": new Date(duration).toISOString(),
      //     "commands": [
      //       {
      //         "executionId": 8,
      //         "sendEthAddresses": sendEthAddresses,
      //         "sendEthAmounts": sendEthAmounts,
      //       }
      //     ],
      //     "type": "action"
      //   }
      //   const createRequest = createProposal(payload)
      //   createRequest.then((result) => {
      //     if (result.status !== 201) {
      //       setOpenSnackBar(true)
      //       setFailed(true)
      //     } else {
      //       // console.log(result.data)
      //       fetchData()
      //       setOpenSnackBar(true)
      //       setFailed(false)
      //       setOpen(false)
      //     }
      //   })
      // }

    }
  }


  useEffect(() => {
   fetchFilteredData("all")
  },[clubID])

  const handleTypeChange = (event) => {
    const { target: { value } } = event
    if (value) {
      setType(value)
    }
  }

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/${proposal.proposalId}`, undefined, { shallow: true })
  }

  const handleTokenChange = (event) => {
    const { target: { value }, } = event
    setCustomToken(value)
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setName(value)
    setEnableSubmitButton(true)
  }

  const handleDurationChange = (value) => {
    setDuration(value)
  }

  const handleDayChange = (value) => {
    setDay(value)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddNewCommand = () => {
    setOpenCard(true)
    setCommandList([...commandList, ""])
  }

  const handleAddNewOption = () => {
    setOpenCard(true)
    setOptionList([...optionList, ""])
    setSurveyOption([...surveyOption, surveyValue])
    console.log(optionList)
  }

  const handleRemoveClick = (index) => {
    const list = [...commandList];
    list.splice(index, 1);
    setCommandList(list);
  };

  const handleRemoveSurveyClick = (index) => {
    const list = [...optionList];
    list.splice(index, 1);
    setOptionList(list);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false)
  }

  return (
    <>
      <Layout1 page={2}>
        <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
          <Grid item md={9}>
            <Grid container mb={5} direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}>
              <Grid item>
                <Typography variant="title">Proposals</Typography>
              </Grid>
              <Grid item spacing={2} xs sx={{ display: { lg:"flex" }, justifyContent: { md: "flex-center", lg:"flex-end" } }}>
                <Grid container direction="row" spacing={2} >
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        value={searchProposal}
                        onChange={(e) => setSearchProposal(e.target.value)}
                        className={classes.searchField}
                        placeholder="Search proposals"
                        InputProps={{
                          endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
                        }}
                    />
                  </Grid>
                <Grid item>
                  <Button  variant="primary" startIcon={<AddCircleRoundedIcon />} onClick={handleClickOpen}>
                    Create new
                  </Button>
                </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {proposalData.length > 0 ?
                proposalData.map((proposal, key) => {
                  return (
                    <Grid item key={key} onClick={e => { handleProposalClick(proposalData[key]) }} md={12}>
                      <CardActionArea sx={{ borderRadius: "10px", }}>
                        <Card className={classes.mainCard}>
                          <Grid container>
                            <Grid items ml={2} mr={2}>
                              <Typography className={classes.cardFont}>
                                Proposed by {fetched ? proposal.createdBy.substring(0, 6) + ".........." + proposal.createdBy.substring(proposal.createdBy.length - 4) : null}
                              </Typography>
                            </Grid>
                            <Grid items ml={1} mr={1} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                              {fetched ? <Chip className={proposal.status === "active" ? classes.cardFontActive : proposal.status === "closed" ? classes.cardFontPending : classes.cardFontFailed} label={proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} /> : null}
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid items ml={2} mr={2}>
                              <Typography className={classes.cardFont1}>
                                [#{key + 1}] {proposal.name}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid items ml={2} mr={2}>
                              <Typography className={classes.cardFont}>
                                {proposal.description.substring(0, 200)}...
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid items ml={2} mr={2} mt={2}>
                              <Typography className={classes.daysFont}>
                                {Math.round((new Date(proposal.votingDuration) - new Date()) / (1000 * 60 * 60 * 24))} days left
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </CardActionArea>
                    </Grid>
                  )
                }) :
                <Grid item justifyContent="center" alignItems="center">
                  <Typography className={classes.cardFont1}>
                    No proposals available
                  </Typography>
                </Grid>
              }
            </Grid>
          </Grid>
          <Grid item md={3}>
            <Card>
              <Grid container>
                <Grid items>
                  <Typography className={classes.listFont}>
                    Proposals
                  </Typography>
                </Grid>
              </Grid>
              <ListItemButton selected={selectedListItem === "all"} onClick={() => fetchFilteredData("all")}>
                <div className={classes.allIllustration}></div>
                <ListItemText primary="All" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>

              <ListItemButton selected={selectedListItem === "active"} onClick={() => fetchFilteredData("active")}>
                <div className={classes.activeIllustration}></div>
                <ListItemText primary="Active" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>

              <ListItemButton selected={selectedListItem === "closed"} onClick={() => fetchFilteredData("closed")}>
                <div className={classes.pendingIllustration}></div>
                <ListItemText primary="Closed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>
              <ListItemButton selected={selectedListItem === "executed"} onClick={() => fetchFilteredData("executed")}>
                <div className={classes.closedIllustration}></div>
                <ListItemText primary="Executed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>
            </Card>
          </Grid>
        </Grid>
        <Dialog open={open} onClose={handleClose} scroll="body" PaperProps={{ classes: { root: classes.modalStyle } }} fullWidth maxWidth="lg" >
          <DialogContent sx={{ overflow: "hidden", backgroundColor: '#19274B', }} >
            <Grid container >
              <Grid item m={3}>
                <Typography className={classes.dialogBox}>Create proposal</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} ml={0}>
              <Grid item md={6} >
                <Typography variant="proposalBody">Type of Proposal</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography variant="proposalBody" >Proposal deadline</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} ml={2}>
              <Grid item md={6}>
                <Select
                  displayEmpty
                  value={type}
                  onChange={handleTypeChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return proposalType.name
                    }
                    return selected
                  }}
                  MenuProps={proposalType}
                  style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", width: "90%", }}
                >
                  {proposalType.map((value) => (
                    <MenuItem
                      key={value.type}
                      value={value.type}>
                      {value.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    error={duration === null}
                    // className={classes.datePicker}
                    inputFormat="dd/MM/yyyy"
                    value={duration}
                    onChange={(e) => handleDurationChange(e)}
                    renderInput={(params) => <TextField {...params} className={classes.datePicker} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container item ml={3} mt={2}>
              <Typography variant="proposalBody">Proposal Title*</Typography>
            </Grid>
            <Grid container item ml={3} mt={2}>
              <TextField sx={{ width: "95%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                placeholder="Add your one line description here" onChange={(e) => setTitle(e.target.value)} />
            </Grid>
            <Grid container item ml={3} mt={2}>
              <Typography variant="proposalBody">Proposal description*</Typography>
            </Grid>
            <Grid container item ml={3} mt={3} mb={3}>
              <TextField
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={10}
                // aria-label="minimum height"
                // minRows={10}
                placeholder="Add full description here"
                style={{ width: "95%", height: "auto", backgroundColor: "#19274B", fontSize: "18px", color: "#C1D3FF", fontFamily: "Whyte", }}
              />
            </Grid>
            {type === proposalType[0].type ?
              (
                <>
                  <Grid item ml={3} mr={2}>
                    {openCard ? (
                      <Card className={classes.proposalCard}>
                        {optionList.map((data, key) => {
                          return (
                            <>
                              <Grid container item ml={3} mt={2}>
                                <Typography variant="proposalBody">Option #{key + 1}</Typography>
                              </Grid>
                              <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                <Grid container direction="row" ml={2}>
                                  <Grid item md={10}>
                                    <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                               placeholder="Yes / No / Abstain, etc." onChange={(e) => {setSurveyValue(e.target.value);setEnableSubmitButton(true)}} />
                                  </Grid>
                                  <Grid item md={1} mt={1}>
                                    <IconButton aria-label="add" onClick={(e) => handleRemoveSurveyClick(key)} mt={1}>
                                      <CancelIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )
                        })}
                      </Card>
                    ) : <></>}
                  </Grid>
                  <Grid container item mt={2} ml={3}>
                    <Button variant="primary" startIcon={<AddCircleRoundedIcon />} onClick={handleAddNewOption}>
                      Add Option
                    </Button>
                  </Grid>
                </>
              )
              :
              (
                <>
                  <Grid container item ml={3} mt={3} mb={2}>
                    <Typography variant="proposalBody">Choose a command for this proposal to execute</Typography>
                  </Grid>
                  <Grid item ml={3} mr={2}>
                    {openCard ? (
                      <Card className={classes.proposalCard}>
                        {commandList.map((data, key) => {
                          return (
                            <>
                              <Grid container item ml={3} mt={2}>
                                <Typography variant="proposalBody">Command #{key + 1}</Typography>
                              </Grid>
                              <Grid container item ml={3} mt={1} mb={2}>
                                <Select
                                  displayEmpty
                                  value={name}
                                  onChange={handleChange}
                                  input={<OutlinedInput />}
                                  renderValue={(selected) => {
                                    if (selected.length === 0) {
                                      return "Select a command"
                                    }
                                    return selected
                                  }}
                                  MenuProps={commandTypeList}
                                  style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", width: "90%" }}
                                >
                                  {commandTypeList.map((command) => (
                                    <MenuItem
                                      key={command.commandId}
                                      value={command.commandText}>
                                      {command.commandText}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <IconButton aria-label="add" onClick={(e) => handleRemoveClick(key)}>
                                  <CancelIcon />
                                </IconButton>
                              </Grid>
                              {/* {name === commandTypeList[0].commandText ? (
                                // airdrop execution
                                <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                  <Grid item>
                                    <Typography className={classes.cardFont}>Air drop token</Typography>
                                  </Grid>
                                  <Grid item>
                                    <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                      placeholder="0x..." onChange={(e) => setAirDropToken(e.target.value)} />
                                  </Grid>
                                  <Grid item>
                                    <Typography className={classes.cardFont}>Amount</Typography>
                                  </Grid>
                                  <Grid item>
                                    <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                      placeholder="0" onChange={(e) => setAirDropAmount(parseInt(e.target.value))} />
                                  </Grid>
                                </Grid>
                              ) : */}
                                {/* {name === commandTypeList[1].commandText ? (
                                  // airdrop execution
                                  <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                    <Grid item>
                                      <Typography className={classes.cardFont}>MintGT address</Typography>
                                    </Grid>
                                    <Grid item>
                                      <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                        placeholder="0x..." onChange={(e) => setMintGtAddress(e.target.value)} />
                                    </Grid>
                                    <Grid item>
                                      <Typography className={classes.cardFont}>MintGt Amount</Typography>
                                    </Grid>
                                    <Grid item>
                                      <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                        placeholder="0" onChange={(e) => setMintGtAmount(parseInt(e.target.value))} />
                                    </Grid>
                                  </Grid>
                                )
                                  :  */}
                                  {name === commandTypeList[0].commandText ? (
                                    // assign executor role execution
                                    <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                      <Grid item>
                                        <Typography variant="proposalBody">Executor role address</Typography>
                                      </Grid>
                                      <Grid item>
                                        <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                          placeholder="0x..." onChange={(e) => setExecutiveRoles(e.target.value)} />
                                      </Grid>
                                    </Grid>
                                  ) :
                                   name === commandTypeList[1].commandText ?
                                      // update governance settings execution
                                      (
                                        <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                          <Grid item>
                                            <Typography variant="proposalBody">Quorum</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setQuorumValue(parseInt(e.target.value))} />
                                          </Grid>
                                          <Grid item>
                                            <Typography variant="proposalBody">Threshold</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setThresholdValue(parseInt(e.target.value))} />
                                          </Grid>
                                        </Grid>
                                      ) :
                                      name === commandTypeList[2].commandText ? (
                                        // start deposit execution
                                        <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                          <Grid item>
                                            <Typography variant="proposalBody">Deposit day</Typography>
                                          </Grid>
                                          <Grid item>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                              <DesktopDatePicker
                                                error={day === null}
                                                inputFormat="dd/MM/yyyy"
                                                value={day}
                                                onChange={e => handleDayChange(e)}
                                                renderInput={(params) => <TextField {...params} className={classes.datePicker} />}
                                              />
                                            </LocalizationProvider>
                                          </Grid>
                                          <Grid item>
                                            <Typography variant="proposalBody">Minimum deposit</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setMinDeposits(e.target.value)} />
                                          </Grid>
                                          <Grid item>
                                            <Typography variant="proposalBody">Maximum deposit</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setMaxDeposits(parseInt(e.target.value))} />
                                          </Grid>
                                          <Grid item>
                                            <Typography variant="proposalBody">Total deposit</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setTotalDeposits(parseInt(e.target.value))} />
                                          </Grid>
                                        </Grid>
                                      ) :
                                        name === commandTypeList[3].commandText ? (
                                          // close deposit execution
                                          <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                          </Grid>
                                        ) :
                                          name === commandTypeList[4].commandText ? (
                                            // update raise amount execution
                                            <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                              <Grid item>
                                                <Typography variant="proposalBody">Total deposit</Typography>
                                              </Grid>
                                              <Grid item>
                                                <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                  placeholder="0" onChange={(e) => setTotalDeposits(parseInt(e.target.value))} />
                                              </Grid>
                                            </Grid>
                                          ) :null
                                            // name === commandTypeList[7].commandText ? (
                                            //   // send custom token execution
                                            //   <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                            //     <Grid item>
                                            //       <Typography className={classes.cardFont}>Custom token</Typography>
                                            //     </Grid>
                                            //     <Grid item>
                                            //     <Select
                                            //       displayEmpty
                                            //       value={customToken}
                                            //       onChange={handleTokenChange}
                                            //       input={<OutlinedInput />}
                                            //       renderValue={(selected) => {
                                            //         if (selected.length === 0) {
                                            //           return "Select a Token"
                                            //         }
                                            //         return selected
                                            //       }}
                                            //       MenuProps={tokenData}
                                            //       style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", width: "90%" }}
                                            //     >
                                            //       {tokenData.slice(1).map((token) => (
                                            //         <MenuItem
                                            //           key={token.name}
                                            //           value={token.tokenAddress}>
                                            //           {token.token.name}
                                            //         </MenuItem>
                                            //       ))}
                                            //     </Select>
                                            //     </Grid>
                                            //     <Grid item>
                                            //       <Typography className={classes.cardFont}>Receiver&apos;s wallet address</Typography>
                                            //     </Grid>
                                            //     <Grid item>
                                            //       <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                            //         placeholder="0x..." onChange={(e) => setCustomTokenAddresses(e.target.value)} />
                                            //     </Grid>
                                            //     <Grid item>
                                            //       <Typography className={classes.cardFont}>Amount to be sent</Typography>
                                            //     </Grid>
                                            //     <Grid item>
                                            //       <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                            //         placeholder="0" onChange={(e) => setCustomTokenAmounts(e.target.value)} />
                                            //     </Grid>                                                
                                            //   </Grid>
                                            // ) :
                                            //   name === commandTypeList[8].commandText ? (
                                            //     // send eth execution
                                            //     <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                            //       <Grid item>
                                            //         <Typography className={classes.cardFont}>Ethereum address</Typography>
                                            //       </Grid>
                                            //       <Grid item>
                                            //         <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                            //           placeholder="0" onChange={(e) => setSendEthAddresses(e.target.value)} />
                                            //       </Grid>
                                            //       <Grid item>
                                            //         <Typography className={classes.cardFont}>Ethereum amount</Typography>
                                            //       </Grid>
                                            //       <Grid item>
                                            //         <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                            //           placeholder="0" onChange={(e) => setSendEthAmounts(parseFloat(e.target.value))} />
                                            //       </Grid>
                                            //     </Grid>
                                            //   ) 
                                            // : null
                              }
                            </>
                          )
                        })}
                      </Card>
                    ) : <></>}
                  </Grid>
                  <Grid container item mt={2} ml={3}>
                    <Button variant="primary" startIcon={<AddCircleRoundedIcon />} onClick={handleAddNewCommand}>
                      Add command
                    </Button>
                  </Grid>
                </>
              )
            }
            <Grid container>
              <Grid item mr={2} xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Grid item>
                  <Button variant="cancel" onClick={handleClose}>Cancel</Button>
                </Grid>
                <Grid item ml={2}>
                  {
                    type === proposalType[0].type ?
                      (duration === null || title === null || description === null || surveyOption.length < 2 || !enableSubmitButton) ?
                        <Button variant="primary" onClick={handleNext} disabled >
                          Submit
                        </Button> :
                          <Button variant="primary" onClick={handleNext} >
                            Submit
                          </Button>
                        : (duration === null || title === null || description === null || !enableSubmitButton) ?
                          <Button variant="primary" onClick={handleNext} disabled >
                            Submit
                          </Button> :
                          <Button variant="primary" onClick={handleNext} >
                            Submit
                          </Button>
                  }
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          {!failed ?
            (<Alert onClose={handleSnackBarClose} severity="success" sx={{ width: '100%' }}>
              Proposal Successfully created!
            </Alert>) :
            (<Alert onClose={handleSnackBarClose} severity="error" sx={{ width: '100%' }}>
              Proposal creation failed!
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

export default ClubFetch(Proposal)