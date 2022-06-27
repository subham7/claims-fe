import { React, useEffect, useState } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Stack, TextField, Button, IconButton, Modal, Select, OutlinedInput, MenuItem, TextareaAutosize, Chip, Dialog, DialogContent, Snackbar, Alert, CardActionArea } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import { fontStyle } from "@mui/system"
import SimpleSelectButton from "../../../../src/components/simpleSelectButton"
import { proposalType, commandTypeList } from "../../../../src/data/dashboard"
import { createProposal, getProposal } from "../../../../src/api/index"
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Web3 from "web3";
import { useSelector } from "react-redux"
import { useRouter, withRouter } from "next/router"
import { SmartContract } from "../../../../src/api/index"
import USDCContract from "../../../../src/abis/usdcTokenContract.json"
import GovernorContract from "../../../../src/abis/governorContract.json"


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
    fontFamily: "Whyte",
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "0 5px 0 5px"
  },
  cardFontPending: {
    fontFamily: "Whyte",
    fontSize: "16px",
    backgroundColor: "#FFB74D",
    padding: "0 5px 0 5px"
  },
  cardFontFailed: {
    fontFamily: "Whyte",
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "0 5px 0 5px"
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


const Proposal = ({ router }) => {
  const classes = useStyles()
  const daoAddress = useSelector(state => { return state.create.daoAddress })
  const clubID = useSelector(state => { return state.create.clubID })
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
  const routers = useRouter()
  const [senderAddress, setSenderAddress] = useState('')
  const [transerAmount, setTransferAmount] = useState(0)
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


  const fetchData = () => {
    const proposalData = getProposal(clubID)
    proposalData.then((result) => {
      if (result.status != 200) {
        console.log(result.error)
        setFetched(false)
      } else {
        setProposalData(result.data)
        setFetched(true)
      }
    })
  }

  const fetchFilteredData = (type) => {
    if (type !== "all") {
      const proposalData = getProposal(clubID, type)
      proposalData.then((result) => {
        if (result.status != 200) {
          console.log(result.error)
          setFetched(false)
        } else {
          setProposalData(result.data)
          setFetched(true)
        }
      })
    }
    fetchData()
  }

  const handleNext = async (event) => {
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
          setOpenSnackBar(true)
          setFailed(true)
          return false
        } else {
          fetchData()
          setOpenSnackBar(true)
          setFailed(false)
          setOpen(false)
          return result.data
        }
      })
    }
    else {
      if (name === commandTypeList[0].commandText) {
        // for airdrop execution
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 0,
              "airDropToken": airDropToken,
              "airDropAmount": airDropAmount,
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[1].commandText) {
        // for mintGT execution
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "command": [
            {
              "executionId": 1,
              "mintGTAddresses": mintGtAddress,
              "mintGTAmounts": mintGTAmounts,
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })

      }

      if (name === commandTypeList[2].commandText) {
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
              "executiveRoles": executiveRoles,
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })

      }

      if (name === commandTypeList[3].commandText) {
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[4].commandText) {
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[5].commandText) {
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[6].commandText) {
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

      if (name === commandTypeList[7].commandText) {
        // for execution of sending custom token
        const tresuryWalletApproval = new SmartContract(USDCContract, daoAddress, undefined)
        const transferApprovalResponse = tresuryWalletApproval.approveDeposit(senderAddress, parseFloat(transerAmount))
        transferApprovalResponse.then((result) => {
          console.log(result)
        }, (error) => {
          console.log(error)
        })
      }

      if (name === commandTypeList[8].commandText) {
        // For execution send ethereum
        const payload = {
          "name": title,
          "description": description,
          "createdBy": walletAddress,
          "clubId": clubID,
          "votingDuration": new Date(duration).toISOString(),
          "commands": [
            {
              "executionId": 8,
              "sendEthAddresses": sendEthAddresses,
              "sendEthAmounts": sendEthAmounts,
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
            fetchData()
            setOpenSnackBar(true)
            setFailed(false)
            setOpen(false)
          }
        })
      }

    }
  }


  useEffect(() => {
    if (!fetched) {
      fetchData()
    }
  }, [])

  const handleTypeChange = (event) => {
    const { target: { value } } = event
    if (value) {
      setType(value)
    }
  }

  const handleProposalClick = (proposal) => {
    routers.push(`${router.asPath}/${proposal.proposalId}`, undefined, { shallow: true })
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setName(value)
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
        <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
          <Grid item md={9}>
            <Grid container mb={5}>
              <Grid item>
                <Typography className={classes.clubAssets}>Proposals</Typography>
              </Grid>
              <Grid item spacing={2} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Stack direction="row" spacing={4}>
                  <TextField
                    value={searchProposal}
                    onChange={(e) => setSearchProposal(e.target.value)}
                    className={classes.searchField}
                    placeholder="Search proposals"
                    InputProps={{
                      endAdornment: <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"><SearchIcon /></IconButton>
                    }}
                  />
                  <Button className={classes.addButton} variant="outlined" startIcon={<AddCircleRoundedIcon />} onClick={handleClickOpen}>
                    Create new
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {proposalData.map((proposal, key) => {
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
              })}

            </Grid>
          </Grid>
          <Grid item md={3}>
            <Card>
              <Grid container>
                <Grid items>
                  <Typography className={classes.listFont}>
                    Status
                  </Typography>
                </Grid>
              </Grid>
              <ListItemButton onClick={() => fetchFilteredData("all")}>
                <div className={classes.allIllustration}></div>
                <ListItemText primary="All" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>

              <ListItemButton onClick={() => fetchFilteredData("active")}>
                <div className={classes.activeIllustration}></div>
                <ListItemText primary="Active" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>

              <ListItemButton onClick={() => fetchFilteredData("closed")}>
                <div className={classes.pendingIllustration}></div>
                <ListItemText primary="Closed" className={classes.listFont} />
                <ArrowForwardIosIcon fontSize="5px" />
              </ListItemButton>
              <ListItemButton onClick={() => fetchFilteredData("failed")}>
                <div className={classes.closedIllustration}></div>
                <ListItemText primary="Failed" className={classes.listFont} />
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
                <Typography className={classes.cardFont}>Type of Proposal</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography className={classes.cardFont}>Voting duration</Typography>
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
              <Typography className={classes.cardFont}>Proposal Title*</Typography>
            </Grid>
            <Grid container item ml={3} mt={2}>
              <TextField sx={{ width: "95%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                placeholder="Add your one line description here" onChange={(e) => setTitle(e.target.value)} />
            </Grid>
            <Grid container item ml={3} mt={2}>
              <Typography className={classes.cardFont}>Proposal description*</Typography>
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
                                <Typography className={classes.cardFont}>Option #{key + 1}</Typography>
                              </Grid>
                              <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                <Grid item>
                                  <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                    placeholder="Yes / No / Abstain, etc." onChange={(e) => setSurveyValue(e.target.value)} />
                                </Grid>
                              </Grid>
                            </>
                          )
                        })}
                      </Card>
                    ) : <></>}
                  </Grid>
                  <Grid container item mt={2} ml={3}>
                    <Button className={classes.addButton2} variant="outlined" startIcon={<AddCircleRoundedIcon />} onClick={handleAddNewOption}>
                      Add Option
                    </Button>
                  </Grid>
                </>
              )
              :
              (
                <>
                  <Grid container item ml={3} mt={3} mb={2}>
                    <Typography className={classes.cardFont}>Choose a command for this proposal to execute</Typography>
                  </Grid>
                  <Grid item ml={3} mr={2}>
                    {openCard ? (
                      <Card className={classes.proposalCard}>
                        {commandList.map((data, key) => {
                          return (
                            <>
                              <Grid container item ml={3} mt={2}>
                                <Typography className={classes.cardFont}>Command #{key + 1}</Typography>
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
                              </Grid>
                              {name === commandTypeList[0].commandText ? (
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
                              ) :
                                name === commandTypeList[1].commandText ? (
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
                                  : name === commandTypeList[2].commandText ? (
                                    // assign executor role execution
                                    <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                      <Grid item>
                                        <Typography className={classes.cardFont}>Executor role address</Typography>
                                      </Grid>
                                      <Grid item>
                                        <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                          placeholder="0x..." onChange={(e) => setExecutiveRoles(e.target.value)} />
                                      </Grid>
                                    </Grid>
                                  ) :
                                    name === commandTypeList[3].commandText ?
                                      // update governance settings execution
                                      (
                                        <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                          <Grid item>
                                            <Typography className={classes.cardFont}>Quorum</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setQuorumValue(parseInt(e.target.value))} />
                                          </Grid>
                                          <Grid item>
                                            <Typography className={classes.cardFont}>Threshold</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setThresholdValue(parseInt(e.target.value))} />
                                          </Grid>
                                        </Grid>
                                      ) :
                                      name === commandTypeList[4].commandText ? (
                                        // start deposit execution
                                        <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                          <Grid item>
                                            <Typography className={classes.cardFont}>Deposit day</Typography>
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
                                            <Typography className={classes.cardFont}>Minimum deposit</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setMinDeposits(e.target.value)} />
                                          </Grid>
                                          <Grid item>
                                            <Typography className={classes.cardFont}>Maximum deposit</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setMaxDeposits(parseInt(e.target.value))} />
                                          </Grid>
                                          <Grid item>
                                            <Typography className={classes.cardFont}>Total deposit</Typography>
                                          </Grid>
                                          <Grid item>
                                            <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                              placeholder="0" onChange={(e) => setTotalDeposits(parseInt(e.target.value))} />
                                          </Grid>
                                        </Grid>
                                      ) :
                                        name === commandTypeList[5].commandText ? (
                                          // close deposit execution
                                          <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                            <Grid item>
                                              <Typography className={classes.cardFont}>Quorum</Typography>
                                            </Grid>
                                            <Grid item>
                                              <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                placeholder="0" onChange={(e) => setQuorumValue(parseInt(e.target.value))} />
                                            </Grid>
                                            <Grid item>
                                              <Typography className={classes.cardFont}>Threshold</Typography>
                                            </Grid>
                                            <Grid item>
                                              <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                placeholder="0" onChange={(e) => setThresholdValue(parseInt(e.target.value))} />
                                            </Grid>
                                          </Grid>
                                        ) :
                                          name === commandTypeList[6].commandText ? (
                                            // update raise amount execution
                                            <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                              <Grid item>
                                                <Typography className={classes.cardFont}>Total deposit</Typography>
                                              </Grid>
                                              <Grid item>
                                                <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                  placeholder="0" onChange={(e) => setTotalDeposits(parseInt(e.target.value))} />
                                              </Grid>
                                            </Grid>
                                          ) :
                                            name === commandTypeList[7].commandText ? (
                                              // send custom token execution
                                              <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                                <Grid item>
                                                  <Typography className={classes.cardFont}>Receiver&apos;s wallet address</Typography>
                                                </Grid>
                                                <Grid item>
                                                  <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                    placeholder="0x..." onChange={(e) => setSenderAddress(e.target.value)} />
                                                </Grid>
                                                <Grid item>
                                                  <Typography className={classes.cardFont}>Amount to be sent</Typography>
                                                </Grid>
                                                <Grid item>
                                                  <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                    placeholder="0" onChange={(e) => setTransferAmount(e.target.value)} />
                                                </Grid>
                                                <Grid item>
                                                  <Typography className={classes.cardFont}>Custom token</Typography>
                                                </Grid>
                                                <Grid item>
                                                  <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                    placeholder="0x..." onChange={(e) => setTransferAmount(e.target.value)} />
                                                </Grid>
                                                <Grid item></Grid>
                                              </Grid>
                                            ) :
                                              name === commandTypeList[8].commandText ? (
                                                // send eth execution
                                                <Grid container ml={1} mt={1} mb={2} spacing={2} direction="column">
                                                  <Grid item>
                                                    <Typography className={classes.cardFont}>Ethereum address</Typography>
                                                  </Grid>
                                                  <Grid item>
                                                    <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                      placeholder="0" onChange={(e) => setSendEthAddresses(e.target.value)} />
                                                  </Grid>
                                                  <Grid item>
                                                    <Typography className={classes.cardFont}>Ethereum amount</Typography>
                                                  </Grid>
                                                  <Grid item>
                                                    <TextField sx={{ width: "90%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                                                      placeholder="0" onChange={(e) => setSendEthAmounts(parseFloat(e.target.value))} />
                                                  </Grid>
                                                </Grid>
                                              ) : null
                              }
                            </>
                          )
                        })}
                      </Card>
                    ) : <></>}
                  </Grid>
                  <Grid container item mt={2} ml={3}>
                    <Button className={classes.addButton2} variant="outlined" startIcon={<AddCircleRoundedIcon />} onClick={handleAddNewCommand}>
                      Add command
                    </Button>
                  </Grid>
                </>
              )
            }
            <Grid container>
              <Grid item mr={2} xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Grid item>
                  <Button onClick={handleClose}>Cancel</Button>
                </Grid>
                <Grid item ml={2}>
                  {(duration === null || title === null || description === null) ? <Button onClick={handleNext} disabled >Submit</Button> : <Button onClick={handleNext} >Submit</Button>}

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
      </Layout1>
    </>
  )
}

export default withRouter(Proposal)