import {
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { commandTypeList } from "../../data/dashboard";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    // margin: "16px 0 25px 0",
    marginTop: "0.5rem",
    fontSize: "18px",
    fontFamily: "Whyte",
  },
});

const ProposalActionForm = ({ formik, tokenData }) => {
  console.log(formik);
  const classes = useStyles();
  return (
    <Stack sx={{ marginTop: "1rem" }}>
      <Typography variant="proposalBody">
        Choose a command for this proposal to execute
      </Typography>
      <Select
        displayEmpty
        value={formik.actionCommand}
        onChange={(e) => formik.setFieldValue("actionCommand", e.target.value)}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          //   if (selected.length === 0) {
          //     return "Select a command";
          //   }
          return selected;
        }}
        MenuProps={commandTypeList}
        style={{
          borderRadius: "10px",
          background: "#111D38 0% 0% no-repeat padding-box",
          width: "100%",
          marginTop: "0.5rem",
        }}
        error={
          formik.touched.actionCommand && Boolean(formik.errors.actionCommand)
        }
        helperText={formik.touched.actionCommand && formik.errors.actionCommand}
      >
        <MenuItem key={0} value="Distribute token to members">
          Distribute token to members
        </MenuItem>
        <MenuItem key={1} value="Mint club token">
          Mint club token
        </MenuItem>
        {/* {isGovernanceActive ? ( */}
        <MenuItem key={2} value="Update Governance Settings">
          Update Governance Settings
        </MenuItem>
        {/* ) : null} */}
        {/* {tokenType !== "erc721" ? ( */}
        <MenuItem key={3} value="Change total raise amount">
          Change total raise amount
        </MenuItem>
        {/* ) : null} */}

        <MenuItem key={4} value="Send token to an address">
          Send token to an address
        </MenuItem>
      </Select>

      {formik.values.actionCommand === "Distribute token to members" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">Token to be sent</Typography>
            <Select
              value={formik.values.customToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "airdropToken",
                  tokenData.find((token) => token.name === e.target.value)
                    .token_address,
                )
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }

                return tokenData.find(
                  (token) => token.token_address === selected,
                )?.name;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="airdropToken"
              id="airdropToken"
            >
              {tokenData.map((token) => (
                <MenuItem key={token.name} value={token.name}>
                  {token.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">Amount of Tokens *</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="amountToAirdrop"
              id="amountToAirdrop"
              value={formik.values.amountToAirdrop}
              onChange={formik.handleChange}
              error={
                formik.touched.amountToAirdrop &&
                Boolean(formik.errors.amountToAirdrop)
              }
              helperText={
                formik.touched.amountToAirdrop && formik.errors.amountToAirdrop
              }
            />
          </Grid>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">Carry Fee</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="carryFee"
              id="carryFee"
              value={formik.values.carryFee}
              onChange={formik.handleChange}
              error={formik.touched.carryFee && Boolean(formik.errors.carryFee)}
              helperText={formik.touched.carryFee && formik.errors.carryFee}
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Mint club token" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">User Address *</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0x00"
              name="userAddress"
              id="userAddress"
              value={formik.values.userAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.userAddress && Boolean(formik.errors.userAddress)
              }
              helperText={
                formik.touched.userAddress && formik.errors.userAddress
              }
            />
          </Grid>

          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">Amount of Tokens *</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="amountOfTokens"
              id="amountOfTokens"
              value={formik.values.amountOfTokens}
              onChange={formik.handleChange}
              error={
                formik.touched.amountOfTokens &&
                Boolean(formik.errors.amountOfTokens)
              }
              helperText={
                formik.touched.amountOfTokens && formik.errors.amountOfTokens
              }
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Update Governance Settings" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">Quorum (in %)</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="quorum"
              id="quorum"
              value={formik.values.quorum}
              onChange={formik.handleChange}
              error={formik.touched.quorum && Boolean(formik.errors.quorum)}
              helperText={formik.touched.quorum && formik.errors.quorum}
            />
          </Grid>

          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody"> Threshold (in %)</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="threshold"
              id="threshold"
              value={formik.values.threshold}
              onChange={formik.handleChange}
              error={
                formik.touched.threshold && Boolean(formik.errors.threshold)
              }
              helperText={formik.touched.threshold && formik.errors.threshold}
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Change total raise amount" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}
        >
          <Typography variant="proposalBody">Total deposit</Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="0"
            type="number"
            name="totalDeposit"
            id="totalDeposit"
            value={formik.values.totalDeposit}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment style={{ color: "#6475A3" }} position="end">
                  USDC
                </InputAdornment>
              ),
            }}
            error={
              formik.touched.totalDeposit && Boolean(formik.errors.totalDeposit)
            }
            helperText={
              formik.touched.totalDeposit && formik.errors.totalDeposit
            }
          />
        </Grid>
      ) : formik.values.actionCommand === "Send token to an address" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody">Token to be sent</Typography>
            <Select
              value={formik.values.customToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "customToken",
                  tokenData.find((token) => token.name === e.target.value)
                    .token_address,
                )
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }

                return tokenData.find(
                  (token) => token.token_address === selected,
                )?.name;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="customToken"
              id="customToken"
            >
              {tokenData.map((token) => (
                <MenuItem key={token.name} value={token.name}>
                  {token.name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="proposalBody">
              Receiver&apos;s wallet address *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0x00"
              name="recieverAddress"
              id="recieverAddress"
              value={formik.values.recieverAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.recieverAddress &&
                Boolean(formik.errors.recieverAddress)
              }
              helperText={
                formik.touched.recieverAddress && formik.errors.recieverAddress
              }
            />
          </Grid>

          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}
          >
            <Typography variant="proposalBody"> Amount to be sent *</Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="amountToSend"
              id="amountToSend"
              value={formik.values.amountToSend}
              onChange={formik.handleChange}
              error={
                formik.touched.amountToSend &&
                Boolean(formik.errors.amountToSend)
              }
              helperText={
                formik.touched.amountToSend && formik.errors.amountToSend
              }
            />
          </Grid>
        </>
      ) : null}
    </Stack>
  );
};

export default ProposalActionForm;
