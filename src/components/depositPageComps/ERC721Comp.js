import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const useStyles = makeStyles({
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: 3,
  },
});

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
}) => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        spacing={6}
        paddingLeft={10}
        paddingTop={15}
        paddingRight={10}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {wallet ? (
          <>
            <Grid item md={5}>
              <img
                src={nftImageUrl}
                alt="nft image"
                height="400px"
                width="400px"
              />
            </Grid>
            <Grid item md={5} sx={{}}>
              <Grid
                container
                spacing={1.5}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Grid item sx={{ width: "100%" }}>
                  <Typography
                    variant="h2"
                    color={"white"}
                    fontWeight="bold"
                    sx={{ width: "100%" }}
                  >
                    {clubName}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container spacing={3}>
                    <Grid item xs="auto">
                      {isDepositActive ? (
                        <Typography
                          sx={{
                            background: "#0ABB9240",
                            color: "#0ABB92",
                            paddingTop: 0.5,
                            paddingBottom: 0.5,
                            paddingRight: 1,
                            paddingLeft: 1,
                            borderRadius: 2,
                            display: "flex",

                            alignItems: "center",
                          }}
                        >
                          <div className={classes.activeIllustration}></div>
                          Active
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            background: "#0ABB9240",
                            color: "#0ABB92",
                            paddingTop: 0.5,
                            paddingBottom: 0.5,
                            paddingRight: 1,
                            paddingLeft: 1,
                            borderRadius: 2,
                            display: "flex",

                            alignItems: "center",
                          }}
                        >
                          <div className={classes.executedIllustration}></div>
                          Finished
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs="auto">
                      <Typography
                        sx={{
                          background: "#142243",
                          color: "#fff",
                          paddingTop: 0.5,
                          paddingBottom: 0.5,
                          paddingRight: 1,
                          paddingLeft: 1,
                          borderRadius: 2,
                        }}
                      >
                        Created by{" "}
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
                  {" "}
                  <Typography variant="subtitle1" color="#C1D3FF">
                    Mint closes on {depositCloseDate}
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid container spacing={3}>
                    {isGovernanceActive && (
                      <>
                        {" "}
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            color="#fff"
                            sx={{ fontWeight: "bold" }}
                          >
                            {quoram}%
                          </Typography>
                          <Typography variant="subtitle2" color="#C1D3FF">
                            Quorum
                          </Typography>
                        </Grid>{" "}
                        <Grid item xs={3}>
                          <Typography
                            variant="subtitle1"
                            color="#fff"
                            sx={{ fontWeight: "bold" }}
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
                        color="#fff"
                        sx={{ fontWeight: "bold" }}
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
                  <Typography
                    variant="h5"
                    color="#fff"
                    sx={{ fontWeight: "bold" }}
                  >
                    {priceOfNft / Math.pow(10, 6)} USDC
                  </Typography>
                </Grid>

                <Grid item width="100%">
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      // flexDirection: "column",
                      // justifyContent: "space-between",
                      justifyContent: "center",
                      borderColor: "",
                      border: "1px solid #C1D3FF40",
                      borderRadius: 2,
                      alignItems: "center",
                      background: "#142243",
                      padding: 4,
                    }}
                  >
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
                          {" "}
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
                    color="#6475A3"
                    sx={{ fontWeight: "light" }}
                  >
                    This station allows maximum of {maxTokensPerUser} mints per
                    member
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <Typography variant="h5" color={"white"} fontWeight="bold">
              Please connect your wallet
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ERC721Comp;
