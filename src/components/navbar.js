import { React } from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  image: {
    height: "40px",
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

export default function Navbar() {
  const classes = useStyles();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const router = useRouter();
  const walletAddress = wallet?.accounts[0]?.address;

  if (wallet) {
    return;
  }

  return (
    <div>
      <>
        {router.pathname.includes("/join") && !walletAddress ? null : (
          <>
            {connecting ? (
              <Button
                sx={{ mt: 2, position: "fixed", right: 16 }}
                className={classes.navButton}>
                Connecting
              </Button>
            ) : wallet ? (
              <></>
            ) : (
              <Button
                sx={{ mt: 2, position: "fixed", right: 16 }}
                className={classes.navButton}
                onClick={() => (wallet ? disconnect(wallet) : connect())}>
                Connect wallet
              </Button>
            )}
          </>
        )}
      </>
    </div>
  );
}
