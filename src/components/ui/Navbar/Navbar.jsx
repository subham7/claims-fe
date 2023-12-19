import Image from "next/image";
import classes from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import NetworkSwitcher from "@components/modals/NetworkSwitcher";
import { dropsNetworksChaindId, stationNetworksChainId } from "utils/constants";
import { useAccount } from "wagmi";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [networksSupported, setNetworkSupported] = useState();

  const router = useRouter();
  const { address } = useAccount();

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
              Switch Network
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
