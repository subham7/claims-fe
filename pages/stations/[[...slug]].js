/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Layout from "@components/layouts/layout";
// import InviteCard from "@components/cards/InviteCard";
import { Typography } from "@components/ui";
import Web3 from "web3";
import { useDispatch } from "react-redux";
import { addClubData } from "redux/reducers/club";
import {
  queryStationDataFromSubgraph,
  queryStationListFromSubgraph,
} from "utils/stationsSubgraphHelper";
import { useAccount, useChainId } from "wagmi";
import { makeStyles } from "@mui/styles";
import { getReferralCode } from "api/invite/invite";
import {
  CHAIN_CONFIG,
  OMIT_DAOS,
  dropsNetworksChaindId,
  stationNetworksChainId,
} from "utils/constants";
import { convertToFullNumber } from "utils/helper";
import { useRouter } from "next/router";
import BackdropLoader from "@components/common/BackdropLoader";
import useAppContractMethods from "hooks/useAppContractMethods";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { BigNumber } from "bignumber.js";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { HiSearch } from "react-icons/hi";
import { RiFilter3Fill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { GoPlus } from "react-icons/go";
import Image from "next/image";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingLeft: "35rem",
    paddingRight: "35rem",
    paddingTop: "3rem",
    gap: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xl")]: {
      paddingLeft: "20rem",
      paddingRight: "20rem",
    },
    [theme.breakpoints.down("lg")]: {
      paddingLeft: "12rem",
      paddingRight: "12rem",
    },
    [theme.breakpoints.down("md")]: {
      paddingLeft: "6rem",
      paddingRight: "6rem",
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0.25rem",
      paddingRight: "0.25rem",
    },
  },
  header: {
    display: "flex",
    width: "100%",
    alignItems: "end",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.975rem",
    fontWeight: 500,
    lineHeight: 1,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    padding: "0.625rem 1.25rem",
    gap: "0.4rem",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "0px",
    borderRadius: "0.6375rem",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#e5e5e5",
    },
  },
  filter: {
    display: "flex",
    width: "100%",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchIcon: {
    color: "#707070",
  },
  searchBar: {
    display: "flex",
    width: "80%",
    borderRadius: "0.6375rem",
    padding: "0.8rem",
    backgroundColor: "#181818",
    border: "1px solid #1D1D1D",
    alignItems: "center",
    justifyContent: "start",
  },
  searchInput: {
    marginLeft: "0.825rem",
    width: "90%",
    backgroundColor: "transparent",
    color: "#cccccc",
    border: "none",
    outline: "none",
  },
  chainFilter: {
    width: "20%",
    position: "relative",
  },
  filterButton: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderRadius: "0.6375rem",
    padding: "0.8rem",
    gap: "0.5rem",
    fontSize: "0.9625rem",
    color: "white",
    backgroundColor: "#181818",
    border: "1px solid #1D1D1D",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  filterDropdown: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: "11rem",
    height: "13rem",
    top: "3.5rem",
    alignItems: "start",
    overflowY: "scroll",
    backgroundColor: "#181818",
    borderRadius: "0.6375rem",
    zIndex: 100,
  },
  filterOption: {
    display: "flex",
    width: "100%",
    padding: "0.8rem",
    color: "white",
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "start",
    cursor: "pointer",
    border: "none",
    "&:hover": {
      backgroundColor: "#1D1D1D",
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "1.5rem",
    gap: "1rem",
    backgroundColor: "#141414",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: "0.6375rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 300,
  },
  sectionSubtitle: {
    color: "#707070",
  },
  stations: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    width: "100%",
    overflowY: "scroll",
    maxHeight: "60vh",
  },
  station: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    gap: "0.8rem",
    width: "100%",
    backgroundColor: "transparent",
    paddingBlock: "1.2rem",
    paddingInline: "1.5rem",
    border: "1px solid #1D1D1D",
    borderRadius: "0.6375rem",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationImage: {
    width: 60,
    height: 60,
    background: "linear-gradient(to top left, #D9D9D9, #737373)",
    borderRadius: "0.6375rem",
    objectFit: "cover",
  },
  stationInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
    width: "75%",
  },
  stationHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "start",
    justifyContent: "space-between",
  },
  stationTitle: {
    fontSize: "1.2rem",
    fontWeight: 500,
    lineHeight: 1,
  },
  stationBadge: {
    paddingInline: "0.6rem",
    paddingBlock: "0.2rem",
    backgroundColor: "#1D1D1D",
    color: "#707070",
    textTransform: "uppercase",
    borderRadius: "0.6375rem",
    fontSize: "0.75rem",
  },
  stationYield: {
    fontSize: "1.2rem",
    fontWeight: 300,
  },
  stationSubTitle: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationMetadata: {
    fontSize: "0.875rem",
    fontWeight: 300,
    color: "#707070",
  },
  option: {
    color: "#707070",
    cursor: "pointer",
  },
  chainIcon: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "white",
    top: "1rem",
    left: "1rem",
    borderRadius: "1rem",
  },
}));

const StationsPage = () => {
  const classes = useStyles();
  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);
  const dispatch = useDispatch();
  const [clubListData, setClubListData] = useState([]);
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [network, setNetwork] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { getDaoDetails } = useAppContractMethods();
  const { getDecimals, getTokenSymbol } = useCommonContractMethods();

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

      const depositTokenDecimal = await getDecimals(
        daoDetails.depositTokenAddress,
      );
      const depositTokenSymbol = await getTokenSymbol(
        daoDetails.depositTokenAddress,
      );

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
            maxTokensPerUser: clubData.stations[0].maxTokensPerUser,
            depositTokenDecimal,
            depositTokenSymbol,
            ...daoDetails,

            raiseAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].raiseAmount,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].raiseAmount,
              bigNumberValue: BigNumber(clubData.stations[0].raiseAmount),
            },

            totalAmountRaisedFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].totalAmountRaised,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].totalAmountRaised,
              bigNumberValue: BigNumber(clubData.stations[0].totalAmountRaised),
            },

            distributionAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                daoDetails.distributionAmount.toString(),
                18,
              ),
              actualValue: daoDetails.distributionAmount.toString(),
              bigNumberValue: BigNumber(
                daoDetails.distributionAmount.toString(),
              ),
            },

            minDepositAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].minDepositAmount,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].minDepositAmount,
              bigNumberValue: BigNumber(clubData.stations[0].minDepositAmount),
            },

            maxDepositAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].maxDepositAmount,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].maxDepositAmount,
              bigNumberValue: BigNumber(clubData.stations[0].maxDepositAmount),
            },

            pricePerTokenFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.stations[0].pricePerToken,
                depositTokenDecimal,
              ),
              actualValue: clubData.stations[0].pricePerToken,
              bigNumberValue: BigNumber(clubData.stations[0].pricePerToken),
            },

            distributionAmount: convertToFullNumber(
              daoDetails.distributionAmount.toString(),
            ),
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
        const stations = await queryStationListFromSubgraph(walletAddress);

        if (stations?.data?.clubs) setClubListData(stations.data.clubs);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (walletAddress) fetchClubs();
  }, [walletAddress]);

  if (isUserWhitelisted === null || isLoading) {
    return (
      <Layout showSidebar={false} faucet={false}>
        <BackdropLoader isOpen={true} showLoading={true} />
      </Layout>
    );
  }

  const filteredSearchClubs = searchQuery
    ? clubListData.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : clubListData;

  const filteredClubs = network
    ? filteredSearchClubs.filter((club) => club?.networkId === network)
    : filteredSearchClubs;

  return (
    <Layout showSidebar={false} faucet={false}>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography className={classes.title}>GM, anon!</Typography>
          <button className={classes.button} onClick={handleCreateButtonClick}>
            <GoPlus size={22} /> Create station
          </button>
        </div>
        <div className={classes.filter}>
          <div className={classes.searchBar}>
            <HiSearch size={25} className={classes.searchIcon} />
            <input
              className={classes.searchInput}
              placeholder="Search your stations by name, owner, ticker..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
          <div className={classes.chainFilter}>
            <button
              className={classes.filterButton}
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}>
              <RiFilter3Fill size={25} />
              Chains
            </button>
            {isOpen && (
              <div className={classes.filterDropdown}>
                {stationNetworksChainId.map((network, key) => (
                  <button
                    key={key}
                    className={classes.filterOption}
                    onClick={() => {
                      const networkId = dropsNetworksChaindId.filter(
                        (chain) => chain?.chainId === network.id,
                      )[0]?.networkId;
                      setNetwork(networkId);
                      setIsOpen(false);
                    }}>
                    <p style={{ fontSize: "1rem" }}>{network.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={classes.section}>
          <Typography className={classes.sectionTitle}>
            My stations{" "}
            {clubListData.length > 0 && (
              <span className={classes.sectionSubtitle}>
                ({clubListData.length})
              </span>
            )}
          </Typography>
          <div className={classes.stations}>
            {walletAddress && filteredClubs.length ? (
              filteredClubs
                .filter((club) => !OMIT_DAOS.includes(club.daoAddress))
                .map((club, key) => {
                  return (
                    <button className={classes.station} key={key}>
                      <Image
                        src={CHAIN_CONFIG[club?.networkId]?.logoUri}
                        alt={CHAIN_CONFIG[club?.networkId]?.shortName}
                        width={10}
                        height={10}
                        className={classes.chainIcon}
                      />
                      {club?.imageUrl ? (
                        <img
                          src={club?.imageUrl}
                          alt="stationImage"
                          width={50}
                          height={50}
                          className={classes.stationImage}
                        />
                      ) : (
                        <span className={classes.stationImage}></span>
                      )}
                      <div className={classes.stationInfo}>
                        <div className={classes.stationHeader}>
                          <Typography className={classes.stationTitle}>
                            {club?.name}{" "}
                            <span className={classes.stationBadge}>
                              {club?.tokenType == "erc721"
                                ? "NFT"
                                : club?.tokenType}
                            </span>
                          </Typography>
                          <Typography className={classes.stationYield}>
                            7.6%
                          </Typography>
                        </div>
                        <div className={classes.stationSubTitle}>
                          <Typography className={classes.stationMetadata}>
                            ⚡️ Admin • {club?.membersCount}{" "}
                            {club?.membersCount > 1 ? "members" : "member"}
                          </Typography>
                          <Typography className={classes.stationMetadata}>
                            {club?.totalAmountRaised} USDC
                          </Typography>
                        </div>
                      </div>
                      <SlOptionsVertical className={classes.option} />
                    </button>
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
      </div>
    </Layout>
  );
};

export default StationsPage;
