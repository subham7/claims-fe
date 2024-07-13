import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { encodeFunctionData, parseEther } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";

import { clipFinanceEthPoolABI } from "abis/clip-finance/ethPoolAbi";
import { eigenContractABI } from "abis/eigenContract";
import { erc20DaoABI } from "abis/erc20Dao";
import { erc721DaoABI } from "abis/erc721Dao";
import { factoryContractABI } from "abis/factoryContract.js";
import { factoryContractCCABI } from "abis/factoryContractCC";
import { mendiTokenContract } from "abis/mendi/mendiToken";
import { ezETH_ETH_ProxyABI } from "abis/nile/ezETh_ETH_ProxyABI";
import { CHAIN_CONFIG } from "utils/constants";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import { readContractFunction, writeContractFunction } from "utils/helper";
import { CC_NETWORKS } from "utils/networkConstants";
import useCommonContractMethods from "./useCommonContractMehods";

const useAppContractMethods = (params) => {
  const walletClient = useWalletClient();

  const { daoAddress, routeNetworkId } = params ?? {};
  const { getCreateFees, getDepositFees } = useCommonContractMethods({
    routeNetworkId,
  });

  const { address: walletAddress } = useAccount();

  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.clubData.assetsStoredOnGnosis;
  });

  const FACTORY_CONTRACT_ADDRESS =
    CHAIN_CONFIG[routeNetworkId ? routeNetworkId : networkId]
      ?.factoryContractAddress;
  const FACTORY_CONTRACT_ADDRESS_CROSS_CHAIN =
    CHAIN_CONFIG[networkId]?.factoryContractAddress;

  const estimateFeesLayerZero = async (chainId, fnName, payload) => {
    try {
      const iface = new Interface(factoryContractABI);

      const callData = iface.encodeFunctionData(fnName, [...payload]);

      const fees = await readContractFunction({
        address: CHAIN_CONFIG[networkId].layer0Endpoint,
        abi: layerZeroEndpointAbi,
        functionName: "estimateFees",
        args: [
          CHAIN_CONFIG[chainId].layer0ChainId,
          CHAIN_CONFIG[networkId].factoryContractAddress,
          callData,
          false,
          "0x",
        ],
        networkId,
      });
      return ((Number(fees[0]) * 4) / 10 ** 18).toFixed(1).toString();
    } catch (error) {
      throw error;
    }
  };

  const getDaoDetails = async (stationAddress = daoAddress, isCrossChain) => {
    try {
      const response = await readContractFunction({
        address: isCrossChain
          ? FACTORY_CONTRACT_ADDRESS_CROSS_CHAIN
          : FACTORY_CONTRACT_ADDRESS,
        abi: factoryContractABI,
        functionName: "getDAOdetails",
        args: [stationAddress],
        // account: walletAddress,
        networkId: routeNetworkId ?? networkId,
      });

      return response
        ? {
            ...response,
            depositCloseTime: Number(response?.depositCloseTime),
            distributionAmount: Number(response?.distributionAmount),
            maxDepositPerUser: Number(response?.maxDepositPerUser),
            minDepositPerUser: Number(response?.minDepositPerUser),
            ownerFeePerDepositPercent: Number(
              response?.ownerFeePerDepositPercent,
            ),
            pricePerToken: Number(response?.pricePerToken),
          }
        : {};
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  const getERC20DAOdetails = async () => {
    try {
      const response = await readContractFunction({
        address: daoAddress,
        abi: erc20DaoABI,
        functionName: "getERC20DAOdetails",
        args: [],
        // account: walletAddress,
        networkId: routeNetworkId ?? networkId,
      });

      return response
        ? {
            ...response,
            quorum: Number(response?.quorum),
            threshold: Number(response?.threshold),
          }
        : {};
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  const getERC721DAOdetails = async () => {
    try {
      const response = await readContractFunction({
        address: daoAddress,
        abi: erc721DaoABI,
        functionName: "getERC721DAOdetails",
        args: [],
        // account: walletAddress,
        networkId: routeNetworkId ?? networkId,
      });

      return response
        ? {
            ...response,
            quorum: Number(response?.quorum),
            threshold: Number(response?.threshold),
            maxTokensPerUser: Number(response?.maxTokensPerUser),
          }
        : {};
    } catch (error) {
      console.error(error);
    }
  };

  const getTokenGatingDetails = async () => {
    try {
      let response = await readContractFunction({
        address: CHAIN_CONFIG[routeNetworkId].factoryContractAddress,
        abi: CC_NETWORKS.includes(routeNetworkId)
          ? factoryContractCCABI
          : factoryContractABI,
        functionName: "getTokenGatingDetails",
        args: [daoAddress],
        // account: walletAddress,
        networkId: routeNetworkId ?? networkId,
        //
      });

      return response ?? {};
    } catch (error) {
      console.error(error);
    }
  };

  const getDaoBalance = async (is721) => {
    const response = await readContractFunction({
      address: daoAddress,
      abi: is721 ? erc721DaoABI : erc20DaoABI,
      functionName: "balanceOf",
      args: [walletAddress],
      // account: walletAddress,
      networkId: routeNetworkId ?? networkId,
    });

    return Number(response ?? 0);
  };

  const getERC20TotalSupply = async () => {
    try {
      const response = await readContractFunction({
        address: daoAddress,
        abi: erc20DaoABI,
        functionName: "totalSupply",
        args: [],
        // account: walletAddress,
        networkId: routeNetworkId ?? networkId,
      });

      return {
        actualValue: Number(response ?? 0),
        bigNumberValue: BigNumber(response ?? 0),
        formattedValue: convertFromWeiGovernance(response ?? 0, 18),
      };
    } catch (error) {
      console.log(error);
    }
  };

  const getNftOwnersCount = async () => {
    try {
      const response = await readContractFunction({
        address: daoAddress,
        abi: erc721DaoABI,
        functionName: "_tokenIdTracker",
        args: [],
        // account: walletAddress,
        networkId: routeNetworkId ?? networkId,
      });
      return {
        actualValue: Number(response) ?? 0,
        bigNumberValue: BigNumber(Number(response) ?? 0),
      };
    } catch (error) {
      console.error(error);
    }
  };

  const buyGovernanceTokenERC721DAO = async (
    tokenUriOfNFT,
    numOfTokens,
    merkleProof,
    value,
  ) => {
    try {
      // Beacause only single chain so should Multiply is false
      const depositFees = await getDepositFees(false);
      value = BigNumber(value)
        .plus(BigNumber(convertToWeiGovernance(depositFees, 18)))
        .integerValue()
        .toString();

      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: CC_NETWORKS.includes(networkId)
          ? factoryContractCCABI
          : factoryContractABI,
        functionName: "buyGovernanceTokenERC721DAO",
        args: [daoAddress, tokenUriOfNFT, numOfTokens, merkleProof],
        account: walletAddress,
        value: value,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const buyGovernanceTokenERC20DAO = async (
    numOfTokens,
    merkleProof,
    value,
  ) => {
    try {
      // Beacause only single chain so should Multiply is false
      const depositFees = await getDepositFees(false);

      value = BigNumber(value)
        .plus(BigNumber(convertToWeiGovernance(depositFees, 18)))
        .integerValue()
        .toString();

      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: CC_NETWORKS.includes(networkId)
          ? factoryContractCCABI
          : factoryContractABI,
        functionName: "buyGovernanceTokenERC20DAO",
        args: [daoAddress, numOfTokens, merkleProof],
        account: walletAddress,
        value,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateOwnerFee = async (ownerFeePerDeposit) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "updateOwnerFee",
        args: [ownerFeePerDeposit, daoAddress],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateDepositTime = async (depositTime) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "updateDepositTime",
        args: [depositTime, daoAddress],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateMinMaxDeposit = async (minDepositPerUser, maxDepositPerUser) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "updateMinMaxDeposit",
        args: [minDepositPerUser, maxDepositPerUser, daoAddress],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const setupTokenGating = async ({ addresses, amounts, operator }) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: CC_NETWORKS.includes(networkId)
          ? factoryContractCCABI
          : factoryContractABI,
        functionName: "setupTokenGating",
        args: [addresses, operator, amounts, daoAddress],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const disableTokenGating = async () => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "disableTokenGating",
        args: [daoAddress],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const toggleWhitelist = async () => {
    const res = encodeFunctionData({
      abi: erc20DaoABI,
      functionName: "toggleOnlyAllowWhitelist",
    });

    return res;
  };

  const fetchEigenTokenBalance = async (gnosisAddress) => {
    try {
      const res = await readContractFunction({
        address: CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        abi: eigenContractABI,
        functionName: "getDeposits",
        args: [gnosisAddress],
        // account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchRatioOfNileEzETH_ETHPool = async () => {
    try {
      const res = await readContractFunction({
        address: CHAIN_CONFIG[networkId].nileEzETH_ETH_LPTokenAddress,
        abi: ezETH_ETH_ProxyABI,
        functionName: "getReserves",
        networkId,
      });

      const ratio = BigNumber(res[1]).dividedBy(BigNumber(res[0]));
      return ratio;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const createERC721DAO = async ({
    clubName,
    clubSymbol,
    metadataURL,
    ownerFeePerDepositPercent,
    depositClose,
    quorum,
    threshold,
    safeThreshold,
    depositTokenAddress,
    treasuryAddress,
    addressList,
    maxTokensPerUser,
    distributeAmount,
    pricePerToken,
    isNftTransferable,
    isNftTotalSupplyUnlimited,
    isGovernanceActive,
    allowWhiteList,
    assetsStoredOnGnosis,
    merkleRoot,
  }) => {
    try {
      const fees = CC_NETWORKS.includes(networkId) ? await getCreateFees() : 0;
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: CC_NETWORKS.includes(networkId)
          ? factoryContractCCABI
          : factoryContractABI,
        functionName: "createERC721DAO",
        args: CC_NETWORKS.includes(networkId)
          ? [
              clubName,
              `x${clubSymbol}`,
              metadataURL,
              2,
              ownerFeePerDepositPercent,
              depositClose,
              quorum,
              threshold,
              safeThreshold,
              [183],
              treasuryAddress,
              [depositTokenAddress],
              addressList,
              maxTokensPerUser,
              distributeAmount,
              pricePerToken,
              isNftTransferable,
              isNftTotalSupplyUnlimited,
              isGovernanceActive,
              allowWhiteList,
              assetsStoredOnGnosis,
              merkleRoot,
            ]
          : [
              clubName,
              `x${clubSymbol}`,
              metadataURL,
              ownerFeePerDepositPercent,
              depositClose,
              quorum,
              threshold,
              safeThreshold,
              depositTokenAddress,
              // treasuryAddress,
              addressList,
              maxTokensPerUser,
              distributeAmount,
              pricePerToken,
              isNftTransferable,
              isNftTotalSupplyUnlimited,
              isGovernanceActive,
              allowWhiteList,
              assetsStoredOnGnosis,
              merkleRoot,
            ],
        account: walletAddress,
        networkId,
        walletClient,
        value: parseEther(fees.toString()),
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const createERC20DAO = async ({
    clubName,
    clubSymbol,
    distributeAmount,
    pricePerToken,
    minDepositPerUser,
    maxDepositPerUser,
    ownerFeePerDepositPercent,
    depositClose,
    quorum,
    threshold,
    safeThreshold,
    depositToken,
    treasuryAddress,
    addressList,
    isGovernanceActive,
    isGtTransferable,
    allowWhiteList,
    assetsStoredOnGnosis,
    merkleRoot,
  }) => {
    try {
      const fees = CC_NETWORKS.includes(networkId) ? await getCreateFees() : 0;
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: CC_NETWORKS.includes(networkId)
          ? factoryContractCCABI
          : factoryContractABI,
        functionName: "createERC20DAO",
        args: CC_NETWORKS.includes(networkId)
          ? [
              clubName,
              `x${clubSymbol}`,
              2, // Comm layer id
              distributeAmount,
              pricePerToken,
              minDepositPerUser,
              maxDepositPerUser,
              ownerFeePerDepositPercent,
              depositClose,
              quorum,
              threshold,
              safeThreshold,
              [183],
              treasuryAddress,
              [depositToken],
              addressList,
              isGovernanceActive,
              isGtTransferable,
              allowWhiteList,
              assetsStoredOnGnosis,
              merkleRoot,
            ]
          : [
              clubName,
              `x${clubSymbol}`,
              distributeAmount,
              pricePerToken,
              minDepositPerUser,
              maxDepositPerUser,
              ownerFeePerDepositPercent,
              depositClose,
              quorum,
              threshold,
              safeThreshold,
              depositToken,
              // treasuryAddress,
              addressList,
              isGovernanceActive,
              isGtTransferable,
              allowWhiteList,
              assetsStoredOnGnosis,
              merkleRoot,
            ],
        account: walletAddress,
        networkId,
        walletClient,
        value: parseEther(fees.toString()),
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const fetchMendiUsdcExhcangeRate = async () => {
    try {
      const res = await readContractFunction({
        address: CHAIN_CONFIG[networkId].mendiTokenAddress,
        abi: mendiTokenContract,
        functionName: "exchangeRateStored",
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchClipFinanceETHExchangeRate = async () => {
    try {
      const res = await readContractFunction({
        address: CHAIN_CONFIG[networkId].clipFinanceETHPoolAddress,
        abi: clipFinanceEthPoolABI,
        functionName: "getPricePerFullShare",
        account: walletAddress,
        networkId,
      });
      return convertFromWeiGovernance(res, 18);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  return {
    createERC20DAO,
    createERC721DAO,
    buyGovernanceTokenERC721DAO,
    buyGovernanceTokenERC20DAO,
    getDaoDetails,
    getERC20DAOdetails,
    getERC721DAOdetails,
    getDaoBalance,
    getNftOwnersCount,
    getERC20TotalSupply,
    updateOwnerFee,
    updateDepositTime,
    setupTokenGating,
    disableTokenGating,
    getTokenGatingDetails,
    toggleWhitelist,
    fetchEigenTokenBalance,
    fetchMendiUsdcExhcangeRate,
    updateMinMaxDeposit,
    fetchRatioOfNileEzETH_ETHPool,
    fetchClipFinanceETHExchangeRate,
  };
};

export default useAppContractMethods;
