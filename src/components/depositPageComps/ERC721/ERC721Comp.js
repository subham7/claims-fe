import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ERC721Styles } from "./ERC721CompStyles";

const ERC721Comp = ({
  wallet,
  nftImageUrl,
  clubName,
  isDepositActive,
  nftContractOwner,
  handleClaimNft,
  loading,
  priceOfNft,
  totalNftSupply,
  totalNftMinted,
  quoram,
  threshold,
  isNftSupplyUnlimited,
  isGovernanceActive,
  maxTokensPerUser,
  depositCloseDate,
}) => {
  const classes = ERC721Styles();

  return (
    <>
      <Grid className={classes.topGrid} container spacing={6}>
        {wallet ? (
          <>
            <Grid item md={5}>
              <img
                src={nftImageUrl}
                alt="nft image"
                className={classes.nftImg}
              />
            </Grid>
            <Grid item md={5}>
              <Grid
                container
                spacing={1.5}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Grid item sx={{ width: "100%" }}>
                  <Typography variant="h2" className={classes.clubName}>
                    {clubName}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs="auto">
                      {isDepositActive ? (
                        <Typography className={classes.depositActive}>
                          <div className={classes.activeIllustration}></div>
                          Active
                        </Typography>
                      ) : (
                        <Typography className={classes.depositActive}>
                          <div className={classes.executedIllustration}></div>
                          Finished
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs="auto">
                      <Typography className={classes.createdBy}>
                        Created by
                        {`${nftContractOwner?.slice(
                          0,
                          5,
                        )}...${nftContractOwner?.slice(-5)}`}
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <MoreHorizIcon
                        sx={{
                          background: "#142243",
                          color: "#fff",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 1,
                          paddingLeft: 1,
                          borderRadius: 2,
                        }}
                        fontSize="large"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item width="100%">
                  <Typography variant="subtitle1" color="#C1D3FF">
                    Mint closes on {depositCloseDate}
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid container spacing={3}>
                    {isGovernanceActive && (
                      <>
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            className={classes.quoramTxt}
                          >
                            {quoram}%
                          </Typography>
                          <Typography variant="subtitle2" color="#C1D3FF">
                            Quorum
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            className={classes.quoramTxt}
                          >
                            {threshold}%
                          </Typography>
                          <Typography variant="subtitle2" color="#C1D3FF">
                            Threshold
                          </Typography>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={4} width="fit-content">
                      <Typography
                        variant="subtitle1"
                        className={classes.quoramTxt}
                      >
                        {isNftSupplyUnlimited
                          ? "unlimited"
                          : totalNftSupply - totalNftMinted}
                      </Typography>
                      <Typography variant="subtitle2" color="#C1D3FF">
                        Nfts Remaining
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item width="100%">
                  <Typography variant="subtitle2" color="#C1D3FF">
                    Price
                  </Typography>
                  <Typography variant="h5" className={classes.quoramTxt}>
                    {priceOfNft / Math.pow(10, 6)} USDC
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid container className={classes.claimGrid}>
                    {/* <Grid
                          spacing={3}
                          sx={{
                            background: "#EFEFEF",
                            borderRadius: 2,
                            display: "flex",
                            flexDirection: "inherit",
                            alignItems: "center",
                          }}
                        >
                          
                          <IconButton onClick={() => setCount(count - 1)}>
                            <RemoveIcon sx={{ color: "black", fontSize: 20 }} />
                          </IconButton>
                          <Typography
                            variant="h6"
                            color=""
                            sx={{ fontWeight: "bold" }}
                          >
                            {count}
                          </Typography>
                          <IconButton
                            onClick={() => setCount(count + 1)}
                            color="#000"
                          >
                            <AddIcon sx={{ color: "black", fontSize: 20 }} />
                          </IconButton>
                        </Grid> */}
                    <Grid item>
                      <Button
                        onClick={handleClaimNft}
                        disabled={loading}
                        sx={{ px: 8 }}
                      >
                        {loading ? <CircularProgress /> : "Claim"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography
                    variant="subtitle2"
                    className={classes.maxTokensTxt}
                  >
                    This station allows maximum of {maxTokensPerUser} mints per
                    member
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid className={classes.connectWalletTxtGrid}>
            <Typography variant="h5" className={classes.quoramTxt}>
              Please connect your wallet
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ERC721Comp;
