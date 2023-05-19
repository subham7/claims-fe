import { React, useEffect, useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { makeStyles } from "@mui/styles";

import { useRouter } from "next/router";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
    zIndex: "2000",
  },
  navbarText: {
    flexGrow: 1,
    fontSize: "18px",
    color: "#C1D3FF",
  },
  navButton: {
    borderRadius: "10px",
    width: "327px",
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
      <AppBar position="static" sx={{ position: "fixed" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Image
              src="/assets/images/monogram.png"
              height="40"
              width="40"
              className={classes.image}
              alt="monogram"
            />
          </Box>

          {props.page === 1 ? (
            <div style={{ marginRight: "330px", marginTop: "10px" }}>
              <Button
                variant="primary"
                color="primary"
                sx={{ mr: 2, mt: 2 }}
                onClick={handleDepositRedirect}
              >
                Deposit
              </Button>
              {/* <Button
                variant="primary"
                color="primary"
                sx={{ mr: 2, mt: 2 }}
                onClick={handleFaucetRedirect}
              >
                USDC Faucet
              </Button> */}
            </div>
          ) : null}
          {connecting ? (
            <Button sx={{ mr: 2, mt: 2 }} className={classes.navButton}>
              Connecting
            </Button>
          ) : wallet ? (
            <></>
          ) : (
            <Button
              sx={{ mr: 2, mt: 2 }}
              className={classes.navButton}
              onClick={() => (wallet ? disconnect(wallet) : connect())}
            >
              Connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
