import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import { useAccount, useNetwork } from "wagmi";
import { Web3Button } from "@web3modal/react";
import useClubFetch from "hooks/useClubFetch";
import { showWrongNetworkModal } from "utils/helper";
import { makeStyles } from "@mui/styles";
import Navbar from "@components/ui/Navbar/Navbar";
import Sidebar from "@components/ui/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { forwardRef } from "react";
import { addAlertData } from "redux/reducers/general";

const drawerWidth = 50;

const useStyles = makeStyles({
  container: {
    padding: "12px 10px 0px 10px",
    marginTop: "80px",
  },
});

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Layout(props) {
  const { showSidebar = true, daoAddress, networkId: routeNetworkId } = props;
  useClubFetch({ daoAddress, networkId: routeNetworkId });
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const networkId = "0x" + chain?.id.toString(16);
  const classes = useStyles();
  const isAlertOpen = useSelector((state) => state.general.open);
  const severity = useSelector((state) => state.general.severity);
  const message = useSelector((state) => state.general.message);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      addAlertData({
        open: false,
        message: null,
        severity: null,
      }),
    );
  };

  return (
    <>
      <div>
        <Navbar />
        {showSidebar && (
          <Sidebar daoAddress={daoAddress} networkId={networkId} />
        )}
      </div>

      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {!walletAddress || !networkId ? (
          <Grid
            sx={{
              height: "75vh",
            }}
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid item mt={4}>
              <Typography
                sx={{
                  fontSize: "2.3em",

                  color: "#F5F5F5",
                }}>
                Connect your wallet to StationX 🛸
              </Typography>
            </Grid>
            <Grid item mt={3}>
              <Web3Button />
            </Grid>
          </Grid>
        ) : (
          <>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                paddingX: showSidebar ? "0px" : "60px",
              }}>
              <div
                className={classes.container}
                style={{
                  marginLeft: showSidebar ? "80px" : 0,
                }}>
                {props.children}
              </div>
            </Box>
            {showWrongNetworkModal(networkId, routeNetworkId)}
          </>
        )}
        {isAlertOpen && (
          <Snackbar
            open={isAlertOpen}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={severity}
              sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </>
  );
}
