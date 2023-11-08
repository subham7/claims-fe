import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import { useAccount, useNetwork } from "wagmi";
import { Web3Button } from "@web3modal/react";
import useClubFetch from "hooks/useClubFetch";
import { showWrongNetworkModal } from "utils/helper";
import { makeStyles } from "@mui/styles";
import Navbar from "@components/ui/Navbar/Navbar";
import Sidebar from "@components/ui/Sidebar/Sidebar";

const drawerWidth = 50;

const useStyles = makeStyles({
  container: {
    padding: "12px 10px 0px 10px",
    marginTop: "80px",
  },
});

export default function Layout(props) {
  const { showSidebar = true, daoAddress, networkId: routeNetworkId } = props;
  useClubFetch({ daoAddress, networkId: routeNetworkId });
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const classes = useStyles();

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
      </Box>
    </>
  );
}
