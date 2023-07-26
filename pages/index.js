import { React, useEffect, useState } from "react";
import {
  Grid,
  Card,
  Typography,
  Divider,
  Stack,
  ListItemButton,
  DialogContent,
  Dialog,
} from "@mui/material";
import Button from "@components/ui/button/Button";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import Router, { useRouter } from "next/router";
import { addDaoAddress } from "../src/redux/reducers/club";

import { useConnectWallet } from "@web3-onboard/react";
import NewCard from "../src/components/cards/card";
import { subgraphQuery } from "../src/utils/subgraphs";
import {
  QUERY_CLUBS_FROM_WALLET_ADDRESS,
  QUERY_CLUB_DETAILS,
} from "../src/api/graphql/queries";
import { SUBGRAPH_URL_GOERLI, SUBGRAPH_URL_POLYGON } from "../src/api";
import WrongNetworkModal from "../src/components/modals/WrongNetworkModal";
import { addClubData } from "../src/redux/reducers/club";
import Layout1 from "../src/components/layouts/layout1";
import { BsFillPlayFill } from "react-icons/bs";
import Web3 from "web3";
import VideoModal from "../src/components/modals/VideoModal";

const useStyles = makeStyles({
  container: {
    maxHeight: "100vh",
    width: "100%",
  },
  yourClubText: {
    fontSize: "30px",
    color: "#F5F5F5",
    opacity: 1,
    fontFamily: "Whyte",
  },
  createClubButton: {
    fontSize: "22px",
    fontFamily: "Whyte",
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
    color: "#C1D3FF",
    opacity: 1,
    fontFamily: "Whyte",
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
    minHeight: "90vh",
  },
  watchBtn: {
    background: "#142243",
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
    background: "#142243",
    borderRadius: "20px",
    marginTop: "20px",
    display: "flex",
    padding: "20px 30px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  isAdmin: {
    fontSize: "16px",
    color: "#C1D3FF",
    opacity: 1,
    fontFamily: "Whyte",
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
  const [clubFlow, setClubFlow] = useState(false);
  const classes = useStyles();
  const [{ wallet }] = useConnectWallet();
  const [clubListData, setClubListData] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [manageStation, setManageStation] = useState(false);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const networkId = wallet?.chains[0]?.id;

  const walletAddress = wallet?.accounts[0].address;

  useEffect(() => {
    try {
      if (!walletAddress) setManageStation(false);
      else {
        const fetchClubs = async () => {
          try {
            const data = await subgraphQuery(
              networkId === "0x5"
                ? SUBGRAPH_URL_GOERLI
                : networkId === "0x89"
                ? SUBGRAPH_URL_POLYGON
                : "",
              QUERY_CLUBS_FROM_WALLET_ADDRESS(walletAddress),
            );
            setClubListData(data.users);
          } catch (error) {
            console.log(error);
          }
        };
        fetchClubs();
      }

      if (walletAddress) {
        setClubFlow(true);
      } else {
        setClubFlow(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [networkId, walletAddress]);

  const handleCreateButtonClick = async (event) => {
    const { pathname } = Router;
    if (pathname == "/") {
      Router.push("/create");
    }
  };

  const handleItemClick = async (data) => {
    dispatch(addDaoAddress(data.daoAddress));
    const clubData = await subgraphQuery(
      networkId == "0x5"
        ? SUBGRAPH_URL_GOERLI
        : networkId == "0x89"
        ? SUBGRAPH_URL_POLYGON
        : "",
      QUERY_CLUB_DETAILS(data.daoAddress),
    );
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
      }),
    );
    router.push(
      `/dashboard/${Web3.utils.toChecksumAddress(data.daoAddress)}`,
      undefined,
      {
        shallow: true,
      },
    );
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const showStationsHandler = () => {
    setManageStation(true);
  };

  const claimsHandler = () => {
    router.push("/claims");
  };

  return (
    <Layout1 showSidebar={false} faucet={false}>
      <div className={classes.container}>
        {!manageStation && clubFlow && (
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
                buttonText="Enter App"
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

        {manageStation && clubFlow ? (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="start"
            mt={12}
            mb={0}>
            <Grid item md={5}>
              <Card>
                <div className={classes.flex}>
                  <Grid item>
                    <Typography className={classes.yourClubText}>
                      My Stations
                    </Typography>
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
                    {console.log(clubListData)}
                    {walletAddress && clubListData.length ? (
                      clubListData
                        .reverse()
                        .filter(
                          (club) =>
                            club.daoAddress !==
                              "0xBd1FAB87bE86fec9336aE49131998D9fA5A00eB0" ||
                            club.daoAddress !==
                              "0x2608d54d10527fD4a6a7Bab0306DFbF9CA95A1Bb" ||
                            club.daoAddress !==
                              "0x067a544f00840056c8CdB7f9D9d73Ac3611D37c9" ||
                            club.daoAddress !==
                              "0x1Ae43fb8283E45AE90d5BD9249cc7227FD6eCc73",
                        )
                        .map((club, key) => {
                          return (
                            <ListItemButton
                              style={{ marginBottom: "8px" }}
                              key={key}
                              onClick={(e) => {
                                handleItemClick(clubListData[key]);
                              }}>
                              {console.log(club)}
                              <Grid container className={classes.flexContainer}>
                                <Grid item md={6}>
                                  <Stack spacing={0}>
                                    <Typography
                                      className={classes.yourClubText}>
                                      {club.daoName}
                                    </Typography>
                                    <Typography className={classes.clubAddress}>
                                      {`${club.userAddress.substring(
                                        0,
                                        9,
                                      )}......${club.userAddress.substring(
                                        club.userAddress.length - 6,
                                      )}`}
                                    </Typography>
                                  </Stack>
                                </Grid>
                                <Grid>
                                  <Stack
                                    spacing={0}
                                    alignItems="flex-end"
                                    justifyContent="flex-end">
                                    <Typography
                                      className={
                                        classes.createClubButton
                                      }></Typography>
                                    <Typography className={classes.isAdmin}>
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
                        <p style={{ color: "#C1D3FF", fontWeight: "300" }}>
                          Station(s) you created or a part of appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <>
            {!manageStation && !wallet && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                <Grid item mt={15}>
                  <img
                    className={classes.bannerImage}
                    src="/assets/images/start_illustration.svg"
                  />
                </Grid>
                <Grid item mt={4}>
                  <Typography variant="mainHeading">
                    Do more together
                  </Typography>
                </Grid>
                <Grid item mt={4}>
                  <Typography variant="regularText">
                    Create or join a station in less than 60 seconds using
                    StationX
                  </Typography>
                </Grid>
              </Grid>
            )}
          </>
        )}

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

        {walletAddress && networkId !== "0x89" && networkId !== "0x5" ? (
          <WrongNetworkModal />
        ) : null}
        {showVideoModal && (
          <VideoModal
            onClose={() => {
              setShowVideoModal(false);
            }}
          />
        )}
      </div>
    </Layout1>
  );
};

export default App;
