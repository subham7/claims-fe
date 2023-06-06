import Image from "next/image";
import React, { useEffect, useState } from "react";
import settingsImg from "../../public/assets/images/settings.png";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";

import claimsBanner from "../../public/assets/images/claimsBanner.png";
import ClaimsCard from "../../src/components/claimsPageComps/ClaimsCard";
import { getClaimsByUserAddress } from "../../src/api/claims";
import { useConnectWallet } from "@web3-onboard/react";
import useSmartContract from "../../src/hooks/useSmartContract";
import WrongNetworkModal from "../../src/components/modals/WrongNetworkModal";
import Layout1 from "../../src/components/layouts/layout1";

const useStyles = makeStyles({
  container: {
    marginLeft: "80px",
    marginTop: "120px",
    display: "flex",
    gap: "30px",
  },
  leftDiv: {
    flex: "0.65",
    margin: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: "46px",
    fontWeight: "500",
    alignSelf: "flex-start",
    marginTop: "0px",
    color: "white",
  },
  claimDoc: {
    width: "130px",
    fontFamily: "sans-serif",
    fontSize: "16px",
    border: "none",
    padding: "18px 24px",
    color: "white",
    background: "#3B7AFD",
    borderRadius: "12px",
    cursor: "pointer",
  },
  rightDiv: {
    flex: "0.3",
  },
  imgContainer: {
    position: "relative",
    width: "100%",
  },
  rightDiv_title: {
    fontSize: "24px",
    fontWeight: "500",
    lineHeight: "30px",
    color: "black",
    margin: 0,
  },
  docLink: {
    position: "absolute",
    bottom: "0px",
    color: "black",
    textDecoration: "underline",
    cursor: "pointer",
  },
  noClaim: {
    width: "600px",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "10px 30px",
    marginTop: "20px",
  },
  noClaim_heading: {
    fontSize: "18px",
    fontWeight: "400",
    color: "white",
  },
  noClaim_para: {
    fontSize: "14px",
    fontWeight: "400",
    color: "lightgray",
  },
  proposalInfoCard: {
    background: settingsImg,
    backgroundColor: "#81f5f4",
  },
  proposalImg: {
    position: "relative",
  },
});

const Claims = () => {
  const classes = useStyles();
  const router = useRouter();
  const [claimData, setClaimData] = useState([]);
  useSmartContract();

  const createClaimHandler = () => {
    router.push("/claims/form");
  };

  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;
  const networkId = wallet?.chains[0].id;

  useEffect(() => {
    const getData = async () => {
      const data = await getClaimsByUserAddress(walletAddress, networkId);
      setClaimData(data.reverse());
    };

    getData();
  }, [walletAddress, networkId]);

  return (
    <Layout1 showSidebar={false}>
      <div className={classes.container}>
        {/* Left Side */}
        <div className={classes.leftDiv}>
          <div className={classes.header}>
            <p className={classes.title}>Claims</p>
            <button onClick={createClaimHandler} className={classes.claimDoc}>
              Create
            </button>
          </div>

          {!claimData.length && (
            <div className={classes.noClaim}>
              <p className={classes.noClaim_heading}>No claims found</p>
              <p className={classes.noClaim_para}>
                Bulk distribute ERC20 tokens or NFTs by creating claim pages in
                less than 60 seconds
              </p>
            </div>
          )}
          {/* No claims exist */}

          {claimData.map((item, i) => (
            <ClaimsCard
              key={i}
              i={claimData.length - i - 1}
              description={item?.description}
              airdropTokenSymbol={item?.airdropTokenSymbol}
              totalAmount={item?.totalAmount}
              startDate={item?.startDate}
              endDate={item?.endDate}
              updatedDate={item?.updateDate}
              claimContract={item?.claimContract}
              createdBy={item?.createdBy}
            />
          ))}
        </div>

        {/* Right Side */}
        <div className={classes.rightDiv}>
          <Image
            src={claimsBanner}
            alt="claimBanner"
            height={250}
            width={400}
          />
        </div>

        {networkId && networkId !== "0x89" && <WrongNetworkModal />}
      </div>
    </Layout1>
  );
};

export default Claims;
