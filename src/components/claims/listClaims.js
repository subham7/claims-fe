import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@components/ui";
import settingsImg from "../../../public/assets/images/settings.png";
import claimsBanner from "../../../public/assets/images/claimsBanner.png";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";

import ClaimsCard from "@components/claimsPageComps/ClaimsCard";
import { subgraphQuery } from "utils/subgraphs";
import { CLAIMS_SUBGRAPH_URL_POLYGON } from "api";
import { QUERY_ALL_CLAIMS_OF_CREATOR } from "api/graphql/queries";
import { useAccount } from "wagmi";

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

const ListClaims = () => {
  debugger;
  const classes = useStyles();
  const router = useRouter();
  const [claimData, setClaimData] = useState([]);

  const createClaimHandler = () => {
    router.push("/claims/create");
  };

  const { address: walletAddress } = useAccount();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { claims } = await subgraphQuery(
          CLAIMS_SUBGRAPH_URL_POLYGON,
          QUERY_ALL_CLAIMS_OF_CREATOR(walletAddress),
        );

        setClaimData(claims?.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    fetchClaims();
  }, [walletAddress]);

  return (
    <>
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
    </>
  );
};

export default ListClaims;
