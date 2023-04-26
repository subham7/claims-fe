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
import QuillEditor from "../quillEditor";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ProposalActionForm from "./ProposalActionForm";
import { proposalValidationSchema } from "../createClubComps/ValidationSchemas";

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
const CreateProposalDialog = ({ open, onClose }) => {
  const classes = useStyles();

  const createProposal = useFormik({
    initialValues: {
      typeOfProposal: "survey",
      proposalDeadline: dayjs(Date.now() + 300000),
      proposalTitle: "",
      proposalDescription: "",
      optionList: ["yes", "no"],
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
                  <Grid container pr={1} mt={2} mb={2}>
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
                            disabled={
                              createProposal.values.optionList.indexOf(
                                createProposal.values.optionList[key],
                              ) < 2
                            }
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
              <Button
                variant="primary"
                onClick={() => {
                  createProposal.resetForm();
                  onClose(event, "cancel");
                }}
              >
                Cancel
              </Button>
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
