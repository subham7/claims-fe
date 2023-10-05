import BackdropLoader from "@components/common/BackdropLoader";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import React from "react";
import { CHAIN_CONFIG } from "utils/constants";
import { requestEthereumChain } from "utils/helper";
import img from "../../../public/assets/images/wrongNetwork.png";

const useStyles = makeStyles({
  modal: {
    width: "450px",
    background: "#0F0F0F",
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

const WrongNetworkModal = ({ chainId = "0x89" }) => {
  const classes = useStyles();

  const switchNetworkHandler = async () => {
    if (typeof window !== "undefined") {
      if (window.ethereum.networkVersion !== chainId) {
        try {
          await requestEthereumChain("wallet_switchEthereumChain", [
            { chainId: chainId },
          ]);
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902 && CHAIN_CONFIG[chainId]) {
            const chainConfig = CHAIN_CONFIG[chainId];
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId,
                  chainName: chainConfig.chainName,
                  rpcUrls: chainConfig.rpcUrls,
                },
              ],
            });
          }
        }
      }
    }
  };

  return (
    <>
      <BackdropLoader isOpen={true} showLoading={false}>
        <div className={classes.modal}>
          <p className={classes.text}>
            Oops! Looks like you’re on a different network.
          </p>
          <Image src={img} alt="Wrong network" height={136} width={160} />

          <button className={classes.btn} onClick={switchNetworkHandler}>
            Switch to {CHAIN_CONFIG[chainId]?.shortName}
          </button>
        </div>
      </BackdropLoader>
    </>
  );
};

export default WrongNetworkModal;
