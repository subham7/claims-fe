import { Box, CssBaseline } from "@mui/material";
import { useAccount, useChainId } from "wagmi";
import useClubFetch from "hooks/useClubFetch";
import { makeStyles } from "@mui/styles";
import Navbar from "@components/ui/Navbar/Navbar";
import Sidebar from "@components/ui/Sidebar/Sidebar";

import CustomAlert from "@components/common/CustomAlert";
import { showWrongNetworkModal } from "utils/helper";
import { useRouter } from "next/router";
import WrongNetworkModal from "@components/modals/WrongNetworkModal";
import ConnectWallet from "@components/ui/ConnectWallet/ConnectWallet";

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
      {networkId === "0xe708" && (
        <div>
          {/* <LineaSurgeBar /> */}
          {/* <div style={{ height: "40px" }}></div> */}
        </div>
      )}

      <div>
        <Navbar daoAddress={daoAddress} routeNetworkId={routeNetworkId} />
        {showSidebar && walletAddress && (
          <Sidebar daoAddress={daoAddress} networkId={routeNetworkId} />
        )}
      </div>

      <>
        {!router.pathname.includes("join") &&
        !router.pathname.includes("profile") &&
        (!walletAddress || !networkId) ? (
          <ConnectWallet />
        ) : (
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
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
                    width: "100vw",
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
            <CustomAlert />
          </Box>
        )}
      </>
    </>
  );
}
