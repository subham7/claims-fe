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
import NewArchERC721 from "../../src/components/depositPageComps/ERC721/NewArch/NewArchERC721";
import { convertIpfsToUrl } from "../../src/utils/globalFunctions";
import { subgraphQuery } from "../../src/utils/subgraphs";
import {
  QUERY_ALL_MEMBERS,
  QUERY_CLUB_DETAILS,
} from "../../src/api/graphql/queries";
import { useSelector } from "react-redux";
import ClubFetch from "../../src/utils/clubFetch";
import { Backdrop, CircularProgress } from "@mui/material";

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
  const [isEligibleForTokenGating, setIsEligibleForTokenGating] =
    useState(false);
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const TOKEN_TYPE = useSelector((state) => {
    return state.club.clubData.tokenType;
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
      setLoading(true);
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

      if (factoryContract && erc20DaoContract) {
        const factoryData = await factoryContract.getDAOdetails(daoAddress);
        const erc20Data = await erc20DaoContract.getERC20DAOdetails();
        const erc20DaoDecimal = await erc20DaoContract.decimals();
        const clubTokensMinted = await erc20DaoContract.totalSupply();

        if (erc20Data && factoryData)
          setDaoDetails({
            daoName: erc20Data.DaoName,
            daoSymbol: erc20Data.DaoSymbol,
            quorum: erc20Data.quorum,
            threshold: erc20Data.threshold,
            isGovernance: erc20Data.isGovernanceActive,
            decimals: erc20DaoDecimal,
            clubTokensMinted: clubTokensMinted,
            // daoImage: fetchedImage,
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      setLoading(true);
      const factoryContract = new SmartContract(
        factoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const erc721DaoContract = new SmartContract(
        erc721DaoContractABI,
        daoAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const clubDetails = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_CLUB_DETAILS(daoAddress),
      );

      const url = convertIpfsToUrl(clubDetails.stations[0].imageUrl);
      const res = await fetch(url);
      const data = await res.json();
      const imageUrl = convertIpfsToUrl(data.image);

      if (factoryContract && erc721DaoContract) {
        const factoryData = await factoryContract.getDAOdetails(daoAddress);

        const erc721Data = await erc721DaoContract.getERC721DAOdetails();
        const nftCount = await erc721DaoContract.nftOwnersCount();

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
            daoImage: imageUrl,
            nftURI: clubDetails?.stations[0].imageUrl,
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [
    FACTORY_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    SUBGRAPH_URL,
    USDC_CONTRACT_ADDRESS,
    daoAddress,
    walletAddress,
  ]);

  const fetchTokenGatingDetials = useCallback(async () => {
    try {
      setLoading(true);
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

      if (tokenGatingDetails[0]?.length) {
        setIsTokenGated(true);
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

        if (tokenGatingDetails[0].operator == 0) {
          if (
            +balanceOfTokenAInUserWallet >= +tokenGatingDetails[0]?.value[0] &&
            +balanceOfTokenBInUserWallet >= +tokenGatingDetails[0]?.value[1]
          ) {
            setIsEligibleForTokenGating(true);
          } else {
            setIsEligibleForTokenGating(false);
          }
        } else if (tokenGatingDetails[0].operator == 1) {
          if (
            +balanceOfTokenAInUserWallet >= +tokenGatingDetails[0]?.value[0] ||
            +balanceOfTokenBInUserWallet >= +tokenGatingDetails[0]?.value[1]
          ) {
            setIsEligibleForTokenGating(true);
          } else {
            setIsEligibleForTokenGating(false);
          }
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [
    FACTORY_CONTRACT_ADDRESS,
    walletAddress,
    USDC_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    daoAddress,
  ]);

  useEffect(() => {
    fetchTokenGatingDetials();
  }, [fetchTokenGatingDetials]);

  useEffect(() => {
    if (TOKEN_TYPE === "erc20") {
      fetchErc20ContractDetails();
    } else {
      fetchErc721ContractDetails();
    }
  }, [fetchErc20ContractDetails, TOKEN_TYPE, fetchErc721ContractDetails]);

  useEffect(() => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [SUBGRAPH_URL, daoAddress]);

  return (
    <Layout2>
      {TOKEN_TYPE === "erc20" ? (
        <NewArchERC20
          isTokenGated={isTokenGated}
          isEligibleForTokenGating={isEligibleForTokenGating}
          erc20DaoAddress={daoAddress}
          daoDetails={daoDetails}
          members={members}
        />
      ) : TOKEN_TYPE === "erc721" ? (
        <NewArchERC721
          isTokenGated={isTokenGated}
          isEligibleForTokenGating={isEligibleForTokenGating}
          erc721DaoAddress={daoAddress}
          daoDetails={daoDetails}
        />
      ) : null}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Layout2>
  );
};

export default ClubFetch(Join);
