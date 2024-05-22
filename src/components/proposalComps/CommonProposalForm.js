import { FormHelperText, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import QuillEditor from "../quillEditor";
import dayjs from "dayjs";
import { makeStyles, useTheme } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  editor: {
    width: "100%",
    height: "auto",
    backgroundColor: theme.palette.background.default,
    fontSize: "18px",
    margin: "0.5rem 0",
  },
}));

const CommonProposalForm = ({ proposal }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <>
      {/* proposal title */}
      <Grid
        container
        direction={"column"}
        ml={3}
        mt={2}
        sx={{ marginLeft: "0 !important" }}>
        <Typography mb={1} variant="proposalBody">
          Proposal Title*
        </Typography>

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
            proposal.touched.proposalTitle && proposal.errors.proposalTitle
          }
        />
      </Grid>

      {/* proposal end time */}
      <Grid item md={6} mt={2}>
        <Typography variant="proposalBody">Proposal deadline</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            fullWidth
            sx={{
              width: "100%",
              marginTop: "0.5rem",
            }}
            value={proposal.values.proposalDeadline}
            minDateTime={dayjs(Date.now()).locale("en")}
            onChange={(value) => {
              proposal.setFieldValue("proposalDeadline", value);
            }}
          />
        </LocalizationProvider>
      </Grid>

      {/* proposal description */}
      <Grid
        container
        direction={"column"}
        ml={3}
        mt={2}
        sx={{ marginLeft: "0 !important" }}>
        <Typography variant="proposalBody">Proposal Description*</Typography>

        <QuillEditor
          //   onChange={setDescription}
          multiline
          rows={10}
          placeholder="Add full description here"
          className={classes.editor}
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
            <FormHelperText error focused mt={10} sx={{ marginLeft: "1rem" }}>
              Description is required
            </FormHelperText>
          )}
      </Grid>
      <Grid
        container
        direction={"column"}
        ml={3}
        mt={2}
        sx={{ marginLeft: "0 !important" }}>
        <Typography variant="proposalBody">
          Custom Block Number (optional)
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Add a block number"
          name="blockNum"
          id="blockNum"
          value={proposal.values.blockNum}
          onChange={proposal.handleChange}
          error={proposal.touched.blockNum && Boolean(proposal.errors.blockNum)}
          helperText={proposal.touched.blockNum && proposal.errors.blockNum}
        />
      </Grid>
    </>
  );
};

export default CommonProposalForm;
