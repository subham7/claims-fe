import {
  Alert,
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
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CollectionCard from "../../../src/components/cardcontent";
import Layout1 from "../../../src/components/layouts/layout1";
import LegalEntityModal from "../../../src/components/modals/LegalEntityModal";
import { DashboardStyles } from "./DashboardStyles";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";
import { fetchClub, fetchClubbyDaoAddress } from "../../api/club";
import { useRouter } from "next/router";
import { getMembersDetails } from "../../api/user";
import nft from "../../../src/abis/nft.json";
import {
  getAssets,
  getAssetsByDaoAddress,
  getNFTs,
  getNFTsByDaoAddress,
} from "../../api/assets";
import { getProposal } from "../../api/proposal";
import { SmartContract } from "../../api/contract";
import { subgraphQuery } from "../../utils/subgraphs";
import {
  QUERY_ALL_MEMBERS,
  QUERY_CLUB_DETAILS,
} from "../../api/graphql/queries";
import ClubFetch from "../../utils/clubFetch";
import erc20DaoContractABI from "../../abis/newArch/erc20Dao.json";
import erc721DaoContractABI from "../../abis/newArch/erc721Dao.json";
import factoryContractABI from "../../abis/newArch/factoryContract.json";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";

const DashboardIndex = () => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

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
  const [depositLink, setDepositLink] = useState("");
  const [balanceOfUser, setBalanceOfUser] = useState(0);
  const [clubTokenMinted, setClubTokenMinted] = useState(0);
  const [depositCloseTime, setDepositCloseTime] = useState("");

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();
  const classes = DashboardStyles();
  const { clubId: daoAddress } = router.query;

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

  const fetchClubDetails = useCallback(async () => {
    try {
      if (daoAddress) {
        const imageUrl = await fetchClubbyDaoAddress(
          Web3.utils.toChecksumAddress(daoAddress),
        );

        const membersData = await subgraphQuery(
          SUBGRAPH_URL,
          QUERY_ALL_MEMBERS(daoAddress),
        );

        setClubDetails({
          clubImageUrl: imageUrl?.data[0]?.imageUrl,

          noOfMembers: membersData?.users?.length,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [SUBGRAPH_URL, daoAddress]);

  const fetchAssets = useCallback(async () => {
    try {
      if (NETWORK_HEX !== "undefined") {
        const assetsData = await getAssetsByDaoAddress(daoAddress, NETWORK_HEX);
        console.log("Asset data", assetsData?.data);
        setTokenDetails({
          treasuryAmount: assetsData?.data?.treasuryAmount,
          tokenPriceList: assetsData?.data?.tokenPriceList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [NETWORK_HEX, daoAddress]);

  const fetchNfts = useCallback(async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(daoAddress, NETWORK_HEX);
      console.log("NFTs by dao", nftsData);
      setNftData(nftsData.data);
    } catch (error) {
      console.log(error);
    }
  }, [NETWORK_HEX, daoAddress]);

  //   const fetchActiveProposals = useCallback(async () => {
  //     try {
  //       const activeProposals = await getProposal(clubId, "active");
  //       console.log("Proposals", activeProposals);
  //       // setProposalData(activeProposals?.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }, [clubId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}/join/${Web3.utils.toChecksumAddress(
            daoAddress,
          )}`
        : null,
    );
  };

  const handleMoreClick = () => {
    router.push(`${router.asPath}/proposal`, undefined, { shallow: true });
  };

  const handleProposalClick = (proposal) => {
    router.push(`${router.asPath}/proposal/${proposal.proposalId}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (NETWORK_HEX) {
      fetchClubDetails();
      fetchAssets();
      fetchNfts();
    }
    // fetchActiveProposals();
  }, [fetchClubDetails, fetchNfts, fetchAssets, NETWORK_HEX]);

  useEffect(() => {
    try {
      if (daoAddress) {
        const factoryContractData = async () => {
          const factoryContract = new SmartContract(
            factoryContractABI,
            FACTORY_CONTRACT_ADDRESS,
            walletAddress,
            USDC_CONTRACT_ADDRESS,
            GNOSIS_TRANSACTION_URL,
          );

          const factoryData = await factoryContract.getDAOdetails(daoAddress);
          console.log("Factory Data", factoryData);
          setDepositCloseTime(factoryData?.depositCloseTime);
        };

        factoryContractData();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    FACTORY_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    daoAddress,
    walletAddress,
  ]);

  useEffect(() => {
    try {
      if (daoAddress) {
        const loadNftContractData = async () => {
          try {
            const nftContract = new SmartContract(
              erc721DaoContractABI,
              daoAddress,
              walletAddress,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
            );
            const nftBalance = await nftContract.nftBalance(walletAddress);
            console.log("NFT Balance", nftBalance);
            setBalanceOfUser(nftBalance);
            const symbol = await nftContract.symbol();
            console.log("SYMBOL", symbol);
            const nftMinted = await nftContract.nftOwnersCount();
            setClubTokenMinted(nftMinted);
            console.log("NFT Minted", nftMinted);
          } catch (error) {
            console.log(error);
          }
        };

        const loadSmartContractData = async () => {
          try {
            const erc20DaoContract = new SmartContract(
              erc20DaoContractABI,
              daoAddress,
              walletAddress,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
            );
            console.log("erc20DaoContract", erc20DaoContract);
            const balance = await erc20DaoContract.nftBalance(walletAddress);
            //KEEP THIS CONSOLE
            console.log(balance);
            setBalanceOfUser(balance);
            const clubTokensMinted = await erc20DaoContract.totalSupply();
            //KEEP THIS CONSOLE
            console.log("clubTokensMinted", clubTokensMinted);
            setClubTokenMinted(clubTokensMinted);

            setDepositLink(
              typeof window !== "undefined" && window.location.origin
                ? `${
                    window.location.origin
                  }/join/${Web3.utils.toChecksumAddress(daoAddress)}`
                : null,
            );
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
        // console.log("token type", tokenType);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    daoAddress,
    clubData.tokenType,
    walletAddress,
    USDC_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
  ]);

  return (
    <>
      <Layout1 page={1} depositUrl={depositLink}>
        {/* <Layout1 page={1} depositUrl={depositLink}> */}
        <Grid container paddingLeft={10} paddingTop={15} spacing={1}>
          <Grid item spacing={1} xs={9}>
            <Card className={classes.cardSharp1}>
              <Grid container spacing={2}>
                <Grid item ml={3} mt={2}>
                  <img
                    src={
                      clubDetails.clubImageUrl ? clubDetails.clubImageUrl : null
                    }
                    width="100vw"
                    alt="profile_pic"
                    className={classes.profilePic}
                  />
                </Grid>
                <Grid item ml={1} mt={4}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {clubData.name ? (
                        clubData.name
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                    <Grid container item direction="row" paddingBottom={4}>
                      <Typography variant="regularText2" mr={1}>
                        {clubDetails.noOfMembers}
                      </Typography>
                      <Typography variant="regularText2">Members</Typography>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Grid item xs={12}>
                  <Card className={classes.firstCard}>
                    <Grid item mt={3} ml={5}>
                      <Grid container item direction="column">
                        <Typography variant="regularText4" fontSize={"21px"}>
                          Treasury value
                        </Typography>
                        <Typography fontSize={"48px"} fontWeight="bold">
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
                        <CardMedia
                          image="/assets/images/treasurywallet.png"
                          component="img"
                          className={classes.media}
                          alt="ownershipshare"
                          sx={{ position: "absolute", bottom: 0 }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 5, md: 3 }}
                  direction={{ xs: "column", sm: "column", md: "column" }}
                >
                  <Card className={classes.secondCard}>
                    <CardMedia
                      image="/assets/images/ownershipshare.png"
                      component="img"
                      className={classes.media}
                      alt="ownershipshare"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        paddingTop: "4px",
                      }}
                    />
                    <Grid container>
                      <Grid
                        container
                        direction={{ xs: "column", sm: "column", md: "column" }}
                      >
                        <Grid item>
                          <Box className={classes.cardOverlay}>
                            <Typography
                              variant="regularText4"
                              fontSize={"21px"}
                            >
                              My ownership share
                            </Typography>
                            {clubData.tokenType === "erc721" ? (
                              <Typography fontSize={"48px"} fontWeight="bold">
                                {balanceOfUser !== null &&
                                clubTokenMinted !== null &&
                                isNaN(
                                  Number(
                                    (convertFromWeiGovernance(
                                      balanceOfUser,
                                      18,
                                    ) /
                                      convertFromWeiGovernance(
                                        clubTokenMinted,
                                        18,
                                      )) *
                                      100,
                                  ).toFixed(2),
                                )
                                  ? 0
                                  : Number(
                                      (convertFromWeiGovernance(
                                        balanceOfUser,
                                        18,
                                      ) /
                                        convertFromWeiGovernance(
                                          clubTokenMinted,
                                          18,
                                        )) *
                                        100,
                                    ).toFixed(2)}
                                %
                              </Typography>
                            ) : (
                              <Typography fontSize={"48px"} fontWeight="bold">
                                {balanceOfUser !== null &&
                                clubTokenMinted !== null &&
                                isNaN(
                                  Number(
                                    (convertFromWeiGovernance(
                                      balanceOfUser,
                                      18,
                                    ) /
                                      convertFromWeiGovernance(
                                        clubTokenMinted,
                                        18,
                                      )) *
                                      100,
                                  ).toFixed(2),
                                )
                                  ? 0
                                  : Number(
                                      (convertFromWeiGovernance(
                                        balanceOfUser,
                                        18,
                                      ) /
                                        convertFromWeiGovernance(
                                          clubTokenMinted,
                                          18,
                                        )) *
                                        100,
                                    ).toFixed(2)}
                                %
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                        {/* <CardMedia    className={classes.media}    component=“img”    image=“/assets/images/card_illustration.png”    alt=“abstract background”    sx={{ position: “absolute”, bottom: 0 }}                     />   */}
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Stack>
            </Card>
            <Grid item md={9}>
              <Stack>
                <Grid item>
                  <Stack
                    direction={{ xs: "column", sm: "column" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                  >
                    <Grid container item mt={8}>
                      <Typography className={classes.clubAssets}>
                        Club Assets
                      </Typography>
                    </Grid>
                    {/* <Grid container mt={4}>
                      <Grid item>
                        <ButtonDropDown label="All" />
                      </Grid>
                      <Grid item ml={2}>
                        <TextField
                          className={classes.searchField}
                          placeholder="Search by name or address"
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                type="submit"
                                sx={{ p: "10px" }}
                                aria-label="search"
                              >
                                <SearchIcon />
                              </IconButton>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid> */}
                    <Typography mt={5} mb={5} variant="subHeading">
                      Tokens
                    </Typography>
                    {tokenDetails.tokenPriceList ? (
                      tokenDetails.tokenPriceList.length ? (
                        //  if the tokens length is > 0 and if the token[0] (by default it will be Ether) is not equal to 0, then show the table
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 809 }}
                            aria-label="simple table"
                          >
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
                                      }}
                                    >
                                      <TableCell
                                        align="left"
                                        variant="tableBody"
                                      >
                                        <></>
                                        {data.symbol}
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        variant="tableBody"
                                      >
                                        {data.value}
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        variant="tableBody"
                                      >
                                        ${data.usd.usdValue}
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Grid
                          item
                          justifyContent="center"
                          alignItems="center"
                          md={10}
                        >
                          <img
                            src="/assets/images/tokens_banner.png"
                            alt="token-banner"
                            className={classes.banner}
                          />
                        </Grid>
                      )
                    ) : null}
                    <Typography mt={16} mb={5} variant="subHeading">
                      Collectibles
                    </Typography>
                    <Grid container>
                      {nftData ? (
                        nftData.length > 0 ? (
                          nftData.map((data, key) => (
                            <Grid item m={1} key={key}>
                              <CollectionCard
                                metadata={data.metadata}
                                tokenName={data.name}
                                tokenSymbol={data.symbol}
                              />
                            </Grid>
                          ))
                        ) : (
                          <Grid
                            item
                            justifyContent="center"
                            alignItems="center"
                            md={10}
                          >
                            <img
                              src="/assets/images/NFT_banner.png"
                              alt="proposal-banner"
                              className={classes.banner}
                            />
                          </Grid>
                        )
                      ) : null}
                    </Grid>
                    {/* <Typography mt={16} mb={5} variant="subHeading">Off-chain investments</Typography>
                      <BasicTable /> */}
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
          <Grid item md={3}>
            <Stack>
              <Card className={classes.fifthCard}>
                <Grid>
                  <Grid>
                    <Grid item>
                      <Typography variant="getStartedClub" fontSize={"36px"}>
                        Get started with your club 👋
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Link
                        color={"#111D38"}
                        variant="Docs"
                        className={classes.docs}
                        onClick={() => {
                          window.open(
                            `https://stationx.substack.com/p/get-started-with-stationx-on-rinkeby`,
                          );
                        }}
                      >
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

            <Stack mt={2}>
              {isAdmin ? (
                <Card className={classes.thirdCard}>
                  <Grid container m={2}>
                    <Grid item>
                      <Typography variant="regularText4">
                        Joining link
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      mr={4}
                      xs
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {depositCloseTime ? (
                        depositCloseTime * 1000 > Date.now() ? (
                          <Grid
                            container
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Grid item mt={1} mr={1}>
                              <div className={classes.activeIllustration}></div>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  color: "#0ABB92",
                                  fontSize: "1.25em",
                                  fontFamily: "Whyte",
                                }}
                              >
                                Active
                              </Typography>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid
                            container
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Grid item mt={1} mr={1}>
                              <div
                                className={classes.inactiveIllustration}
                              ></div>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  color: "#D55438",
                                  fontSize: "1.25em",
                                  fontFamily: "Whyte",
                                }}
                              >
                                In-active
                              </Typography>
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
                          typeof window !== "undefined" &&
                          window.location.origin
                            ? `${window.location.origin}/join/${clubDetails.daoAddress}`
                            : null
                        }
                        InputProps={{
                          endAdornment: (
                            <Button
                              variant="contained"
                              className={classes.copyButton}
                              onClick={handleCopy}
                            >
                              Copy
                            </Button>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item md={12} mt={4} ml={1} mr={1}>
                      <Typography variant="regularText5">
                        Share this link for new members to join your club and
                        add funds into this club.
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ) : null}
            </Stack>

            <Stack mt={2}>
              <Card className={classes.fourthCard}>
                <Grid container m={2}>
                  <Grid item>
                    <Typography className={classes.card2text1}>
                      Proposals
                    </Typography>
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
                                      sx={{ width: "100%" }}
                                    >
                                      <Grid container direction="column">
                                        <Grid item md={12}>
                                          <Typography
                                            className={classes.card5text1}
                                          >
                                            Proposed by{" "}
                                            {data.createdBy.substring(0, 6) +
                                              "......" +
                                              data.createdBy.substring(
                                                data.createdBy.length - 4,
                                              )}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography
                                            className={classes.card5text2}
                                          >
                                            {data.name}
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography
                                            className={classes.card5text1}
                                          >
                                            Expired on{" "}
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
                          variant="transparentWhite"
                          onClick={() => handleMoreClick()}
                        >
                          More
                        </Button>
                      </Grid>
                    </Grid>{" "}
                  </>
                ) : (
                  <Grid
                    container
                    pt={10}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography className={classes.card2text1}>
                        No proposals raised yet
                      </Typography>
                    </Grid>
                    {isAdmin ? (
                      <Grid item pb={15}>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            router.push(
                              {
                                pathname: `/dashboard/${daoAddress}/proposal`,
                                query: {
                                  create_proposal: true,
                                },
                              },
                              undefined,
                              {
                                shallow: true,
                              },
                            );
                          }}
                        >
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
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
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

        {/* {tweetModal && (
            <LegalEntityModal
              isTwitter={true}
              daoAddress={daoAddress}
              onClose={() => setTweetModal(false)}
            />
          )} */}
      </Layout1>
    </>
  );
};

export default ClubFetch(DashboardIndex);
