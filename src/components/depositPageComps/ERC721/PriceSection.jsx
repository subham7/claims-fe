import {
  // Button,
  CircularProgress,
  Grid,
  IconButton,
  // Typography,
} from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./ERC721.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { BsInfoCircleFill } from "react-icons/bs";
import { Typography, Button } from "@components/ui";

const PriceSection = ({
  clubData,
  claimNFTHandler,
  remainingDays,
  remainingTimeInSecs,
  loading,
  hasClaimed,
  count,
  setCount,
  balanceOfNft,
  isTokenGated,
  isEligibleForTokenGating,
  whitelistUserData,
  nftMinted,
}) => {
  return (
    <div className={classes.priceContainer}>
      <Typography variant="body">
        {nftMinted} collected out of{" "}
        {clubData?.raiseAmount === "0"
          ? "unlimited"
          : convertFromWeiGovernance(clubData.distributionAmount, 18) *
            convertFromWeiGovernance(clubData.pricePerToken, 6)}{" "}
        NFTs
      </Typography>
      <Typography variant="info" className="text-blue tb-pad-min">
        Price
      </Typography>
      <Typography variant="heading">
        {convertFromWeiGovernance(clubData?.pricePerToken, 6)} USDC
      </Typography>

      <div className="f-d b-pad-1">
        <Grid spacing={3} className={classes.counterContainer}>
          <IconButton
            onClick={() => {
              count > 1 ? setCount(count - 1) : 1;
            }}>
            <RemoveIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
          </IconButton>
          <Typography
            variant="subheading"
            className="text-bold"
            style={{ paddingTop: "8px" }}>
            {count}
          </Typography>
          <IconButton
            onClick={() =>
              count < clubData?.maxTokensPerUser - balanceOfNft
                ? setCount(count + 1)
                : clubData?.maxTokensPerUser
            }
            color="#000">
            <AddIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
          </IconButton>
        </Grid>
        <Button
          onClick={claimNFTHandler}
          disabled={
            (remainingDays <= 0 && remainingTimeInSecs < 0) ||
            hasClaimed ||
            (whitelistUserData?.setWhitelist === true &&
              whitelistUserData?.proof === null)
              ? true
              : isTokenGated
              ? !isEligibleForTokenGating
              : false
          }>
          {loading ? (
            <CircularProgress size={20} />
          ) : hasClaimed ? (
            "Minted"
          ) : (
            "Mint"
          )}
        </Button>
      </div>
      <Typography variant="info">
        Note: This station allows maximum of {clubData?.maxTokensPerUser}{" "}
        mint(s) per address
      </Typography>

      {isTokenGated ||
      (whitelistUserData?.setWhitelist === true &&
        whitelistUserData?.proof === null) ? (
        <div className={classes.tokenGateInfo}>
          <BsInfoCircleFill color="#C1D3FF" />
          <p>
            This Station is token-gated. Please check the about section to know
            more.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default PriceSection;
