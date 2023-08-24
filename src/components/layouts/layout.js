import React, { useEffect, useState } from "react";
import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import { useDispatch } from "react-redux";
import { addWalletAddress } from "redux/reducers/user";
import { useAccount, useNetwork } from "wagmi";
import { Web3Button } from "@web3modal/react";
import useClubFetch from "hooks/useClubFetch";
import { showWrongNetworkModal } from "utils/helper";

const drawerWidth = 50;

export default function Layout(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showSidebar = true, daoAddress } = props;
  useClubFetch({ daoAddress });
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const dispatch = useDispatch();

  useEffect(() => {
    if (walletAddress) {
      dispatch(addWalletAddress(walletAddress));
    } else {
      dispatch(addWalletAddress(""));
    }
  }, [walletAddress]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {showSidebar && (
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
            page={props.page}
            daoAddress={daoAddress}
            networkId={networkId}
          />
        )}

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
              <div style={{ padding: "12px 32px 0px 40px" }}>
                {props.children}
              </div>
            </Box>
            {showWrongNetworkModal(
              walletAddress,
              networkId,
              props.isClaims,
              props.network,
            )}
          </>
        )}
      </Box>
    </>
  );
}
