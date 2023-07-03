import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import UploadIcon from "@mui/icons-material/Upload";
import Image from "next/image";
import empty_nft from "../../../public/assets/icons/empty_nft.svg";
import { useEffect, useState } from "react";

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

export default function NFTStep2(props) {
  const classes = useStyles();
  const [isVideo, setIsVideo] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (props.formik.values.nftImage) {
      if (props.formik.values.nftImage.type.includes("mp4")) {
        setIsVideo(true);
      } else {
        setIsVideo(false);
      }
      setImageUrl(URL.createObjectURL(props.formik.values.nftImage));
    }
  }, [props.formik.values.nftImage]);

  const generateRandomNFTImage = async () => {
    const randInt = Math.floor(Math.random() * (15 - 1 + 1) + 1);
    const imageUrl = `/assets/NFT_IMAGES/${randInt}.png`;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], imageUrl, {
      type: blob.type,
    });
    props.formik.setFieldValue("nftImage", file);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={12} mt={4}>
        <Typography className={classes.largeText1}>Set Token Rules</Typography>

        <Typography className={classes.largeText} mt={3} mb={2}>
          All parameters (except token name, symbol & art) are modifiable later
          by raising proposals.
        </Typography>
        <br />
        <Typography className={classes.largeText} mb={2}>
          Artwork
        </Typography>

        {/* Image input card */}
        <Card className={classes.cardPadding}>
          <Grid container p={2}>
            <Grid
              item
              xs
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-between",
              }}
              mt={6}
              spacing={3}>
              <Typography
                className={classes.largeText}
                color="white !important"
                mb={2}>
                Upload Image
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    sx={{ fontWeight: "light", minWidth: "180px" }}
                    onClick={generateRandomNFTImage}>
                    Generate random
                  </Button>
                </Grid>
                <Grid item>
                  {/* <input type="text" /> */}

                  <Button
                    startIcon={<UploadIcon />}
                    variant="contained"
                    sx={{
                      fontWeight: "light",
                      minWidth: "180px",
                    }}
                    onClick={(e) => {
                      props.uploadInputRef.current.click();
                    }}>
                    Upload
                  </Button>
                  <input
                    name="nftImage"
                    accept="image/*,video/mp4"
                    type="file"
                    id="select-image"
                    style={{ display: "none" }}
                    ref={props.uploadInputRef}
                    onChange={(event) => {
                      props.formik.setFieldValue(
                        "nftImage",
                        event.currentTarget.files[0],
                      );
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
              sx={{
                height: "300px",
                width: "300px",
                borderRadius: "10px",
                backgroundColor: "#19274B",
              }}>
              {isVideo ? (
                <video
                  muted
                  loop
                  autoPlay
                  style={{
                    height: "300px",
                    width: "300px",
                    borderRadius: "10px",
                  }}>
                  <source src={imageUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={imageUrl || empty_nft}
                  alt={""}
                  // className={classes.emptyImage}
                  width={300}
                  height={300}
                  // fill
                  style={{ borderRadius: "10px" }}
                  // sx={{  width: "100%", height: "100%" }}
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
              }}>
              <Typography
                className={classes.largeText}
                //   sx={{ color: "#FFFFFF" }}
                color="white !important">
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
              mr={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.formik.values.isNftTransferable}
                    // onChange={handleOperationTypeChange}
                    onChange={(value) => {
                      props.formik.setFieldValue(
                        "isNftTransferable",
                        value.target.checked,
                      );
                    }}
                  />
                }
                label="NO / YES"
                labelPlacement="top"
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
              }}>
              <Typography
                className={classes.largeText}
                //   sx={{ color: "#FFFFFF" }}
                color="white !important">
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
              mr={3}>
              <TextField
                name="pricePerToken"
                className={classes.textField}
                type="number"
                placeholder="Ex:10"
                variant="outlined"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                value={props.formik.values.pricePerToken}
                error={
                  props.formik.touched.pricePerToken &&
                  Boolean(props.formik.errors.pricePerToken)
                }
                helperText={
                  props.formik.touched.pricePerToken &&
                  props.formik.errors.pricePerToken
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ color: "#C1D3FF" }}>
                      USDC
                    </InputAdornment>
                  ),
                }}
                onWheel={(event) => event.target.blur()}
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
              }}>
              <Typography
                className={classes.largeText}
                //   sx={{ color: "#FFFFFF" }}
                color="white !important">
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
              mr={3}>
              <TextField
                name="maxTokensPerUser"
                type="number"
                className={classes.textField}
                label="Eg: 100"
                variant="outlined"
                onChange={props.formik.handleChange}
                onBlur={props.formik.handleBlur}
                value={props.formik.values.maxTokensPerUser}
                error={
                  props.formik.touched.maxTokensPerUser &&
                  Boolean(props.formik.errors.maxTokensPerUser)
                }
                helperText={
                  props.formik.touched.maxTokensPerUser &&
                  props.formik.errors.maxTokensPerUser
                }
                onWheel={(event) => event.target.blur()}
              />
            </Grid>
          </Grid>
        </Card>

        {/* limit token supply input */}
        <Card className={classes.cardPadding} my={2}>
          <Grid container pl={3} pr={1} mt={1} mb={1}>
            <Grid
              item
              xs
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}>
              <Typography
                className={classes.largeText}
                //   sx={{ color: "#FFFFFF" }}
                color="white !important">
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
              mr={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={props.formik.values.isNftTotalSupplylimited}
                    // onChange={handleOperationTypeChange}
                    onChange={(value) => {
                      props.formik.setFieldValue(
                        "isNftTotalSupplylimited",
                        value.target.checked,
                      );
                    }}
                  />
                }
                label="NO / YES"
                labelPlacement="top"
              />
            </Grid>
          </Grid>
        </Card>

        {props.formik.values.isNftTotalSupplylimited && (
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={1} mb={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}>
                <Typography
                  className={classes.largeText}
                  color="white !important">
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
                mr={3}>
                <TextField
                  name="totalTokenSupply"
                  className={classes.textField}
                  type="number"
                  placeholder="Ex:200"
                  variant="outlined"
                  onChange={props.formik.handleChange}
                  onBlur={props.formik.handleBlur}
                  value={props.formik.values.totalTokenSupply}
                  error={
                    props.formik.touched.totalTokenSupply &&
                    Boolean(props.formik.errors.totalTokenSupply)
                  }
                  helperText={
                    props.formik.touched.totalTokenSupply &&
                    props.formik.errors.totalTokenSupply
                  }
                  onWheel={(event) => event.target.blur()}
                />
              </Grid>
            </Grid>
          </Card>
        )}

        <Card className={classes.cardPadding} mb={2}>
          <Grid container pl={3} py={1}>
            <Grid
              item
              xs
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}>
              <Typography
                className={classes.largeText}
                color="white !important">
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
              mr={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={props.formik.values.depositClose}
                  minDateTime={dayjs(Date.now())}
                  onChange={(value) => {
                    props.formik.setFieldValue("depositClose", value);
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Card>
        <Typography variant="subtitle" color="#6475A3">
          If you don’t limit the supply of your club token, your supply will be
          unlimited until the date deposits are open.
        </Typography>
      </Grid>
    </Grid>
  );
}
