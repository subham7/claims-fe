import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import QuillEditor from "../quillEditor";
import dayjs from "dayjs";

const CommonProposalForm = ({ proposal }) => {
  return (
    <>
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
          <Typography variant="proposalBody">Proposal deadline</Typography>
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
            proposal.touched.proposalTitle && proposal.errors.proposalTitle
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
        <Typography variant="proposalBody">Proposal Description*</Typography>

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
