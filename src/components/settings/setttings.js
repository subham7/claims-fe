import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdditionalSettings from "@components/settingsComps/AdditionalSettings";
import SettingsInfo from "@components/settingsComps/SettingsInfo";
import TokenGating from "@components/tokenGatingComp/TokenGating";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { getAssetsByDaoAddress } from "api/assets";
import { getClubInfo } from "api/club";
import { useAccount, useNetwork } from "wagmi";
import useAppContractMethods from "hooks/useAppContractMethods";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { queryAllMembersFromSubgraph } from "utils/stationsSubgraphHelper";
import { getPublicClient } from "utils/viemConfig";
import { formatEther } from "viem";
import { isNative } from "utils/helper";
import WalletTracker from "@components/settingsComps/walletTracker/WalletTracker";

const Settings = ({ daoAddress, routeNetworkId }) => {
  const [daoDetails, setDaoDetails] = useState({
    daoName: "",
    daoSymbol: "",
    decimals: 0,
    daoImage: "",
    clubTokensMinted: 0,
    quorum: 0,
    threshold: 0,
    isGovernance: false,
    isTokenGated: false,
    isTotalSupplyUnlimited: false,
    isTransferable: false,
    minDeposit: 0,
    maxDeposit: 0,
    totalSupply: 0,
    depositDeadline: 0,
    pricePerToken: 0,
    distributionAmt: 0,
    depositTokenAddress: "",
    createdBy: "",
    maxTokensPerUser: 0,
    nftURI: "",
    ownerFee: 0,
    nftMinted: 0,
    assetsStoredOnGnosis: true,
  });
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenBalance: 0,
    tokenName: "",
    tokenDecimal: 0,
  });
  const [members, setMembers] = useState(0);
  const [treasuryAmount, setTreasuryAmount] = useState(0);
  const [clubInfo, setClubInfo] = useState();

  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  const remainingDays = day2.diff(day1, "day");
  const publicClient = getPublicClient(networkId);

  const {
    getERC20DAOdetails,
    getERC721DAOdetails,
    getERC20TotalSupply,
    getNftOwnersCount,
  } = useAppContractMethods({ daoAddress });

  const { getDecimals, getBalance, getTokenName, getTokenSymbol } =
    useCommonContractMethods({ routeNetworkId });

  const fetchErc20ContractDetails = useCallback(async () => {
    try {
      const erc20Data = await getERC20DAOdetails();
      const erc20DaoDecimal = await getDecimals(daoAddress);
      const clubTokensMinted = await getERC20TotalSupply();
      if (erc20Data && clubData) {
        setDaoDetails({
          daoName: erc20Data.DaoName,
          daoSymbol: erc20Data.DaoSymbol,
          quorum: erc20Data.quorum,
          threshold: erc20Data.threshold,
          isGovernance: erc20Data.isGovernanceActive,
          decimals: erc20DaoDecimal,
          clubTokensMinted: clubTokensMinted.actualValue,
          isTokenGated: clubData.isTokenGatingApplied,
          minDeposit: clubData.minDepositPerUser,
          maxDeposit: clubData.maxDepositPerUser,
          pricePerToken: clubData.pricePerToken,
          depositDeadline: clubData.depositCloseTime,
          depositTokenAddress: clubData.depositTokenAddress,
          distributionAmt: clubData.distributionAmount,
          assetsStoredOnGnosis: clubData.assetsStoredOnGnosis,
          totalSupply:
            (clubData.distributionAmount / 10 ** 18) * clubData.pricePerToken,
          ownerFee: clubData.ownerFeePerDepositPercent / 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress, clubData]);

  const fetchErc20TokenDetails = useCallback(async () => {
    try {
      const isNativeToken = isNative(clubData.depositTokenAddress, networkId);

      let balanceOfToken;

      if (isNativeToken) {
        balanceOfToken = formatEther(
          await publicClient.getBalance({
            address: walletAddress,
          }),
        );
      } else {
        balanceOfToken = await getBalance(clubData.depositTokenAddress);
      }

      const decimals = await getDecimals(clubData.depositTokenAddress);
      const symbol = await getTokenSymbol(clubData.depositTokenAddress);
      const name = await getTokenName(clubData.depositTokenAddress);

      const balanceConverted = convertFromWeiGovernance(
        balanceOfToken,
        decimals,
      );
      setErc20TokenDetails({
        tokenBalance: +balanceConverted,
        tokenSymbol: symbol,
        tokenName: name,
        tokenDecimal: decimals,
      });
    } catch (error) {
      console.log(error);
    }
  }, [clubData.depositTokenAddress]);

  const fetchErc721ContractDetails = useCallback(async () => {
    try {
      const erc721Data = await getERC721DAOdetails();

      const nftMinted = await getNftOwnersCount();

      if (erc721Data && clubData) {
        setDaoDetails({
          daoName: erc721Data.DaoName,
          daoSymbol: erc721Data.DaoSymbol,
          quorum: erc721Data.quorum,
          threshold: erc721Data.threshold,
          isGovernance: erc721Data.isGovernanceActive,
          maxTokensPerUser: erc721Data.maxTokensPerUser,
          isTotalSupplyUnlimited: erc721Data.isNftTotalSupplyUnlimited,
          nftMinted: nftMinted,
          isTransferable: erc721Data.isTransferable,
          createdBy: erc721Data.ownerAddress,
          isTokenGated: clubData.isTokenGatingApplied,
          minDeposit: clubData.minDepositPerUser,
          maxDeposit: clubData.maxDepositPerUser,
          pricePerToken: clubData.pricePerToken,
          depositDeadline: clubData.depositCloseTime,
          depositTokenAddress: clubData.depositTokenAddress,
          distributionAmt: clubData.distributionAmount,
          assetsStoredOnGnosis: clubData.assetsStoredOnGnosis,
          totalSupply: clubData.distributionAmount,
          ownerFee: clubData.ownerFeePerDepositPercent / 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [clubData]);

  const fetchAssets = async () => {
    try {
      const assetsData = await getAssetsByDaoAddress(
        daoDetails.assetsStoredOnGnosis ? gnosisAddress : daoAddress,
      );
      setTreasuryAmount(assetsData?.data?.treasuryAmount);
    } catch (error) {
      console.log(error);
    }
  };

  const getClubInfoFn = async () => {
    const info = await getClubInfo(daoAddress);
    if (info.status === 200) {
      setClubInfo(info.data[0]);
    }
  };

  useEffect(() => {
    getClubInfoFn();
  }, [daoAddress]);

  useEffect(() => {
    if (tokenType === "erc20") {
      fetchErc20ContractDetails();
    } else {
      fetchErc721ContractDetails();
    }
    fetchErc20TokenDetails();
  }, [
    fetchErc20ContractDetails,
    fetchErc20TokenDetails,
    fetchErc721ContractDetails,
    tokenType,
  ]);

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const data = await queryAllMembersFromSubgraph(daoAddress, networkId);
        if (data && data?.users) {
          setMembers(data?.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (daoAddress && networkId && walletAddress) {
      fetchAllMembers();
    }
  }, [daoAddress, networkId, walletAddress]);

  useEffect(() => {
    fetchAssets();
  }, [networkId, daoAddress, daoDetails.assetsStoredOnGnosis, gnosisAddress]);

  return (
    <>
      <SettingsInfo
        daoDetails={daoDetails}
        erc20TokenDetails={erc20TokenDetails}
        members={members}
        treasuryAmount={treasuryAmount}
        tokenType={tokenType}
        remainingDays={remainingDays}
        remainingTimeInSecs={remainingTimeInSecs}
        walletAddress={walletAddress}
        clubInfo={clubInfo}
        getClubInfo={getClubInfoFn}
        isAdminUser={isAdminUser}
        daoAddress={daoAddress}
      />
      <AdditionalSettings
        walletAddress={walletAddress}
        daoDetails={daoDetails}
        erc20TokenDetails={erc20TokenDetails}
        tokenType={tokenType}
        gnosisAddress={gnosisAddress}
        fetchErc20ContractDetails={fetchErc20ContractDetails}
        fetchErc721ContractDetails={fetchErc721ContractDetails}
        isAdminUser={isAdminUser}
        daoAddress={daoAddress}
        routeNetworkId={routeNetworkId}
        clubData={clubData}
      />

      <WalletTracker isAdminUser={isAdminUser} daoAddress={daoAddress} />

      <TokenGating daoAddress={daoAddress} routeNetworkId={routeNetworkId} />
    </>
  );
};

export default Settings;
