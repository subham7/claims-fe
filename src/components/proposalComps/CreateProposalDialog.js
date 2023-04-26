import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";
import QuillEditor from "../quillEditor";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ProposalActionForm from "./ProposalActionForm";

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
  },
});
const CreateProposalDialog = ({ open, onClose }) => {
  const classes = useStyles();

  const proposalValidationSchema = yup.object({
    proposalDeadline: yup.date().required("deposit close date is required"),
    proposalTitle: yup
      .string("Enter proposal title")
      .required("Title is required"),
    proposalDescription: yup
      .string("Enter proposal description")
      .required("Description is required"),
    optionList: yup.array().of(yup.string().required("option is required")),
    actionCommand: yup
      .string("Enter proposal title")
      .required("action command is required"),
    userAddress: yup
      .string("Please enter user address")

      .when("actionCommand", {
        is: "Mint club token",
        then: () =>
          yup
            .string("Enter user address")
            .matches(/^0x[a-zA-Z0-9]+/gm, " proper wallet address is required")
            .required("User address is required"),
      }),
    amountOfTokens: yup.number("Enter amount of tokens").when("actionCommand", {
      is: "Mint club token",
      then: () =>
        yup
          .number("Enter amount of tokens")
          .required("Amount is required")
          .moreThan(0, "Amount should be greater than 0"),
    }),
    quorum: yup.number("Enter Quorum in percentage").when("actionCommand", {
      is: "Update Governance Settings",
      then: () =>
        yup
          .number("Enter Quorum in percentage")
          .required("Quorum is required")
          .moreThan(0, "Quorum should be greater than 0")
          .max(100, "Quorum should be less than 100"),
    }),
    threshold: yup
      .number("Enter Threshold in percentage")
      .when("actionCommand", {
        is: "Update Governance Settings",
        then: () =>
          yup
            .number("Enter Threshold in percentage")
            .required("Threshold is required")
            .moreThan(0, "Threshold should be greater than 0")
            .max(100, "Threshold should be less than 100"),
      }),
    totalDeposit: yup
      .number("Enter total deposit amount")
      .when("actionCommand", {
        is: "Change total raise amount",
        then: () =>
          yup
            .number("Enter total deposit amount")
            .required("Total deposit is required")
            .moreThan(0, "Total deposit should be greater than 0"),
      }),
    recieverAddress: yup
      .string("Please enter reciever address")
      .when("actionCommand", {
        is: "Send token to an address",
        then: () =>
          yup
            .string("Enter reciever address")
            .matches(/^0x[a-zA-Z0-9]+/gm, " proper wallet address is required")
            .required("Reciever address is required"),
      }),
    amountToSend: yup.number("Enter amount to be sent").when("actionCommand", {
      is: "Send token to an address",
      then: () =>
        yup
          .number("Enter amount to be sent")
          .required("Amount is required")
          .moreThan(0, "Amount should be greater than 0"),
    }),
  });

  const createProposal = useFormik({
    initialValues: {
      typeOfProposal: "action",
      proposalDeadline: dayjs(Date.now() + 300000),
      proposalTitle: "",
      proposalDescription: "",
      optionList: [],
      actionCommand: "",
      userAddress: "",
      amountOfTokens: 0,
      quorum: 0,
      threshold: 0,
      totalDeposit: 0,
      recieverAddress: "",
      amountToSend: 0,
    },
    validationSchema: proposalValidationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      PaperProps={{ classes: { root: classes.modalStyle } }}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent
        sx={{ overflow: "hidden", backgroundColor: "#19274B", padding: "3rem" }}
      >
        <form onSubmit={createProposal.handleSubmit} className={classes.form}>
          {/* <Grid container>
            <Grid item m={3}> */}
          <Typography className={classes.dialogBox}>Create proposal</Typography>
          {/* </Grid>
          </Grid> */}

          {/* type of proposal and end time */}
          <Grid container spacing={3} ml={0}>
            <Grid item md={6} sx={{ paddingLeft: "0 !important" }}>
              <Typography variant="proposalBody">Type of Proposal</Typography>
              <FormControl sx={{ width: "100%", marginTop: "0.5rem" }}>
                <Select
                  value={createProposal.values.typeOfProposal}
                  onChange={createProposal.handleChange}
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
              <Typography variant="proposalBody">Proposal deadline</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  fullWidth
                  sx={{
                    width: "90%",
                    marginTop: "0.5rem",
                  }}
                  value={createProposal.values.proposalDeadline}
                  minDateTime={dayjs(Date.now())}
                  onChange={(value) => {
                    createProposal.setFieldValue("proposalDeadline", value);
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
              value={createProposal.values.proposalTitle}
              onChange={createProposal.handleChange}
              error={
                createProposal.touched.proposalTitle &&
                Boolean(createProposal.errors.proposalTitle)
              }
              helperText={
                createProposal.touched.proposalTitle &&
                createProposal.errors.proposalTitle
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
              value={createProposal.values.proposalDescription}
              onChange={(value) =>
                createProposal.setFieldValue("proposalDescription", value)
              }
              error={
                createProposal.touched.proposalDescription &&
                Boolean(createProposal.errors.proposalDescription)
              }
              helperText={
                createProposal.touched.proposalDescription &&
                createProposal.errors.proposalDescription
              }
            />
            {createProposal.touched.proposalDescription &&
              Boolean(createProposal.errors.proposalDescription) && (
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
          {createProposal.values.typeOfProposal === "survey" ? (
            <>
              <Stack mt={3}>
                {createProposal.values.optionList?.length > 0 ? (
                  <Grid container pl={3} pr={1} mt={2} mb={2}>
                    {createProposal.values.optionList.map((data, key) => {
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
                            label="option"
                            // error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                            variant="outlined"
                            value={createProposal.values.optionList[key]}
                            onChange={(e, value) => {
                              const option = e.target.value;
                              const list = [
                                ...createProposal.values.optionList,
                              ];
                              list[key] = option;
                              createProposal.setFieldValue("optionList", list);
                            }}
                            placeholder={"yes, no"}
                            sx={{
                              m: 1,
                              width: 443,
                              mt: 1,
                              borderRadius: "10px",
                            }}
                            error={
                              Boolean(createProposal.errors.optionList)
                                ? createProposal.touched.optionList &&
                                  Boolean(
                                    createProposal?.errors?.optionList[key],
                                  )
                                : null
                            }
                            helperText={
                              Boolean(createProposal.errors.optionList)
                                ? createProposal.touched.optionList &&
                                  createProposal?.errors?.optionList[key]
                                : null
                            }
                          />
                          <IconButton
                            aria-label="add"
                            onClick={(value) => {
                              const list = [
                                ...createProposal.values.optionList,
                              ];
                              list.splice(key, 1);
                              createProposal.setFieldValue("optionList", list);
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
                    createProposal.setFieldValue("optionList", [
                      ...createProposal.values.optionList,
                      "",
                    ]);
                  }}
                  startIcon={<AddCircleRoundedIcon />}
                >
                  Add Option
                </Button>
                <Typography variant="proposalBody">
                  (Minimum 2 options needed *)
                </Typography>
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
              <ProposalActionForm formik={createProposal} />
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
              <Button variant="primary">Cancel</Button>
            </Grid>
            <Grid item>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalDialog;
