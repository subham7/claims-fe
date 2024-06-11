import BackdropLoader from "@components/common/BackdropLoader";
import { makeStyles, useTheme } from "@mui/styles";
import Image from "next/image";
import React from "react";
import { CHAIN_CONFIG } from "utils/constants";
import img from "../../../public/assets/images/wrong-network.png";
import { switchChain } from "@wagmi/core";
import { config } from "config";

const useStyles = makeStyles((theme) => ({
  modal: {
    width: "480px",
    background: "#111111",
    border: "1px solid #333333",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  btn: {
    width: "100%",
    textAlign: "center",
    padding: "10px",
    height: "45px",
    borderRadius: "100px",
    backgroundColor: "#EFEFEF",
    fontSize: "14px",
    color: "#1E1E1E",
    border: "none",
    fontWeight: "600",
    // marginTop: "20px",
    cursor: "pointer",
  },
  text: {
    width: "100%",
    fontSize: "28px",
    fontWeight: "600",
    color: "#EFEFEF",
  },
}));

const WrongNetworkModal = ({ chainId = "0x89" }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const switchNetworkHandler = async () => {
    await switchChain(config, {
      chainId: CHAIN_CONFIG[chainId].chainId,
    });
  };

  return (
    <>
      <BackdropLoader isOpen={true} showLoading={false}>
        <div className={classes.modal}>
          <div className={classes.text}>
            <p> Wrong network detected,</p>
            <p> Switch to continue.</p>
          </div>
          <Image src={img} alt="Wrong network" height={192} width={217} />

          <button className={classes.btn} onClick={switchNetworkHandler}>
            Switch to {CHAIN_CONFIG[chainId]?.shortName}
          </button>
        </div>
      </BackdropLoader>
    </>
  );
};

export default WrongNetworkModal;
