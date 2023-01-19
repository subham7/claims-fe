import {
  Button,
  Card,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useRef } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import Image from "next/image";
import empty_nft from "../../public/assets/icons/empty_nft.svg";
import { width } from "@mui/system";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    // margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px",
  },
  largeText: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  largeText1: {
    fontSize: "2.4vw",
    color: "#FFFFFF",
    fontFamily: "Whyte",
  },
  wrapTextIcon: {
    fontSize: "18px",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  smallText: {
    fontSize: "14px",
    fontFamily: "Whyte",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontSize: "14px",
    fontFamily: "Whyte",
  },
  boldText: {
    fontWeight: "bold",
    fontFamily: "Whyte",
  },
  uploadButton: {
    backgroundColor: "#111D38",
    color: "#3B7AFD",
    fontSize: "18px",
    width: "208px",
    fontFamily: "Whyte",
  },
  cardPadding: {
    margin: 8,
    padding: 0,
    borderRadius: "10px",
  },
  addCircleColour: {
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  large_button: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    fontFamily: "Whyte",
  },
  backButton: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    backgroundColor: "#FFFFFF",
    color: "#3B7AFD",
    fontFamily: "Whyte",
  },
  emptyImage: {
    height: "200px !important",
    width: "200px !important",
  },
  nftImage: {
    height: "400px !important",
    width: "400px !important",
  },
});

const ERC721NonTransferableStep2 = (props) => {
  const classes = useStyles();

  const {
    transferableMembership,
    setTransferableMembership,
    handleTransferableMembership,
    nftPrice,
    setNftPrice,
    limitSupply,
    setLimitSupply,
    mintLimit,
    setMintLimit,
    tokenSupply,
    setTokenSupply,
    depositClose,
    setDepositClose,
    handleChange,
    selectedImage,
    setSelectedImage,
    imageUrl,
    setImageUrl,
    uploadInputRef,
    activeStep,
    handleNext,
  } = props;

  const generateRandomNFTImage = () => {
    const randInt = Math.floor(Math.random() * (15 - 1 + 1) + 1);
    console.log("random Image", randInt);
    setImageUrl(`/assets/NFT_IMAGES/${randInt}.png`);
    setSelectedImage(null);
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} mt={8}>
          <Typography className={classes.largeText1}>
            Set Token Rules
          </Typography>

          <Typography className={classes.largeText} mt={3} mb={2}>
            All parameters (except token name, symbol & art) are modifiable
            later by raising proposals.
          </Typography>
          <br />
          <Typography className={classes.largeText} mt={3} mb={2}>
            Artwork
          </Typography>
          {/* upload image card */}
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "start",
                }}
                mt={6}
                spacing={3}
              >
                <Typography
                  className={classes.largeText}
                  color="white !important"
                  mb={2}
                >
                  How do you want to set an image?
                </Typography>

                <Grid container spacing={2} mb={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      sx={{ fontWeight: "light" }}
                      onClick={generateRandomNFTImage}
                    >
                      Generate random
                    </Button>
                  </Grid>
                  <Grid item>
                    {/* <input type="text" /> */}

                    <Button
                      startIcon={<UploadIcon />}
                      sx={{
                        "fontWeight": "light",
                        "backgroundColor": "#81F5FF",
                        "color": "#3B7AFD",
                        ":hover": {
                          backgroundColor: "#81F5FF",
                        },
                      }}
                      onClick={(e) => {
                        uploadInputRef.current.click();
                      }}
                    >
                      Upload
                    </Button>
                    <input
                      accept="image/*"
                      type="file"
                      id="select-image"
                      style={{ display: "none" }}
                      ref={uploadInputRef}
                      onChange={(e) => {
                        setSelectedImage(e.target.files[0]);
                        setImageUrl(null);
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography
                  variant="subtitle2"
                  color="#6475A3"
                  sx={{ fontWeight: "light" }}
                  // mx={2}
                >
                  This image can’t be changed after your station is created.
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "400px",
                  borderRadius: "10px",
                  backgroundColor: "#19274B",
                }}
                mr={3}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={selectedImage ? selectedImage.name : ""}
                    // className={imageUrl ? classes.nftImage : classes.emptyImage}
                    // layout="fill"
                    height="400px"
                    width="400px"
                    sx={{ borderRadius: "10px" }}
                  />
                ) : (
                  <Image
                    src={empty_nft}
                    alt={selectedImage ? selectedImage.name : ""}
                    className={classes.emptyImage}
                    // layout="fill"
                    // height="400px"
                    // width="400px"
                    sx={{ borderRadius: "10px" }}
                  />
                )}
              </Grid>
            </Grid>
          </Card>
          <br />
          <Typography className={classes.largeText} mt={3} mb={2} mx={1}>
            Token Rules
          </Typography>

          {/* Membership transfer input */}
          <Card className={classes.cardPadding} my={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.largeText}
                  //   sx={{ color: "#FFFFFF" }}
                  color="white !important"
                >
                  Make membership transferable
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mr={3}
              >
                <Switch
                  checked={transferableMembership}
                  onChange={() =>
                    setTransferableMembership(!transferableMembership)
                  }
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* price of nft input */}
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.largeText}
                  //   sx={{ color: "#FFFFFF" }}
                  color="white !important"
                >
                  Set price per NFT (in USDC)
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mr={3}
              >
                <TextField
                  error={nftPrice === ""}
                  className={classes.textField}
                  type="number"
                  label="price"
                  variant="outlined"
                  onChange={(e) => setNftPrice(e.target.value)}
                  value={nftPrice}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">USDC</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* max mints allowed per wallet input */}
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.largeText}
                  //   sx={{ color: "#FFFFFF" }}
                  color="white !important"
                >
                  Max. mints allowed per wallet
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mr={3}
              >
                <TextField
                  error={mintLimit === ""}
                  className={classes.textField}
                  type="number"
                  // label="price"
                  variant="outlined"
                  onChange={(e) => setMintLimit(e.target.value)}
                  value={mintLimit}
                />
              </Grid>
            </Grid>
          </Card>

          {/* limit token supply input */}
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.largeText}
                  //   sx={{ color: "#FFFFFF" }}
                  color="white !important"
                >
                  Limit total supply of the token
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mr={3}
              >
                <Switch
                  checked={limitSupply}
                  onChange={() => setLimitSupply(!limitSupply)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* set total token supply input */}
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.largeText}
                  color="white !important"
                >
                  Set total token supply
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mr={3}
              >
                <TextField
                  error={tokenSupply === ""}
                  className={classes.textField}
                  type="number"
                  placeholder="-"
                  // label="price"
                  variant="outlined"
                  onChange={(e) => setTokenSupply(e.target.value)}
                  value={tokenSupply}
                />
              </Grid>
            </Grid>
          </Card>

          {/* accept deposits till x date input */}
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  className={classes.largeText}
                  color="white !important"
                >
                  Last date to close deposits
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                mr={3}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    error={depositClose === null}
                    inputFormat="dd/MM/yyyy"
                    value={depositClose}
                    onChange={(e) => handleChange(e)}
                    renderInput={(params) => (
                      <TextField
                        onKeyDown={(e) => e.preventDefault()}
                        place
                        {...params}
                        sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                      />
                    )}
                    minDate={depositClose}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
          <Typography variant="subtitle" color="#6475A3" sx={{}} mx={2}>
            If you don’t limit the supply of your club token, your supply will
            be unlimited until the date deposits are open.
          </Typography>
        </Grid>
        <Grid
          container
          wrap="nowrap"
          spacing={0}
          justify="center"
          alignItems="center"
          direction="row"
          ml={4}
        >
          <Grid item xs={0} mt={2}>
            <Button
              variant="wideButton"
              disabled={
                activeStep === 1
                  ? !imageUrl ||
                    !nftPrice ||
                    !mintLimit ||
                    !tokenSupply ||
                    !depositClose
                  : false
              }
              onClick={handleNext}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ERC721NonTransferableStep2;
