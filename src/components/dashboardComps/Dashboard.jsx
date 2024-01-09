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
import { convertToFullNumber, formatCash, shortAddress } from "utils/helper";
import { useNetwork } from "wagmi";
import AssetsTable from "./AssetsTable";
import classes from "./Dashboard.module.scss";
import { tableHeader } from "../../data/dashboard";
import DashboardActivities from "./DashboardActivities";
import NoTokens from "./NoTokens";
import TreasuryItem from "./TreasuryItem";
import InviteModal from "@components/modals/InviteModal";
import { fetchClubByDaoAddress } from "api/club";
import Image from "next/image";

const Dashboard = ({ daoAddress, routeNeteworkId }) => {
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const networkId = "0x" + chain?.id.toString(16);

  const [assetType, setAssetType] = useState("erc20");
  const [tokenDetails, setTokenDetails] = useState({
    tokenPriceList: [],
  });
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const [clubDetails, setClubDetails] = useState({
    clubImageUrl: "",
    noOfMembers: 0,
  });
  const [myShare, setMyShare] = useState(0);
  const [nftData, setNftData] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentEOAWallet, setCurrentEOAWallet] = useState({
    walletAddress: gnosisAddress,
    walletName: "Treasury",
    networkId,
  });
  const [allEOAWallets, setAllEOAWallets] = useState([]);

  const { getBalance, getDecimals } = useCommonContractMethods();

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
          currentEOAWallet.walletAddress,
          currentEOAWallet.networkId,
        );
        setTokenDetails({
          tokenPriceList: assetsData?.data?.tokenPriceList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNfts = async () => {
    try {
      const nftsData = await getNFTsByDaoAddress(
        currentEOAWallet.walletAddress,
        currentEOAWallet.networkId,
      );
      setNftData(nftsData.data.items);
      dispatch(addNftsOwnedByDao(nftsData.data.items));
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

  const fetchTreasuryDetails = async () => {
    try {
      if (networkId !== "undefined") {
        const assetsData = await getAssetsByDaoAddress(
          gnosisAddress,
          networkId,
        );

        setTreasuryAmount(assetsData?.data?.treasuryAmount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setAssetType(e.target.value);
  };

  const currentEOAWalletChangeHandler = (e) => {
    setCurrentEOAWallet({
      walletAddress: e.target.value.walletAddress,
      networkId: e.target.value.networkId,
      walletName: e.target.value.walletName,
    });
  };

  const fetchAllWallets = async () => {
    try {
      const data = await fetchClubByDaoAddress(daoAddress);
      setAllEOAWallets(data.data.hotWallets);
    } catch (error) {
      console.log(error);
    }
  };

  const treasuryData = [
    {
      containerClass: classes.treasuryContainer,
      iconSrc: "/assets/icons/stats_hovered.svg",
      altText: "Treasury Holdings",
      title: "Treasury Holdings",
      value: `$${Number(treasuryAmount).toFixed(3)}`,
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
    if (gnosisAddress && networkId && daoAddress && clubData) {
      fetchProposals();
      fetchClubDetails();
      fetchTreasuryDetails();
      fetchAllWallets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gnosisAddress, networkId, daoAddress, clubData]);

  useEffect(() => {
    if (currentEOAWallet && networkId && daoAddress && clubData) {
      fetchAssets();
      fetchNfts();
    }
  }, [currentEOAWallet]);

  return (
    <div className={classes.main}>
      <div className={classes.leftContainer}>
        <div className={classes.headerContainer}>
          <ComponentHeader
            title={clubData?.name}
            subtext="Astronauts, welcome to your station"
            showButton
            buttonText="Send Invite"
            onClickHandler={() => setShowInviteModal(true)}
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
            {/* <Typography className={classes.title} variant="inherit">
              Assets
            </Typography> */}

            <FormControl sx={{ minWidth: 150 }}>
              <Select
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  fontFamily: "inherit",
                }}
                value={currentEOAWallet}
                onChange={currentEOAWalletChangeHandler}
                displayEmpty>
                <MenuItem
                  sx={{
                    fontFamily: "inherit",
                  }}
                  value={{
                    walletAddress: gnosisAddress,
                    walletName: "Treasury",
                    networkId,
                  }}
                  selected>
                  Treasury
                </MenuItem>
                {allEOAWallets.map((wallet) => (
                  <MenuItem
                    key={`${wallet.walletAddress}${wallet.networkId}`}
                    sx={{
                      fontFamily: "inherit",
                    }}
                    value={wallet}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "4px",
                      }}>
                      <Image
                        src={`/assets/networks/${wallet.networkId}.png`}
                        height={20}
                        width={20}
                        alt={wallet.networkId}
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="inherit" fontSize={14}>
                        {wallet.walletName
                          ? wallet.walletName
                          : shortAddress(wallet.walletAddress)}
                      </Typography>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                nftData.map((nft, index) => (
                  <img
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/matic/${nft.contract_address}/${nft?.nft_data[0]?.token_id}`,
                        "_blank",
                      );
                    }}
                    key={
                      nft?.nft_data[0]?.token_id
                        ? nft?.nft_data[0]?.token_id
                        : index
                    }
                    src={
                      nft?.nft_data[0]?.external_data?.image_1024
                        ? nft?.nft_data[0]?.external_data?.image_1024
                        : "/assets/NFT_IMAGES/3.png"
                    }
                    alt={nft?.contract_name ? nft?.contract_name : "NFT"}
                    height={230}
                    width={230}
                    className={classes.nft}
                  />
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

      {showInviteModal && (
        <InviteModal
          daoAddress={daoAddress}
          networkId={networkId}
          onClose={() => {
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
