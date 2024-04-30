import { Box, CssBaseline, Grid, Typography } from "@mui/material";
import { useAccount, useChainId } from "wagmi";
import useClubFetch from "hooks/useClubFetch";
import { makeStyles } from "@mui/styles";
import Navbar from "@components/ui/Navbar/Navbar";
import Sidebar from "@components/ui/Sidebar/Sidebar";

import CustomAlert from "@components/common/CustomAlert";
import { showWrongNetworkModal } from "utils/helper";
import { useRouter } from "next/router";
import WrongNetworkModal from "@components/modals/WrongNetworkModal";

const drawerWidth = 50;

const useStyles = makeStyles({
  container: {
    padding: "0 10px 0px 10px",
    marginTop: "80px",
  },
});

export default function Layout(props) {
  const { showSidebar = true, daoAddress, networkId: routeNetworkId } = props;
  useClubFetch({ daoAddress, routeNetworkId: routeNetworkId });
  const { address: walletAddress } = useAccount();
  const chain = useChainId();

  const networkId = "0x" + chain?.toString(16);
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      <div>
        <Navbar daoAddress={daoAddress} routeNetworkId={routeNetworkId} />
        {showSidebar && (
          <Sidebar daoAddress={daoAddress} networkId={networkId} />
        )}
      </div>

      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {!router.pathname.includes("join") &&
        !router.pathname.includes("profile") &&
        (!walletAddress || !networkId) ? (
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
              <w3m-connect-button />
            </Grid>
          </Grid>
        ) : (
          <>
            {!router.pathname.includes("join") &&
            !router.pathname.includes("profile") &&
            showWrongNetworkModal(
              networkId,
              routeNetworkId,
              router.pathname.includes("claim"),
            ) ? (
              <WrongNetworkModal chainId={routeNetworkId} />
            ) : (
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
            )}
          </>
        )}
        <CustomAlert />
      </Box>
    </>
  );
}
