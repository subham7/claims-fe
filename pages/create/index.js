import { React, useRef, onChange, useState } from "react"
import { makeStyles } from "@mui/styles"
import { Grid, Item, Typography, TextField, Card, Switch, FormControlLabel, Box, Stack, Divider, Button, CircularProgress, IconButton } from "@mui/material"
import styled from "@emotion/styled"
import Layout2 from "../../src/components/layouts/layout2"
import HorizontalLinearStepper from "../../src/components/stepper"
import CustomRoundedCard from "../../src/components/roundcard"
import CustomCard from "../../src/components/card"
import CustomSlider from "../../src/components/slider"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import UploadIcon from '@mui/icons-material/Upload'
import ContractCard from "../../src/components/contractCard"
import { contractList, tokenType, dateTill, exitDates } from './data'
import Link from "next/link"
import SimpleSelectButton from "../../src/components/simpleSelectButton"
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import DeleteIcon from '@mui/icons-material/Delete'


const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px"
  },
  largeText: {
    fontSize: "18px",
    color: "#C1D3FF"
  },
  largeText1: {
    fontSize: "46px",
    color: "#FFFFFF"
  },
  wrapTextIcon: {
    fontSize: "18px",
    color: "#C1D3FF",
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  smallText: {
    fontSize: "14px",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontSize: "14px",
  },
  boldText: {
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: "#111D38",
    color: "#3B7AFD",
    fontSize: "18px",
  },
  cardPadding : {
    margin: 0,
    padding: 0,
    borderRadius: "10px",
  },
  addCircleColour: {
    color: "#C1D3FF",
  }
})

export default function Create(props) {
  const classes = useStyles()
  const uploadInputRef = useRef(null);
  const [value, setValue] = useState(null);
  const [clubName, setClubName] = useState(null);
  const [clubSymbol, setClubSymbol] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [maxContribution, setMaxContribution] = useState(0);
  const [mandatoryProposal, setMandatoryProposal] = useState(false);
  const [voteForQuorum, setVoteForQuorum] = useState(0);
  const [depositClose, setDepositClose] = useState(new Date());
  const [minContribution, setMinContribution] = useState(0);
  const [voteInFavour, setVoteInFavour] = useState(0);
  const [open, setOpen] = useState(false);
  const [addressList, setAddressList] = useState([]);


  const handleChange = (newValue) => {
    setValue(newValue);
    setDepositClose(newValue);
  };

  const onSetVoteForQuorum = (event, newValue) => {
    setVoteForQuorum(newValue);
  };

  const onSetVoteOnFavourChange = (event, newValue) => {
    setVoteInFavour(newValue);
  };

  const handleLoading = (event) => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleContractClick = (key) => {
    console.log(props)
  }
  
  const handleInputChange = (e, index) => {
    const address = e.target.value;
    const list = [...addressList];
    list[index] = address;
    setAddressList(list);
  };

  const handleRemoveClick = index => {
    const list = [...addressList];
    list.splice(index, 1);
    setAddressList(list);
  };

  const handleAddClick = () => {
    setAddressList([...addressList, ""]);
  };

  const steps = ["Add basic info", "Select template", "Set rules"]

  const step1 = () => {
    return (
      <>
        <Grid container direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid item md={6} mt={8}>
            <Typography className={classes.largeText1}>
              What&apos;s your club info?
            </Typography>
            <br />
            <Typography className={classes.wrapTextIcon}>
              You&apos;ll be the admin of the club since you&apos;re creating the club. &nbsp;
              <InfoOutlinedIcon />
            </Typography>
            <TextField
              error={clubName === ""}
              className={classes.textField}
              label="Club name"
              variant="outlined"
              onChange={(e) => setClubName(e.target.value)}
              value={clubName}
            />
            <TextField
              error={clubSymbol === ""}
              className={classes.textField}
              label="Club token symbol (eg: $DEMO)"
              variant="outlined"
              onChange={(e) => setClubSymbol(e.target.value)}
              value={clubSymbol}
            />
            <br />
            <Typography className={classes.largeText} variant="p">
              Upload a display picture (Optional)
            </Typography>
            <br />
            <Grid container wrap="nowrap" spacing={0} justify="center" alignItems="center" direction="row">
              <Grid item xs={0} mt={2}>
                <input ref={uploadInputRef} type="file" accept="image/*" id="file" name="file" hidden onChange={(e) => setDisplayImage(URL.createObjectURL(e.target.files[0]))} />
                <Button onClick={() => uploadInputRef.current && uploadInputRef.current.click()} startIcon={<UploadIcon />} className={classes.uploadButton}>Upload file</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }

  const step2 = () => {
    return (
      <>
      <Grid container direction="row">
          <Grid item md={12} mt={8}>
            <Typography className={classes.largeText1}>
              Choose a template or create a custom
            </Typography>
            <br />
            <Typography className={classes.largeText}>
              Templates once chosen can be modified at a later too like voting quorum, financials, etc.
            </Typography>
            </Grid>
            </Grid>
        <Grid 
          container 
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid item md={12} mt={8}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {contractList.map((data, key) => {
              return (
                <Grid item xs={6} key={key} onClick={() => handleContractClick(key)}>
                  <ContractCard 
                  contractHeading={data.contractHeading} 
                  contractSubHeading={data.contractSubHeading} 
                  contractImage={data.image}
                  star={data.star}
                  />
                </Grid>
              )
            })}
          </Grid>
          </Grid>
        </Grid>
      </>)
  }

  const step3 = () => {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item md={12}  mt={8}>
          <Typography className={classes.largeText1}>
          Investment club
            </Typography>
            <br />
            <Typography className={classes.largeText}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren
            </Typography>
            <br />
            <br />
            <Typography className={classes.largeText} mb={2}>
            Club tokens
            </Typography>
            <Card className={classes.cardPadding}>
              <Grid container pl={3} pr={1}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Membership token
            </Typography>
                  </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <SimpleSelectButton data={tokenType}/>
                </Grid>
              </Grid>
            </Card>

            <Typography className={classes.largeText} mt={4} mb={2}>
            Governance
            </Typography>
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Make proposals mandatory
            </Typography>
                  </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <FormControlLabel control={<Switch />} onChange={(e) => setMandatoryProposal(e.target.value)} value={mandatoryProposal} label=""/>
                </Grid>
              </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding} mb={2}>
                <Grid container item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} pl={3} pr={1} mt={2} mb={2}>
                <Typography className={classes.largeText}>
                Minimum votes needed to <Box sx={{ color : "#FFFFFF"}} fontWeight='fontWeightBold' display='inline'>validate</Box> a proposal
            </Typography>
                  </Grid>
                <Grid container item md={11.3} mt={4} ml={4} mb={4}>
                <CustomSlider onChange={onSetVoteForQuorum} value={voteForQuorum} />
                </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding} mb={2}>
                <Grid container item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} pl={3} pr={1} mt={2} mb={2}>
                <Typography className={classes.largeText}>
                Minimum votes in support to <Box sx={{ color : "#FFFFFF"}} fontWeight='fontWeightBold' display='inline'>pass</Box> a proposal
            </Typography>
                  </Grid>
                <Grid container item md={11.3} mt={4} ml={4} mb={4}>
                <CustomSlider onChange={onSetVoteOnFavourChange} value={voteInFavour} />
                </Grid>
            </Card>
            <br />

            <Typography className={classes.largeText} mt={3} mb={2}>
            Deposits
            </Typography>
            <Card className={classes.cardPadding}>
              <Grid container pl={3} pr={1}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Accept deposits till
            </Typography>
                  </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <SimpleSelectButton data={dateTill}/>
                </Grid>
              </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding} mb={2}>
                <Grid container pl={3} pr={1}>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Minimum contribution per person
            </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <TextField
                error={!(minContribution >= 0 || minContribution % 1 === 0)}
                variant="outlined"
                onChange={(e) => setMinContribution(e.target.value)}
                value={minContribution}
                sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px", }}
              />
                </Grid>
                </Grid>
            </Card>
            
            <br />
            <Card className={classes.cardPadding} mb={2}>
                <Grid container pl={3} pr={1}>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Maximum contribution per person
            </Typography>
                  </Grid>
                  <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <TextField
                error={!(maxContribution >= 0 || maxContribution % 1 === 0)}
                variant="outlined"
                onChange={(e) => setMaxContribution(e.target.value)}
                value={maxContribution}
                sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px", }}
              />
                </Grid>
                </Grid>
            </Card>
            <Typography className={classes.largeText} mt={4} mb={2}>
            Wallet Signators
            </Typography>
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Add more wallets that will sign & approve final transaction
            </Typography>
                  </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} mr={3}>
                <IconButton aria-label="add" onClick={handleAddClick}>
                  <AddCircleOutlinedIcon className={classes.addCircleColour}/>
                </IconButton>
                </Grid>
              </Grid>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                {addressList.map((data, key) => {
                  return (
                    <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} key={key} >
                      <TextField
                        error={!(maxContribution >= 0 || maxContribution % 1 === 0)}
                        variant="outlined"
                        onChange={(e) => handleInputChange(e, key)}
                        placeholder={"0x"}
                        sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px", }}
                      />
                      <IconButton aria-label="add" onClick={handleRemoveClick}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                );
              })}
              </Grid>
            </Card>
            <br />

            <Card className={classes.cardPadding} mb={2}>
                <Grid container item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} pl={3} pr={1} mt={2} mb={2}>
                <Typography className={classes.largeText}>
                Minimum signatures needed to <Box sx={{ color : "#FFFFFF"}} fontWeight='fontWeightBold' display='inline'>pass</Box> any transaction
            </Typography>
                  </Grid>
                <Grid container item md={11.3} mt={4} ml={4} mb={4}>
                <CustomSlider onChange={onSetVoteOnFavourChange} value={voteInFavour} />
                </Grid>
            </Card>
            
            <Typography className={classes.largeText} mt={4} mb={2}>
              Other
            </Typography>
            <Card className={classes.cardPadding} mb={2}>
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Add a carry fee
            </Typography>
                  </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <FormControlLabel control={<Switch />} onChange={(e) => setMandatoryProposal(e.target.value)} value={mandatoryProposal} label=""/>
                </Grid>
              </Grid>
            </Card>
            <br />
            <Card className={classes.cardPadding}>
              <Grid container pl={3} pr={1}>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Accept deposits till
            </Typography>
                  </Grid>
                <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <SimpleSelectButton data={exitDates}/>
                </Grid>
              </Grid>
            </Card>
            
          </Grid>
        </Grid>

      </>
    )
  }

  return (
    <Layout2>
      <div style={{ padding: "100px 400px" }}>
        <HorizontalLinearStepper
          steps={steps}
          components={[step1(), step2(), step3()]}
          data={
            {
              clubname: clubName,
              clubsymbol: clubSymbol,
              displayimage: displayImage,
              raiseamount: raiseAmount,
              maxcontribution: maxContribution,
              mandatoryproposal: mandatoryProposal,
              voteforquorum: voteForQuorum,
              depositclose: depositClose,
              mincontribution: minContribution,
              voteinfavour: voteInFavour,
              addressList: addressList,
            }
          }
          loading={handleLoading}
        />

      </div>

    </Layout2>
  )
}
