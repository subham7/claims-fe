import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ERC721Styles } from "./ERC721CompStyles";

import { checkUserByClub, createUser } from "../../../api/user";
import { useSelector } from "react-redux";
import { convertFromWei } from "../../../utils/globalFunctions";
import { TwitterShareButton } from "react-twitter-embed";
import { useRouter } from "next/router";

const ERC721Comp = ({
  wallet,
  nftImageUrl,
  clubName,
  isDepositActive,
  nftContractOwner,
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
  daoAddress,
  userNftBalance,
  walletBalance,
  setLoading,
  setAlertStatus,
  setOpenSnackBar,
  usdcTokenDecimal,
  nftMetadata,
  userDetails,
  clubId,
  setMessage,
  newContract,
  tokenGatingAddress,
  tokenGatingAmount,
  userTokenBalance,
}) => {
  const classes = ERC721Styles();
  const router = useRouter();

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const handleClaimNft = async () => {
    const usdc_contract = newContract(USDC_CONTRACT_ADDRESS);
    // pass governor contract
    const dao_contract = newContract(daoAddress);

    // const priceOfNftConverted = convertToWei(
    //   priceOfNft,
    //   usdcTokenDecimal,
    // ).toString();
    const priceOfNftConverted = priceOfNft;
    // console.log(userNftBalance, maxTokensPerUser);
    if (
      userNftBalance < maxTokensPerUser &&
      walletBalance >= convertFromWei(priceOfNft, 6)
    ) {
      setLoading(true);
      // if the user doesn't exist

      // pass governor contract
      const usdc_response = usdc_contract.approveDeposit(
        daoAddress,
        priceOfNftConverted,
        usdcTokenDecimal,
      );
      usdc_response
        .then(
          (result) => {
            const deposit_response = dao_contract.deposit(
              USDC_CONTRACT_ADDRESS,
              priceOfNftConverted,
              nftMetadata,
            );
            deposit_response.then((result) => {
              const data = {
                userAddress: userDetails,
                clubs: [
                  {
                    clubId: clubId,
                    isAdmin: 0,
                    // balance: depositAmountConverted,
                  },
                ],
              };
              const checkUserExists = checkUserByClub(userDetails, clubId);
              checkUserExists.then((result) => {
                if (result.data === false) {
                  const createuser = createUser(data);
                  createuser.then((result) => {
                    if (result.status !== 201) {
                      console.log("Error", result);
                      setAlertStatus("error");
                      setOpenSnackBar(true);
                    } else {
                      setAlertStatus("success");
                      setOpenSnackBar(true);
                      setLoading(false);
                      router.push(`/dashboard/${clubId}`, undefined, {
                        shallow: true,
                      });
                    }
                  });
                } else {
                  setLoading(false);
                  setAlertStatus("success");
                  setMessage("NFT minted successfully");
                  router.push(`/dashboard/${clubId}`, undefined, {
                    shallow: true,
                  });
                }
              });
            });
          },
          (error) => {
            // console.log("Error", error);
            setAlertStatus("error");
            setMessage(error.message);
            setLoading(false);
            setOpenSnackBar(true);
          },
        )
        .catch((err) => {
          setAlertStatus("error");
          setMessage(err.message);
          setLoading(false);
          setOpenSnackBar(true);
        });
    } else {
      setAlertStatus("error");
      // console.log("wallet balance less", walletBalance, priceOfNftConverted);
      if (walletBalance < convertFromWei(priceOfNftConverted, 6)) {
        setMessage("usdc balance is less that mint price");
      } else setMessage("Mint Limit Reached");
      setOpenSnackBar(true);
    }
  };

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
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {tokenGatingAddress !==
                    "0x0000000000000000000000000000000000000000" && (
                    <>
                      {userTokenBalance < tokenGatingAmount ? (
                        <Typography sx={{ color: "red" }}>
                          This club is Token Gated. You don&apos;t qualify
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#3B7AFD" }}>
                          This club is Token Gated. You qualify
                        </Typography>
                      )}
                    </>
                  )}
                </Grid>
                <Grid item sx={{ width: "100%" }}>
                  <Grid container>
                    <Grid item xs={12} md={9}>
                      <Typography variant="h2" className={classes.clubName}>
                        {clubName}
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      {/* enter your code here */}

                      <div className="centerContent">
                        <div className="selfCenter spaceBetween">
                          <TwitterShareButton
                            onLoad={function noRefCheck() {}}
                            options={{
                              size: "large",
                              text: `Just joined ${clubName} Station on `,
                              via: "stationxnetwork",
                            }}
                            url={`https://test.stationx.network/join/${daoAddress}`}
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
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
