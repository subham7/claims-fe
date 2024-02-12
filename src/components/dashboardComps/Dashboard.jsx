import ComponentHeader from "@components/common/ComponentHeader";
import { Tab, Tabs } from "@mui/material";
import { getAssetsOfWallet, getNFTsByWallet, getUploadedNFT } from "api/assets";
import { getProposalByDaoAddress } from "api/proposal";
import { getTotalNumberOfTokenHolders } from "api/token";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNftsOwnedByDao } from "redux/reducers/club";
import { CHAIN_CONFIG } from "utils/constants";
import { convertFromWeiGovernance, getImageURL } from "utils/globalFunctions";
import { convertToFullNumber } from "utils/helper";
import { useNetwork } from "wagmi";
import AssetsTable from "./AssetsTable";
import classes from "./Dashboard.module.scss";
import { tableHeader } from "../../data/dashboard";
import DashboardActivities from "./DashboardActivities";
import NoTokens from "./NoTokens";
import TreasuryItem from "./TreasuryItem";
import InviteModal from "@components/modals/InviteModal";
import { fetchClubByDaoAddress, getTotalTreasuryAmount } from "api/club";
import WalletsTabs from "./WalletsTabs";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useRouter } from "next/router";
import StatusModal from "@components/modals/StatusModal/StatusModal";

const Dashboard = ({ daoAddress, routeNeteworkId }) => {
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const networkId = "0x" + chain?.id.toString(16);

  const router = useRouter();
  const { create, join } = router.query;

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
  const [showTwitterModal, setShowTwitterModal] = useState(true);

  const { getBalance, getDecimals } = useCommonContractMethods();
  const { getERC20TotalSupply, getNftOwnersCount } = useAppContractMethods({
    daoAddress,
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
          let totalSupply, totalNftMinted, percentageShare, balance, myBalance;

          const noOfHolders = await getTotalNumberOfTokenHolders(
            CHAIN_CONFIG[networkId]?.covalentNetworkName,
            daoAddress,
          );

          if (tokenType === "erc20") {
            totalSupply = await getERC20TotalSupply();
            myBalance = await getBalance(daoAddress);
            balance = convertFromWeiGovernance(
              convertToFullNumber(myBalance + ""),
              18,
            );

            percentageShare =
              (balance / Number(convertFromWeiGovernance(totalSupply, 18))) *
              100;
          } else if (tokenType === "erc721") {
            totalNftMinted = await getNftOwnersCount();
            myBalance = await getBalance(daoAddress);
            percentageShare =
              (Number(myBalance) / Number(totalNftMinted)) * 100;
          }

          if (tokenType === "erc721") {
            const imageUrl = await fetchImageUrl(daoAddress, clubData?.imgUrl);

            clubDetails.clubImageUrl = imageUrl?.data
              ? imageUrl?.data[0]?.imageUrl
              : imageUrl;
          }

          clubDetails.noOfMembers = noOfHolders ?? 1;

          setMyShare(percentageShare ? Number(percentageShare) : 0);

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
        const assetsData = await getAssetsOfWallet(
          currentEOAWallet.walletAddress
            ? currentEOAWallet.walletAddress
            : gnosisAddress,
        );
        setTokenDetails({
          tokenPriceList: assetsData?.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNfts = async () => {
    try {
      const nftsData = await getNFTsByWallet(currentEOAWallet.walletAddress);
      setNftData(nftsData?.data?.data);
      dispatch(addNftsOwnedByDao(nftsData?.data?.data));
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
        const assetsData = await getTotalTreasuryAmount(
          daoAddress.toLowerCase(),
        );

        setTreasuryAmount(assetsData?.balance);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event, newValue) => {
    setAssetType(newValue);
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
      value: myShare.toFixed(2),
      tokenName: symbol,
      isOwnership: true,
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
    if (
      currentEOAWallet &&
      networkId &&
      daoAddress &&
      clubData &&
      gnosisAddress
    ) {
      fetchAssets();
      fetchNfts();
    }
  }, [currentEOAWallet, gnosisAddress, networkId, daoAddress, clubData]);

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
              isOwnership={item.isOwnership}
            />
          ))}
        </div>

        <div className={classes.assetsContainer}>
          <WalletsTabs
            allEOAWallets={allEOAWallets}
            classes={classes}
            currentEOAWallet={currentEOAWallet}
            currentEOAWalletChangeHandler={currentEOAWalletChangeHandler}
            gnosisAddress={gnosisAddress}
            networkId={networkId}
          />

          <Tabs
            TabIndicatorProps={{
              style: { backgroundColor: "#fff" },
            }}
            textColor="inherit"
            value={assetType}
            onChange={handleChange}>
            <Tab
              sx={{
                fontFamily: "inherit",
                textTransform: "none",
              }}
              value="erc20"
              label="Crypto"
            />
            <Tab
              sx={{
                fontFamily: "inherit",
                textTransform: "none",
              }}
              value="erc721"
              label="NFTs"
            />
          </Tabs>

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
              {nftData?.length ? (
                nftData?.map((nft) => {
                  return nft.collection_assets.map((asset, index) => {
                    const n = asset?.assets[0] ?? {};
                    return (
                      <img
                        onClick={() => {
                          window.open(
                            `https://opensea.io/assets/matic/${
                              asset?.contract_address
                            }/${n?.token_id ?? "0"}`,
                            "_blank",
                          );
                        }}
                        key={"nft" + index}
                        src={n?.image_uri ?? "/assets/NFT_IMAGES/3.png"}
                        alt={n?.contract_name ?? "NFT"}
                        height={230}
                        width={230}
                        className={classes.nft}
                      />
                    );
                  });
                })
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

      {(create || join) && showTwitterModal && (
        <StatusModal
          onClose={() => setShowTwitterModal(false)}
          heading={`Successfully ${
            create ? "created" : join ? "joined" : ""
          } a station`}
          subheading={"Let your friends know what they are missing out!"}
          buttonText={"Share on Twitter"}
          onButtonClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=I've become a member of ${clubData?.name} by joining their station on @stationxnetwork %0A%0AJoin the station:
              https://app.stationx.network/join/${daoAddress}/${networkId}`,
              "_blank",
            );
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
