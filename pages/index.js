import NetworkSwitcher from "@components/modals/NetworkSwitcher/NetworkSwitcher";
import { makeStyles } from "@mui/styles";
import { useWalletInfo, useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/router";
import { React, useState } from "react";
// import { BsFillPlayFill } from "react-icons/bs";
import { useChainId } from "wagmi";

import {
  ALLOWED_NETWORKS_FOR_STATION,
  stationNetworksChainId,
} from "utils/constants";

import NewCard from "../src/components/cards/card";
import Layout from "../src/components/layouts/layout";

const useStyles = makeStyles({
  container: {
    maxHeight: "100vh",
    width: "100%",
  },
  yourClubText: {
    fontSize: "30px",
    color: "#F5F5F5",
    opacity: 1,
  },
  createClubButton: {
    fontSize: "22px",

    borderRadius: "30px",
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  logoImage: {
    width: "75px",
    height: "auto",
    maxWidth: "100px",
    minWidth: "50px",
  },
  clubAddress: {
    fontSize: "16px",
    color: "#dcdcdc",
    opacity: 1,
  },
  bannerImage: {
    width: "60vh",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontSize: "28px",
  },
  profilePic: {
    borderRadius: "50%",
  },
  cardContainer: {
    width: "min-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 auto",
    minHeight: "70vh",
  },
  watchBtn: {
    background: "#151515",
    borderRadius: "50px",
    border: "1px solid #EFEFEF",
    width: "180px",
    padding: 10,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    cursor: "pointer",
  },
  secondContainer: {
    background: "#151515",
    borderRadius: "20px",
    marginTop: "20px",
    display: "flex",
    padding: "20px 30px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  isAdmin: {
    fontSize: "16px",
    color: "#dcdcdc",
    opacity: 1,
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  flex: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "15px",
  },
});

const App = () => {
  const classes = useStyles();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isMainLink, setIsMainLink] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { walletInfo } = useWalletInfo();

  const showStationsHandler = async () => {
    if (isMainLink) {
      window.open("https://tally.so/r/nG64GQ", "_blank");
    } else if (!ALLOWED_NETWORKS_FOR_STATION.includes(networkId)) {
      await open({ view: "Networks" });
    } else {
      router.push("/stations");
    }
  };

  const claimsHandler = () => {
    router.push(`/claims/`);
  };

  return (
    <Layout showSidebar={false} faucet={false}>
      <div className={classes.container}>
        <div className={classes.cardContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
            }}>
            <NewCard
              onClick={claimsHandler}
              title={"Drops"}
              subtitle={
                "Bulk distribute tokens or create custom drop pages for your community. Example - distribute profits, rewards, airdrops, or literally any other token distribution use-case."
              }
              buttonText="Enter App"
            />
          </div>
        </div>

        {/* {showVideoModal && (
          <VideoModal
            onClose={() => {
              setShowVideoModal(false);
            }}
          />
        )} */}

        {showNetworkModal && (
          <NetworkSwitcher
            onClose={() => {
              setShowNetworkModal(false);
            }}
            supportedNetworks={stationNetworksChainId}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
