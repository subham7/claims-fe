import { React, useState } from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
  IconButton,
  Card,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { fetchTokenMetaData } from "../api/assets";

const useStyles = makeStyles({
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  addCircleColour: {
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  card3text3: {
    fontFamily: "Whyte",
    width: "354px",
    color: "#C1D3FF",
  },
});

const TokenSearch = (props) => {
  const classes = useStyles();
  const [tokenDetails, setTokenDetails] = useState(null);
  const activeNetworkId = useSelector((state) => {
    return state.gnosis.networkHex;
  });
  const [tokenObtained, setTokenObtained] = useState(false);
  const [tokenSearched, setTokenSearched] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);

  const handleSearch = () => {
    props.setLoaderOpen(true);
    setTokenSearched(true);
    if (tokenAddress && activeNetworkId) {
      const tokenFetchAPICall = fetchTokenMetaData(
        tokenAddress,
        activeNetworkId,
      );
      tokenFetchAPICall.then(
        (result) => {
          if (result.status !== 200) {
            setTokenObtained(false);
            props.setLoaderOpen(false);
          } else {
            setTokenDetails(result.data);
            props.setSearchTokenAddress(result.data[0].address);
            setTokenObtained(true);
            props.setLoaderOpen(false);
          }
        },
        (error) => {
          setTokenObtained(false);
          props.setLoaderOpen(false);
        },
      );
    }
  };
  return (
    <Dialog
      open={props.tokenSearchOpen}
      onClose={props.tokenSearchClose}
      scroll="body"
      PaperProps={{ classes: { root: classes.modalStyle } }}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent sx={{ overflow: "hidden", backgroundColor: "#19274B" }}>
        <Grid container>
          <Grid item m={3}>
            <Typography className={classes.dialogBox}>Search token</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} ml={2} mr={2}>
          <Grid item>
            <TextField
              sx={{
                width: 443,
                borderRadius: "10px",
              }}
              placeholder="Enter token address"
              value={props.searchTokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
            />
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
            <IconButton aria-label="add" onClick={handleSearch}>
              <SearchIcon className={classes.addCircleColour} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container item m={3}>
          {tokenSearched ? (
            tokenObtained && tokenDetails ? (
              <Card>
                <Grid container ml={3} mt={2}>
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Typography variant="textLink">
                          {tokenDetails[0].name}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="textLink">
                          {tokenDetails[0].symbol}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="regularText5">
                          {/* {tokenDetails[0].token_address} */}
                        </Typography>
                      </Grid>
                    </Grid>
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
                    <IconButton
                      aria-label="add"
                      onClick={(e) => {
                        props.handleTokenInputChange(tokenDetails[0].address);
                        props.handleSetTokenType(tokenDetails[0].contract_type);
                      }}
                    >
                      <AddCircleOutlinedIcon
                        className={classes.addCircleColour}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </Card>
            ) : (
              <Grid container ml={3} mt={2}>
                <Grid item>
                  <Typography variant="textLink">Token not found!</Typography>
                </Grid>
              </Grid>
            )
          ) : null}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSearch;
