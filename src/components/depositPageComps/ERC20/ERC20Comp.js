import React from "react";
import {
  Backdrop,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

const ERC20Comp = ({
  wallet,
  imageFetched,
  imageUrl,
  apiTokenDetailSet,
  tokenAPIDetails,
  tokenDetails,
  dataFetched,
  walletConnected,
  governorDataFetched,
  depositCloseDate,
  depositAmount,
  depositInitiated,
  maxDeposit,
  handleMaxButtonClick,
  handleInputChange,
  handleDeposit,
  handleConnectWallet,
  handleDialogClose,
  handleSwitchNetwork,
  closingDays,
  open,
  minDeposit,
  maxDeposit,
  members,
  clubTokenMinted,
  tokenSymbol,
  totalDeposit,
  walletBalance,
}) => {
  return (
    <>
      {wallet !== null ? (
        <Grid
          container
          spacing={2}
          paddingLeft={10}
          paddingTop={15}
          paddingRight={10}
        >
          <Grid item md={7}>
            <Card className={classes.cardRegular}>
              <Grid container spacing={2}>
                <Grid item mt={3} ml={3}>
                  <img
                    src={imageFetched ? imageUrl : null}
                    alt="club-image"
                    width="100vw"
                  />
                </Grid>
                <Grid item ml={1} mt={4} mb={7}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {apiTokenDetailSet ? (
                        tokenAPIDetails[0].name
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                    <Typography variant="h6" className={classes.dimColor}>
                      {dataFetched ? "$" + tokenDetails[1] : null}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Divider variant="middle" />
              <Grid container spacing={7}>
                <Grid item ml={4} mt={5} md={3}>
                  <Typography variant="p" className={classes.valuesDimStyle}>
                    {walletConnected ? (
                      "Deposits deadline"
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                  <Grid container mt={2} direction="row">
                    <Grid item>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {governorDataFetched ? (
                          new Date(parseInt(depositCloseDate) * 1000)
                            ?.toJSON()
                            ?.slice(0, 10)
                            .split("-")
                            .reverse()
                            .join("/")
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item ml={1}>
                      {walletConnected ? (
                        governorDataFetched ? (
                          closingDays > 0 ? (
                            <Card className={classes.openTag}>
                              <Typography className={classes.openTagFont}>
                                Open
                              </Typography>
                            </Card>
                          ) : (
                            <Card className={classes.closeTag}>
                              <Typography className={classes.closeTagFont}>
                                Closed
                              </Typography>
                            </Card>
                          )
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item ml={4} mt={5} md={3}>
                  <Grid container>
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}
                      >
                        {walletConnected ? (
                          "Minimum Deposits"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item mt={2}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {governorDataFetched ? (
                          minDeposit + " USDC"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item ml={4} mt={5} md={3}>
                  <Grid container>
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}
                      >
                        {walletConnected ? (
                          "Maximum Deposit"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item mt={2}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {governorDataFetched ? (
                          maxDeposit + " USDC"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}{" "}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container mt={5}>
                <Grid item ml={4} md={3}>
                  <Grid item>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletConnected ? (
                        "Governance"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item mt={2}>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {walletConnected ? (
                        "By Voting"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item ml={5} md={3}>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}
                      >
                        {walletConnected ? (
                          "Members"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item mt={2}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {walletConnected ? (
                          members
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item ml={3} mt={5} mb={2} mr={3}>
            {walletConnected ? (
              <ProgressBar
                value={
                  governorDataFetched
                    ? calculateTreasuryTargetShare(
                        clubTokenMinted,
                        convertAmountToWei(governorDetails[4]),
                      )
                    : 0
                }
              />
            ) : (
              <Skeleton variant="rectangular" />
            )}
          </Grid> */}
              <br />
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item ml={4} mt={1} mb={2} md={8}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}
                      >
                        {walletConnected ? (
                          "Club Tokens Minted so far"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {walletConnected ? (
                          parseInt(clubTokenMinted) + " $" + tokenSymbol
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item mt={1} mb={2} mr={3} direction="row">
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}
                      >
                        {walletConnected ? (
                          "Total Supply"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {governorDataFetched ? (
                          totalDeposit + (" $" + tokenSymbol)
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}{" "}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item md={5}>
            {walletConnected ? (
              <Card className={classes.cardJoin}>
                <Grid container spacing={2}>
                  <Grid item ml={2} mt={4} mb={4} className={classes.JoinText}>
                    <Typography variant="h4">Join this Club</Typography>
                  </Grid>
                  <Divider />
                  <Grid
                    item
                    ml={1}
                    mt={4}
                    mb={4}
                    mr={2}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography variant="h6" className={classes.JoinText}>
                      {governorDataFetched
                        ? closingDays > 0
                          ? "Closes in " + closingDays + " days"
                          : "Joining Closed"
                        : 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider variant="middle" sx={{ bgcolor: "#3B7AFD" }} />
                <Grid container spacing={2}>
                  <Grid item md={12} mt={2}>
                    <Card className={classes.cardSmall}>
                      <Grid container spacing={2}>
                        <Grid item ml={2} mt={2} mb={0}>
                          <Typography className={classes.cardSmallFont}>
                            USDC
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          ml={2}
                          mt={2}
                          mb={0}
                          xs
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Typography className={classes.cardSmallFont}>
                            Balance: {walletBalance} USDC
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item ml={2} mt={1} mb={2} p={1}>
                          <Input
                            type="number"
                            error={depositAmount <= 0}
                            className={classes.cardLargeFont}
                            placeholder="0"
                            value={depositAmount}
                            onChange={(e) => handleInputChange(e.target.value)}
                            disabled={closingDays > 0 ? false : true}
                            inputProps={{ style: { fontSize: "1em" } }}
                            InputLabelProps={{ style: { fontSize: "1em" } }}
                          />
                        </Grid>
                        <Grid
                          item
                          ml={2}
                          mt={1}
                          mb={1}
                          xs
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            className={classes.maxTag}
                            onClick={handleMaxButtonClick}
                          >
                            Max
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={12} mt={2}>
                    <Card className={classes.cardWarning}>
                      <Typography className={classes.JoinText}>
                        Clubs can have same names or symbols, please make sure
                        to trust the sender for the link before depositing.
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item container ml={1} mt={1} mb={1}>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleDeposit}
                      disabled={
                        (closingDays > 0 ? false : true) ||
                        (depositAmount <= 0 ? true : false)
                      }
                    >
                      Deposit
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ) : (
              <Card className={classes.cardJoin} height={"full"}>
                <>
                  <Grid
                    flex
                    flexDirection="column"
                    container
                    justifyContent={"space-between"}
                    height={"100%"}
                  >
                    <Grid margin={"25px"}>
                      <Typography className={classes.JoinText}>
                        {" "}
                        Join this station by depositing your funds{" "}
                      </Typography>
                    </Grid>
                    <Grid sx={{ display: "flex", flexDirection: "row" }}>
                      <Grid mt={"300px"} ml={4}>
                        <Button variant="primary" onClick={handleConnectWallet}>
                          Connect
                        </Button>
                      </Grid>
                      <Grid mt={"50px"}>
                        <CardMedia
                          image="/assets/images/joinstation.png"
                          component="img"
                          alt="ownership_share"
                          className={classes.media}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              </Card>
            )}
          </Grid>
        </Grid>
      ) : (
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
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" color={"white"} fontWeight="bold">
                Please connect your wallet
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      {/* 
    <Snackbar
      open={openSnackBar}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {alertStatus === "success" ? (
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Transaction Successfull!
        </Alert>
      ) : (
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Transaction Failed!
        </Alert>
      )}
    </Snackbar> */}
      <Dialog
        open={open}
        onClose={handleDialogClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ overflow: "hidden", backgroundColor: "#19274B" }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            mt={3}
          >
            <Grid item pl={15}>
              <img src="/assets/images/connected_world_wuay.svg" width="80%" />
            </Grid>
            <Grid item m={3}>
              <Typography className={classes.dialogBox}>
                You are in the wrong network, please switch to the correct
                network by clicking the button provided below
              </Typography>
            </Grid>
            <Grid item m={3}>
              <Button
                variant="primary"
                onClick={() => {
                  handleSwitchNetwork();
                }}
              >
                Switch Network
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={depositInitiated}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ERC20Comp;
