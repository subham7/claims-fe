import ComponentHeader from "@components/common/ComponentHeader";
import { Tab, Tabs } from "@mui/material";
import { getAssetsOfWallet, getNFTsByWallet } from "api/assets";
import { getProposalByDaoAddress } from "api/proposal";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNftsOwnedByDao } from "redux/reducers/club";
import { customToFixedAutoPrecision, handleSignMessage } from "utils/helper";
import { useAccount, useNetwork } from "wagmi";
import AssetsTable from "./AssetsTable";
import classes from "./Dashboard.module.scss";
import DashboardActivities from "./DashboardActivities";
import NoTokens from "./NoTokens";
import TreasuryItem from "./TreasuryItem";
import InviteModal from "@components/modals/InviteModal";
import {
  createStation,
  fetchClubByDaoAddress,
  getTotalTreasuryAmount,
} from "api/club";
import WalletsTabs from "./WalletsTabs";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useRouter } from "next/router";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import CreateClubModal from "@components/modals/CreateClubModal/CreateClubModal";
import BackdropLoader from "@components/common/BackdropLoader";
import DashboardActionContainer from "./dashboardActions/DashboardActionContainer";
import { BigNumber } from "bignumber.js";
import LineaCreateModal from "@components/modals/LineaCreateModal/LineaCreateModal";
import LineaCampaignModal from "@components/modals/LineaCreateModal/LineaCampaignModal";
import { IoMdHelp } from "react-icons/io";
import LineaHelperSteps from "./lineaHelperSteps/LineaHelperSteps";

const Dashboard = ({ daoAddress, routeNetworkId }) => {
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const networkId = "0x" + chain?.id.toString(16);
  const { address: walletAddress } = useAccount();

  const router = useRouter();
  const { create, join } = router.query;

  const [assetType, setAssetType] = useState("erc20");
  const [tokenDetails, setTokenDetails] = useState({
    tokenPriceList: [],
  });
  const [treasuryAmount, setTreasuryAmount] = useState(0);
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
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLineaCampaignModal, setShowLineaCampaignModal] = useState(false);
  const [showHelperSteps, setShowHelperSteps] = useState(false);

  const { getBalance } = useCommonContractMethods({ routeNetworkId });
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

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const fetchClubDetails = async () => {
    try {
      if (daoAddress && networkId) {
        if (clubData) {
          let percentageShare;

          const myBalance = await getBalance(daoAddress);

          if (myBalance === 0) {
            setMyShare(0);
            return;
          }

          if (tokenType === "erc20") {
            const totalSupply = await getERC20TotalSupply();
            percentageShare = BigNumber(myBalance)
              .dividedBy(totalSupply?.bigNumberValue)
              .times(100)
              .toFixed(4);
          } else if (tokenType === "erc721") {
            const totalNftMinted = await getNftOwnersCount();
            percentageShare = BigNumber(myBalance)
              .dividedBy(totalNftMinted?.bigNumberValue)
              .times(100)
              .toFixed(4);
          }
          setMyShare(percentageShare ? Number(percentageShare) : 0);
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

      if (data.data?.message === "Club not found") {
        setShowCreateClubModal(true);
      }
      setAllEOAWallets(data.data.hotWallets);
    } catch (error) {
      console.log(error);
    }
  };

  const createClubHandler = async () => {
    try {
      setLoading(true);
      const payload = {
        depositConfig: {
          subscriptionDocId: null,
          enableKyc: false,
          uploadDocId: null,
        },
        name: clubData?.name,
        daoAddress: daoAddress,
        votingStrategy: "onePersonOneVote",
        safeAddress: gnosisAddress,
        networkId,
        tokenType: tokenType === "erc721" ? "erc721" : "erc20NonTransferable",
      };

      const { signature } = await handleSignMessage(
        walletAddress,
        JSON.stringify(payload),
      );

      const res = await createStation({ ...payload, signature });

      if (res === 201) {
        setShowCreateClubModal(false);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const treasuryData = [
    {
      containerClass: classes.treasuryContainer,
      iconSrc: "/assets/icons/stats_hovered.svg",
      altText: "Balance",
      title: "Balance",
      value: `$${customToFixedAutoPrecision(treasuryAmount)}`,
    },
    {
      containerClass: classes.ownershipContainer,
      iconSrc: "/assets/icons/chart.svg",
      altText: "My Ownership",
      title: "My Ownership",
      value: customToFixedAutoPrecision(myShare),
      tokenName: symbol,
      isOwnership: true,
    },
    {
      containerClass: classes.ownershipContainer,
      iconSrc: "/assets/icons/astronaut_icon.svg",
      altText: "Members",
      title: "Members",
      value: clubData?.membersCount,
    },
  ];

  useEffect(() => {
    if (gnosisAddress && networkId && daoAddress) {
      fetchProposals();
      fetchClubDetails();
      fetchTreasuryDetails();
      fetchAllWallets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gnosisAddress, networkId, daoAddress]);

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
            subtext={`$${clubData?.symbol}`}
            showButton={routeNetworkId === "0xe708" ? true : false}
            buttonText="Join Campaign"
            onClickHandler={() => {
              setShowLineaCampaignModal(true);
            }}
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

        {isAdmin && (
          <DashboardActionContainer
            daoAddress={daoAddress}
            gnosisAddress={gnosisAddress}
            networkId={networkId}
            tokenType={tokenType}
          />
        )}

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
                <AssetsTable tableData={tokenDetails.tokenPriceList} />
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

      {(create || join) && showTwitterModal && routeNetworkId !== "0xe708" && (
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

      {create && showTwitterModal && routeNetworkId === "0xe708" && (
        <LineaCreateModal onClose={() => setShowTwitterModal(false)} />
      )}

      {showCreateClubModal ? (
        <CreateClubModal onClick={createClubHandler} />
      ) : null}

      <BackdropLoader isOpen={loading} />

      {showLineaCampaignModal ? (
        <LineaCampaignModal
          onClose={() => {
            setShowLineaCampaignModal(false);
          }}
        />
      ) : null}

      <div
        onClick={() => {
          setShowHelperSteps(!showHelperSteps);
        }}
        className={classes.helpContainer}>
        <IoMdHelp />
      </div>

      {showHelperSteps ? (
        <LineaHelperSteps
          onClose={() => {
            setShowHelperSteps(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
