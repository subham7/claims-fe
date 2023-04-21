import React, { useCallback, useEffect, useState } from "react";
import { SmartContract } from "../../src/api/contract";
import factoryContractABI from "../../src/abis/newArch/factoryContract.json";
import erc20DaoContractABI from "../../src/abis/newArch/erc20Dao.json";
import erc721DaoContractABI from "../../src/abis/newArch/erc721Dao.json";

import { NEW_FACTORY_ADDRESS } from "../../src/api";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";
import Layout2 from "../../src/components/layouts/layout2";
import NewArchERC20 from "../../src/components/depositPageComps/ERC20/NewArch/NewArchERC20";
import { useRouter } from "next/router";
import { fetchClub, fetchClubbyDaoAddress } from "../../src/api/club";
import NewArchERC721 from "../../src/components/depositPageComps/ERC721/NewArch/NewArchERC721";
import { convertFromWeiGovernance } from "../../src/utils/globalFunctions";

const Join = () => {
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
  });
  const [tokenType, setTokenType] = useState("");

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();

  const { piiid: daoAddress } = router.query;

  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  /**
   * Fetching details for ERC20 comp
   */
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

      const fetchedData = await fetchClubbyDaoAddress(daoAddress);
      console.log(fetchedData);
      const fetchedImage = fetchedData?.data[0]?.imageUrl;

      if (factoryContract && erc20DaoContract) {
        const factoryData = await factoryContract.getDAOdetails(daoAddress);
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
          });
      }
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress, walletAddress]);

  /**
   * Fetching details for ERC721 comp
   */
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
        console.log(erc721Data);

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

  /**
   * Fetching tokenType from API
   */
  const fetchDataFromApi = useCallback(async () => {
    try {
      const data = await fetchClubbyDaoAddress(daoAddress);
      console.log(data?.data[0]?.tokenType);
      setTokenType(data?.data[0]?.tokenType);
    } catch (error) {
      console.log(error);
    }
  }, [daoAddress]);

  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  useEffect(() => {
    if (tokenType === "erc20NonTransferable") {
      fetchErc20ContractDetails();
    } else {
      console.log("Hereee");
      fetchErc721ContractDetails();
    }
  }, [fetchErc20ContractDetails, tokenType, fetchErc721ContractDetails]);

  return (
    <Layout2>
      {tokenType === "erc20NonTransferable" ? (
        <NewArchERC20 erc20DaoAddress={daoAddress} daoDetails={daoDetails} />
      ) : (
        <NewArchERC721 erc721DaoAddress={daoAddress} daoDetails={daoDetails} />
      )}
    </Layout2>
  );
};

export default Join;
