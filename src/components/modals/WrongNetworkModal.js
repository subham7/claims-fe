import { makeStyles } from "@mui/styles";
import Image from "next/image";
import React from "react";
import { CHAIN_IDs } from "utils/constants";
import Web3 from "web3";
import img from "../../../public/assets/images/wrongNetwork.png";

const Backdrop = () => {
  const classes = useStyles();
  return <div className={classes.backdrop}></div>;
};

const useStyles = makeStyles({
  backdrop: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    background: "#000000",
    opacity: 0.85,
    zIndex: 2000,
  },
  modal: {
    width: "450px",
    background: "#111D38",
    // border: "1px solid #6475A3",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  btn: {
    width: "200px",
    textAlign: "center",
    padding: "10px",
    borderRadius: "50px",
    backgroundColor: "#B85286",
    fontSize: "18px",
    color: "#fff",
    border: "none",
    // marginTop: "20px",
    cursor: "pointer",
  },
  text: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "400",
    padding: 0,
    margin: 0,
    color: "#fff",
  },
});

const WrongNetworkModal = ({ chainId = 137 }) => {
  const classes = useStyles();

  const switchNetworkHandler = async () => {
    if (typeof window !== "undefined") {
      if (window.ethereum.networkVersion !== chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(chainId) }],
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            if (chainId === 137) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainName: "Polygon Mainnet",
                    chainId: Web3.utils.toHex(chainId),
                    nativeCurrency: {
                      name: "MATIC",
                      decimals: 18,
                      symbol: "MATIC",
                    },
                    rpcUrls: ["https://polygon-rpc.com/"],
                  },
                ],
              });
            } else if (chainId === 8453) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainName: "Base Mainnet",
                    chainId: Web3.utils.toHex(chainId),
                    nativeCurrency: {
                      name: "Base ETH",
                      decimals: 18,
                      symbol: "ETH",
                    },
                    rpcUrls: ["https://mainnet.base.org"],
                  },
                ],
              });
            } else if (chainId === 42161) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainName: "Arbitrum One",
                    chainId: Web3.utils.toHex(chainId),
                    nativeCurrency: {
                      name: "ETH",
                      decimals: 18,
                      symbol: "ETH",
                    },
                    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
                  },
                ],
              });
            }
          }
        }
      }
    }
  };

  return (
    <>
      <Backdrop />
      <div className={classes.modal}>
        <p className={classes.text}>
          Oops! Looks like you’re on a different network.
        </p>
        <Image src={img} alt="Wrong network" height={136} width={160} />

        <button className={classes.btn} onClick={switchNetworkHandler}>
          Switch to {CHAIN_IDs[chainId]}
        </button>
      </div>
    </>
  );
};

export default WrongNetworkModal;
