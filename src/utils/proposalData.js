import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "./globalFunctions";
import { extractNftAdressAndId, shortAddress } from "./helper";
import Link from "next/link";
import { getWhiteListMerkleRoot } from "api/whitelist";
import { fetchLensActionAddresses, handleFetchFollowers } from "./lensHelper";

export const proposalData = ({ data, decimals, factoryData, symbol }) => {
  const {
    executionId,
    airDropAmount,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customTokenAddresses,
    mintGTAddresses,
    customNft,
    ownerAddress,
    nftLink,
    lensId,
    lensPostLink,
    pricePerToken,
    depositAmount,
    withdrawAmount,
  } = data ?? {};

  switch (executionId) {
    case 0:
      return {
        Amount: convertFromWeiGovernance(airDropAmount, decimals),
      };
    case 1:
      return {
        "No of recipients :": mintGTAddresses?.length,
      };
    case 2:
      return {
        Quorum: quorum,
        Threshold: threshold,
      };
    case 3:
      return {
        "Raise Amount :":
          (convertToWeiGovernance(
            convertToWeiGovernance(totalDeposits, 6) /
              factoryData?.pricePerToken,
            18,
          ) /
            10 ** 18) *
          convertFromWeiGovernance(factoryData?.pricePerToken, 6),
      };
    case 4:
      return {
        Amount: customTokenAmounts[0] / 10 ** decimals,
        Recipient: shortAddress(customTokenAddresses[0]),
      };
    case 5:
      return {
        "NFT address": shortAddress(customNft),
        Recipient: shortAddress(customTokenAddresses[0]),
      };
    case 6:
    case 7:
      return {
        "Owner address": shortAddress(ownerAddress),
      };
    case 8:
    case 9:
      return {
        "NFT address": shortAddress(extractNftAdressAndId(nftLink).nftAddress),
        "Token Id": `${extractNftAdressAndId(nftLink).tokenId}`,
      };
    case 10:
      return { "Enable whitelisting": "" };
    case 11:
      return { "Lens profile id": lensId };
    case 12:
    case 16:
      return { "Lens profile link": lensPostLink };
    case 13:
      return { "Price per token": `${pricePerToken} USDC` };
    case 14:
      return {
        "Deposit token": symbol,
        "Deposit amount": convertFromWeiGovernance(depositAmount, decimals),
      };
    case 15:
      return {
        "Withdraw token": symbol,
        "Withdraw amount": convertFromWeiGovernance(withdrawAmount, decimals),
      };
    default:
      return {};
  }
};

export const proposalFormData = ({
  formik,
  tokenData,
  networkId,
  classes,
  handleChange,
  handleClick,
  hiddenFileInput,
  file,
  nftData,
  filteredTokens,
}) => {
  const executionId = formik.values.actionCommand;
  switch (executionId) {
    case 0:
      return (
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
              value={formik.values.airdropToken}
              onChange={(e) => {
                formik.setFieldValue(
                  "airdropToken",
                  tokenData.find((token) => token.symbol === e.target.value)
                    .address,
                );
              }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }
                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="airdropToken"
              id="airdropToken">
              {tokenData
                .filter((token) => token.address !== [networkId].nativeToken)
                .map((token) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
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
      );

    case 1:
      return (
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
      );

    case 2:
      return (
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
      );

    case 3:
      return (
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
      );

    case 4:
      return (
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
                  tokenData.find((token) => token.symbol === e.target.value)
                    .address,
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
                <MenuItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
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
      );

    case 5:
      return (
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
      );

    case 6:
    case 7:
      return (
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

          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
            <Typography mt={2} variant="proposalBody">
              Safe Threshold *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
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
      );

    case 8:
    case 9:
      return (
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
      );

    case 10:
      return (
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
            <span style={{ color: "#2D55FF" }}>
              <Link href={"/assets/csv/addresses.csv"}>here</Link>
            </span>
          </Typography>
        </>
      );

    case 11:
      return (
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
      );

    case 12:
    case 16:
      return (
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
      );

    case 13:
      return (
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
      );

    case 14:
      return (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            // mb={}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">
              Token to be deposited
            </Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.aaveWithdrawToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "aaveDepositToken",
                  filteredTokens.find(
                    (token) => token.symbol === e.target.value,
                  ).address,
                )
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }
                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="aaveDepositToken"
              id="aaveDepositToken">
              {filteredTokens.map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
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
              name="aaveDepositAmount"
              id="aaveDepositAmount"
              value={formik.values.aaveDepositAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.aaveDepositAmount &&
                Boolean(formik.errors.aaveDepositAmount)
              }
              helperText={
                formik.touched.aaveDepositAmount &&
                formik.errors.aaveDepositAmount
              }
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      );

    case 15:
      return (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            // mb={}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">Token to withdraw</Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.aaveWithdrawToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "aaveWithdrawToken",
                  filteredTokens.find(
                    (token) => token.symbol === e.target.value,
                  ).address,
                )
              }
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }
                return selected;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="aaveWithdrawToken"
              id="aaveWithdrawToken">
              {filteredTokens.map((token) => (
                <MenuItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
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
              name="aaveWithdrawAmount"
              id="aaveWithdrawAmount"
              value={formik.values.aaveWithdrawAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.aaveWithdrawAmount &&
                Boolean(formik.errors.aaveWithdrawAmount)
              }
              helperText={
                formik.touched.aaveWithdrawAmount &&
                formik.errors.aaveWithdrawAmount
              }
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      );
  }
};

export const getProposalCommands = async ({
  values,
  tokenData,
  clubData,
  daoAddress,
  networkId,
}) => {
  const executionId = values.actionCommand;
  let data;
  let followersAddresses;
  let merkleRoot;
  let tokenDecimal;
  let mirrorAddresses;
  switch (executionId) {
    case 0:
      const airDropTokenDecimal = tokenData.find(
        (token) => token.address === values.airdropToken,
      ).decimals;
      return {
        airDropToken: values.airdropToken,
        airDropAmount: convertToWeiGovernance(
          values.amountToAirdrop,
          airDropTokenDecimal,
        ).toString(),
        airDropCarryFee: values.carryFee,
      };

    case 1:
      return {
        mintGTAddresses: values.mintGTAddresses,
        mintGTAmounts:
          clubData.tokenType === "erc20"
            ? values.mintGTAmounts.map((amount) =>
                convertToWeiGovernance(amount, 18),
              )
            : values.mintGTAmounts,
      };

    case 2:
      return {
        quorum: values.quorum,
        threshold: values.threshold,
      };

    case 3:
      return {
        totalDeposits: values.totalDeposit,
      };

    case 4:
      tokenDecimal = tokenData.find(
        (token) => token.address === values.customToken,
      ).decimals;
      return {
        customToken: values.customToken,
        customTokenAmounts: [
          convertToWeiGovernance(values.amountToSend, tokenDecimal),
        ],
        customTokenAddresses: [values.recieverAddress],
      };

    case 5:
      return {
        customNft: values.customNft,
        customNftToken: values.customNftToken,
        customTokenAddresses: [values.recieverAddress],
      };

    case 6:
    case 7:
      return {
        ownerAddress: values.ownerAddress,
        safeThreshold: values.safeThreshold,
      };

    case 8:
    case 9:
      return {
        nftLink: values.nftLink,
      };

    case 10:
      followersAddresses = values.csvObject;

      data = {
        daoAddress,
        whitelist: values.csvObject,
      };
      merkleRoot = await getWhiteListMerkleRoot(networkId, data);
      return {
        merkleRoot: merkleRoot,
        whitelistAddresses: followersAddresses,
        allowWhitelisting: true,
      };

    case 11:
      followersAddresses = await handleFetchFollowers(values.lensId);

      data = {
        daoAddress,
        whitelist: followersAddresses,
      };
      merkleRoot = await getWhiteListMerkleRoot(networkId, data);
      return {
        merkleRoot: merkleRoot,
        lensId: values.lensId,
        whitelistAddresses: followersAddresses,
        allowWhitelisting: true,
      };

    case 12:
      followersAddresses = await fetchLensActionAddresses({
        postLink: values.lensPostLink,
        action: "comment",
      });

      data = {
        daoAddress,
        whitelist: followersAddresses,
      };
      merkleRoot = await getWhiteListMerkleRoot(networkId, data);

      return {
        merkleRoot: merkleRoot,
        lensPostLink: values.lensPostLink,
        whitelistAddresses: followersAddresses,
        allowWhitelisting: true,
      };

    case 13:
      return {
        pricePerToken: values.pricePerToken,
      };

    case 14:
      tokenDecimal = tokenData.find(
        (token) => token.address === values.aaveDepositToken,
      ).decimals;
      return {
        depositToken: values.aaveDepositToken,
        depositAmount: convertToWeiGovernance(
          values.aaveDepositAmount,
          tokenDecimal,
        ),
      };

    case 15:
      tokenDecimal = tokenData.find(
        (token) => token.address === values.aaveWithdrawToken,
      ).decimals;

      return {
        withdrawToken: values.aaveWithdrawToken,
        withdrawAmount: convertToWeiGovernance(
          values.aaveWithdrawAmount,
          tokenDecimal,
        ),
      };
    case 16:
      mirrorAddresses = await fetchLensActionAddresses({
        postLink: values.lensPostLink,
        action: "mirror",
      });
      data = {
        daoAddress,
        whitelist: mirrorAddresses,
      };
      merkleRoot = await getWhiteListMerkleRoot(networkId, data);

      return {
        merkleRoot: merkleRoot,
        lensPostLink: values.lensPostLink,
        whitelistAddresses: mirrorAddresses,
        allowWhitelisting: true,
      };
  }
};
