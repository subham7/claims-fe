import { React } from "react";
import { AppBar, Box, Toolbar, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useRouter } from "next/router";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
    zIndex: "2000",
    cursor: "pointer",
  },
  navbarText: {
    flexGrow: 1,
    fontSize: "18px",
    color: "#C1D3FF",
  },
  navButton: {
    borderRadius: "10px",
    height: "auto",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    opacity: "1",
    fontSize: "18px",
  },
});

export default function Navbar2(props) {
  const router = useRouter();
  const { clubId: daoAddress } = router.query;
  const classes = useStyles();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const handleDepositRedirect = () => {
    router.push(
      `${window.origin}/join/${Web3.utils.toChecksumAddress(daoAddress)}`,
      undefined,
      { shallow: true },
    );
  };

  const handleFaucetRedirect = () => {
    window.open("/faucet", "_ blank");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          {connecting ? (
            <Button sx={{ mt: 2 }} className={classes.navButton}>
              Connecting
            </Button>
          ) : wallet ? (
            <></>
          ) : (
            <Button
              sx={{ mt: 2 }}
              className={classes.navButton}
              onClick={() => (wallet ? disconnect(wallet) : connect())}>
              Connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
