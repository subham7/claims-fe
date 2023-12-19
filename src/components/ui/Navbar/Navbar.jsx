import Image from "next/image";
import classes from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import NetworkSwitcher from "@components/modals/NetworkSwitcher";
import {
  CHAIN_CONFIG,
  dropsNetworksChaindId,
  stationNetworksChainId,
} from "utils/constants";
import { useAccount, useNetwork } from "wagmi";
import { Typography } from "@mui/material";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [networksSupported, setNetworkSupported] = useState();

  const router = useRouter();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const showNetworkModalHandler = () => {
    setShowModal(!showModal);

    if (router.pathname.includes("claim")) {
      setNetworkSupported(dropsNetworksChaindId);
    } else {
      setNetworkSupported(stationNetworksChainId);
    }
  };

  return (
    <>
      <nav className={classes.nav}>
        <Image
          src="/assets/images/monogram.png"
          height="40"
          width="40"
          alt="monogram"
          onClick={() => {
            router.push("/");
          }}
        />
        <div className={classes["wallet-div"]}>
          {address && (
            <div onClick={showNetworkModalHandler} className={classes.switch}>
              <Image
                src={CHAIN_CONFIG[networkId].logoUri}
                height={25}
                width={25}
                alt={CHAIN_CONFIG[networkId].shortName}
                className={classes.networkImg}
              />
              <Typography variant="inherit">
                {CHAIN_CONFIG[networkId].shortName}
              </Typography>
            </div>
          )}

          <w3m-button />
        </div>
      </nav>

      {showModal && (
        <NetworkSwitcher
          onClose={() => {
            setShowModal(false);
          }}
          supportedNetworks={networksSupported}
        />
      )}
    </>
  );
};

export default Navbar;
