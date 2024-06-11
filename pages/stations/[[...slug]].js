/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import Layout from "@components/layouts/layout";
// import InviteCard from "@components/cards/InviteCard";
import { Typography } from "@components/ui";
import Web3 from "web3";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addClubData } from "redux/reducers/club";
import {
  queryStationDataFromSubgraph,
  queryStationListFromSubgraph,
} from "utils/stationsSubgraphHelper";
import { useAccount } from "wagmi";
import { makeStyles } from "@mui/styles";
import { getReferralCode } from "api/invite/invite";
import {
  CHAIN_CONFIG,
  OMIT_DAOS,
  stationNetworksChainId,
  supportedNetworksChaindId,
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
    width: "12rem",
    height: "13rem",
    top: "3.8rem",
    right: 0,
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
  selectedNetwork: {
    display: "flex",
    width: "100%",
    padding: "0.8rem",
    color: "#db2777",
    backgroundColor: "#1D1D1D",
    alignItems: "center",
    justifyContent: "start",
    cursor: "pointer",
    border: "none",
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
  sectionHeader: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    display: "flex",
    gap: 5,
    alignItems: "center",
    justifyContent: "space-between",
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
    "&:hover": {
      backgroundColor: "#1D1D1D",
    },
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
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationHeader: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: 6,
    alignItems: "start",
  },
  stationTitle: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    fontSize: "1.2rem",
    fontWeight: 500,
    lineHeight: 1,
    alignItems: "center",
    cursor: "pointer",
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
  stationFunding: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    fontSize: "0.8rem",
    fontWeight: 300,
    alignItems: "center",
  },
  stationMetadata: {
    fontSize: "0.875rem",
    fontWeight: 300,
    color: "#707070",
  },
  option: {
    position: "relative",
  },
  optionButton: {
    width: "fit-content",
    color: "#707070",
    background: "none",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      color: "#ffffff",
    },
  },
  optionDropdown: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: "11rem",
    top: "1.5rem",
    right: 0,
    alignItems: "start",
    backgroundColor: "#111111",
    border: "1px solid #1D1D1D",
    borderRadius: "0.6375rem",
    zIndex: 100,
  },
  optionDropdownButton: {
    display: "flex",
    width: "100%",
    padding: "0.8rem",
    color: "white",
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "start",
    cursor: "pointer",
    border: "none",
    borderRadius: "0.6375rem",
    "&:hover": {
      backgroundColor: "#181818",
    },
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
  const dispatch = useDispatch();
  const [clubListData, setClubListData] = useState([]);
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { getDaoDetails } = useAppContractMethods();
  const { getDecimals, getTokenSymbol } = useCommonContractMethods();
  const dropdownRef = useRef(null);

  const handleCreateButtonClick = async () => {
    const { pathname } = router;

    if (pathname.includes("/stations")) {
      router.push("/create");
    }
  };

  const handleItemClick = async (daoAddress, networkId) => {
    try {
      const clubData = await queryStationDataFromSubgraph(
        daoAddress,
        networkId,
      );
      const daoDetails = await getDaoDetails(daoAddress);

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
        `/dashboard/${Web3.utils.toChecksumAddress(daoAddress)}/${networkId}`,
        undefined,
        {
          shallow: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleNetwork = (networkId) => {
    setSelectedNetworks((prev) =>
      prev.includes(networkId)
        ? prev.filter((id) => id !== networkId)
        : [...prev, networkId],
    );
  };

  const getImage = async (daoAddress) => {
    const imageData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}club/${daoAddress}/file`,
    );
    return imageData;
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
        const stations = await queryStationListFromSubgraph(
          "0x66264a63FcE8BAcF52E36a4f005179D71514aD8e",
        );

        if (stations?.data?.clubs) setClubListData(stations.data.clubs);

        const imageData = await Promise.all(
          stations.data.clubs.map((club) => getImage(club.daoAddress)),
        );
        const filteredImageData = imageData.filter((image) => image.data);
        setClubListData((prev) =>
          prev.map((club, index) => {
            return {
              ...club,
              imageUrl: filteredImageData[index]?.data[0]?.imageUrl,
            };
          }),
        );

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (walletAddress) fetchClubs();
  }, [walletAddress]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const filteredClubs = selectedNetworks.length
    ? filteredSearchClubs.filter((club) =>
        selectedNetworks.includes(club?.networkId),
      )
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
                {stationNetworksChainId.map((network, key) => {
                  const networkId = supportedNetworksChaindId.filter(
                    (chain) => chain?.chainId === network.id,
                  )[0]?.networkId;
                  const isSelected = selectedNetworks.includes(networkId);
                  return (
                    <button
                      key={key}
                      className={
                        isSelected
                          ? classes.selectedNetwork
                          : classes.filterOption
                      }
                      onClick={() => {
                        handleToggleNetwork(networkId);
                      }}>
                      <span
                        style={{
                          display: "flex",
                          gap: 10,
                          fontSize: "1rem",
                          alignItems: "center",
                        }}>
                        <Image
                          alt={CHAIN_CONFIG[networkId]?.shortName}
                          src={CHAIN_CONFIG[networkId]?.logoUri}
                          width={10}
                          height={10}
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: "white",
                            borderRadius: "1rem",
                          }}
                        />
                        {network.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className={classes.section}>
          <span className={classes.sectionHeader}>
            <Typography className={classes.sectionTitle}>
              My stations{" "}
              {filteredClubs.length > 0 && (
                <p className={classes.sectionSubtitle}>
                  ({filteredClubs.length})
                </p>
              )}
            </Typography>
            {clubListData.length > 0 && (
              <p className={classes.sectionSubtitle}>
                Total Stations: {clubListData.length}
              </p>
            )}
          </span>
          <div className={classes.stations}>
            {walletAddress && filteredClubs.length ? (
              filteredClubs
                .filter((club) => !OMIT_DAOS.includes(club.daoAddress))
                .map((club, key) => {
                  return (
                    <div className={classes.station} key={key}>
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
                          <Typography
                            className={classes.stationTitle}
                            onClick={() => {
                              handleItemClick(club.daoAddress, club.networkId);
                            }}>
                            {club?.name}{" "}
                            <span className={classes.stationBadge}>
                              {club?.tokenType == "erc721"
                                ? "NFT"
                                : club?.tokenType}
                            </span>
                          </Typography>
                          <Typography className={classes.stationMetadata}>
                            {club?.membersCount}{" "}
                            {club?.membersCount > 1 ? "members" : "member"}
                          </Typography>
                        </div>
                        <Typography className={classes.stationFunding}>
                          {club?.totalAmountRaised}{" "}
                          {club?.depositTokenAddress !==
                          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" ? (
                            <p>ETH</p>
                          ) : (
                            <p>USDC</p>
                          )}
                        </Typography>
                      </div>
                      <div className={classes.option} ref={dropdownRef}>
                        {selectedIndex === key && (
                          <div className={classes.optionDropdown}>
                            <button
                              className={classes.optionDropdownButton}
                              onClick={() => {}}>
                              Joining Page
                            </button>
                            <button
                              className={classes.optionDropdownButton}
                              onClick={() => {}}>
                              Copy Treasury Address
                            </button>
                          </div>
                        )}
                        <button
                          className={classes.optionButton}
                          onClick={() => {
                            setSelectedIndex((prevIndex) =>
                              prevIndex === key ? null : key,
                            );
                          }}>
                          <SlOptionsVertical />
                        </button>
                      </div>
                    </div>
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
