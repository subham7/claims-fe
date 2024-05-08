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
import {
  extractNftAdressAndId,
  getSafeSdk,
  isNative,
  shortAddress,
} from "./helper";
import Link from "next/link";
import { getWhiteListMerkleRoot } from "api/whitelist";
import { fetchLensActionAddresses, handleFetchFollowers } from "./lensHelper";
import { proposalActionCommands } from "./proposalConstants";
import { getProposalTxHash } from "api/proposal";
import { createSafeTransactionData } from "./proposal";
import { CHAIN_CONFIG } from "./constants";

export const proposalData = ({
  data,
  decimals,
  factoryData,
  symbol,
  isNativeClub,
}) => {
  const {
    executionId,
    airDropAmount,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customTokenAddresses,
    mintGTAddresses,
    mintGTAmounts,
    customNft,
    ownerAddress,
    nftLink,
    lensId,
    lensPostLink,
    pricePerToken,
    depositAmount,
    withdrawAmount,
    swapToken,
    swapAmount,
    destinationToken,
    stakeAmount,
    unstakeAmount,
    nftSupply,
    updatedMinimumDepositAmount,
    updatedMaximumDepositAmount,
    safeThreshold,
    stakeToken1Amount,
    stakeToken2Amount,
  } = data ?? {};

  switch (executionId) {
    case 0:
      return {
        Amount: convertFromWeiGovernance(airDropAmount, decimals),
      };
    case 1:
      return {
        "No of recipients :": mintGTAddresses?.length,
        "Tokens to be minted: ": isNativeClub
          ? mintGTAmounts?.reduce((partialSum, a) => partialSum + Number(a), 0)
          : mintGTAmounts?.reduce(
              (partialSum, a) => partialSum + Number(a),
              0,
            ) /
            10 ** decimals,
      };
    case 2:
      return {
        Quorum: quorum,
        Threshold: threshold,
      };
    case 3:
      return {
        "Raise Amount :": totalDeposits,
      };
    case 4:
      return {
        Amount: convertFromWeiGovernance(customTokenAmounts[0], decimals),
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
        Address: shortAddress(ownerAddress),
      };
    case 62:
      return {
        safeThreshold: safeThreshold,
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
      return { "New price per token": `${pricePerToken} ${symbol}` };
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
    case 19:
      return {
        "Swap token": shortAddress(swapToken),
        "Swap amt": convertFromWeiGovernance(swapAmount, decimals),
        "Destination token": shortAddress(destinationToken),
      };
    case 17:
      return {
        "Stake token": symbol,
        "Stake amount": convertFromWeiGovernance(stakeAmount, decimals),
      };
    case 18:
    case 48:
    case 50:
    case 56:
    case 58:
    case 65:
      return {
        "Unstake token": symbol,
        "Unstake amount": convertFromWeiGovernance(unstakeAmount, decimals),
      };
    case 20:
      return { "New nft supply": `${nftSupply}` };
    case 24:
      return {
        "Deposit Amount :": `${convertFromWeiGovernance(
          depositAmount,
          decimals,
        )} $${symbol}`,
      };

    // case 25:
    //   return {
    //     "Withdraw Amount :": `${convertFromWeiGovernance(
    //       withdrawAmount,
    //       decimals,
    //     )} $${symbol}`,
    //   };

    case 60:
      return {
        "Updated amount:": `${updatedMinimumDepositAmount}`,
      };

    case 61:
      return {
        "Updated amount:": `${updatedMaximumDepositAmount}`,
      };

    case 26:
    case 31:
    case 33:
    case 35:
    case 37:
    case 39:
    case 41:
    case 43:
    case 45:
    case 47:
    case 51:
    case 53:
    case 57:
      return {
        "Deposit Amount :": `${depositAmount} ETH`,
      };
    case 49:
    case 55:
      return {
        "Deposit Amount :": `${depositAmount} USDC`,
      };
    case 63:
      return {
        "Staked ezETH": stakeToken1Amount,
        "Staked ETH": stakeToken2Amount,
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
  clubData,
}) => {
  const executionId = formik.values.actionCommand;
  const isNativeClub = isNative(clubData.depositTokenAddress, networkId);

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
                  tokenData?.find((token) => token.address === e.target.value)
                    .address,
                );
              }}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return "Select a command";
                }
                return tokenData?.find((token) => token.address === selected)
                  .symbol;
              }}
              inputProps={{ "aria-label": "Without label" }}
              name="airdropToken"
              id="airdropToken">
              {tokenData
                ?.filter((token) => token.address !== [networkId].nativeToken)
                .map((token) => (
                  <MenuItem key={token.address} value={token.address}>
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
              error={
                formik.touched.mintGTAmounts &&
                Boolean(formik.errors.mintGTAmounts)
              }
              helperText={
                formik.touched.mintGTAmounts && formik.errors.mintGTAmounts
              }
            />
            <Button onClick={handleClick} variant="contained">
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
              <Link href={"/assets/csv/sample.csv"}>here</Link>
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
                  {isNativeClub
                    ? CHAIN_CONFIG[networkId].nativeCurrency.symbol
                    : "USDC"}
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
                  tokenData?.find((token) => token.symbol === e.target.value)
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
              {tokenData?.map((token) => (
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
                  nftData?.find(
                    (token) => token.contract_address === e.target.value,
                  ).contract_address,
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
                ?.filter((item, index, self) => {
                  return (
                    index ===
                    self.findIndex(
                      (t) => t.contract_address === item.contract_address,
                    )
                  );
                })
                .map((nft) => (
                  <MenuItem key={nft.token_hash} value={nft.contract_address}>
                    {nft.contract_address}
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
                ?.filter(
                  (nft) => nft.contract_address === formik.values.customNft,
                )
                .map((nft) => (
                  <MenuItem
                    key={nft.token_hash}
                    value={nft.nft_data[0].token_id}>
                    {nft.nft_data[0].token_id}
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
                  {isNativeClub
                    ? CHAIN_CONFIG[networkId].nativeCurrency.symbol
                    : "USDC"}
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
              value={formik.values.aaveDepositToken}
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
    case 17:
      return (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            // mb={}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">Token to be staked</Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.stargateStakeToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "stargateStakeToken",
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
              name="stargateStakeToken"
              id="stargateStakeToken">
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
              name="stargateStakeAmount"
              id="stargateStakeAmount"
              value={formik.values.stargateStakeAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.stargateStakeAmount &&
                Boolean(formik.errors.stargateStakeAmount)
              }
              helperText={
                formik.touched.stargateStakeAmount &&
                formik.errors.stargateStakeAmount
              }
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      );
    case 18:
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
              Token to be un-staked
            </Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.stargateUnstakeToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "stargateUnstakeToken",
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
              name="stargateUnstakeToken"
              id="stargateUnstakeToken">
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
              name="stargateUnstakeAmount"
              id="stargateUnstakeAmount"
              value={formik.values.stargateUnstakeAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.stargateUnstakeAmount &&
                Boolean(formik.errors.stargateUnstakeAmount)
              }
              helperText={
                formik.touched.stargateUnstakeAmount &&
                formik.errors.stargateUnstakeAmount
              }
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      );
    case 19:
      return (
        <>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            // mb={}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">Token to swap</Typography>
            <Select
              sx={{ marginTop: "0.5rem" }}
              value={formik.values.uniswapSwapToken}
              onChange={(e) =>
                formik.setFieldValue(
                  "uniswapSwapToken",
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
              name="uniswapSwapToken"
              id="uniswapSwapToken">
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
            <Typography mt={2} variant="proposalBody">
              Swap tokens to *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0x00"
              name="uniswapRecieverToken"
              id="uniswapRecieverToken"
              value={formik.values.uniswapRecieverToken}
              onChange={formik.handleChange}
              error={
                formik.touched.uniswapRecieverToken &&
                Boolean(formik.errors.uniswapRecieverToken)
              }
              helperText={
                formik.touched.uniswapRecieverToken &&
                formik.errors.uniswapRecieverToken
              }
            />
          </Grid>
          <Grid
            container
            direction={"column"}
            ml={3}
            mt={2}
            sx={{ marginLeft: "0 !important" }}>
            <Typography variant="proposalBody">
              Amount of tokens to swap *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.textField}
              placeholder="0"
              type="number"
              name="uniswapSwapAmount"
              id="uniswapSwapAmount"
              value={formik.values.uniswapSwapAmount}
              onChange={formik.handleChange}
              error={
                formik.touched.uniswapSwapAmount &&
                Boolean(formik.errors.uniswapSwapAmount)
              }
              helperText={
                formik.touched.uniswapSwapAmount &&
                formik.errors.uniswapSwapAmount
              }
              onWheel={(event) => event.target.blur()}
            />
          </Grid>
        </>
      );
    case 20:
      return (
        <Grid
          container
          direction={"column"}
          ml={3}
          mt={2}
          sx={{ marginLeft: "0 !important" }}>
          <Typography variant="proposalBody">Changed NFT supply *</Typography>
          <TextField
            variant="outlined"
            className={classes.textField}
            placeholder="0"
            type="number"
            name="nftSupply"
            id="nftSupply"
            value={formik.values.nftSupply}
            onChange={formik.handleChange}
            error={formik.touched.nftSupply && Boolean(formik.errors.nftSupply)}
            helperText={formik.touched.nftSupply && formik.errors.nftSupply}
            onWheel={(event) => event.target.blur()}
          />
        </Grid>
      );
    case 21:
      return (
        <>
          <Typography variant="proposalBody" mt={2}>
            Token to be sent
          </Typography>
          <Select
            sx={{ marginTop: "0.5rem" }}
            value={formik.values.customToken}
            onChange={(e) =>
              formik.setFieldValue(
                "sendToken",
                tokenData?.find((token) => token.symbol === e.target.value)
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
            name="sendToken"
            id="sendToken">
            {tokenData?.map((token) => (
              <MenuItem key={token.symbol} value={token.symbol}>
                {token.symbol}
              </MenuItem>
            ))}
          </Select>
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
              id="sendToken"
              onChange={(event) => {
                handleChange(event, true);
              }}
              disabled
              value={file?.name}
              error={
                formik.touched.sendTokenAmounts &&
                Boolean(formik.errors.sendTokenAmounts)
              }
              helperText={
                formik.touched.sendTokenAmounts &&
                formik.errors.sendTokenAmounts
              }
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
              <Link href={"/assets/csv/sample.csv"}>here</Link>
            </span>
          </Typography>
        </>
      );

    case 22:
    case 23:
      return (
        <>
          <Typography variant="proposalBody" mt={2}>
            Token to be sent
          </Typography>
          <Select
            sx={{ marginTop: "0.5rem" }}
            value={formik.values.customToken}
            onChange={(e) =>
              formik.setFieldValue(
                "sendToken",
                tokenData?.find((token) => token.symbol === e.target.value)
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
            name="sendToken"
            id="sendToken">
            {tokenData?.map((token) => (
              <MenuItem key={token.symbol} value={token.symbol}>
                {token.symbol}
              </MenuItem>
            ))}
          </Select>
          <Typography mt={2} variant="proposalBody">
            {executionId === 25
              ? "Amount to be sent to each member *"
              : "Total amount of tokens to be distributed *"}
          </Typography>
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
              formik.touched.amountToSend && Boolean(formik.errors.amountToSend)
            }
            helperText={
              formik.touched.amountToSend && formik.errors.amountToSend
            }
            onWheel={(event) => event.target.blur()}
          />
        </>
      );

    // case 24:
    //   return (
    //     <>
    //       <Grid
    //         container
    //         direction={"column"}
    //         ml={3}
    //         mt={2}
    //         // mb={}
    //         sx={{ marginLeft: "0 !important" }}>
    //         <Typography variant="proposalBody">
    //           Token to be deposited
    //         </Typography>
    //         <Select
    //           sx={{ marginTop: "0.5rem" }}
    //           value={formik.values.clipFinanceDepositToken}
    //           onChange={(e) =>
    //             formik.setFieldValue(
    //               "clipFinanceDepositToken",
    //               filteredTokens.find(
    //                 (token) => token.symbol === e.target.value,
    //               ).address,
    //             )
    //           }
    //           renderValue={(selected) => {
    //             if (selected.length === 0) {
    //               return "Select a command";
    //             }
    //             return selected;
    //           }}
    //           inputProps={{ "aria-label": "Without label" }}
    //           name="clipFinanceDepositToken"
    //           id="clipFinanceDepositToken">
    //           {filteredTokens.map((token) => (
    //             <MenuItem key={token.symbol} value={token.symbol}>
    //               {token.symbol}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </Grid>
    //       <Grid
    //         container
    //         direction={"column"}
    //         ml={3}
    //         mt={2}
    //         sx={{ marginLeft: "0 !important" }}>
    //         <Typography variant="proposalBody">Amount of Tokens *</Typography>
    //         <TextField
    //           variant="outlined"
    //           className={classes.textField}
    //           placeholder="0"
    //           type="number"
    //           name="clipFinanceDepositAmount"
    //           id="clipFinanceDepositAmount"
    //           value={formik.values.clipFinanceDepositAmount}
    //           onChange={formik.handleChange}
    //           error={
    //             formik.touched.clipFinanceDepositAmount &&
    //             Boolean(formik.errors.clipFinanceDepositAmount)
    //           }
    //           helperText={
    //             formik.touched.clipFinanceDepositAmount &&
    //             formik.errors.clipFinanceDepositAmount
    //           }
    //           onWheel={(event) => event.target.blur()}
    //         />
    //       </Grid>
    //     </>
    //   );

    // case 25:
    //   return (
    //     <>
    //       <Grid
    //         container
    //         direction={"column"}
    //         ml={3}
    //         mt={2}
    //         // mb={}
    //         sx={{ marginLeft: "0 !important" }}>
    //         <Typography variant="proposalBody">Token to be withdraw</Typography>
    //         <Select
    //           sx={{ marginTop: "0.5rem" }}
    //           value={formik.values.clipFinanceWithdrawToken}
    //           onChange={(e) =>
    //             formik.setFieldValue(
    //               "clipFinanceWithdrawToken",
    //               filteredTokens.find(
    //                 (token) => token.symbol === e.target.value,
    //               ).address,
    //             )
    //           }
    //           renderValue={(selected) => {
    //             if (selected.length === 0) {
    //               return "Select a command";
    //             }
    //             return selected;
    //           }}
    //           inputProps={{ "aria-label": "Without label" }}
    //           name="clipFinanceWithdrawToken"
    //           id="clipFinanceWithdrawToken">
    //           {filteredTokens.map((token) => (
    //             <MenuItem key={token.symbol} value={token.symbol}>
    //               {token.symbol}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </Grid>
    //       <Grid
    //         container
    //         direction={"column"}
    //         ml={3}
    //         mt={2}
    //         sx={{ marginLeft: "0 !important" }}>
    //         <Typography variant="proposalBody">Amount of Tokens *</Typography>
    //         <TextField
    //           variant="outlined"
    //           className={classes.textField}
    //           placeholder="0"
    //           type="number"
    //           name="clipFinanceWithdrawAmount"
    //           id="clipFinanceWithdrawAmount"
    //           value={formik.values.clipFinanceWithdrawAmount}
    //           onChange={formik.handleChange}
    //           error={
    //             formik.touched.clipFinanceWithdrawAmount &&
    //             Boolean(formik.errors.clipFinanceWithdrawAmount)
    //           }
    //           helperText={
    //             formik.touched.clipFinanceWithdrawAmount &&
    //             formik.errors.clipFinanceWithdrawAmount
    //           }
    //           onWheel={(event) => event.target.blur()}
    //         />
    //       </Grid>
    //     </>
    //   );
    // case 26:
    //   return (
    //     <Grid
    //       container
    //       direction={"column"}
    //       ml={3}
    //       mt={2}
    //       sx={{ marginLeft: "0 !important" }}>
    //       <Typography variant="proposalBody">
    //         Amount of eth to stake *
    //       </Typography>
    //       <TextField
    //         variant="outlined"
    //         className={classes.textField}
    //         placeholder="0"
    //         type="number"
    //         name="eigenStakeAmount"
    //         id="eigenStakeAmount"
    //         value={formik.values.eigenStakeAmount}
    //         onChange={formik.handleChange}
    //         InputProps={{
    //           endAdornment: (
    //             <InputAdornment style={{ color: "#6475A3" }} position="end">
    //               ETH
    //             </InputAdornment>
    //           ),
    //         }}
    //         error={
    //           formik.touched.eigenStakeAmount &&
    //           Boolean(formik.errors.eigenStakeAmount)
    //         }
    //         helperText={
    //           formik.touched.eigenStakeAmount && formik.errors.eigenStakeAmount
    //         }
    //         onWheel={(event) => event.target.blur()}
    //       />
    //     </Grid>
    //   );
    // case 27:
    // return (
    //   <Grid
    //     container
    //     direction={"column"}
    //     ml={3}
    //     mt={2}
    //     sx={{ marginLeft: "0 !important" }}>
    //     <Typography variant="proposalBody">
    //       Amount of eth to remove from stake *
    //     </Typography>
    //     <TextField
    //       variant="outlined"
    //       className={classes.textField}
    //       placeholder="0"
    //       type="number"
    //       name="eigenUnstakeAmount"
    //       id="eigenUnstakeAmount"
    //       value={formik.values.eigenUnstakeAmount}
    //       onChange={formik.handleChange}
    //       // InputProps={{
    //       //   endAdornment: (
    //       //     <InputAdornment style={{ color: "#6475A3" }} position="end">
    //       //       ETH
    //       //     </InputAdornment>
    //       //   ),
    //       // }}
    //       error={
    //         formik.touched.eigenUnstakeAmount &&
    //         Boolean(formik.errors.eigenUnstakeAmount)
    //       }
    //       helperText={
    //         formik.touched.eigenUnstakeAmount &&
    //         formik.errors.eigenUnstakeAmount
    //       }
    //       onWheel={(event) => event.target.blur()}
    //     />
    //   </Grid>
    // );
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
      const airDropTokenDecimal = tokenData?.find(
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
      tokenDecimal = tokenData?.find(
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

    case 62:
      return {
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
      tokenDecimal = tokenData?.find(
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
      tokenDecimal = tokenData?.find(
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
    case 19:
      tokenDecimal = tokenData?.find(
        (token) => token.address === values.uniswapSwapToken,
      ).decimals;

      return {
        swapToken: values.uniswapSwapToken,
        swapAmount: convertToWeiGovernance(
          values.uniswapSwapAmount,
          tokenDecimal,
        ),
        destinationToken: values.uniswapRecieverToken,
      };
    case 17:
      tokenDecimal = tokenData?.find(
        (token) => token.address === values.stakeTokenAddress,
      ).decimals;

      return {
        stakeToken: values.stakeTokenAddress,
        stakeAmount: convertToWeiGovernance(values.stakeAmount, tokenDecimal),
      };
    case 18:
    case 48:
    case 50:
    case 56:
    case 58:
    case 65:
      tokenDecimal = tokenData?.find(
        (token) =>
          token.address.toLowerCase() ===
          values.unstakeTokenAddress.toLowerCase(),
      )?.decimals;
      return {
        unstakeToken: values.unstakeTokenAddress,
        unstakeAmount: convertToWeiGovernance(
          values.stakeAmount,
          tokenDecimal ?? 18,
        ),
      };
    case 20:
      return {
        nftSupply: values.nftSupply,
      };
    case 21:
      tokenDecimal = tokenData?.find(
        (token) => token.address === values.sendToken,
      ).decimals;
      return {
        sendToken: values.sendToken,
        sendTokenAddresses: values.sendTokenAddresses,
        sendTokenAmounts:
          clubData.tokenType === "existingErc20"
            ? values.sendTokenAmounts.map((amount) =>
                convertToWeiGovernance(amount, tokenDecimal),
              )
            : values.sendTokenAmounts,
      };

    case 22:
    case 23:
      tokenDecimal = tokenData?.find(
        (token) => token.address === values.sendToken,
      ).decimals;
      return {
        sendToken: values.sendToken,
        amountToSend: convertToWeiGovernance(values.amountToSend, tokenDecimal),
      };

    case 24:
      tokenDecimal = tokenData?.find(
        (token) => token.address === values.stakeTokenAddress.toLowerCase(),
      ).decimals;
      return {
        depositToken: values.stakeTokenAddress,
        depositAmount: convertToWeiGovernance(values.stakeAmount, tokenDecimal),
      };
    case 52:
      tokenDecimal = tokenData?.find(
        (token) =>
          token.address.toLowerCase() ===
          values.stakeTokenAddress.toLowerCase(),
      ).decimals;
      return {
        depositToken: values.unstakeTokenAddress,
        depositAmount: convertToWeiGovernance(values.stakeAmount, tokenDecimal),
      };

    // case 25:
    //   tokenDecimal = tokenData?.find(
    //     (token) => token.address === values.clipFinanceWithdrawToken,
    //   ).decimals;
    //   return {
    //     depositToken: values.clipFinanceWithdrawToken,
    //     depositAmount: convertToWeiGovernance(
    //       values.clipFinanceWithdrawAmount,
    //       tokenDecimal,
    //     ),
    //   };

    case 60:
      return {
        updatedMinimumDepositAmount: values.updatedMinimumDepositAmount,
      };
    case 61:
      return {
        updatedMaximumDepositAmount: values.updatedMaximumDepositAmount,
      };

    case 26:
    case 31:
    case 33:
    case 35:
    case 37:
    case 39:
    case 41:
    case 43:
    case 45:
    case 47:
    case 51:
    case 49:
    case 53:
    case 55:
    case 57:
      return {
        depositToken: values.stakeTokenAddress,
        depositAmount: values.stakeAmount,
      };
    // case 27:
    //   return {
    //     withdrawAmount: values.stakeAmount,
    //   };
  }
};

export const proposalDetailsData = ({
  data,
  decimals,
  factoryData,
  symbol,
  isNativeClub,
}) => {
  const {
    executionId,
    airDropAmount,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customTokenAddresses,
    mintGTAddresses,
    mintGTAmounts,
    customNft,
    ownerAddress,
    nftLink,
    lensId,
    lensPostLink,
    pricePerToken,
    depositAmount,
    withdrawAmount,
    swapToken,
    swapAmount,
    destinationToken,
    stakeAmount,
    unstakeAmount,
    customNftToken,
    whitelistAddresses,
    airDropCarryFee,
    nftSupply,
    sendTokenAmounts,
    sendTokenAddresses,
    updatedMinimumDepositAmount,
    updatedMaximumDepositAmount,
    safeThreshold,
    stakeToken1Amount,
    stakeToken2Amount,
  } = data ?? {};
  let responseData = {
    title: proposalActionCommands[executionId],
  };

  switch (executionId) {
    case 0:
      responseData.data = {
        Amount: convertFromWeiGovernance(airDropAmount, decimals),
        " Carry fee": airDropCarryFee,
      };

      return responseData;
    case 1:
      responseData.data = {
        "Total Amount": isNativeClub
          ? mintGTAmounts?.reduce((partialSum, a) => partialSum + Number(a), 0)
          : mintGTAmounts?.reduce(
              (partialSum, a) => partialSum + Number(a),
              0,
            ) /
            10 ** 18,
        Recipients: mintGTAddresses
          ?.map((address) => shortAddress(address))
          .join(", "),
      };
      return responseData;
    case 2:
      responseData.data = { Quorum: quorum, Threshold: threshold };
      return responseData;

    case 3:
      responseData.data = {
        "Raise Amount :": totalDeposits,
      };
      return responseData;

    case 4:
      responseData.data = {
        Amount: convertFromWeiGovernance(customTokenAmounts[0], decimals),
        Recipient: shortAddress(customTokenAddresses[0]),
      };
      return responseData;

    case 5:
      responseData.data = {
        "NFT address": shortAddress(customNft),
        "Nft Token Id": customNftToken,
        Recipient: shortAddress(customTokenAddresses[0]),
      };
      return responseData;

    case 6:
    case 7:
      responseData.data = { "Owner address": shortAddress(ownerAddress) };
      return responseData;

    case 62:
      responseData.data = { "Safe threshold": safeThreshold };
      return responseData;

    case 8:
    case 9:
      responseData.data = {
        "NFT address": shortAddress(extractNftAdressAndId(nftLink).nftAddress),
        "Token Id": `${extractNftAdressAndId(nftLink).tokenId}`,
      };
      return responseData;

    case 10:
      responseData.data = { "Enable whitelisting": whitelistAddresses };
      return responseData;

    case 11:
      responseData.data = { "Lens profile id": lensId };
      return responseData;

    case 12:
    case 16:
      responseData.data = { "Lens profile link": lensPostLink };
      return responseData;

    case 13:
      responseData.data = {
        "New price per token": `${pricePerToken} ${symbol}`,
      };
      return responseData;

    case 14:
      responseData.data = {
        "Deposit token": symbol,
        "Deposit amount": convertFromWeiGovernance(depositAmount, decimals),
      };
      return responseData;

    case 15:
      responseData.data = {
        "Withdraw token": symbol,
        "Withdraw amount": convertFromWeiGovernance(withdrawAmount, decimals),
      };
      return responseData;

    case 19:
      responseData.data = {
        Token: symbol,
        Amount: convertFromWeiGovernance(swapAmount, decimals),
        "Destination token": shortAddress(destinationToken),
      };
      return responseData;
    case 17:
      responseData.data = {
        "Stake token": symbol,
        "Stake amount": convertFromWeiGovernance(stakeAmount, decimals),
      };
      return responseData;

    case 18:
    case 48:
    case 56:
    case 58:
      responseData.data = {
        "Unstake token": symbol,
        "Unstake amount": convertFromWeiGovernance(unstakeAmount, decimals),
      };
      return responseData;
    case 52:
      responseData.data = {
        "Unstake token": symbol,
        "Unstake amount": convertFromWeiGovernance(depositAmount, decimals),
      };
      return responseData;
    case 50:
      responseData.data = {
        "Unstake token": symbol,
        "Unstake amount": convertFromWeiGovernance(unstakeAmount, 8),
      };
      return responseData;

    case 65:
      responseData.data = {
        "Unstake token": symbol,
        "Unstake amount": convertFromWeiGovernance(unstakeAmount, 18),
      };
      return responseData;
    case 20:
      responseData.data = { "New nft supply": nftSupply };
      return responseData;
    case 21:
      responseData.data = {
        "Total Amount": sendTokenAmounts?.reduce(
          (partialSum, a) => partialSum + Number(a),
          0,
        ),
        Recipients: sendTokenAddresses
          ?.map((address) => shortAddress(address))
          .join(", "),
      };
      return responseData;
    case 22:
    case 23:
      responseData.data = {
        "Total Amount": (
          sendTokenAmounts?.reduce(
            (partialSum, a) => partialSum + Number(a),
            0,
          ) /
          10 ** decimals
        ).toFixed(4),
        Recipients: "All Members",
      };
      return responseData;
    case 24:
      responseData.data = {
        "Deposit Amount": `${convertFromWeiGovernance(
          depositAmount,
          decimals ? decimals : 18,
        )} ${symbol}`,
      };

      return responseData;

    // case 25:
    //   responseData.data = {
    //     "Withdraw Amount": `${convertFromWeiGovernance(
    //       withdrawAmount,
    //       decimals,
    //     )} ${symbol}`,
    //   };

    //   return responseData;

    case 60:
      responseData.data = {
        "Updated amount:": updatedMinimumDepositAmount,
      };

      return responseData;

    case 61:
      responseData.data = {
        "Updated amount:": updatedMaximumDepositAmount,
      };

      return responseData;

    case 26:
    case 31:
    case 33:
    case 35:
    case 37:
    case 39:
    case 41:
    case 43:
    case 45:
    case 47:
    case 51:
    case 53:
    case 57:
      responseData.data = {
        "Deposit Amount": `${depositAmount} ETH`,
      };

      return responseData;

    case 49:
    case 55:
      responseData.data = {
        "Deposit Amount": `${depositAmount} USDC`,
      };

      return responseData;

    case 63:
      responseData.data = {
        "Staked ezETH": stakeToken1Amount,
        "Staked ETH": stakeToken2Amount,
      };

      return responseData;

    default:
      return {};
  }
};

export const getSafeTransaction = async (
  gnosisAddress,
  walletAddress,
  gnosisTxUrl,
) => {
  return await getSafeSdk(gnosisAddress, walletAddress, gnosisTxUrl);
};

export const getTransactionHash = async (pid) => {
  const proposalTxHash = await getProposalTxHash(pid);
  return proposalTxHash?.data[0]?.txHash ?? "";
};

export const createOrUpdateSafeTransaction = async ({
  safeSdk,
  executionId,
  transaction,
  approvalTransaction,
  stakeETHTransaction,
  nonce,
  executionStatus,
  approvalTransaction2,
}) => {
  let safeTransaction;
  let rejectionTransaction;

  if (executionId === 6) {
    safeTransaction = await safeSdk.createAddOwnerTx(transaction);
  } else if (executionId === 7) {
    safeTransaction = await safeSdk.createRemoveOwnerTx(transaction);
  } else if (executionId === 62) {
    safeTransaction = await safeSdk.createChangeThresholdTx(transaction);
  } else {
    safeTransaction = await safeSdk.createTransaction({
      safeTransactionData: createSafeTransactionData({
        approvalTransaction,
        stakeETHTransaction,
        transaction,
        nonce,
        executionId,
        approvalTransaction2,
      }),
    });
    if (executionStatus === "cancel") {
      rejectionTransaction = await safeSdk.createRejectionTransaction(nonce);
    }
  }

  const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

  return { safeTransaction, rejectionTransaction, safeTxHash: safeTxHash };
};

export const signAndConfirmTransaction = async ({
  safeSdk,
  safeService,
  safeTransaction,
  rejectionTransaction,
  executionStatus,
  safeTxHash,
}) => {
  const transactionToSign =
    executionStatus === "cancel" ? rejectionTransaction : safeTransaction;
  const senderSignature = await safeSdk.signTypedData(transactionToSign, "v4");
  await safeService.confirmTransaction(safeTxHash, senderSignature.data);
};
