import { React, useEffect, useState } from "react";
import {
  Grid,
  Card,
  Divider,
  Stack,
  ListItemButton,
  DialogContent,
  Dialog,
} from "@mui/material";
import { Button, Typography } from "@components/ui";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import NewCard from "../src/components/cards/card";
import { addClubData } from "../src/redux/reducers/club";
import Layout from "../src/components/layouts/layout";
import { BsFillPlayFill } from "react-icons/bs";
import Web3 from "web3";
import VideoModal from "../src/components/modals/VideoModal";
import { useAccount, useNetwork } from "wagmi";
import {
  queryStationDataFromSubgraph,
  queryStationListFromSubgraph,
} from "utils/stationsSubgraphHelper";
import { shortAddress } from "utils/helper";
import { OMIT_DAOS } from "utils/constants";
import useClubFetch from "hooks/useClubFetch";

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
  const dispatch = useDispatch();
  const classes = useStyles();
  const { address: walletAddress } = useAccount();
  const [clubListData, setClubListData] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isMainLink, setIsMainLink] = useState(false);

  const [manageStation, setManageStation] = useState(false);

  const [open, setOpen] = useState(false);
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  useClubFetch({ networkId });
  const router = useRouter();

  useEffect(() => {
    setIsMainLink(window.location.origin.includes("app.stationx.network"));
  }, []);

  useEffect(() => {
    try {
      if (!walletAddress) setManageStation(false);
      else {
        const fetchClubs = async () => {
          try {
            const data = await queryStationListFromSubgraph(
              walletAddress,
              networkId,
            );

            if (data.users) setClubListData(data.users);
          } catch (error) {
            console.log(error);
          }
        };

        if (walletAddress && networkId) fetchClubs();
      }
    } catch (error) {
      console.log(error);
    }
  }, [networkId, walletAddress]);

  const handleCreateButtonClick = async (event) => {
    const { pathname } = router;
    if (pathname == "/") {
      router.push("/create");
    }
  };

  const handleItemClick = async (data) => {
    try {
      const clubData = await queryStationDataFromSubgraph(
        data.daoAddress,
        networkId,
      );

      if (clubData.stations.length)
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

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const showStationsHandler = () => {
    if (isMainLink) {
      window.open("https://tally.so/r/nG64GQ", "_blank");
    } else {
      setManageStation(true);
    }
  };

  const claimsHandler = () => {
    router.push(`/claims/`);
  };

  return (
    <Layout showSidebar={false} faucet={false}>
      <div className={classes.container}>
        {!manageStation && (
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
                buttonText={isMainLink ? "Join Waitlist" : "Enter App"}
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
        )}

        {manageStation ? (
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
                    <Button onClick={handleCreateButtonClick}>
                      Create new
                    </Button>
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
        ) : null}

        <Dialog
          open={open}
          onClose={handleClose}
          scroll="body"
          PaperProps={{ classes: { root: classes.modalStyle } }}
          fullWidth
          maxWidth="lg">
          <DialogContent
            sx={{ overflow: "hidden", backgroundColor: "#19274B" }}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              mt={3}>
              <Grid item pl={15}>
                <img
                  src="/assets/images/connected_world_wuay.svg"
                  width="80%"
                />
              </Grid>
              <Grid item m={3}>
                <Typography className={classes.dialogBox}>
                  You are in the wrong network, please switch to the correct
                  network by clicking the button provided below
                </Typography>
              </Grid>
              <Grid item m={3}>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSwitchNetwork();
                  }}>
                  Switch Network
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
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
