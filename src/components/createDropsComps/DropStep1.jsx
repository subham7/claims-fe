import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

const DropStep1 = ({ handleNext }) => {
  return (
    <form>
      <>
        <Typography mb={1} variant="body1">
          Set who is eligible to claim
        </Typography>
        <FormControl sx={{ width: "100%", marginBottom: "20px" }}>
          <Select
            inputProps={{ "aria-label": "Without label" }}
            name="eligible"
            id="eligible">
            <MenuItem value={"everyone"}>Everyone can claim</MenuItem>
            <MenuItem value={"token"}>Anyone with certain token/NFT</MenuItem>
            <MenuItem value={"csv"}>Upload custom CSV file</MenuItem>
          </Select>
        </FormControl>
      </>

      <>
        <Typography mb={1} variant="body1">
          Start Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker sx={{ width: "100%" }} />
        </LocalizationProvider>
      </>

      <>
        <Typography mb={1} mt={4} variant="body1">
          End Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker sx={{ width: "100%" }} />
        </LocalizationProvider>
      </>

      <>
        <Typography mt={4} mb={1}>
          Description (optional)
        </Typography>
        <TextField
          sx={{
            width: "100%",
          }}
          variant="outlined"
          minRows={3}
          multiline={true}
          placeholder="type here"
        />
      </>

      <>
        <Typography mt={4} mb={1}>
          Twitter URL (optional)
        </Typography>
        <TextField
          sx={{
            width: "100%",
          }}
          variant="outlined"
          name="twitter"
          id="twitter"
          placeholder="link"
        />
      </>

      <>
        <Typography mt={4} mb={1}>
          Discord (optional)
        </Typography>
        <TextField
          sx={{
            width: "100%",
          }}
          variant="outlined"
          name="discord"
          id="discord"
          placeholder="link"
        />
      </>

      <>
        <Typography mt={4} mb={1}>
          Telegram (optional)
        </Typography>
        <TextField
          sx={{
            width: "100%",
          }}
          variant="outlined"
          name="telegram"
          id="telegram"
          placeholder="link"
        />
      </>

      <Button
        sx={{
          marginY: "20px",
          padding: "10px 30px",
        }}
        onClick={handleNext}
        variant="contained">
        Next
      </Button>
    </form>
  );
};

export default DropStep1;
