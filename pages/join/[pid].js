import React, { useCallback, useEffect, useState } from "react";
import { SmartContract } from "../../src/api/contract";
import factoryContractABI from "../../src/abis/newArch/factoryContract.json";
import erc20DaoContractABI from "../../src/abis/newArch/erc20Dao.json";
import erc721DaoContractABI from "../../src/abis/newArch/erc721Dao.json";
import FactoryContractABI from "../../src/abis/newArch/factoryContract.json";
import ERC20ABI from "../../src/abis/usdcTokenContract.json";

import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";
import Layout2 from "../../src/components/layouts/layout2";
import NewArchERC20 from "../../src/components/depositPageComps/ERC20/NewArch/NewArchERC20";
import { useRouter } from "next/router";
import { fetchClub, fetchClubbyDaoAddress } from "../../src/api/club";
import NewArchERC721 from "../../src/components/depositPageComps/ERC721/NewArch/NewArchERC721";
import { convertFromWeiGovernance } from "../../src/utils/globalFunctions";
import { subgraphQuery } from "../../src/utils/subgraphs";
import { QUERY_ALL_MEMBERS } from "../../src/api/graphql/queries";
import { useSelector } from "react-redux";
import ClubFetch from "../../src/utils/clubFetch";

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
    nftMinted: 0,
  });
  const [tokenType, setTokenType] = useState("");
  const [isEligibleForTokenGating, setIsEligibleForTokenGating] =
    useState(false);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [members, setMembers] = useState([]);

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();

  const { pid: daoAddress } = router.query;

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const SUBGRAPH_URL = useSelector((state) => {
    return state.gnosis.subgraphUrl;
  });

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const walletAddress = Web3.utils.toChecksumAddress(
    wallet?.accounts[0].address,
  );

  /**
   * Fetching details for ERC20 comp
   */
  const fetchErc20ContractDetails = useCallback(async () => {
    try {
      const factoryContract = new SmartContract(
        factoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const erc20DaoContract = new SmartContract(
        erc20DaoContractABI,
        daoAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const fetchedData = await fetchClubbyDaoAddress(daoAddress);
      console.log(fetchedData);
      const fetchedImage = fetchedData?.data[0]?.imageUrl;

      if (factoryContract && erc20DaoContract) {
        const factoryData = await factoryContract.getDAOdetails(daoAddress);
        const erc20Data = await erc20DaoContract.getERC20DAOdetails();
        const erc20DaoDecimal = await erc20DaoContract.decimals();
        const clubTokensMinted = await erc20DaoContract.totalSupply();

        // console.log(factoryData, erc20Data);

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
  }, [
    FACTORY_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    daoAddress,
    walletAddress,
  ]);

  /**
   * Fetching details for ERC721 comp
   */
  const fetchErc721ContractDetails = useCallback(async () => {
    try {
      console.log(factoryContractABI, FACTORY_CONTRACT_ADDRESS);
      const factoryContract = new SmartContract(
        factoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      console.log(factoryContract);

      const erc721DaoContract = new SmartContract(
        erc721DaoContractABI,
        daoAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
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
        const nftCount = await erc721DaoContract.nftOwnersCount();
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
            nftMinted: nftCount,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    daoAddress,
    walletAddress,
  ]);

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

  const fetchTokenGatingDetials = useCallback(async () => {
    try {
      // setLoading(true);
      const factoryContract = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const tokenGatingDetails = await factoryContract.getTokenGatingDetails(
        daoAddress,
      );
      console.log("TOken Gating details", tokenGatingDetails);
      if (tokenGatingDetails[0].length) setIsTokenGated(true);
      const tokenAContract = new SmartContract(
        ERC20ABI,
        tokenGatingDetails[0].tokenA,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const tokenBContract = new SmartContract(
        ERC20ABI,
        tokenGatingDetails[0].tokenB,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      const balanceOfTokenAInUserWallet = await tokenAContract.balanceOf();
      const balanceOfTokenBInUserWallet = await tokenBContract.balanceOf();

      console.log(
        "Balance of token A",
        +balanceOfTokenAInUserWallet > +tokenGatingDetails[0].value[0],
      );

      if (tokenGatingDetails[0].operator == 0) {
        if (
          +balanceOfTokenAInUserWallet >= +tokenGatingDetails[0]?.value[0] &&
          +balanceOfTokenBInUserWallet >= +tokenGatingDetails[0]?.value[1]
        ) {
          console.log("You are eligible (AND)");
          setIsEligibleForTokenGating(true);
        } else {
          console.log("You are not eligible (AND)");
          setIsEligibleForTokenGating(false);
        }
      } else if (tokenGatingDetails[0].operator == 1) {
        if (
          +balanceOfTokenAInUserWallet >= +tokenGatingDetails[0]?.value[0] ||
          +balanceOfTokenBInUserWallet >= +tokenGatingDetails[0]?.value[1]
        ) {
          console.log("You are eligible (OR)");
          setIsEligibleForTokenGating(true);
        } else {
          console.log("You are not eligible (OR)");
          setIsEligibleForTokenGating(false);
        }
      }
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setLoading(false);
    }
  }, [
    walletAddress,
    USDC_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    daoAddress,
  ]);

  useEffect(() => {
    fetchTokenGatingDetials();
  }, [fetchTokenGatingDetials]);

  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  useEffect(() => {
    if (tokenType === "erc20NonTransferable") {
      fetchErc20ContractDetails();
    } else {
      fetchErc721ContractDetails();
    }
  }, [fetchErc20ContractDetails, tokenType, fetchErc721ContractDetails]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        if (daoAddress) {
          const data = await subgraphQuery(
            SUBGRAPH_URL,
            QUERY_ALL_MEMBERS(daoAddress),
          );
          console.log("Members", data);
          setMembers(data?.users);
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [SUBGRAPH_URL, daoAddress]);

  return (
    <Layout2>
      {tokenType === "erc20NonTransferable" ? (
        <NewArchERC20
          isTokenGated={isTokenGated}
          isEligibleForTokenGating={isEligibleForTokenGating}
          erc20DaoAddress={daoAddress}
          daoDetails={daoDetails}
          members={members}
        />
      ) : (
        <NewArchERC721
          isTokenGated={isTokenGated}
          isEligibleForTokenGating={isEligibleForTokenGating}
          erc721DaoAddress={daoAddress}
          daoDetails={daoDetails}
        />
      )}
    </Layout2>
  );
};

export default ClubFetch(Join);
