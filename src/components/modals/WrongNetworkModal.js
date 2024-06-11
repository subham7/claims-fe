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
          <div className="text-[#EFEFEF] text-[28px] font-semibold w-full">
            <p> Wrong network detected,</p>
            <p> Switch to continue.</p>
          </div>
          <Image src={img} alt="Wrong network" height={192} width={217} />

          <button
            className="w-full h-[45px] bg-[#EFEFEF] cursor-pointer text-[14px] font-semibold text-[#1E1E1E] border-transparent rounded-[100px] "
            onClick={switchNetworkHandler}>
            Switch to {CHAIN_CONFIG[chainId]?.shortName}
          </button>
        </div>
      </BackdropLoader>
    </>
  );
};

export default WrongNetworkModal;
