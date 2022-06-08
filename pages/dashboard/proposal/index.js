import { React, useState } from "react"
import { makeStyles } from "@mui/styles"
import Layout1 from "../../../src/components/layouts/layout1"
import { Box, Card, Grid, Typography, ListItemButton, ListItemText, Stack, TextField, Button, IconButton, Modal, Select, OutlinedInput, MenuItem, TextareaAutosize, Chip, Dialog, DialogContent } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import { fontStyle } from "@mui/system"
import SimpleSelectButton from "../../../src/components/simpleSelectButton"
import { proposalType } from "../data"

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
  addButton2: {
    width: "242px",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
    fontSize: "22px",
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
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "0 5px 0 5px"
  },
  cardFontNo: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "0 5px 0 5px"
  },
  dialogBox: {
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
    border: "1px solid",
    backgroundColor: "#142243",
  },
  daysFont: {
    fontSize: "21px",
    color: "#FFFFFF"
  }
})


export default function Proposal(props) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState([])
  const [openCard, setOpenCard] = useState(false)
  const [commandList, setCommandList] = useState([])
  const [questionList, setQuestionList] = useState([])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setName(value)
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

  return (
    <>
      <Layout1 page={2}>
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
                    <Button className={classes.addButton} variant="outlined" startIcon={<AddCircleRoundedIcon />} onClick={handleClickOpen}>
                      Create new
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item>
                  <Card className={classes.mainCard}>
                    <Grid container>
                      <Grid items ml={2} mr={2}>
                        <Typography className={classes.cardFont}>
                          Proposed by 0x75ed……34fd
                        </Typography>
                      </Grid>
                      <Grid items ml={1} mr={1} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Chip className={classes.cardFontYes} label="Active" />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid items ml={2} mr={2}>
                        <Typography className={classes.cardFont1}>
                          [#7] Buy 2 ETH worth of Evaders in their private round.
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid items ml={2} mr={2}>
                        <Typography className={classes.cardFont}>
                          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet…
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid items ml={2} mr={2} mt={2}>
                        <Typography className={classes.daysFont}>
                          3 days left
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item>
                  <Card className={classes.mainCard}>
                    <Grid container>
                      <Grid items ml={2} mr={2}>
                        <Typography className={classes.cardFont}>
                          Proposed by 0x75ed……34fd
                        </Typography>
                      </Grid>
                      <Grid items ml={1} mr={1} xs sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Chip className={classes.cardFontNo} label="Closed" />
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid items ml={2} mr={2}>
                        <Typography className={classes.cardFont1}>
                          [#7] Buy 2 ETH worth of Evaders in their private round.
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid items ml={2} mr={2}>
                        <Typography className={classes.cardFont}>
                          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet…
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid items ml={2} mr={2} mt={2}>
                        <Typography className={classes.daysFont}>
                          3 days left
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>



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
                    value={name}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return proposalType[0].name
                      }
                      return selected
                    }}
                    MenuProps={proposalType}
                    style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", width: "90%" }}
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
                  <Select
                    displayEmpty
                    value={name}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return "Action"
                      }
                      return selected
                    }}
                    MenuProps={["Action", "Survey"]}
                    style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", width: "90%" }}
                  >
                    {["Action", "Survey"].map((value) => (
                      <MenuItem
                        key={value}
                        value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container item ml={3} mt={2}>
                <Typography className={classes.cardFont}>Proposal Title*</Typography>
              </Grid>
              <Grid container item ml={3} mt={2}>
                <TextField sx={{ width: "95%", backgroundColor: "#C1D3FF40" }} className={classes.cardTextBox}
                  placeholder="Add your one line description here" />
              </Grid>
              <Grid container item ml={3} mt={2}>
                <Typography className={classes.cardFont}>Proposal description*</Typography>
              </Grid>
              <Grid container item ml={3} mt={3}>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={10}
                  placeholder="Add full description here"
                  style={{ width: "95%", height: "auto", backgroundColor: "#19274B", fontSize: "18px", color: "#C1D3FF" }}
                />
              </Grid>
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
                              MenuProps={["Select a command"]}
                              style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", width: "90%" }}
                            >
                              {["Select a command"].map((value) => (
                                <MenuItem
                                  key={value}
                                  value={value}>
                                  {value}
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>
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
              <Grid container>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <Grid item>
                    <Button onClick={handleClose}>Cancel</Button>
                  </Grid>
                  <Grid item ml={2}>
                    <Button onClick={handleClose}>Next</Button>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </div>
      </Layout1>
    </>
  )
}