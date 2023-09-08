import {
  Alert,
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
  Typography,
} from "@mui/material";
import { Button, TextField } from "@components/ui";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import QuillEditor from "../quillEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import ProposalActionForm from "./ProposalActionForm";
import { createProposal } from "../../api/proposal";
import { useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import { getProposalCommands } from "utils/proposalData";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { getProposalValidationSchema } from "@components/createClubComps/ValidationSchemas";

const useStyles = makeStyles({
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  textField: {
    width: "100%",
    // margin: "16px 0 25px 0",
    fontSize: "18px",

    marginTop: "0.5rem",
  },
});

const CreateProposalDialog = ({
  open,
  setOpen,
  onClose,
  tokenData,
  nftData,
  daoAddress,
  fetchProposalList,
}) => {
  const classes = useStyles();

  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
    setLoaderOpen(false);
  };

  const { getBalance, getDecimals } = useCommonContractMethods();
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const proposal = useFormik({
    initialValues: {
      tokenType: tokenType,
      typeOfProposal: "survey",
      proposalDeadline: dayjs(Date.now() + 3600 * 1000 * 24),
      proposalTitle: "",
      proposalDescription: "",
      optionList: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
      actionCommand: "",
      airdropToken: tokenData ? tokenData[0]?.address : "",
      amountToAirdrop: 0,
      carryFee: 0,
      pricePerToken: 0,
      quorum: 0,
      threshold: 0,
      totalDeposit: 0,
      customToken: tokenData ? tokenData[0]?.address : "",
      recieverAddress: "",
      amountToSend: 0,
      customNft: "",
      customNftToken: "",
      ownerChangeAction: "",
      ownerAddress: "",
      safeThreshold: 1,
      nftLink: "",
      csvObject: [],
      mintGTAddresses: [],
      mintGTAmounts: [],
      lensId: "",
      lensPostLink: "",
      aaveDepositToken: tokenData ? tokenData[0]?.address : "",
      aaveDepositAmount: 0,
      aaveWithdrawAmount: 0,
      aaveWithdrawToken: tokenData ? tokenData[0]?.address : "",
    },
    validationSchema: getProposalValidationSchema({
      networkId,
      getBalance,
      getDecimals,
      gnosisAddress,
    }),
    onSubmit: async (values) => {
      try {
        setLoaderOpen(true);
        let commands = await getProposalCommands({
          values,
          tokenData,
          clubData,
          daoAddress,
          networkId,
        });

        commands = {
          executionId: values.actionCommand,
          ...commands,
          usdcTokenSymbol: "USDC",
          usdcTokenDecimal: 6,
          usdcGovernanceTokenDecimal: 18,
        };

        const payload = {
          clubId: daoAddress,
          name: values.proposalTitle,
          description: values.proposalDescription,
          createdBy: walletAddress,
          votingDuration: dayjs(values.proposalDeadline).unix(),
          votingOptions: values.optionList,
          commands: [commands],
          type: values.typeOfProposal,
          tokenType: clubData.tokenType,
          daoAddress: daoAddress,
        };

        const createRequest = createProposal(payload, networkId);
        createRequest.then(async (result) => {
          if (result.status !== 201) {
            setOpenSnackBar(true);
            setFailed(true);
            setLoaderOpen(false);
          } else {
            fetchProposalList();
            setOpenSnackBar(true);
            setFailed(false);
            setOpen(false);
            setLoaderOpen(false);
          }
        });
      } catch (error) {
        setErrorMessage(error.message ?? error);
        setLoaderOpen(false);
        setOpenSnackBar(true);
        setFailed(true);
      }
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
        maxWidth="lg">
        <DialogContent
          sx={{
            overflow: "hidden",
            backgroundColor: "#19274B",
            padding: "3rem",
          }}>
          <form onSubmit={proposal.handleSubmit} className={classes.form}>
            {/* <Grid container>
            <Grid item m={3}> */}
            <Typography className={classes.dialogBox}>
              Create proposal
            </Typography>
            {/* </Grid>
          </Grid> */}

            {/* type of proposal and end time */}
            <Grid container spacing={3} ml={0} width="100%">
              <Grid item md={6} sx={{ paddingLeft: "0 !important" }}>
                <Typography variant="proposalBody">Type of Proposal</Typography>
                <FormControl sx={{ width: "100%", marginTop: "0.5rem" }}>
                  <Select
                    value={proposal.values.typeOfProposal}
                    onChange={proposal.handleChange}
                    inputProps={{ "aria-label": "Without label" }}
                    name="typeOfProposal"
                    id="typeOfProposal">
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
                      width: "100%",
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
              sx={{ marginLeft: "0 !important" }}>
              <Typography variant="proposalBody">Proposal Title*</Typography>

              <TextField
                variant="outlined"
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
              sx={{ marginLeft: "0 !important" }}>
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
                  backgroundColor: "#0f0f0f",
                  fontSize: "18px",
                  margin: "0.5rem 0",
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
                    sx={{ marginLeft: "1rem" }}>
                    Description is required
                  </FormHelperText>
                )}
            </Grid>

            {/* add options button */}
            {proposal.values.typeOfProposal === "survey" ? (
              <>
                <Stack mt={1}>
                  {proposal.values.optionList?.length > 0 ? (
                    <Grid
                      container
                      mt={2}
                      mb={2}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}>
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
                            key={key}>
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
                              }}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : null}
                  <Button
                    onClick={(value) => {
                      proposal.setFieldValue("optionList", [
                        ...proposal.values.optionList,
                        { text: "" },
                      ]);
                    }}>
                    Add Option
                  </Button>
                </Stack>
              </>
            ) : (
              <Stack>
                <ProposalActionForm
                  formik={proposal}
                  tokenData={tokenData}
                  nftData={nftData}
                />
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
                }}>
                <Button
                  onClick={() => {
                    proposal.resetForm();
                    setLoaderOpen(false);
                    onClose(event, "cancel");
                  }}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button type="submit">
                  {loaderOpen ? <CircularProgress size={25} /> : "Submit"}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {!failed ? (
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            sx={{ width: "100%" }}>
            Proposal Successfully created!
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            sx={{ width: "100%" }}>
            {errorMessage ? errorMessage : "Proposal creation failed!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default CreateProposalDialog;
