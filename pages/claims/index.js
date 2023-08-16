import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@components/ui";
import settingsImg from "../../public/assets/images/settings.png";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";

import claimsBanner from "../../public/assets/images/claimsBanner.png";
import ClaimsCard from "../../src/components/claimsPageComps/ClaimsCard";
import useSmartContract from "../../src/hooks/useSmartContract";
import Layout1 from "../../src/components/layouts/layout1";
import { subgraphQuery } from "../../src/utils/subgraphs";
import {
  CLAIMS_SUBGRAPH_URL_BASE,
  CLAIMS_SUBGRAPH_URL_POLYGON,
} from "../../src/api";
import { QUERY_ALL_CLAIMS_OF_CREATOR } from "../../src/api/graphql/queries";
import { useAccount, useNetwork } from "wagmi";
import Web3 from "web3";

const useStyles = makeStyles({
  container: {
    display: "flex",
    gap: "30px",
    marginBottom: "60px",
    justifyContent: "space-around",
  },
  leftDiv: {
    flex: "0.7",
    margin: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  const { chain } = useNetwork();
  const networkId = Web3.utils.numberToHex(chain?.id);

  useSmartContract();

  const createClaimHandler = () => {
    router.push("/claims/form");
  };

  const { address: walletAddress } = useAccount();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { claims } = await subgraphQuery(
          networkId === "0x89"
            ? CLAIMS_SUBGRAPH_URL_POLYGON
            : networkId === "0x2105"
            ? CLAIMS_SUBGRAPH_URL_BASE
            : null,
          QUERY_ALL_CLAIMS_OF_CREATOR(walletAddress),
        );

        setClaimData(claims?.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchClaims();
  }, [networkId, walletAddress]);

  return (
    <Layout1 showSidebar={false} isClaims={true}>
      <div className={classes.container}>
        {/* Left Side */}
        <div className={classes.leftDiv}>
          <div className={classes.header}>
            <Typography variant="heading">Claims</Typography>
            <Button onClick={createClaimHandler} variant="normal">
              Create
            </Button>
          </div>

          {!claimData.length && (
            <div className={classes.noClaim}>
              <Typography variant="heading">No claims found</Typography>
              <Typography variant="body">
                Bulk distribute ERC20 tokens or NFTs by creating claim pages in
                less than 60 seconds
              </Typography>
            </div>
          )}
          {/* No claims exist */}

          {claimData.map((item, i) => (
            <ClaimsCard
              key={i}
              i={claimData.length - i - 1}
              description={item?.description}
              airdropTokenAddress={item?.airdropToken}
              totalAmount={item?.totalClaimAmount}
              startDate={item?.startTime}
              endDate={item?.endTime}
              updatedDate={item?.timestamp}
              claimContract={item?.claimAddress}
              createdBy={item?.creatorAddress}
              isActive={item?.isActive}
              claimsNetwork={item?.networkId}
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
      </div>
    </Layout1>
  );
};

export default Claims;
