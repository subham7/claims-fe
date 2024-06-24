/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import classes from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import NetworkSwitcher from "@components/modals/NetworkSwitcher/NetworkSwitcher";
import CreateSpaceModal from "@components/modals/CreateSpaceModal/CreateSpaceModal";
import { dropsNetworksChaindId, stationNetworksChainId } from "utils/constants";
import { useAccount, useChainId } from "wagmi";
import { Typography } from "@mui/material";
import EditDetails from "@components/settingsComps/modals/EditDetails";
import { useSelector } from "react-redux";
import { useWalletInfo } from "@web3modal/wagmi/react";
import { getConnections } from "@wagmi/core";
import { config } from "config";
import Menu from "./Menu";
import useSpaceFetch from "hooks/useSpaceFetch";
import { getSpaceByManager } from "api/space";

const Navbar = ({ daoAddress, routeNetworkId }) => {
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [networksSupported, setNetworkSupported] = useState();
  const [walletIcon, setWalletIcon] = useState("");
  const [spaces, setSpaces] = useState();
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [spaceId] = router?.query?.slug ?? [];
  const { spaceData, isLoading } = useSpaceFetch(spaceId);
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

  const fetchSpaces = async () => {
    const data = await getSpaceByManager(address);
    setSpaces(data);
  };

  useEffect(() => {
    if (address) fetchSpaces();
  }, [address]);

  useEffect(() => {
    if (address && networkId) fetchCurrentWalletIcon();
  }, [networkId, address]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          {router.pathname.includes("space") &&
            !isLoading &&
            spaceData.creator === address && (
              <button
                className={classes.customise}
                onClick={() => {
                  router.push(`/space/customise/${spaceId}`);
                }}>
                Customise
              </button>
            )}
          <div className={classes.network}>
            <w3m-network-button />
          </div>
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
            <Menu
              spaces={spaces}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              dropdownRef={dropdownRef}
              setShowCreateSpaceModal={setShowCreateSpaceModal}
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

      {showCreateSpaceModal && (
        <CreateSpaceModal setShowCreateSpaceModal={setShowCreateSpaceModal} />
      )}

      <EditDetails
        networkId={routeNetworkId}
        isClaims={false}
        open={showEditDetails}
        setOpen={setShowEditDetails}
        onClose={() => setShowEditDetails(false)}
        daoAddress={daoAddress}
        isErc721={clubData?.tokenType === "erc721"}
      />
    </>
  );
};

export default Navbar;
