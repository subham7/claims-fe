import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { commandTypeList } from "../../data/dashboard";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import Link from "next/link";
import { csvToObjectForMintGT } from "utils/helper";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    // margin: "16px 0 25px 0",
    marginTop: "0.5rem",
    fontSize: "18px",
  },
});

const ProposalActionForm = ({ formik, tokenData, nftData }) => {
  const hiddenFileInput = useRef(null);
  const [file, setFile] = useState("");
  const [loadingCsv, setLoadingCsv] = useState(false);

  const classes = useStyles();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isGovernanceERC20 = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  const isGovernanceERC721 = useSelector((state) => {
    return state.club.erc721ClubDetails.isGovernanceActive;
  });

  const isGovernanceActive =
    tokenType === "erc20" ? isGovernanceERC20 : isGovernanceERC721;

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event, isMintGT = false) => {
    const fileUploaded = event.target.files[0];
    setLoadingCsv(true);
    setFile(fileUploaded);

    // new instance of fileReader class
    const reader = new FileReader();

    if (fileUploaded) {
      await reader.readAsText(fileUploaded);

      // converting .csv file into array of objects
      reader.onload = async (event) => {
        const csvData = event.target.result;
        if (!isMintGT) {
          const csvArr = csvData.split("\r\n");
          // setCSVObject(csvArr);
          formik.values.csvObject = csvArr;
          setLoadingCsv(false);
        } else {
          const { addresses, amounts } = csvToObjectForMintGT(csvData);
          formik.values.mintGTAmounts = amounts;
          formik.values.mintGTAddresses = addresses;
          setLoadingCsv(false);
        }
      };
    }
  };

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
        helperText={
          formik.touched.actionCommand && formik.errors.actionCommand
        }>
        <MenuItem key={0} value="Distribute token to members">
          Distribute token to members
        </MenuItem>
        {/* {tokenType !== "erc721" ? ( */}
        <MenuItem key={1} value="Mint club token">
          Mint club token
        </MenuItem>
        {/* ) : null} */}
        {isGovernanceActive ? (
          <MenuItem key={2} value="Update Governance Settings">
            Update Governance Settings
          </MenuItem>
        ) : null}
        {tokenType !== "erc721" ? (
          <MenuItem key={3} value="Change total raise amount">
            Change total raise amount
          </MenuItem>
        ) : null}

        <MenuItem key={4} value="Send token to an address">
          Send token to an address
        </MenuItem>
        <MenuItem key={5} value="Send nft to an address">
          Send nft to an address
        </MenuItem>
        <MenuItem key={6} value="Add signer">
          Add Signer
        </MenuItem>
        <MenuItem key={7} value="Remove signer">
          Remove Signer
        </MenuItem>
        <MenuItem key={8} value="Buy nft">
          Buy Nft
        </MenuItem>
        {/* <MenuItem key={9} value="Sell nft">
          Sell Nft
        </MenuItem> */}
        <MenuItem key={10} value="whitelist deposit">
          Whitelist Deposit
        </MenuItem>
        <MenuItem key={9} value="whitelist with lens followers">
          Whitelist with Lens followers
        </MenuItem>
        <MenuItem key={10} value="whitelist with lens post's comments">
          Whitelist with Lens post&apos;s comments
        </MenuItem>
        <MenuItem key={11} value="update price per token">
          Update price per token
        </MenuItem>
      </Select>

      {formik.values.actionCommand === "Distribute token to members" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            // mb={}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">Token to be sent</Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
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
                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="airdropToken"
              id="airdropToken">
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
            sx={{ marginLeft: "0 !important" }}>
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
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
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
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Mint club token" ? (
        <>
          <Typography mt={2} variant="proposalBody">
            Upload your CSV file
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "8px",
            }}>
            <TextField
              style={{
                width: "100%",
              }}
              className={classes.input}
              onClick={handleClick}
              onChange={(event) => {
                handleChange(event, true);
              }}
              disabled
              value={file?.name}
            />
            <Button onClick={handleClick} variant="normal">
              Upload
            </Button>
            <input
              type="file"
              accept=".csv"
              ref={hiddenFileInput}
              onChange={(event) => {
                handleChange(event, true);
              }}
              style={{ display: "none" }}
            />
          </div>

          <Typography mt={1} variant="proposalSubHeading">
            Download sample from{" "}
            <span style={{ color: "#3a7afd" }}>
              <Link href={"/assets/csv/mintGT.csv"}>here</Link>
            </span>
          </Typography>
        </>
      ) : formik.values.actionCommand === "Update Governance Settings" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
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
              onWheel={(event) => event.target.blur()}
            />
          </Grid>

          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
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
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Change total raise amount" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
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
            onWheel={(event) => event.target.blur()}
          />
        </Grid>
      ) : formik.values.actionCommand === "Send token to an address" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">Token to be sent</Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
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

                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="customToken"
              id="customToken">
              {tokenData.map((token) => (
                <MenuItem key={token.name} value={token.name}>
                  {token.name}
                </MenuItem>
              ))}
            </Select>
            <Typography mt={2} variant="proposalBody">
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
            sx={{ marginLeft: "0 !important" }}>
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
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Send nft to an address" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">Nft to be sent</Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.customToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "customNft",
                  nftData.find(
                    (token) => token.token_address === e.target.value,
                  ).token_address,
                )
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }

                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="customToken"
              id="customToken">
              {nftData
                .filter((item, index, self) => {
                  return (
                    index ===
                    self.findIndex(
                      (t) => t.token_address === item.token_address,
                    )
                  );
                })
                .map((nft) => (
                  <MenuItem key={nft.token_hash} value={nft.token_address}>
                    {nft.token_address}
                  </MenuItem>
                ))}
            </Select>
            <Typography mt={2} variant="proposalBody">
              Token ID
            </Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.customToken}
              onChange={(e) =>
                formik.setFieldValue("customNftToken", e.target.value)
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }

                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="customNftToken"
              id="customNftToken">
              {nftData
                .filter((nft) => nft.token_address === formik.values.customNft)
                .map((nft) => (
                  <MenuItem key={nft.token_hash} value={nft.token_id}>
                    {nft.token_id}
                  </MenuItem>
                ))}
              {/* {nftData?.map((nft) => (
                <MenuItem key={nft.token_hash} value={nft.token_address}>
                  {nft.token_address}
                </MenuItem>
              ))} */}
            </Select>
            <Typography mt={2} variant="proposalBody">
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
        </>
      ) : formik.values.actionCommand === "Add signer" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
            <Typography mt={2} variant="proposalBody">
              Wallet Address *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0x00"
              name="ownerAddress"
              id="ownerAddress"
              value={formik.values.ownerAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.ownerAddress &&
                Boolean(formik.errors.ownerAddress)
              }
              helperText={
                formik.touched.ownerAddress && formik.errors.ownerAddress
              }
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Remove signer" ? (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
            <Typography mt={2} variant="proposalBody">
              Wallet address *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0x00"
              name="ownerAddress"
              id="ownerAddress"
              value={formik.values.ownerAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.ownerAddress &&
                Boolean(formik.errors.ownerAddress)
              }
              helperText={
                formik.touched.ownerAddress && formik.errors.ownerAddress
              }
            />

            <Typography mt={2} variant="proposalBody">
              Threshold of safe
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              type="number"
              placeholder="0x00"
              name="safeThreshold"
              id="safeThreshold"
              value={formik.values.safeThreshold}
              onChange={formik.handleChange}
              error={
                formik.touched.safeThreshold &&
                Boolean(formik.errors.safeThreshold)
              }
              helperText={
                formik.touched.safeThreshold && formik.errors.safeThreshold
              }
            />
          </Grid>
        </>
      ) : formik.values.actionCommand === "Buy nft" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
          <Typography mt={2} variant="proposalBody">
            Opensea NFT Link *
          </Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="nft link"
            name="nftLink"
            id="nftLink"
            value={formik.values.nftLink}
            onChange={formik.handleChange}
            error={formik.touched.nftLink && Boolean(formik.errors.nftLink)}
            helperText={formik.touched.nftLink && formik.errors.nftLink}
          />
        </Grid>
      ) : formik.values.actionCommand === "Sell nft" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
          <Typography mt={2} variant="proposalBody">
            Opensea NFT Link *
          </Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="nft link"
            name="nftLink"
            id="nftLink"
            value={formik.values.nftLink}
            onChange={formik.handleChange}
            error={formik.touched.nftLink && Boolean(formik.errors.nftLink)}
            helperText={formik.touched.nftLink && formik.errors.nftLink}
          />
        </Grid>
      ) : formik.values.actionCommand === "whitelist deposit" ? (
        <>
          <Typography mt={2} variant="proposalBody">
            Upload your CSV file
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "8px",
            }}>
            <TextField
              style={{
                width: "100%",
              }}
              className={classes.input}
              onClick={handleClick}
              onChange={handleChange}
              disabled
              value={file?.name}
            />
            <Button onClick={handleClick} variant="normal">
              Upload
            </Button>
            <input
              type="file"
              accept=".csv"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </div>

          <Typography mt={1} variant="proposalSubHeading">
            Download sample from{" "}
            <span style={{ color: "#3a7afd" }}>
              <Link href={"/assets/csv/addresses.csv"}>here</Link>
            </span>
          </Typography>
        </>
      ) : formik.values.actionCommand === "whitelist with lens followers" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
          <Typography variant="proposalBody">Lens username *</Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="johndoe.lens"
            type="text"
            name="lensId"
            id="lensId"
            value={formik.values.lensId}
            onChange={formik.handleChange}
            error={formik.touched.lensId && Boolean(formik.errors.lensId)}
            helperText={formik.touched.lensId && Boolean(formik.errors.lensId)}
            onWheel={(event) => event.target.blur()}
          />
        </Grid>
      ) : formik.values.actionCommand ===
        "whitelist with lens post's comments" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
          <Typography variant="proposalBody">Lens post link *</Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="https://lenster.xyz/posts/0x01a14e-0x018e"
            type="text"
            name="lensPostLink"
            id="lensPostLink"
            value={formik.values.lensPostLink}
            onChange={formik.handleChange}
            error={
              formik.touched.lensPostLink && Boolean(formik.errors.lensPostLink)
            }
            helperText={
              formik.touched.lensPostLink && Boolean(formik.errors.lensPostLink)
            }
            onWheel={(event) => event.target.blur()}
          />
        </Grid>
      ) : formik.values.actionCommand === "update price per token" ? (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
          <Typography variant="proposalBody">Price of token *</Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="0"
            type="number"
            name="pricePerToken"
            id="pricePerToken"
            value={formik.values.pricePerToken}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment style={{ color: "#6475A3" }} position="end">
                  USDC
                </InputAdornment>
              ),
            }}
            error={
              formik.touched.pricePerToken &&
              Boolean(formik.errors.pricePerToken)
            }
            helperText={
              formik.touched.pricePerToken && formik.errors.pricePerToken
            }
            onWheel={(event) => event.target.blur()}
          />
        </Grid>
      ) : null}
    </Stack>
  );
};

export default ProposalActionForm;
