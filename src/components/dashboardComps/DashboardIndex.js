import {
  Button,
  Card,
  CardMedia,
  Grid,
  Link,
  ListItemButton,
  Paper,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Typography } from "@components/ui";
import { Stack } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionCard from "../../../src/components/cardcontent";
import { DashboardStyles } from "./DashboardStyles";
import { useRouter } from "next/router";
import { getAssetsByDaoAddress, getNFTsByDaoAddress } from "../../api/assets";
import { getProposalByDaoAddress } from "../../api/proposal";
import {
  convertFromWeiGovernance,
  getImageURL,
} from "../../utils/globalFunctions";
import { GiTwoCoins } from "react-icons/gi";
import { IoColorPalette } from "react-icons/io5";
import { addNftsOwnedByDao } from "../../redux/reducers/club";
import { useAccount, useNetwork } from "wagmi";
import useAppContractMethods from "../../hooks/useAppContractMethods";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { queryAllMembersFromSubgraph } from "utils/stationsSubgraphHelper";

const DashboardIndex = ({ daoAddress }) => {
  const dispatch = useDispatch();
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const [clubDetails, setClubDetails] = useState({
    clubImageUrl: "",
    noOfMembers: 0,
  });
  const [tokenDetails, setTokenDetails] = useState({
    treasuryAmount: 0,
    tokenPriceList: [],
  });
  const [nftData, setNftData] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  const [balanceOfUser, setBalanceOfUser] = useState(0);
  const [clubTokenMinted, setClubTokenMinted] = useState(0);

  const router = useRouter();
  const classes = DashboardStyles();

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const symbol = useSelector((state) => {
    return state.club.clubData.symbol;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const {
    getERC721Balance,
    getNftOwnersCount,
    getERC20Balance,
    getERC20TotalSupply,
  } = useAppContractMethods();

  const { getERC721Symbol } = useCommonContractMethods();

  const fetchClubDetails = useCallback(async () => {
    try {
      if (daoAddress && walletAddress && networkId) {
        const membersData = await queryAllMembersFromSubgraph(
          daoAddress,
          networkId,
        );

        if (clubData && membersData) {
          if (tokenType === "erc721") {
            const imageUrl = await getImageURL(clubData?.imgUrl);

            setClubDetails({
              clubImageUrl: imageUrl,
              noOfMembers: membersData?.users?.length,
            });
          } else {
            setClubDetails({
              noOfMembers: membersData?.users?.length,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [clubData, daoAddress, networkId, tokenType, walletAddress]);

  const fetchAssets = useCallback(async () => {
    try {
      if (NETWORK_HEX !== "undefined") {
        const assetsData = await getAssetsByDaoAddress(
          gnosisAddress,
          NETWORK_HEX,
        );
        setTokenDetails({
          treasuryAmount: assetsData?.data?.treasuryAmount,
          tokenPriceList: assetsData?.data?.tokenPriceList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [NETWORK_HEX, gnosisAddress]);

  const fetchNfts = useCallback(async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(
        factoryData.assetsStoredOnGnosis ? gnosisAddress : daoAddress,
        NETWORK_HEX,
      );
      setNftData(nftsData.data);
      dispatch(addNftsOwnedByDao(nftsData.data));
    } catch (error) {
      console.log(error);
    }
  }, [
    NETWORK_HEX,
    daoAddress,
    factoryData.assetsStoredOnGnosis,
    gnosisAddress,
  ]);

  const fetchActiveProposals = useCallback(async () => {
    try {
      const activeProposals = await getProposalByDaoAddress(daoAddress);
      setProposalData(activeProposals?.data);
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/join/${daoAddress}`
        : null,
    );
  };

  const handleMoreClick = () => {
    router.push(`/proposals/${daoAddress}/${networkId}`, undefined, {
      shallow: true,
    });
  };

  const handleProposalClick = (proposal) => {
    router.push(
      `/proposals/${daoAddress}/${networkId}/${proposal.proposalId}`,
      undefined,
      {
        shallow: true,
      },
    );
  };

  useEffect(() => {
    if (NETWORK_HEX) {
      fetchClubDetails();
      fetchAssets();
      fetchNfts();
      fetchActiveProposals();
    }
  }, [
    fetchClubDetails,
    fetchNfts,
    fetchAssets,
    NETWORK_HEX,
    fetchActiveProposals,
  ]);

  useEffect(() => {
    try {
      if (daoAddress) {
        const loadNftContractData = async () => {
          try {
            const nftBalance = await getERC721Balance();
            setBalanceOfUser(nftBalance);
            const symbol = await getERC721Symbol(daoAddress);
            const nftMinted = await getNftOwnersCount();
            setClubTokenMinted(nftMinted);
          } catch (error) {
            console.log(error);
          }
        };

        const loadSmartContractData = async () => {
          try {
            const balance = await getERC20Balance();
            //KEEP THIS CONSOLE
            setBalanceOfUser(balance);
            const clubTokensMinted = await getERC20TotalSupply();
            //KEEP THIS CONSOLE
            setClubTokenMinted(clubTokensMinted);

            // setDataFetched(true);
          } catch (e) {
            console.log(e);
            // setOpenSnackBar(true);
            // setFailed(true);
          }
        };

        if (clubData.tokenType === "erc721") {
          loadNftContractData();
        } else {
          loadSmartContractData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    daoAddress,
    clubData.tokenType,
    walletAddress,
    getERC721Balance,
    getERC721Symbol,
    getNftOwnersCount,
    getERC20Balance,
    getERC20TotalSupply,
  ]);

  return (
    <>
      <Grid container paddingTop={2} spacing={3} mb={8}>
        <Grid item xs={9}>
          <Card className={classes.cardSharp1}>
            <Grid display="flex" alignItems="center" container spacing={2}>
              {tokenType === "erc721" &&
              !clubDetails.clubImageUrl?.includes(".mp4") &&
              !clubDetails.clubImageUrl?.includes(".MP4") ? (
                <div>
                  <img
                    src={
                      clubDetails.clubImageUrl ? clubDetails.clubImageUrl : null
                    }
                    width="80px"
                    alt="profile_pic"
                    className={classes.profilePic}
                  />
                </div>
              ) : clubDetails.clubImageUrl?.includes(".mp4") ||
                clubDetails.clubImageUrl?.includes(".MP4") ? (
                <Grid
                  style={{
                    width: "110px",
                    height: "110px",
                  }}
                  item
                  ml={3}
                  mt={2}>
                  <video
                    style={{
                      width: "110px",
                      height: "110px",
                    }}
                    loop
                    autoPlay
                    muted>
                    <source
                      src={
                        clubDetails.clubImageUrl
                          ? clubDetails.clubImageUrl
                          : null
                      }
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </Grid>
              ) : null}

              <Grid item ml={1}>
                <Stack spacing={0}>
                  <Typography variant="heading">
                    {clubData.name ? (
                      clubData.name
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                  <Grid container item direction="row" paddingBottom={2}>
                    <Typography variant="info" className="text-blue">
                      {clubDetails.noOfMembers} Members
                    </Typography>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Grid item xs={12}>
                <Card className={classes.firstCard}>
                  <div className={classes.statsDiv}>
                    <Typography vvariant="body">Total assets</Typography>
                    <Typography variant="heading">
                      $
                      {tokenDetails ? (
                        tokenDetails.treasuryAmount
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </div>
                  <CardMedia
                    image="/assets/images/treasurywallet.png"
                    component="img"
                    className={classes.media}
                    alt="ownershipshare"
                    sx={{ position: "sticky", zIndex: 0 }}
                  />
                </Card>
              </Grid>
              <Grid
                container
                spacing={{ xs: 2, sm: 5, md: 3 }}
                direction={{ xs: "column", sm: "column", md: "column" }}>
                <Card className={classes.secondCard}>
                  <CardMedia
                    image="/assets/images/ownershipshare.png"
                    component="img"
                    className={classes.media}
                    alt="ownershipshare"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      paddingTop: "px",
                    }}
                  />
                  <div className={classes.statsDiv}>
                    <Typography variant="body">My share</Typography>
                    {clubData.tokenType === "erc721" ? (
                      <Typography variant="heading">
                        {balanceOfUser !== null &&
                        clubTokenMinted !== null &&
                        isNaN(
                          Number(
                            (convertFromWeiGovernance(balanceOfUser, 18) /
                              convertFromWeiGovernance(clubTokenMinted, 18)) *
                              100,
                          ).toFixed(2),
                        )
                          ? 0
                          : Number(
                              (convertFromWeiGovernance(balanceOfUser, 18) /
                                convertFromWeiGovernance(clubTokenMinted, 18)) *
                                100,
                            ).toFixed(2)}
                        %
                      </Typography>
                    ) : (
                      <Typography variant="heading">
                        {balanceOfUser !== null &&
                        clubTokenMinted !== null &&
                        isNaN(
                          Number(
                            (convertFromWeiGovernance(balanceOfUser, 18) /
                              convertFromWeiGovernance(clubTokenMinted, 18)) *
                              100,
                          ).toFixed(2),
                        )
                          ? 0
                          : Number(
                              (convertFromWeiGovernance(balanceOfUser, 18) /
                                convertFromWeiGovernance(clubTokenMinted, 18)) *
                                100,
                            ).toFixed(2)}
                        %
                      </Typography>
                    )}
                    {balanceOfUser === null || balanceOfUser === 0 ? (
                      <Typography>
                        {balanceOfUser} {symbol}
                      </Typography>
                    ) : null}
                  </div>
                </Card>
              </Grid>
            </Stack>
          </Card>
          <Grid item md={9}>
            <div style={{ marginTop: "32px" }}>
              <Typography variant="heading">All Assets</Typography>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginTop: "20px",
                marginBottom: "12px",
              }}>
              <GiTwoCoins size={30} />
              <Typography variant="subheading">Tokens</Typography>
            </div>

            {tokenDetails.tokenPriceList ? (
              tokenDetails.tokenPriceList.length ? (
                //  if the tokens length is > 0 and if the token[0] (by default it will be Ether) is not equal to 0, then show the table
                <TableContainer component={Paper} sx={{ overflowX: "hidden" }}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" variant="tableHeading">
                          Token
                        </TableCell>
                        <TableCell align="left" variant="tableHeading">
                          Balance
                        </TableCell>
                        <TableCell align="left" variant="tableHeading">
                          Value (USD)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tokenDetails.tokenPriceList.map((data, key) => {
                        if (data.value !== 0) {
                          return (
                            <TableRow
                              key={key}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}>
                              <TableCell align="left" variant="tableBody">
                                <></>
                                {data.symbol}
                              </TableCell>
                              <TableCell align="left" variant="tableBody">
                                {Number(data.value).toFixed(4)}
                              </TableCell>
                              <TableCell align="left" variant="tableBody">
                                ${Number(data.usd.usdValue).toFixed(4)}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Grid item justifyContent="center" alignItems="center" md={10}>
                  <img
                    src="/assets/images/tokens_banner.png"
                    alt="token-banner"
                    className={classes.banner}
                  />
                </Grid>
              )
            ) : null}

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginTop: "20px",
                marginBottom: "12px",
              }}>
              <IoColorPalette size={30} />
              <Typography variant="subheading">Collectibles</Typography>
            </div>
            <Grid container maxWidth={"70vw"}>
              {nftData ? (
                nftData.length > 0 ? (
                  nftData.map((data, key) => (
                    <Grid item m={1} key={key} gap={3}>
                      <CollectionCard
                        metadata={data.metadata}
                        tokenName={data.name}
                        tokenSymbol={data.symbol}
                        nftData={data}
                      />
                    </Grid>
                  ))
                ) : (
                  <Grid
                    item
                    justifyContent="center"
                    alignItems="center"
                    md={10}>
                    <img
                      src="/assets/images/NFT_banner.png"
                      alt="proposal-banner"
                      className={classes.banner}
                    />
                  </Grid>
                )
              ) : null}
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={3}>
          <Stack>
            <Card className={classes.fifthCard}>
              <Grid>
                <Grid>
                  <Grid item>
                    <Typography variant="heading">
                      Docs to help you get started
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Link
                      color={"#0F0F0F"}
                      variant="Docs"
                      className={classes.docs}
                      onClick={() => {
                        window.open(`https://stationxnetwork.gitbook.io/docs`);
                      }}>
                      Read Docs
                    </Link>

                    <Grid>
                      <CardMedia
                        image="/assets/images/docs.png"
                        component="img"
                        alt="ownership_share"
                        className={classes.docimg}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Stack>

          <Stack mt={3}>
            {isAdmin ? (
              <Card className={classes.thirdCard}>
                <Grid container m={2}>
                  <Grid item>
                    <Typography variant="subheading">Joining link</Typography>
                  </Grid>
                  <Grid
                    item
                    mr={4}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {factoryData?.depositCloseTime ? (
                      factoryData?.depositCloseTime * 1000 > Date.now() ? (
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "baseline",
                          }}>
                          <Grid item mt={1.5} mr={1}>
                            <div className={classes.activeIllustration}></div>
                          </Grid>
                          <Grid item>
                            <Typography variant="info">Active</Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "baseline",
                          }}>
                          <Grid item mt={1.5} mr={1}>
                            <div className={classes.inactiveIllustration}></div>
                          </Grid>
                          <Grid item>
                            <Typography variant="info">Inactive</Typography>
                          </Grid>
                        </Grid>
                      )
                    ) : null}
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item md={12} mt={2} ml={1} mr={1}>
                    <TextField
                      className={classes.linkInput}
                      disabled
                      value={
                        typeof window !== "undefined" && window.location.origin
                          ? `${window.location.origin}/join/${daoAddress}`
                          : null
                      }
                      InputProps={{
                        endAdornment: (
                          <Button
                            variant="contained"
                            className={classes.copyButton}
                            onClick={handleCopy}>
                            Copy
                          </Button>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item md={12} mt={4} ml={1} mr={1}>
                    <Typography variant="info" className="text-blue">
                      Share the link with new members to deposit & join this
                      Station.
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            ) : null}
          </Stack>

          <Stack mt={3}>
            <Card className={classes.fourthCard}>
              <Grid container m={2}>
                <Grid item>
                  <Typography variant="subheading">Recent Proposals</Typography>
                </Grid>
              </Grid>
              {proposalData.length > 0 ? (
                <>
                  <Grid container m={1}>
                    <Grid item md={12} mr={2}>
                      {proposalData
                        ? proposalData.map((data, key) => {
                            if (key < 3) {
                              return (
                                <div key={key}>
                                  <ListItemButton
                                    onClick={() =>
                                      handleProposalClick(proposalData[key])
                                    }
                                    sx={{ width: "100%" }}>
                                    <Grid container mb={2} direction="column">
                                      <Grid item>
                                        <Typography variant="body">
                                          {data.name}
                                        </Typography>
                                      </Grid>
                                      <Grid item>
                                        <Typography
                                          variant="info"
                                          className="text-blue">
                                          Expires on{" "}
                                          {new Date(
                                            data.votingDuration,
                                          ).toLocaleDateString()}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </ListItemButton>
                                </div>
                              );
                            }
                          })
                        : null}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item md={12}>
                      <Button
                        sx={{ width: "100%" }}
                        variant="text"
                        onClick={() => handleMoreClick()}>
                        More
                      </Button>
                    </Grid>
                  </Grid>{" "}
                </>
              ) : (
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  minHeight={"120px"}>
                  <Grid item>
                    <Typography variant="info" className="text-blue">
                      No proposals raised yet
                    </Typography>
                  </Grid>
                  {isAdmin ? (
                    <Grid item pb={4}>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          router.push(
                            {
                              pathname: `/proposal/${daoAddress}`,
                              query: {
                                create_proposal: true,
                              },
                            },
                            undefined,
                            {
                              shallow: true,
                            },
                          );
                        }}>
                        Create new
                      </Button>
                    </Grid>
                  ) : null}
                </Grid>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        //   open={openSnackBar}
        autoHideDuration={6000}
        //   onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        {/* {failed ? (
              <Alert
              //   onClose={handleSnackBarClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Error fetching data!
              </Alert>
            ) : null} */}
      </Snackbar>
    </>
  );
};

export default DashboardIndex;
