import { React, useEffect } from "react";
import { AppBar, Box, Toolbar, Button } from "@mui/material";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useConnectWallet } from "@web3-onboard/react";
import { addWalletAddress } from "../redux/reducers/user";

const useStyles = makeStyles({
  image: {
    height: "40px",
    width: "auto !important",
    zIndex: "99999 !important",
    position: "absolute",
    cursor: "pointer",
  },
});

export default function Navbar3(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const router = useRouter();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  // const { pid: daoAddress } = router.query;

  const walletAddress = wallet?.accounts[0].address;

  useEffect(() => {
    if (wallet) {
      dispatch(addWalletAddress(wallet ? walletAddress : null));
    }
  }, [dispatch, wallet, walletAddress]);

  // const handleFaucetRedirect = () => {
  //   window.open("/faucet", "_ blank");
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton> */}
          <Box sx={{ flexGrow: 1 }}>
            {/* <Link href={"/"}> */}
            <Image
              src="/assets/images/monogram.png"
              height="50"
              width="50"
              className={classes.image}
              alt="monogram"
              onClick={() => router.push(`/`)}
            />
            {/* </Link> */}
          </Box>
          {/* {props.faucet ? (
            <Button
              variant="primary"
              color="primary"
              sx={{ mr: 40, mt: 2 }}
              onClick={handleFaucetRedirect}
            >
              USDC Faucet
            </Button>
          ) : null} */}
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
              onClick={() => (wallet ? disconnect(wallet) : connect())}>
              Connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
