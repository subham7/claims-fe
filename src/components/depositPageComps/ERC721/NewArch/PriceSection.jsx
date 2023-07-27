import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "../../../../utils/globalFunctions";
import classes from "./ERC721.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { BsInfoCircleFill } from "react-icons/bs";

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
}) => {
  return (
    <div className={classes.priceContainer}>
      <p
        style={{
          marginBottom: "10px",
        }}
        className={classes.subtitle}>
        {clubData?.membersCount} collected out of{" "}
        {clubData?.raiseAmount === "0"
          ? "unlimited"
          : convertFromWeiGovernance(clubData.distributionAmount, 18) *
            convertFromWeiGovernance(clubData.pricePerToken, 6)}{" "}
        NFTs
      </p>
      <p
        style={{
          color: "#C1D3FE",
        }}
        className={classes.smallText}>
        Price
      </p>
      <p
        style={{
          marginBottom: "12px",
          padding: 0,
        }}
        className={classes.heading}>
        {convertFromWeiGovernance(clubData?.pricePerToken, 6)} USDC
      </p>

      <div
        style={{
          display: "flex",
        }}>
        <Grid spacing={3} className={classes.counterContainer}>
          <IconButton
            onClick={() => {
              count > 1 ? setCount(count - 1) : 1;
            }}>
            <RemoveIcon sx={{ color: "#EFEFEF", fontSize: 20 }} />
          </IconButton>
          <Typography variant="h6" color="" sx={{ fontWeight: "bold" }}>
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
          }
          sx={{ px: 8, borderRadius: "24px", py: "0.5rem" }}>
          {loading ? <CircularProgress /> : hasClaimed ? "Minted" : "Mint"}
        </Button>
      </div>
      <p
        style={{
          marginTop: "12px",
        }}
        className={classes.smallText}>
        Note: This station allows maximum of {clubData?.maxTokensPerUser}{" "}
        mint(s) per address
      </p>

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
