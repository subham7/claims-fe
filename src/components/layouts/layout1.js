import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import Button from "@components/ui/button/Button";
import { useConnectWallet } from "@web3-onboard/react";
import { makeStyles } from "@mui/styles";
import { showWrongNetworkModal } from "utils/helper";
import { useDispatch } from "react-redux";
import { addWalletAddress } from "redux/reducers/user";

const drawerWidth = 50;

const useStyles = makeStyles({
  navButton: {
    borderRadius: "10px",
    height: "auto",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    opacity: "1",
    fontSize: "18px",
  },
});

export default function Layout1(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showSidebar = true } = props;
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const networkId = wallet?.chains[0].id;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet) {
      dispatch(addWalletAddress(wallet.accounts[0].address));
    } else {
      dispatch(addWalletAddress(""));
    }
  }, [wallet]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar
          showSidebar={showSidebar}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          page={props.page}
        />

        {!wallet ? (
          <Grid
            sx={{
              height: "95vh",
            }}
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid item mt={4}>
              <Typography
                sx={{
                  fontSize: "2.3em",
                  fontFamily: "Whyte",
                  color: "#F5F5F5",
                }}>
                Connect your wallet to StationX 🛸
              </Typography>
            </Grid>
            {/* <Grid item mt={1}>
              <Typography variant="regularText">
                You’re all set! Connect wallet to join this Station 🛸
              </Typography>
            </Grid> */}

            <Grid item mt={3}>
              {connecting ? (
                <Button
                  // sx={{ mt: 2, position: "fixed", right: 16 }}
                  className={classes.navButton}>
                  Connecting
                </Button>
              ) : wallet ? (
                <></>
              ) : (
                <Button
                  // sx={{ mt: 2, position: "fixed", right: 16 }}
                  className={classes.navButton}
                  onClick={() => (wallet ? disconnect(wallet) : connect())}>
                  Connect wallet
                </Button>
              )}
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
              <div style={{ padding: "12px 32px 0px 40px" }}>
                {props.children}
              </div>
            </Box>
            {showWrongNetworkModal(wallet, networkId)}
          </>
        )}
      </Box>
    </>
  );
}
