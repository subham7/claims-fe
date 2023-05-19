import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import QuillEditor from "../quillEditor";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ProposalActionForm from "./ProposalActionForm";
import { proposalValidationSchema } from "../createClubComps/ValidationSchemas";
import {
  convertToWei,
  convertToWeiGovernance,
} from "../../utils/globalFunctions";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import Web3 from "web3";
import { createProposal } from "../../api/proposal";
import { fetchProposals } from "../../utils/proposal";
import { useDispatch, useSelector } from "react-redux";
import factoryContractABI from "../../abis/newArch/factoryContract.json";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { SmartContract } from "../../api/contract";
import { setProposalList } from "../../redux/reducers/proposal";

const useStyles = makeStyles({
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  textField: {
    width: "100%",
    // margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
    marginTop: "0.5rem",
  },
});
const CreateProposalDialog = ({ open, setOpen, onClose, tokenData }) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();

  const { clubId } = router.query;
  const [{ wallet }] = useConnectWallet();
  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const daoAddress = useSelector((state) => {
    return state.club.daoAddress;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    setLoaderOpen(false);
  };

  const proposal = useFormik({
    initialValues: {
      typeOfProposal: "survey",
      proposalDeadline: dayjs(Date.now() + 3600 * 1000 * 24),
      proposalTitle: "",
      proposalDescription: "",
      optionList: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
      actionCommand: "",
      airdropToken: tokenData ? tokenData[0]?.tokenAddress : "",
      amountToAirdrop: 0,
      carryFee: 0,
      userAddress: "",
      amountOfTokens: 0,
      quorum: 0,
      threshold: 0,
      totalDeposit: 0,
      customToken: tokenData ? tokenData[0]?.tokenAddress : "",
      recieverAddress: "",
      amountToSend: 0,
    },
    validationSchema: proposalValidationSchema,
    onSubmit: async (values) => {
      let commands;
      setLoaderOpen(true);
      if (values.actionCommand === "Distribute token to members") {
        const airDropTokenDecimal = tokenData.find(
          (token) => token.token_address === values.airdropToken,
        ).decimals;
        commands = [
          {
            executionId: 0,
            airDropToken: values.airdropToken,
            airDropAmount: convertToWeiGovernance(
              values.amountToAirdrop,
              airDropTokenDecimal,
            ).toString(),
            airDropCarryFee: values.carryFee,
            usdcTokenSymbol: "USDC",
            usdcTokenDecimal: 6,
            usdcGovernanceTokenDecimal: 18,
          },
        ];
      }
      if (values.actionCommand === "Mint club token") {
        commands = [
          {
            executionId: 1,
            mintGTAddresses: [values.userAddress],
            mintGTAmounts: [
              clubData.tokenType === "erc20"
                ? convertToWeiGovernance(values.amountOfTokens, 18)
                : values.amountOfTokens,
            ],
            usdcTokenSymbol: "USDC",
            usdcTokenDecimal: 6,
            usdcGovernanceTokenDecimal: 18,
          },
        ];
      }
      if (values.actionCommand === "Update Governance Settings") {
        commands = [
          {
            executionId: 2,
            quorum: values.quorum,
            threshold: values.threshold,
            usdcTokenSymbol: "USDC",
            usdcTokenDecimal: 6,
            usdcGovernanceTokenDecimal: 18,
          },
        ];
      }
      if (values.actionCommand === "Change total raise amount") {
        const factoryContract = new SmartContract(
          factoryContractABI,
          FACTORY_CONTRACT_ADDRESS,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        const factoryData = await factoryContract.getDAOdetails(daoAddress);

        commands = [
          {
            executionId: 3,
            totalDeposits:
              convertToWei(values.totalDeposit, 6) / factoryData.pricePerToken,

            usdcTokenSymbol: "USDC",
            usdcTokenDecimal: 6,
            usdcGovernanceTokenDecimal: 18,
          },
        ];
      }
      if (values.actionCommand === "Send token to an address") {
        const tokenDecimal = tokenData.find(
          (token) => token.token_address === values.customToken,
        ).decimals;
        commands = [
          {
            executionId: 4,
            customToken: values.customToken,
            customTokenAmounts: [
              convertToWei(values.amountToSend, tokenDecimal),
            ],
            customTokenAddresses: [values.recieverAddress],
            usdcTokenSymbol: "USDC",
            usdcTokenDecimal: 6,
            usdcGovernanceTokenDecimal: 18,
          },
        ];
      }
      const payload = {
        name: values.proposalTitle,
        description: values.proposalDescription,
        createdBy: walletAddress,
        clubId: clubId,
        votingDuration: dayjs(values.proposalDeadline).unix(),
        votingOptions: values.optionList,
        commands: commands,
        type: values.typeOfProposal,
        tokenType: clubData.tokenType,
        daoAddress: daoAddress,
      };

      const createRequest = createProposal(payload, NETWORK_HEX);
      createRequest.then(async (result) => {
        if (result.status !== 201) {
          setOpenSnackBar(true);
          setFailed(true);
          setLoaderOpen(false);
        } else {
          const proposalData = await fetchProposals(clubId);
          dispatch(setProposalList(proposalData));
          setOpenSnackBar(true);
          setFailed(false);
          setOpen(false);
          setLoaderOpen(false);
        }
      });
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent
          sx={{
            overflow: "hidden",
            backgroundColor: "#19274B",
            padding: "3rem",
          }}
        >
          <form onSubmit={proposal.handleSubmit} className={classes.form}>
            {/* <Grid container>
            <Grid item m={3}> */}
            <Typography className={classes.dialogBox}>
              Create proposal
            </Typography>
            {/* </Grid>
          </Grid> */}

            {/* type of proposal and end time */}
            <Grid container spacing={3} ml={0}>
              <Grid item md={6} sx={{ paddingLeft: "0 !important" }}>
                <Typography variant="proposalBody">Type of Proposal</Typography>
                <FormControl sx={{ width: "100%", marginTop: "0.5rem" }}>
                  <Select
                    value={proposal.values.typeOfProposal}
                    onChange={proposal.handleChange}
                    inputProps={{ "aria-label": "Without label" }}
                    name="typeOfProposal"
                    id="typeOfProposal"
                  >
                    <MenuItem value={"survey"}>Survey</MenuItem>
                    <MenuItem value={"action"}>Action</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <Typography variant="proposalBody">
                  Proposal deadline
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    fullWidth
                    sx={{
                      width: "90%",
                      marginTop: "0.5rem",
                    }}
                    value={proposal.values.proposalDeadline}
                    minDateTime={dayjs(Date.now())}
                    onChange={(value) => {
                      proposal.setFieldValue("proposalDeadline", value);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            {/* proposal title */}
            <Grid
              container
              direction={"column"}
              ml={3}
              mt={2}
              sx={{ marginLeft: "0 !important" }}
            >
              <Typography variant="proposalBody">Proposal Title*</Typography>

              <TextField
                variant="outlined"
                className={classes.textField}
                placeholder="Add a one liner title here"
                name="proposalTitle"
                id="proposalTitle"
                value={proposal.values.proposalTitle}
                onChange={proposal.handleChange}
                error={
                  proposal.touched.proposalTitle &&
                  Boolean(proposal.errors.proposalTitle)
                }
                helperText={
                  proposal.touched.proposalTitle &&
                  proposal.errors.proposalTitle
                }
              />
            </Grid>

            {/* proposal description */}
            <Grid
              container
              direction={"column"}
              ml={3}
              mt={2}
              sx={{ marginLeft: "0 !important" }}
            >
              <Typography variant="proposalBody">
                Proposal Description*
              </Typography>

              <QuillEditor
                //   onChange={setDescription}
                multiline
                rows={10}
                placeholder="Add full description here"
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#19274B",
                  fontSize: "18px",
                  color: "#C1D3FF",
                  fontFamily: "Whyte",
                  marginBottom: "0.5rem",
                }}
                name="proposalDescription"
                id="proposalDescription"
                value={proposal.values.proposalDescription}
                onChange={(value) =>
                  proposal.setFieldValue("proposalDescription", value)
                }
                error={
                  proposal.touched.proposalDescription &&
                  Boolean(proposal.errors.proposalDescription)
                }
                helperText={
                  proposal.touched.proposalDescription &&
                  proposal.errors.proposalDescription
                }
              />
              {proposal.touched.proposalDescription &&
                Boolean(proposal.errors.proposalDescription) && (
                  <FormHelperText
                    error
                    focused
                    mt={10}
                    sx={{ marginLeft: "1rem" }}
                  >
                    Description is required
                  </FormHelperText>
                )}
            </Grid>

            {/* add options button */}
            {proposal.values.typeOfProposal === "survey" ? (
              <>
                <Stack mt={3}>
                  {proposal.values.optionList?.length > 0 ? (
                    <Grid container pr={1} mt={2} mb={2}>
                      {proposal.values.optionList.map((data, key) => {
                        return (
                          <Grid
                            item
                            xs
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                            key={key}
                          >
                            <TextField
                              label="Options"
                              // error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                              variant="outlined"
                              value={proposal.values.optionList[key].text}
                              onChange={(e, value) => {
                                const option = e.target.value;
                                const list = [...proposal.values.optionList];
                                list[key].text = option;
                                proposal.setFieldValue("optionList", list);
                              }}
                              placeholder={"yes, no"}
                              sx={{
                                m: 1,
                                width: 443,
                                mt: 1,
                                borderRadius: "10px",
                              }}
                              error={
                                Boolean(proposal.errors.optionList)
                                  ? proposal.touched.optionList &&
                                    Boolean(proposal?.errors?.optionList[key])
                                  : null
                              }
                              helperText={
                                Boolean(proposal.errors.optionList)
                                  ? proposal.touched.optionList &&
                                    proposal?.errors?.optionList[key]
                                  : null
                              }
                            />
                            <IconButton
                              aria-label="add"
                              disabled={
                                proposal.values.optionList.indexOf(
                                  proposal.values.optionList[key],
                                ) < 2
                              }
                              onClick={(value) => {
                                const list = [...proposal.values.optionList];
                                list.splice(key, 1);
                                proposal.setFieldValue("optionList", list);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : null}
                  <Button
                    variant={"primary"}
                    //   className={classes.btn}
                    sx={{ width: "30%" }}
                    onClick={(value) => {
                      proposal.setFieldValue("optionList", [
                        ...proposal.values.optionList,
                        { text: "" },
                      ]);
                    }}
                    startIcon={<AddCircleRoundedIcon />}
                  >
                    Add Option
                  </Button>
                </Stack>
              </>
            ) : (
              <Stack>
                {/* <Typography variant="proposalBody">
                Choose a command for this proposal to execute
              </Typography>
              <Button
                variant="primary"
                sx={{ width: "40%" }}
                startIcon={<AddCircleRoundedIcon />}
                // onClick={handleAddNewCommand}
              >
                Add command
              </Button> */}
                <ProposalActionForm formik={proposal} tokenData={tokenData} />
              </Stack>
            )}

            {/* Submit Button */}
            <Grid container mt={2} spacing={3}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="primary"
                  onClick={() => {
                    proposal.resetForm();
                    setLoaderOpen(false);
                    onClose(event, "cancel");
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="primary"
                  type="submit"
                  sx={loaderOpen && { padding: "3px" }}
                >
                  {loaderOpen ? (
                    <CircularProgress color="inherit" s />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {!failed ? (
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Proposal Successfully created!
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Proposal creation failed!
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default CreateProposalDialog;
