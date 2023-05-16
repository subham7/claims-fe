import { React, useEffect, useState } from "react";
import Layout2 from "../src/components/layouts/layout2";
import {
  Grid,
  Button,
  Card,
  Typography,
  Divider,
  Stack,
  ListItemButton,
  DialogContent,
  Dialog,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import Router, { useRouter } from "next/router";
import { fetchClubByUserAddress } from "../src/api/user";
import {
  addClubName,
  addDaoAddress,
  addClubID,
  addClubRoute,
} from "../src/redux/reducers/create";
import claim from "../public/assets/images/treasury_image.png";
import station from "../public/assets/images/gov_image.png";

import {
  getExpiryTime,
  getJwtToken,
  getRefreshToken,
  setExpiryTime,
  setJwtToken,
  setRefreshToken,
} from "../src/utils/auth";
import { loginToken, refreshToken } from "../src/api/auth";
import { useConnectWallet } from "@web3-onboard/react";
import NewCard from "../src/components/cards/card";
import Web3 from "web3";
import { subgraphQuery } from "../src/utils/subgraphs";
import { QUERY_CLUBS_FROM_WALLET_ADDRESS } from "../src/api/graphql/queries";
import ClubFetch from "../src/utils/clubFetch";
import { SUBGRAPH_URL_GOERLI, SUBGRAPH_URL_POLYGON } from "../src/api";
import WrongNetworkModal from "../src/components/modals/WrongNetworkModal";
import Image from "next/image";

const useStyles = makeStyles({
  container: {
    // background: "url(/assets/images/gradients.png)",
    minHeight: "100vh",
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
    display: "flex",
    gap: "60px",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "90vh",
  },
});

const App = () => {
  const dispatch = useDispatch();
  const [clubFlow, setClubFlow] = useState(false);
  const classes = useStyles();
  const [{ wallet }] = useConnectWallet();
  const [clubData, setClubData] = useState([]);
  const [clubOwnerAddress, setClubOwnerAddress] = useState(null);
  const [noWalletMessage, setNoWalletMessage] = useState(null);
  const [clubListData, setClubListData] = useState([]);

  const [manageStation, setManageStation] = useState(false);

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const networkId = wallet?.chains[0]?.id;
  console.log("Current Network Id", networkId);

  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

  useEffect(() => {
    try {
      if (walletAddress) {
        // (async () => {
        //   const getClubs = await fetchClubByUserAddress(walletAddress);
        //   console.log(getClubs.data.clubs);
        // })();
        // getClubs
        //   .then((result) => {
        //     console.log(result);
        //     if (result.status != 200) {
        //       console.log(result.statusText);
        //     } else {
        //       console.log("CLub data", Array.from(result.data.clubs));
        //       setClubData(Array.from(result.data.clubs));
        //       setClubOwnerAddress(
        //         result.data.userAddress.substring(0, 6) +
        //           ".........." +
        //           result.data.userAddress.substring(
        //             result.data.userAddress.length - 4,
        //           ),
        //       );
        //     }
        //   })
        //   .catch((error) => {
        //     setNoWalletMessage(
        //       "You don't have any clubs available, please join an existing one or create a new club",
        //     );
        //     console.log(error);
        //   });
      }

      if (walletAddress) {
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
            console.log(data.users);
            setClubListData(data.users);
          } catch (error) {
            setNoWalletMessage(
              "You don't have any clubs available, please join an existing one or create a new club",
            );
            console.log(error);
          }
        };
        fetchClubs();
      }

      if (walletAddress) {
        const getLoginToken = loginToken(walletAddress);

        getLoginToken.then((response) => {
          console.log("responseee", response);
          if (response?.status !== 200) {
            console.log(response?.data.error);
          } else {
            // setExpiryTime(response.data.tokens.access.expires);
            setExpiryTime("2023-03-19T11:07:20.810Z");
            const expiryTime = getExpiryTime();
            const currentDate = Date();
            setJwtToken(response.data.tokens.access.token);
            setRefreshToken(response.data.tokens.refresh.token);
            if (expiryTime < currentDate) {
              console.log("changeeeee", getJwtToken());
              const obtainNewToken = refreshToken(
                getRefreshToken(),
                getJwtToken(),
              );
              obtainNewToken
                .then((tokenResponse) => {
                  if (response.status !== 200) {
                    console.log(tokenResponse.data.error);
                  } else {
                    setExpiryTime(tokenResponse.data.tokens.access.expires);
                    setJwtToken(tokenResponse.data.tokens.access.token);
                    setRefreshToken(tokenResponse.data.tokens.refresh.token);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        });
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
    console.log(pathname);
    if (pathname == "/") {
      Router.push("/create");
    }
  };

  const handleItemClick = (data) => {
    dispatch(addClubName(data.daoName));
    dispatch(addDaoAddress(data.daoAddress));

    // dispatch(addClubID(data.clubId));
    // dispatch(addClubRoute(data.route));
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

  const getImageURL = (tokenURI) => {
    let imgUrl = tokenURI?.split("/");
  };

  const showStationsHandler = () => {
    setManageStation(true);
  };

  const claimsHandler = () => {
    router.push("/claims");
  };

  return (
    <Layout2 faucet={false}>
      <div className={classes.container}>
        {!manageStation && clubFlow && (
          <div className={classes.cardContainer}>
            <NewCard
              onClick={showStationsHandler}
              imgSrc={station}
              title={"Manage Stations"}
              subtitle={"Create and manage stations with few clicks"}
            />
            <NewCard
              onClick={claimsHandler}
              imgSrc={claim}
              title={"Airdrop Tokens"}
              subtitle={"Get your airdrop tokens from here!"}
            />
          </div>
        )}

        {manageStation && clubFlow ? (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={20}
            mb={10}
          >
            <Grid item md={5}>
              <Card>
                <Grid container mt={2}>
                  <Grid item>
                    <Typography className={classes.yourClubText}>
                      Your clubs
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      // startIcon={<AddIcon fontSize="large" />}
                      variant="primary"
                      onClick={handleCreateButtonClick}
                    >
                      Create new
                    </Button>
                  </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Stack spacing={3}>
                  {walletAddress ? (
                    clubListData.reverse().map((club, key) => {
                      return (
                        <ListItemButton
                          component="a"
                          key={key}
                          onClick={(e) => {
                            handleItemClick(clubListData[key]);
                          }}
                        >
                          {getImageURL(club.imageUrl)}
                          <Grid container>
                            {/* <Grid item md={2}>
                              <img
                                src={club.imageUrl}
                                width="80vw"
                                alt="club_image"
                                className={classes.profilePic}
                              />
                            </Grid> */}
                            <Grid item md={6}>
                              <Stack spacing={0}>
                                <Typography className={classes.yourClubText}>
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
                            <Grid
                              item
                              md={4}
                              xs
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Stack
                                spacing={0}
                                alignItems="flex-end"
                                justifyContent="flex-end"
                              >
                                <Typography
                                  className={classes.createClubButton}
                                ></Typography>
                                <Typography className={classes.clubAddress}>
                                  {club.isAdmin ? "Admin" : "Member"}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </ListItemButton>
                      );
                    })
                  ) : (
                    <Grid
                      container
                      item
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography>{noWalletMessage}</Typography>
                    </Grid>
                  )}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <>
            {!manageStation && !walletAddress && (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
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
                    Create or join a club in less than 60 seconds using StationX
                  </Typography>
                </Grid>
              </Grid>

              // <div>
              //   <div></div>
              //   <div>
              //     <Image src={homepage} alt='Join StationX' height={800} />
              //   </div>
              // </div>
            )}
          </>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          scroll="body"
          PaperProps={{ classes: { root: classes.modalStyle } }}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent
            sx={{ overflow: "hidden", backgroundColor: "#19274B" }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              mt={3}
            >
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
                  }}
                >
                  Switch Network
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>

        {walletAddress && networkId !== "0x89" && networkId !== "0x5" ? (
          <WrongNetworkModal />
        ) : (
          ""
        )}
      </div>
    </Layout2>
  );
};

export default App;
