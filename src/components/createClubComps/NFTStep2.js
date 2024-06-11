import {
  Card,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { Button, TextField } from "@components/ui";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import UploadIcon from "@mui/icons-material/Upload";
import Image from "next/image";
import empty_nft from "../../../public/assets/icons/empty_nft.svg";
import { useEffect, useState } from "react";
import { CHAIN_CONFIG } from "utils/constants";
import { getTokenSymbolFromAddress } from "utils/tokenHelper";

export default function NFTStep2(props) {
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
    <div className="f-d f-vt tb-pad-2 w-100">
      <Typography fontSize={24} fontWeight={600} variant="inherit">
        Contribution rules
      </Typography>
      <Typography
        fontSize={16}
        color={"#a0a0a0"}
        variant="info"
        className="text-light-gray tb-pad-1">
        Configure membership mint parameters for the station. Members mint their
        NFT by paying in USDC/USDT or native currency to join the station
      </Typography>

      <Typography fontWeight={600} variant="body" className="text-blue">
        Upload Artwork
      </Typography>

      {/* Image input card */}
      <Card>
        <div style={{ justifyContent: "space-between" }} className="f-d">
          <div className="f-d f-vt tb-pad-2">
            <Typography variant="body">Upload Image</Typography>

            <div className="f-d tb-pad-1" style={{ gap: "16px" }}>
              <Button variant="normal" onClick={generateRandomNFTImage}>
                Generate random
              </Button>
              <Button
                variant="normal"
                onClick={(e) => {
                  props.uploadInputRef.current.click();
                }}>
                <UploadIcon fontSize="8px" />
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
            </div>

            <Typography variant="info" className="text-light-gray">
              This image can’t be changed after your station is created.
            </Typography>
          </div>

          <div>
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
                width={300}
                height={300}
                style={{ borderRadius: "10px" }}
              />
            )}
          </div>
        </div>
      </Card>

      <br />

      <Typography variant="body" className="text-blue">
        Token Rules
      </Typography>

      {/* Membership transfer input */}
      <Card>
        <div className="f-d f-v-c f-h-sb">
          <Typography variant="body">Make membership transferable</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={props.formik.values.isNftTransferable}
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
        </div>
      </Card>

      <br />
      <Card>
        <div className="f-d f-v-c f-h-sb">
          <div>
            <Typography variant="body" className="text-blue">
              Deposit Token
            </Typography>
          </div>

          <FormControl sx={{ width: "50%" }}>
            <InputLabel id="demo-simple-select-label">Token</InputLabel>
            <Select
              labelId="depositToken-label"
              id="depositToken"
              name="depositToken"
              value={props.formik.values.depositToken}
              label="Token"
              onChange={props.formik.handleChange}>
              <MenuItem value={CHAIN_CONFIG[props.networkId].usdcAddress}>
                USDC
              </MenuItem>
              <MenuItem value={CHAIN_CONFIG[props.networkId].usdtAddress}>
                USDT
              </MenuItem>
              <MenuItem value={CHAIN_CONFIG[props.networkId].nativeToken}>
                {" "}
                {CHAIN_CONFIG[props.networkId].nativeCurrency.symbol}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </Card>

      <br />

      {/* price of nft input */}
      <Card>
        <div className="f-d f-v-c f-h-sb">
          <div>
            <Typography variant="body">Set price per NFT</Typography>
          </div>
          <div className="w-50">
            <TextField
              name="pricePerToken"
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
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="inherit" fontSize={16}>
                      1 ${props.tokenSymbol.toUpperCase()} ={" "}
                    </Typography>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" sx={{ color: "#dcdcdc" }}>
                    {getTokenSymbolFromAddress(props)}
                  </InputAdornment>
                ),
              }}
              onWheel={(event) => event.target.blur()}
            />
          </div>
        </div>
      </Card>

      <br />
      {/* limit token supply input */}
      <Card>
        <div className="f-d f-v-c f-h-sb">
          <Typography variant="body">
            Limit total supply of the token
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={props.formik.values.isNftTotalSupplylimited}
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
        </div>
      </Card>

      <br />

      {props.formik.values.isNftTotalSupplylimited && (
        <>
          <Card>
            <div className="f-d f-v-c f-h-sb">
              <div>
                <Typography variant="body">Set total token supply</Typography>
              </div>
              <div className="w-50">
                <TextField
                  name="totalTokenSupply"
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
              </div>
            </div>
          </Card>
          <br />
        </>
      )}

      {/* max mints allowed per wallet input */}
      <Card>
        <div className="f-d f-v-c f-h-sb">
          <div>
            <Typography variant="body">
              Max. mints allowed per wallet
            </Typography>
          </div>
          <div className="w-50">
            <TextField
              name="maxTokensPerUser"
              type="number"
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
          </div>
        </div>
      </Card>
      <br />

      <Card>
        <div className="f-d f-v-c f-h-sb">
          <Typography variant="body">Last date to close deposits</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={props.formik.values.depositClose}
              minDateTime={dayjs(Date.now()).locale("en")}
              onChange={(value) => {
                props.formik.setFieldValue("depositClose", value);
              }}
            />
          </LocalizationProvider>
        </div>
      </Card>

      <br />
      <Typography variant="info" className="text-light-gray">
        If you don’t limit the supply of your club token, your supply will be
        unlimited until the date deposits are open.
      </Typography>
    </div>
  );
}
