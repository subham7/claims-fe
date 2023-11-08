import ComponentHeader from "@components/common/ComponentHeader";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import {
  getAssetsByDaoAddress,
  getNFTsByDaoAddress,
  getUploadedNFT,
} from "api/assets";
import { getProposalByDaoAddress } from "api/proposal";
import { getTotalNumberOfTokenHolders } from "api/token";
import useCommonContractMethods from "hooks/useCommonContractMehods";
// import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNftsOwnedByDao } from "redux/reducers/club";
import { CHAIN_CONFIG } from "utils/constants";
import { convertFromWeiGovernance, getImageURL } from "utils/globalFunctions";
import { convertToFullNumber, formatCash } from "utils/helper";
import { useNetwork } from "wagmi";
import AssetsTable from "./AssetsTable";
import classes from "./Dashboard.module.scss";
import { tableHeader } from "../../data/dashboard";
import DashboardActivities from "./DashboardActivities";
import NoTokens from "./NoTokens";
import TreasuryItem from "./TreasuryItem";
import useAppContractMethods from "hooks/useAppContractMethods";

const Dashboard = ({ daoAddress }) => {
  const [assetType, setAssetType] = useState("erc20");
  const [tokenDetails, setTokenDetails] = useState({
    treasuryAmount: 0,
    tokenPriceList: [],
  });
  const [clubDetails, setClubDetails] = useState({
    clubImageUrl: "",
    noOfMembers: 0,
  });
  const [myShare, setMyShare] = useState(0);
  const [nftData, setNftData] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [balanceOfUser, setBalanceOfUser] = useState(0);
  const [clubTokenMinted, setClubTokenMinted] = useState(0);

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const networkId = "0x" + chain?.id.toString(16);

  const { getBalance, getDecimals, getTokenSymbol } =
    useCommonContractMethods();

  const { getNftOwnersCount, getDaoBalance, getERC20TotalSupply } =
    useAppContractMethods();

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const symbol = useSelector((state) => {
    return state.club.clubData.symbol;
  });

  const fetchImageUrl = async (daoAddress, clubDataImgUrl) => {
    let imageUrl = await getUploadedNFT(daoAddress?.toLowerCase());

    if (!imageUrl?.data.length) {
      imageUrl = await getImageURL(clubDataImgUrl);
    }

    return imageUrl;
  };

  const fetchClubDetails = async () => {
    try {
      if (daoAddress && networkId) {
        if (clubData) {
          const clubDetails = {};

          const noOfHolders = await getTotalNumberOfTokenHolders(
            CHAIN_CONFIG[networkId]?.covalentNetworkName,
            daoAddress,
          );

          const myBalance = await getBalance(daoAddress);

          const decimals = await getDecimals(daoAddress);
          const balance = convertFromWeiGovernance(
            convertToFullNumber(myBalance + ""),
            decimals,
          );

          if (tokenType === "erc721") {
            const imageUrl = await fetchImageUrl(daoAddress, clubData?.imgUrl);

            clubDetails.clubImageUrl = imageUrl?.data
              ? imageUrl?.data[0]?.imageUrl
              : imageUrl;
          }

          clubDetails.noOfMembers = noOfHolders ?? 1;
          setMyShare(balance);
          setClubDetails(clubDetails);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAssets = async () => {
    try {
      if (networkId !== "undefined") {
        const assetsData = await getAssetsByDaoAddress(
          gnosisAddress,
          networkId,
        );
        setTokenDetails({
          treasuryAmount: assetsData?.data?.treasuryAmount,
          tokenPriceList: assetsData?.data?.tokenPriceList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNfts = async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(gnosisAddress, networkId);
      setNftData(nftsData.data);
      dispatch(addNftsOwnedByDao(nftsData.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProposals = async () => {
    try {
      const activeProposals = await getProposalByDaoAddress(daoAddress);
      setProposals(activeProposals?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setAssetType(e.target.value);
  };

  const NFTImage = ({ tokenUri }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
      const fetchImageUrl = async () => {
        try {
          const response = await fetch(
            `/api/proxy?url=${encodeURIComponent(tokenUri)}`,
          );

          const metadata = await response.json();

          if (metadata.image) {
            setImageUrl(metadata.image);
          } else {
            setImageUrl("/assets/NFT_IMAGES/3.png");
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
      fetchImageUrl();
    }, [tokenUri]);

    if (!imageUrl) return;

    return (
      <img
        src={imageUrl}
        height={230}
        width={230}
        alt="NFT"
        className={classes.nft}
      />
    );
  };

  const treasuryData = [
    {
      containerClass: classes.treasuryContainer,
      iconSrc: "/assets/icons/stats_hovered.svg",
      altText: "Treasury Holdings",
      title: "Treasury Holdings",
      value: `$${Number(tokenDetails?.treasuryAmount).toFixed(3)}`,
    },
    {
      containerClass: classes.ownershipContainer,
      iconSrc: "/assets/icons/chart.svg",
      altText: "My Ownership",
      title: "My Ownership",
      value: formatCash(myShare),
      tokenName: symbol,
    },
    {
      containerClass: classes.ownershipContainer,
      iconSrc: "/assets/icons/astronaut_icon.svg",
      altText: "Total Members",
      title: "Total Members",
      value: clubDetails.noOfMembers,
    },
  ];

  useEffect(() => {
    try {
      if (daoAddress) {
        const loadNftContractData = async () => {
          try {
            const nftBalance = await getDaoBalance(daoAddress, true);
            setBalanceOfUser(nftBalance);
            const symbol = await getTokenSymbol(daoAddress);
            const nftMinted = await getNftOwnersCount();
            setClubTokenMinted(nftMinted);
          } catch (error) {
            console.log(error);
          }
        };

        const loadSmartContractData = async () => {
          try {
            const balance = await getDaoBalance(daoAddress);
            setBalanceOfUser(balance);
            const clubTokensMinted = await getERC20TotalSupply();
            setClubTokenMinted(clubTokensMinted);
          } catch (e) {
            console.log(e);
            console.log(e);
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
  }, [daoAddress, clubData.tokenType]);

  useEffect(() => {
    if (gnosisAddress && networkId && daoAddress && clubData) {
      fetchAssets();
      fetchNfts();
      fetchProposals();
      fetchClubDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gnosisAddress, networkId, daoAddress, clubData]);

  return (
    <div className={classes.main}>
      <div className={classes.leftContainer}>
        <div className={classes.headerContainer}>
          <ComponentHeader
            title={clubData?.name}
            subtext="Astronauts, welcome to your station"
          />
        </div>

        <div className={classes.flexContainer}>
          {treasuryData.map((item, index) => (
            <TreasuryItem
              key={index}
              containerClass={item.containerClass}
              iconSrc={item.iconSrc}
              altText={item.altText}
              title={item.title}
              value={item.value}
              tokenName={item.tokenName}
            />
          ))}
        </div>

        <div className={classes.assetsContainer}>
          <div className={classes.assetsType}>
            <Typography className={classes.title} variant="inherit">
              Assets
            </Typography>

            <FormControl sx={{ minWidth: 150 }}>
              <Select
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  fontFamily: "inherit",
                }}
                value={assetType}
                onChange={handleChange}
                displayEmpty>
                <MenuItem
                  sx={{
                    fontFamily: "inherit",
                  }}
                  value={"erc20"}
                  selected>
                  Tokens
                </MenuItem>
                <MenuItem
                  sx={{
                    fontFamily: "inherit",
                  }}
                  value={"erc721"}>
                  Collectibles
                </MenuItem>
              </Select>
            </FormControl>
          </div>

          {assetType === "erc20" ? (
            <>
              {tokenDetails?.tokenPriceList?.length ? (
                <AssetsTable
                  tableData={tokenDetails.tokenPriceList}
                  tableHeader={tableHeader}
                />
              ) : (
                <NoTokens
                  title="No tokens in treasury"
                  subtext="All tokens owned by your station appear here."
                />
              )}
            </>
          ) : (
            <div className={classes.collectiblesContainer}>
              {nftData.length ? (
                nftData.map((nft) => (
                  <NFTImage key={nft.token_address} tokenUri={nft.token_uri} />
                ))
              ) : (
                <NoTokens
                  title="No collectibles in treasury"
                  subtext="All NFTs owned by your station appear here."
                />
              )}
            </div>
          )}
        </div>
      </div>

      <DashboardActivities
        daoAddress={daoAddress}
        proposals={proposals}
        networkId={networkId}
      />
    </div>
  );
};

export default Dashboard;
