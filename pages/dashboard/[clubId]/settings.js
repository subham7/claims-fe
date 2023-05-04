import { useConnectWallet } from "@web3-onboard/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { NEW_FACTORY_ADDRESS } from "../../../src/api";
import { fetchClubbyDaoAddress } from "../../../src/api/club";
import { SmartContract } from "../../../src/api/contract";
import { QUERY_ALL_MEMBERS } from "../../../src/api/graphql/queries";
import AdditionalSettings from "../../../src/components/settingsComps/AdditionalSettings";
import SettingsInfo from "../../../src/components/settingsComps/SettingsInfo";
import TokenGating from "../../../src/components/tokenGatingComp/TokenGating";
import factoryContractABI from "../../../src/abis/newArch/factoryContract.json";
import erc20DaoContractABI from "../../../src/abis/newArch/erc20Dao.json";
import erc721DaoContractABI from "../../../src/abis/newArch/erc721Dao.json";
import erc20ABI from "../../../src/abis/usdcTokenContract.json";
import ClubFetch from "../../../src/utils/clubFetch";
import { subgraphQuery } from "../../../src/utils/subgraphs";
import { convertFromWeiGovernance } from "../../../src/utils/globalFunctions";
import { getAssetsByDaoAddress } from "../../../src/api/assets";

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
    isTotalSupplyUnlinited: false,
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

  let walletAddress;
  if (typeof window !== "undefined") {
    walletAddress = Web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const router = useRouter();
  const { clubId: daoAddress } = router.query;

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingDays = day2.diff(day1, "day");

  const fetchErc20ContractDetails = useCallback(async () => {
    try {
      const factoryContract = new SmartContract(
        factoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        undefined,
        undefined,
      );

      const erc20DaoContract = new SmartContract(
        erc20DaoContractABI,
        daoAddress,
        walletAddress,
        undefined,
        undefined,
      );

      console.log(factoryContract);

      const fetchedData = await fetchClubbyDaoAddress(daoAddress);
      console.log("Fetchedd", fetchedData);
      const fetchedImage = fetchedData?.data[0];
      console.log("Fetchedddd Image", fetchedImage);

      if (factoryContract && erc20DaoContract) {
        const factoryData = await factoryContract.getDAOdetails(daoAddress);

        console.log("Fkajdkald", factoryData);
        const erc20Data = await erc20DaoContract.getERC20DAOdetails();
        const erc20DaoDecimal = await erc20DaoContract.decimals();
        const clubTokensMinted = await erc20DaoContract.totalSupply();

        console.log(factoryData, erc20Data);

        if (erc20Data && factoryData)
          setDaoDetails({
            daoName: erc20Data.DaoName,
            daoSymbol: erc20Data.DaoSymbol,
            quorum: erc20Data.quorum,
            threshold: erc20Data.threshold,
            isGovernance: erc20Data.isGovernanceActive,
            decimals: erc20DaoDecimal,
            clubTokensMinted: clubTokensMinted,
            daoImage: fetchedImage,
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
  }, [daoAddress, walletAddress]);

  const fetchErc20TokenDetails = useCallback(async () => {
    try {
      const erc20Contract = new SmartContract(
        erc20ABI,
        daoDetails.depositTokenAddress,
        walletAddress,
        undefined,
        undefined,
      );

      const balanceOfToken = await erc20Contract.balanceOf();
      const decimals = await erc20Contract.decimals();
      const symbol = await erc20Contract.obtainSymbol();
      const name = await erc20Contract.name();

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
  }, [daoDetails.depositTokenAddress, walletAddress]);

  const fetchErc721ContractDetails = useCallback(async () => {
    try {
      console.log(factoryContractABI, NEW_FACTORY_ADDRESS);
      const factoryContract = new SmartContract(
        factoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        undefined,
        undefined,
      );

      console.log(factoryContract);

      const erc721DaoContract = new SmartContract(
        erc721DaoContractABI,
        daoAddress,
        walletAddress,
        undefined,
        undefined,
      );

      console.log(erc721DaoContract);

      const fetchedData = await fetchClubbyDaoAddress(daoAddress);
      console.log("Fetched Data", fetchedData);
      const fetchedImage = fetchedData?.data[0]?.nftImageUrl;
      const nftURI = fetchedData?.data[0]?.nftMetadataUrl;

      if (factoryContract && erc721DaoContract) {
        const factoryData = await factoryContract.getDAOdetails(daoAddress);
        console.log("Factory Data", factoryData);

        const erc721Data = await erc721DaoContract.getERC721DAOdetails();
        console.log("Dataaaaaaaa", erc721Data);

        if (erc721Data && factoryData) {
          setDaoDetails({
            daoName: erc721Data.DaoName,
            daoSymbol: erc721Data.DaoSymbol,
            quorum: erc721Data.quorum,
            threshold: erc721Data.threshold,
            isGovernance: erc721Data.isGovernanceActive,
            maxTokensPerUser: erc721Data.maxTokensPerUser,
            isTotalSupplyUnlinited: erc721Data.isNftTotalSupplyUnlimited,
            // decimals: erc20DaoDecimal,
            // clubTokensMinted: clubTokensMinted,
            isTransferable: erc721Data.isTransferable,
            createdBy: erc721Data.ownerAddress,
            daoImage: fetchedImage,
            nftURI: nftURI,
            isTokenGated: factoryData.isTokenGatingApplied,
            minDeposit: factoryData.minDepositPerUser,
            maxDeposit: factoryData.maxDepositPerUser,
            pricePerToken: factoryData.pricePerToken,
            depositDeadline: factoryData.depositCloseTime,
            depositTokenAddress: factoryData.depositTokenAddress,
            distributionAmt: factoryData.distributionAmount,
            totalSupply:
              factoryData.distributionAmount * factoryData.pricePerToken,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress, walletAddress]);

  const fetchAssets = useCallback(async () => {
    try {
      const assetsData = await getAssetsByDaoAddress(daoAddress);
      console.log("Asset data", assetsData.data?.treasuryAmount);
      setTreasuryAmount(assetsData?.data?.treasuryAmount);
    } catch (error) {
      console.log(error);
    }
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
    fetchAssets,
    fetchErc721ContractDetails,
    tokenType,
  ]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        if (daoAddress) {
          const data = await subgraphQuery(QUERY_ALL_MEMBERS(daoAddress));
          console.log("Members", data);
          setMembers(data?.users);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  console.log(erc20TokenDetails);

  return (
    <div>
      <SettingsInfo
        daoDetails={daoDetails}
        erc20TokenDetails={erc20TokenDetails}
        members={members}
        treasuryAmount={treasuryAmount}
        tokenType={tokenType}
        remainingDays={remainingDays}
        walletAddress={walletAddress}
      />
      <AdditionalSettings
        daoDetails={daoDetails}
        erc20TokenDetails={erc20TokenDetails}
        tokenType={tokenType}
        walletAddress={walletAddress}
      />
      <TokenGating />
    </div>
  );
};

export default ClubFetch(Settings);
