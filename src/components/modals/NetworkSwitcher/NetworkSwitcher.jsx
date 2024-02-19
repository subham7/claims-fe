import { CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { CHAIN_CONFIG } from "utils/constants";
import classes from "./NetworkSwitcher.module.scss";
import { requestEthereumChain } from "utils/helper";
import { IoClose } from "react-icons/io5";
import Backdrop from "@components/common/Backdrop/Backdrop";

const NetworkSwitcher = ({ onClose, supportedNetworks }) => {
  const [loading, setLoading] = useState(false);

  const switchNetworkHandler = async (networkId) => {
    setLoading(true);
    if (typeof window !== "undefined") {
      if (window?.ethereum?.networkVersion !== networkId) {
        try {
          await requestEthereumChain("wallet_switchEthereumChain", [
            { chainId: networkId },
          ]);
          setLoading(false);
          onClose();
        } catch (err) {
          if (err.code === 4902 && CHAIN_CONFIG[networkId]) {
            const chainConfig = CHAIN_CONFIG[networkId];
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: networkId,
                  chainName: chainConfig.chainName,
                  rpcUrls: chainConfig.rpcUrls,
                  nativeCurrency: chainConfig?.nativeCurrency,
                  blockExplorerUrls: [chainConfig?.blockExplorerUrl],
                },
              ],
            });
            setLoading(false);
            onClose();
          } else {
            setLoading(false);
          }
        }
      }
    }
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <div className={classes.modal}>
        <Typography className={classes.header} variant="inherit">
          {loading ? "Switching Network" : " Supported Networks"}
        </Typography>

        <IoClose onClick={onClose} size={20} className={classes.close} />

        <div className={classes.networksContainer}>
          {loading ? (
            <div className={classes.loaderContainer}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {supportedNetworks.map((network) => (
                <div
                  onClick={() => {
                    switchNetworkHandler(network.networkId);
                  }}
                  className={classes.network}
                  key={network.chainId}>
                  <div className={classes.hexagonImageContainer}>
                    <Image
                      alt={CHAIN_CONFIG[network.networkId]?.shortName}
                      src={CHAIN_CONFIG[network.networkId]?.logoUri}
                      height={64}
                      width={57}
                      className={classes.logo}
                    />
                  </div>
                  <Typography className={classes.chainName} variant="inherit">
                    {CHAIN_CONFIG[network.networkId]?.shortName}
                  </Typography>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NetworkSwitcher;
