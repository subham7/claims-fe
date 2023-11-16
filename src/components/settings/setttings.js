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

const Settings = ({ daoAddress }) => {
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
    balanceOfClubToken: 0,
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

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  const remainingDays = day2.diff(day1, "day");

  const {
    getERC20DAOdetails,
    getERC721DAOdetails,
    getERC20TotalSupply,
    getDaoBalance,
    getNftOwnersCount,
  } = useAppContractMethods({ daoAddress });

  const { getDecimals, getBalance, getTokenName, getTokenSymbol } =
    useCommonContractMethods();

  const fetchErc20ContractDetails = useCallback(async () => {
    try {
      const balanceOfClubToken = await getDaoBalance();
      const erc20Data = await getERC20DAOdetails();
      const erc20DaoDecimal = await getDecimals(daoAddress);
      const clubTokensMinted = await getERC20TotalSupply();

      if (erc20Data && factoryData) {
        setDaoDetails({
          daoName: erc20Data.DaoName,
          daoSymbol: erc20Data.DaoSymbol,
          quorum: erc20Data.quorum,
          threshold: erc20Data.threshold,
          isGovernance: erc20Data.isGovernanceActive,
          decimals: erc20DaoDecimal,
          clubTokensMinted: clubTokensMinted,
          balanceOfClubToken: convertFromWeiGovernance(balanceOfClubToken, 18),
          isTokenGated: factoryData.isTokenGatingApplied,
          minDeposit: factoryData.minDepositPerUser,
          maxDeposit: factoryData.maxDepositPerUser,
          pricePerToken: factoryData.pricePerToken,
          depositDeadline: factoryData.depositCloseTime,
          depositTokenAddress: factoryData.depositTokenAddress,
          distributionAmt: factoryData.distributionAmount,
          assetsStoredOnGnosis: factoryData.assetsStoredOnGnosis,
          totalSupply:
            (factoryData.distributionAmount / 10 ** 18) *
            factoryData.pricePerToken,
          ownerFee: factoryData.ownerFeePerDepositPercent / 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress, factoryData]);

  const fetchErc20TokenDetails = useCallback(async () => {
    try {
      const balanceOfToken = await getBalance(factoryData.depositTokenAddress);
      const decimals = await getDecimals(factoryData.depositTokenAddress);
      const symbol = await getTokenSymbol(factoryData.depositTokenAddress);
      const name = await getTokenName(factoryData.depositTokenAddress);

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
  }, [factoryData.depositTokenAddress]);

  const fetchErc721ContractDetails = useCallback(async () => {
    try {
      const erc721Data = await getERC721DAOdetails();

      const balanceOfClubToken = await getDaoBalance(true);
      const nftMinted = await getNftOwnersCount();

      if (erc721Data && factoryData) {
        setDaoDetails({
          daoName: erc721Data.DaoName,
          daoSymbol: erc721Data.DaoSymbol,
          quorum: erc721Data.quorum,
          threshold: erc721Data.threshold,
          isGovernance: erc721Data.isGovernanceActive,
          maxTokensPerUser: erc721Data.maxTokensPerUser,
          isTotalSupplyUnlimited: erc721Data.isNftTotalSupplyUnlimited,
          balanceOfClubToken: balanceOfClubToken,
          nftMinted: nftMinted,
          isTransferable: erc721Data.isTransferable,
          createdBy: erc721Data.ownerAddress,
          isTokenGated: factoryData.isTokenGatingApplied,
          minDeposit: factoryData.minDepositPerUser,
          maxDeposit: factoryData.maxDepositPerUser,
          pricePerToken: factoryData.pricePerToken,
          depositDeadline: factoryData.depositCloseTime,
          depositTokenAddress: factoryData.depositTokenAddress,
          distributionAmt: factoryData.distributionAmount,
          assetsStoredOnGnosis: factoryData.assetsStoredOnGnosis,
          totalSupply: factoryData.distributionAmount,
          ownerFee: factoryData.ownerFeePerDepositPercent / 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [factoryData]);

  const fetchAssets = async () => {
    try {
      const assetsData = await getAssetsByDaoAddress(
        daoDetails.assetsStoredOnGnosis ? gnosisAddress : daoAddress,
        networkId,
      );
      setTreasuryAmount(assetsData?.data?.treasuryAmount);
    } catch (error) {
      console.log(error);
    }
  };

  const getClubInfoFn = async () => {
    const info = await getClubInfo(daoAddress);
    if (info.status === 200) setClubInfo(info.data[0]);
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
      />
      <TokenGating daoAddress={daoAddress} />
    </>
  );
};

export default Settings;
