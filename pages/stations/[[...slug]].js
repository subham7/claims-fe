import React, { useEffect, useState } from "react";
import Layout from "@components/layouts/layout";
// import InviteCard from "@components/cards/InviteCard";
import { Grid, Card, Divider, Stack, ListItemButton } from "@mui/material";
import { Button, Typography } from "@components/ui";
import Web3 from "web3";
import { useDispatch } from "react-redux";
import { addClubData } from "redux/reducers/club";
import {
  queryStationDataFromSubgraph,
  queryStationListFromSubgraph,
} from "utils/stationsSubgraphHelper";
import { useAccount, useNetwork } from "wagmi";
import { makeStyles } from "@mui/styles";
import { getReferralCode } from "api/invite/invite";
import { OMIT_DAOS } from "utils/constants";
import { shortAddress } from "utils/helper";
import { useRouter } from "next/router";
import BackdropLoader from "@components/common/BackdropLoader";
import useAppContractMethods from "hooks/useAppContractMethods";

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

const StationsPage = () => {
  const classes = useStyles();
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const dispatch = useDispatch();
  const [clubListData, setClubListData] = useState([]);
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { getDaoDetails } = useAppContractMethods();

  const handleCreateButtonClick = async () => {
    const { pathname } = router;

    if (pathname.includes("/stations")) {
      router.push("/create");
    }
  };

  const handleItemClick = async (data) => {
    try {
      const clubData = await queryStationDataFromSubgraph(
        data.daoAddress,
        networkId,
      );
      const daoDetails = await getDaoDetails(data.daoAddress);
      const depositTokenAddress = daoDetails.depositTokenAddress;

      if (clubData?.stations?.length)
        dispatch(
          addClubData({
            gnosisAddress: clubData.stations[0].gnosisAddress,
            isGtTransferable: clubData.stations[0].isGtTransferable,
            name: clubData.stations[0].name,
            ownerAddress: clubData.stations[0].ownerAddress,
            symbol: clubData.stations[0].symbol,
            tokenType: clubData.stations[0].tokenType,
            membersCount: clubData.stations[0].membersCount,
            deployedTime: clubData.stations[0].timeStamp,
            imgUrl: clubData.stations[0].imageUrl,
            minDepositAmount: clubData.stations[0].minDepositAmount,
            maxDepositAmount: clubData.stations[0].maxDepositAmount,
            pricePerToken: clubData.stations[0].pricePerToken,
            isGovernanceActive: clubData.stations[0].isGovernanceActive,
            quorum: clubData.stations[0].quorum,
            threshold: clubData.stations[0].threshold,
            raiseAmount: clubData.stations[0].raiseAmount,
            totalAmountRaised: clubData.stations[0].totalAmountRaised,
            distributionAmount: clubData.stations[0].distributionAmount,
            maxTokensPerUser: clubData.stations[0].maxTokensPerUser,
            depositTokenAddress: depositTokenAddress,
          }),
        );
      router.push(
        `/dashboard/${Web3.utils.toChecksumAddress(
          data.daoAddress,
        )}/${networkId}`,
        undefined,
        {
          shallow: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        const data = await queryStationListFromSubgraph(
          walletAddress,
          networkId,
        );

        if (data.users) setClubListData(data.users);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (walletAddress && networkId) fetchClubs();
  }, [networkId, walletAddress]);

  if (isUserWhitelisted === null || isLoading) {
    return (
      <Layout showSidebar={false} faucet={false}>
        <BackdropLoader isOpen={true} showLoading={true} />
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false} faucet={false}>
      <div className={classes.container}>
        {/* {isUserWhitelisted ? ( */}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="start"
          mt={2}
          mb={0}>
          <Grid item md={5}>
            <Card>
              <div className={classes.flex}>
                <Grid item>
                  <Typography variant="heading">My Stations</Typography>
                </Grid>
                <Grid>
                  <Button onClick={handleCreateButtonClick}>Create new</Button>
                </Grid>
              </div>
              <Divider className={classes.divider} />
              <div>
                <div style={{ overflowY: "scroll", maxHeight: "60vh" }}>
                  {walletAddress && clubListData.length ? (
                    clubListData
                      .reverse()
                      .filter((club) => !OMIT_DAOS.includes(club.daoAddress))
                      .map((club, key) => {
                        return (
                          <ListItemButton
                            style={{ marginBottom: "8px" }}
                            key={key}
                            onClick={(e) => {
                              handleItemClick(clubListData[key]);
                            }}>
                            <Grid container className={classes.flexContainer}>
                              <Grid item md={6}>
                                <Stack spacing={0}>
                                  <Typography variant="subheading">
                                    {club.daoName}
                                  </Typography>
                                  <Typography
                                    variant="body"
                                    className="text-blue">
                                    {shortAddress(club.userAddress)}
                                  </Typography>
                                </Stack>
                              </Grid>
                              <Grid>
                                <Stack
                                  spacing={0}
                                  alignItems="flex-end"
                                  justifyContent="flex-end">
                                  <Typography
                                    variant="body"
                                    className="text-blue">
                                    {club.isAdmin ? "Admin" : "Member"}
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </ListItemButton>
                        );
                      })
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}>
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: "400",
                          marginBottom: 0,
                        }}>
                        No stations found
                      </h3>
                      <p style={{ color: "#dcdcdc", fontWeight: "300" }}>
                        Station(s) you created or a part of appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
        {/* // ) : (
        //   <InviteCard setIsUserWhitelisted={setIsUserWhitelisted} />
        // )} */}
      </div>
    </Layout>
  );
};

export default StationsPage;
