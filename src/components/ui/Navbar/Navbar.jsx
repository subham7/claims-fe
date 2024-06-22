import Image from "next/image";
import classes from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NetworkSwitcher from "@components/modals/NetworkSwitcher/NetworkSwitcher";
import { dropsNetworksChaindId, stationNetworksChainId } from "utils/constants";
import { useAccount, useChainId } from "wagmi";
import { Typography } from "@mui/material";
import EditDetails from "@components/settingsComps/modals/EditDetails";
import { useSelector } from "react-redux";
import { useWalletInfo } from "@web3modal/wagmi/react";
import { getConnections } from "@wagmi/core";
import { config } from "config";
import { fetchClubByDaoAddress } from "api/club";

const Navbar = ({ daoAddress, routeNetworkId }) => {
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [networksSupported, setNetworkSupported] = useState();
  const [walletIcon, setWalletIcon] = useState("");
  const [isToggleRaise, setIsToggleRaise] = useState(false);

  const router = useRouter();
  const { address } = useAccount();
  const { walletInfo } = useWalletInfo();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const showNetworkModalHandler = () => {
    setShowModal(!showModal);
    if (router.pathname.includes("claim")) {
      setNetworkSupported(dropsNetworksChaindId);
    } else {
      setNetworkSupported(stationNetworksChainId);
    }
  };

  const fetchCurrentWalletIcon = () => {
    const connector = getConnections(config)[0]?.connector;
    setWalletIcon(connector?.icon);
  };

  const fetchClubData = async () => {
    const data = await fetchClubByDaoAddress(daoAddress);

    setIsToggleRaise(
      data?.data?.depositConfig?.toggleRaise
        ? data?.data?.depositConfig?.toggleRaise
        : false,
    );
  };

  useEffect(() => {
    if (daoAddress) fetchClubData();
  }, [daoAddress]);

  useEffect(() => {
    if (address && networkId) fetchCurrentWalletIcon();
  }, [networkId, address]);

  return (
    <>
      <nav className={classes.nav}>
        <div className={classes["wallet-div"]}>
          <Image
            src="/assets/images/monogram.png"
            height="28"
            width="28"
            alt="monogram"
            onClick={() => {
              router.push("/");
            }}
          />
        </div>

        <div className={classes["wallet-div"]}>
          {router.pathname.includes("join") &&
          clubData?.adminAddresses?.includes(address?.toLowerCase()) ? (
            <div className={classes.switch}>
              <Typography
                onClick={() => setShowEditDetails(true)}
                variant="inherit">
                Edit Page
              </Typography>
            </div>
          ) : null}

          <w3m-network-button />
          <div className={classes.connectedWallet}>
            {walletIcon && address && (
              <Image
                className={classes.wallet}
                src={walletIcon}
                height={20}
                width={20}
                alt="wallet"
              />
            )}
            <w3m-button label="Connect" />
          </div>
          {address && (
            <Image
              onClick={() => router.push(`/profile/${address}`)}
              src="/assets/icons/astronaut_icon.svg"
              alt="profile image"
              height={20}
              width={20}
              style={{
                cursor: "pointer",
              }}
            />
          )}
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

      <EditDetails
        networkId={routeNetworkId}
        isClaims={false}
        open={showEditDetails}
        setOpen={setShowEditDetails}
        onClose={() => setShowEditDetails(false)}
        daoAddress={daoAddress}
        isErc721={clubData?.tokenType === "erc721"}
        toggleRaise={isToggleRaise}
      />
    </>
  );
};

export default Navbar;
