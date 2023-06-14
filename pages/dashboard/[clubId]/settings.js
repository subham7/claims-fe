import { useConnectWallet } from "@web3-onboard/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QUERY_ALL_MEMBERS } from "../../../src/api/graphql/queries";
import AdditionalSettings from "../../../src/components/settingsComps/AdditionalSettings";
import SettingsInfo from "../../../src/components/settingsComps/SettingsInfo";
import TokenGating from "../../../src/components/tokenGatingComp/TokenGating";
import ClubFetch from "../../../src/utils/clubFetch";
import { subgraphQuery } from "../../../src/utils/subgraphs";
import { convertFromWeiGovernance } from "../../../src/utils/globalFunctions";
import { getAssetsByDaoAddress } from "../../../src/api/assets";
import useSmartContractMethods from "../../../src/hooks/useSmartContractMethods";
import { showWrongNetworkModal } from "../../../src/utils/helper";

const Settings = () => {
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
  });
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenBalance: 0,
    tokenName: "",
    tokenDecimal: 0,
  });
  const [members, setMembers] = useState(0);
  const [treasuryAmount, setTreasuryAmount] = useState(0);

  const [{ wallet }] = useConnectWallet();

  const walletAddress = wallet?.accounts[0].address;
  const networkId = wallet?.chains[0].id;

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const NETWORK_HEX = useSelector((state) => {
    return state.gnosis.networkHex;
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const router = useRouter();
  const { clubId: daoAddress } = router.query;

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  const remainingDays = day2.diff(day1, "day");

  const {
    getERC20DAOdetails,
    getERC721DAOdetails,
    getERC20TotalSupply,
    getERC20Balance,
    getDecimals,
    getBalance,
    getTokenName,
    getTokenSymbol,
    getERC721Balance,
    getNftOwnersCount,
  } = useSmartContractMethods();

  const fetchErc20ContractDetails = useCallback(async () => {
    try {
      const balanceOfClubToken = await getERC20Balance();
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
          // daoImage: fetchedImage,
          balanceOfClubToken: convertFromWeiGovernance(balanceOfClubToken, 18),
          isTokenGated: factoryData.isTokenGatingApplied,
          minDeposit: factoryData.minDepositPerUser,
          maxDeposit: factoryData.maxDepositPerUser,
          pricePerToken: factoryData.pricePerToken,
          depositDeadline: factoryData.depositCloseTime,
          depositTokenAddress: factoryData.depositTokenAddress,
          distributionAmt: factoryData.distributionAmount,

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

      const balanceOfClubToken = await getERC721Balance();
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
          balanceOfClubToken: convertFromWeiGovernance(balanceOfClubToken, 18),
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
          totalSupply:
            factoryData.distributionAmount * factoryData.pricePerToken,
          ownerFee: factoryData.ownerFeePerDepositPercent / 100,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [factoryData]);

  const fetchAssets = useCallback(async () => {
    try {
      const assetsData = await getAssetsByDaoAddress(daoAddress, NETWORK_HEX);
      setTreasuryAmount(assetsData?.data?.treasuryAmount);
    } catch (error) {
      console.log(error);
    }
  }, [NETWORK_HEX, daoAddress]);

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
    try {
      const fetchData = async () => {
        if (daoAddress) {
          const data = await subgraphQuery(
            SUBGRAPH_URL,
            QUERY_ALL_MEMBERS(daoAddress),
          );
          setMembers(data?.users);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [SUBGRAPH_URL, daoAddress]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <div>
      <SettingsInfo
        daoDetails={daoDetails}
        erc20TokenDetails={erc20TokenDetails}
        members={members}
        treasuryAmount={treasuryAmount}
        tokenType={tokenType}
        remainingDays={remainingDays}
        remainingTimeInSecs={remainingTimeInSecs}
        walletAddress={walletAddress}
      />
      <AdditionalSettings
        daoDetails={daoDetails}
        erc20TokenDetails={erc20TokenDetails}
        tokenType={tokenType}
        walletAddress={walletAddress}
        fetchErc20ContractDetails={fetchErc20ContractDetails}
        fetchErc721ContractDetails={fetchErc721ContractDetails}
        isAdminUser={isAdminUser}
      />
      <TokenGating />

      {showWrongNetworkModal(wallet, networkId)}
    </div>
  );
};

export default ClubFetch(Settings);
