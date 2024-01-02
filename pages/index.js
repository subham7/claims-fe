import { React, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";

import NewCard from "../src/components/cards/card";
import Layout from "../src/components/layouts/layout";
import { BsFillPlayFill } from "react-icons/bs";
import VideoModal from "../src/components/modals/VideoModal";
import { useAccount, useNetwork } from "wagmi";
import { requestEthereumChain } from "utils/helper";
import useClubFetch from "hooks/useClubFetch";
import { getReferralCode } from "api/invite/invite";

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
  const { address: walletAddress } = useAccount();

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isMainLink, setIsMainLink] = useState(false);

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  useClubFetch({ networkId });
  const router = useRouter();

  const showStationsHandler = async () => {
    if (isMainLink) {
      window.open("https://tally.so/r/nG64GQ", "_blank");
    } else if (networkId !== "0x89" && networkId !== "0x1") {
      await requestEthereumChain("wallet_switchEthereumChain", [
        { chainId: "0x89" },
      ]);
    } else {
      router.push("/stations");
    }
  };

  const claimsHandler = () => {
    router.push(`/claims/`);
  };

  useEffect(() => {
    (async () => {
      try {
        if (walletAddress) {
          const code = await getReferralCode(walletAddress);
          if (code) {
            setIsUserWhitelisted(true);
          } else {
            setIsUserWhitelisted(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [walletAddress]);

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
              onClick={showStationsHandler}
              title={"Manage Stations"}
              subtitle={
                "Creating a Station is the easiest way to start managing money/assets towards shared goals"
              }
              buttonText={
                networkId === "0x89" || networkId === "0x1"
                  ? "Enter App"
                  : "Switch to polygon"
              }
            />
            <NewCard
              onClick={claimsHandler}
              title={"DropX"}
              subtitle={
                "Set up custom drops instantly to distribute tokens/NFTs to your community anywhere."
              }
              buttonText="Enter App"
            />
          </div>
          <div className={classes.secondContainer}>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "400",
                color: "#EFEFEF",
                margin: 0,
                padding: 0,
                letterSpacing: ".8px",
              }}>
              Learn what communities can do with StationX
            </p>
            <button
              onClick={() => {
                setShowVideoModal(true);
              }}
              className={classes.watchBtn}>
              <BsFillPlayFill color="#EFEFEF" size={30} />
              <p
                style={{
                  fontSize: "18px",
                  color: "#EFEFEF",
                  margin: 0,
                  padding: 0,
                }}>
                Watch video
              </p>
            </button>
          </div>
        </div>

        {showVideoModal && (
          <VideoModal
            onClose={() => {
              setShowVideoModal(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
