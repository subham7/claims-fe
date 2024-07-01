import ComponentHeader from "@components/common/ComponentHeader";
import { Tab, Tabs, Typography } from "@mui/material";
import { getAssetsOfWallet, getNFTsByWallet } from "api/assets";
import { getProposalByDaoAddress } from "api/proposal";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "redux/loader/actions";
import { isLoading } from "redux/loader/selectors";
import { addNftsOwnedByDao } from "redux/reducers/club";
import { customToFixedAutoPrecision, handleSignMessage } from "utils/helper";
import { useAccount, useChainId, useSignMessage } from "wagmi";
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
import LineaHelperSteps from "./lineaHelperSteps/LineaHelperSteps";
import InviteMemberModal from "@components/modals/LineaCreateModal/InviteMemberModal";
import CustomiseContributionModal from "@components/modals/LineaCreateModal/CustomiseContributionModal";
import AdminFeeModal from "@components/modals/LineaCreateModal/AdminFeeModal";
import TreasuryModal from "@components/modals/LineaCreateModal/TreasuryModal";
import TokenGateModal from "@components/modals/LineaCreateModal/TokenGateModal";
import WhiteListModal from "@components/modals/LineaCreateModal/WhiteListDepositModal";
import SendModal from "@components/modals/LineaCreateModal/SendModal";
import DistributeModal from "@components/modals/LineaCreateModal/DistributeModal";
import EditKYCModal from "@components/modals/LineaCreateModal/EditKYCModal";
import EditDeadlineMdoal from "@components/modals/LineaCreateModal/EditDeadlineModal";
import AddRemoveAdminModal from "@components/modals/LineaCreateModal/AddRemoveAdminModal";
import CreateSurveyModal from "@components/modals/LineaCreateModal/CreateSurveryModal";
import MintGTModal from "@components/modals/LineaCreateModal/MintGTModal";
import StakeDefiModal from "@components/modals/LineaCreateModal/StakeDefiModal";
import ChangeDepositParamsModal from "@components/modals/LineaCreateModal/ChangeDepositParmsModal";
import { BiSupport } from "react-icons/bi";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import ActivateLXPLModal from "@components/modals/LineaCreateModal/ActivateLXPLModal";

import TableSkeleton from "@components/skeleton/TableSkeleton";

const Dashboard = ({ daoAddress, routeNetworkId }) => {
  const { signMessageAsync } = useSignMessage();
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const chain = useChainId();
  const dispatch = useDispatch();
  const networkId = "0x" + chain?.toString(16);
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

  // Linea modals
  const [showInviteMembersModal, setShowInviteMembersModal] = useState(false);
  const [showCustomiseContributionModal, setShowCustomiseContributionModal] =
    useState(false);
  const [showAdminFeeModal, setShowAdminFeeModal] = useState(false);
  const [showTreasuryModal, setShowTreasuryModal] = useState(false);
  const [showTokenGateModal, setShowTokenGateModal] = useState(false);
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showEditSignerModal, setShowEditSignerModal] = useState(false);
  const [showCreateSurveyModal, setShowCreateSurveyModal] = useState(false);
  const [showMintGTModal, setShowMintGTModal] = useState(false);
  const [showStakeDefiModal, setShowStakeDefiModal] = useState(false);
  const [showDepositParamsModal, setShowDepositParamsModal] = useState(false);
  const [showActivateLXPLModal, setShowActivateLXPLModal] = useState(false);

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

  const tokenDetailsIsloading = useSelector((state) =>
    isLoading(state, "token-details"),
  );
  const treasuryAmountIsloading = useSelector((state) =>
    isLoading(state, "treasury-amount"),
  );

  const nftIsloading = useSelector((state) => isLoading(state, "nft"));
  const fetchClubDetails = async () => {
    try {
      if (daoAddress && networkId) {
        if (clubData) {
          let percentageShare;

          const myBalance = await getBalance(daoAddress);

          if (myBalance === 0) {
            setMyShare(0);
            dispatch(stopLoading("share-percent"));
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
    dispatch(startLoading("token-details"));

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
    dispatch(stopLoading("token-details"));
  };

  const fetchNfts = async () => {
    dispatch(startLoading("nfts"));
    try {
      const nftsData = await getNFTsByWallet(currentEOAWallet.walletAddress);
      setNftData(nftsData?.data?.data);
      dispatch(addNftsOwnedByDao(nftsData?.data?.data));
    } catch (error) {
      console.log(error);
    }
    dispatch(stopLoading("nfts"));
  };

  const fetchProposals = async () => {
    dispatch(startLoading("proposal"));
    try {
      const activeProposals = await getProposalByDaoAddress(daoAddress);
      setProposals(activeProposals?.data);
    } catch (error) {
      console.log(error);
    }
    dispatch(stopLoading("proposal"));
  };

  const fetchTreasuryDetails = async () => {
    dispatch(startLoading("treasury-amount"));
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
    dispatch(stopLoading("treasury-amount"));
  };

  const handleChange = (event, newValue) => {
    setAssetType(newValue);
  };

  const handleOnClickLearnMore = () => {
    setShowTwitterModal(false);
    setShowActivateLXPLModal(true);
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
        JSON.stringify(payload),
        signMessageAsync,
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
      loading: treasuryAmountIsloading,
    },
    {
      containerClass: classes.ownershipContainer,
      iconSrc: "/assets/icons/chart.svg",
      altText: "My Ownership",
      title: "My Ownership",
      value: customToFixedAutoPrecision(myShare),
      tokenName: symbol,
      isOwnership: true,
      loading: treasuryAmountIsloading,
    },
    {
      containerClass: classes.ownershipContainer,
      iconSrc: "/assets/icons/astronaut_icon.svg",
      altText: "Members",
      title: "Members",
      value: clubData?.membersCount,
      loading: treasuryAmountIsloading,
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
        {/* {routeNetworkId === "0xe708" && (
          <div className={classes.joinCampaignBar}>
            <Typography variant="inherit" fontSize={18} fontWeight={550}>
              Join the Linea Surge and run stations on StationX to get LXP-L
              points.{" "}
              <a
                href={`https://stnx.notion.site/Participate-in-SurgeOnLinea-a659cb8412a24233971a2f7b247643f7?pvs=25https://stnx.notion.site/Participate-in-SurgeOnLinea-a659cb8412a24233971a2f7b247643f7?pvs=25`}
                target="_blank"
                rel="noopener noreferrer">
                Learn more.
              </a>
            </Typography>

            <div></div>
          </div>
        )} */}

        <div className={classes.headerContainer}>
          <ComponentHeader
            loading={treasuryAmountIsloading}
            title={clubData?.name}
            subtext={`$${clubData?.symbol}`}
            showButton={routeNetworkId === "0xe708" ? true : false}
            buttonText="Activate LXP-L"
            onClickHandler={() => {
              setShowActivateLXPLModal(true);
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
              loading={item.loading}
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
                <>
                  {tokenDetailsIsloading && <TableSkeleton column={4} />}
                  {!tokenDetailsIsloading && (
                    <NoTokens
                      title="No tokens in treasury"
                      subtext="All tokens owned by your station appear here."
                    />
                  )}
                </>
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
                <>
                  {nftIsloading && <TableSkeleton column={4} />}
                  {!nftIsloading && (
                    <NoTokens
                      title="No collectibles in treasury"
                      subtext="All NFTs owned by your station appear here."
                    />
                  )}
                </>
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
        <LineaCreateModal
          onClose={() => setShowTwitterModal(false)}
          onClick={() => handleOnClickLearnMore()}
        />
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

      {showActivateLXPLModal ? (
        <ActivateLXPLModal
          safeAddress={gnosisAddress}
          onClose={() => {
            setShowActivateLXPLModal(false);
          }}
        />
      ) : null}

      <div
        onClick={() => {
          setShowHelperSteps(!showHelperSteps);
        }}
        className={classes.helpContainer}>
        {showHelperSteps ? <IoIosArrowDropdownCircle /> : <BiSupport />}
        <Typography variant="inherit" fontWeight={700} pt={0.1}>
          FAQ
        </Typography>
      </div>

      {showHelperSteps ? (
        <LineaHelperSteps
          setShowInviteMembersModal={setShowInviteMembersModal}
          setShowCustomiseContributionModal={setShowCustomiseContributionModal}
          setShowAdminFeeModal={setShowAdminFeeModal}
          setShowTreasuryModal={setShowTreasuryModal}
          setShowTokenGateModal={setShowTokenGateModal}
          setShowWhitelistModal={setShowWhitelistModal}
          setShowDistributeModal={setShowDistributeModal}
          setShowSendModal={setShowSendModal}
          setShowDeadlineModal={setShowDeadlineModal}
          setShowKYCModal={setShowKYCModal}
          setShowEditSignerModal={setShowEditSignerModal}
          setShowCreateSurveyModal={setShowCreateSurveyModal}
          setShowMintGTModal={setShowMintGTModal}
          setShowDepositParamsModal={setShowDepositParamsModal}
          setShowStakeDefiModal={setShowStakeDefiModal}
          onClose={() => {
            setShowHelperSteps(false);
          }}
        />
      ) : null}

      {showInviteMembersModal ? (
        <InviteMemberModal
          onClose={() => {
            setShowInviteMembersModal(false);
          }}
        />
      ) : null}

      {showCustomiseContributionModal ? (
        <CustomiseContributionModal
          onClose={() => {
            setShowCustomiseContributionModal(false);
          }}
        />
      ) : null}

      {showAdminFeeModal ? (
        <AdminFeeModal
          onClose={() => {
            setShowAdminFeeModal(false);
          }}
        />
      ) : null}

      {showTreasuryModal ? (
        <TreasuryModal
          onClose={() => {
            setShowTreasuryModal(false);
          }}
        />
      ) : null}

      {showTokenGateModal ? (
        <TokenGateModal
          onClose={() => {
            setShowTokenGateModal(false);
          }}
        />
      ) : null}

      {showWhitelistModal ? (
        <WhiteListModal
          onClose={() => {
            setShowWhitelistModal(false);
          }}
        />
      ) : null}

      {showSendModal ? (
        <SendModal
          onClose={() => {
            setShowSendModal(false);
          }}
        />
      ) : null}

      {showDistributeModal ? (
        <DistributeModal
          onClose={() => {
            setShowDistributeModal(false);
          }}
        />
      ) : null}

      {showKYCModal ? (
        <EditKYCModal
          onClose={() => {
            setShowKYCModal(false);
          }}
        />
      ) : null}

      {showDeadlineModal ? (
        <EditDeadlineMdoal
          onClose={() => {
            setShowDeadlineModal(false);
          }}
        />
      ) : null}

      {showEditSignerModal ? (
        <AddRemoveAdminModal
          onClose={() => {
            setShowEditSignerModal(false);
          }}
        />
      ) : null}

      {showCreateSurveyModal ? (
        <CreateSurveyModal
          onClose={() => {
            setShowCreateSurveyModal(false);
          }}
        />
      ) : null}

      {showMintGTModal ? (
        <MintGTModal
          onClose={() => {
            setShowMintGTModal(false);
          }}
        />
      ) : null}

      {showStakeDefiModal ? (
        <StakeDefiModal
          onClose={() => {
            setShowStakeDefiModal(false);
          }}
        />
      ) : null}

      {showDepositParamsModal ? (
        <ChangeDepositParamsModal
          onClose={() => {
            setShowDepositParamsModal(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
