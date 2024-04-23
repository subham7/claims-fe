import Image from "next/image";
import classes from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import NetworkSwitcher from "@components/modals/NetworkSwitcher/NetworkSwitcher";
import {
  CHAIN_CONFIG,
  dropsNetworksChaindId,
  stationNetworksChainId,
} from "utils/constants";
import { useAccount, useNetwork } from "wagmi";
import { Typography } from "@mui/material";
import EditDetails from "@components/settingsComps/modals/EditDetails";
import { useSelector } from "react-redux";

const Navbar = ({ daoAddress, routeNetworkId }) => {
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [networksSupported, setNetworkSupported] = useState();

  const router = useRouter();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  console.log(clubData);

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
          {address && (
            <div onClick={showNetworkModalHandler} className={classes.switch}>
              <Image
                src={CHAIN_CONFIG[networkId]?.logoUri}
                height={20}
                width={20}
                alt={CHAIN_CONFIG[networkId]?.shortName}
                className={classes.networkImg}
              />
              <Typography variant="inherit">
                {CHAIN_CONFIG[networkId]?.shortName}
              </Typography>
            </div>
          )}
          <w3m-account-button balance="hide" />
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
      />
    </>
  );
};

export default Navbar;
