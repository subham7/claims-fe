import Image from "next/image";
import React, { useEffect, useState } from "react";
import settingsImg from "../../../public/assets/images/settings.png";
import claimsBanner from "../../../public/assets/images/claimsBanner.png";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import ClaimsCard from "components/claimsPageComps/ClaimsCard";
import { useAccount, useChainId } from "wagmi";
import { Button, Typography } from "@mui/material";
import { queryDropsListFromSubgraph } from "utils/dropsSubgraphHelper";

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
  headerBtns: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  claimDoc: {
    width: "130px",
    fontSize: "16px",
    border: "none",
    padding: "18px 24px",
    color: "white",
    background: "#2D55FF",
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
    marginTop: "100px",
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
  const classes = useStyles();
  const router = useRouter();
  const [claimData, setClaimData] = useState([]);
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const createClaim = () => {
    router.push("/claims/create");
  };

  const createDisburse = () => {
    router.push("/claims/disburse");
  };

  const { address: walletAddress } = useAccount();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { claims } = await queryDropsListFromSubgraph(
          walletAddress,
          networkId,
        );

        if (claims.length) {
          setClaimData(claims?.reverse());
        } else {
          setClaimData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (walletAddress && networkId) fetchClaims();
  }, [networkId, walletAddress]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.leftDiv}>
          <div className={classes.header}>
            <Typography color="textPrimary" variant="h4">
              Welcome to Drops
            </Typography>
            <div className={classes.headerBtns}>
              {/* <Button variant="contained" onClick={createDisburse}>
                Disburse
              </Button> */}
              <Button variant="contained" onClick={createClaim}>
                Create
              </Button>
            </div>
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
              claimsNetwork={networkId}
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
