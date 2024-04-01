import { getProposalByDaoAddress } from "../api/proposal";
import { createCancelProposal, getProposalTxHash } from "api/proposal";
import Web3 from "web3";
import { getIncreaseGasPrice, getSafeSdk } from "./helper";
import { factoryContractABI } from "abis/factoryContract.js";
import { erc721DaoABI } from "abis/erc721Dao";
import { erc20DaoABI } from "abis/erc20Dao";
import { seaportABI } from "abis/seaport";
import { stakeETHABI } from "abis/stakeEth";
import { eigenContractABI } from "abis/eigenContract";
import { subgraphQuery } from "./subgraphs";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "./globalFunctions";
import { Interface } from "ethers";
import { fulfillOrder, retrieveNftListing } from "api/assets";
import { SEAPORT_CONTRACT_ADDRESS } from "api";
import { CHAIN_CONFIG, REFERRAL_ADDRESS } from "./constants";
import {
  QUERY_ALL_MEMBERS,
  QUERY_STATION_DETAILS,
} from "api/graphql/stationQueries";
import { erc20TokenABI } from "abis/usdcTokenContract.js";
import { actionContractABI } from "abis/actionContract";
import { erc20AaveABI } from "abis/erc20AaveABI";
import { stargateStakeABI } from "abis/stargateStakeABI";
import { stargateNativeABI } from "abis/stargateNativeABI";
import { maticAaveABI } from "abis/MaticAaveABI";
import { uniswapABI } from "abis/uniswapABI";
import { encodeFunctionData } from "viem";
import { Batch } from "abis/clip-finance/batch";
import { StrategyRouter } from "abis/clip-finance/stragetgyRouter";
import { getClipBalanceInShares } from "api/defi";
import axios from "axios";
import { SharesPool } from "abis/clip-finance/sharesPool";
import { SharesToken } from "abis/clip-finance/sharesToken";
import { kelpPoolABI } from "abis/kelp/kelpPoolContract";
import { rswETHABI } from "abis/swell/rswETHContract";
import { swETHABI } from "abis/swell/swETHContract";
import { renzoStakingPoolABI } from "abis/renzo/renzoStakingPoolContract";
import { stETHTokenABI } from "abis/lido/lidoStETHContract";
import { rocketPoolABI } from "abis/rocketPool/rocketPoolContract";
import { rETHTokenABI } from "abis/rocketPool/rETHTokenContract";
import { mantlePoolABI } from "abis/mantlePool/manelPoolContract";
import { LayerBankABI } from "abis/layerBankContract";
import { BigNumber } from "bignumber.js";

export const fetchProposals = async (daoAddress, type) => {
  let proposalData;
  if (type === "all") proposalData = await getProposalByDaoAddress(daoAddress);
  else proposalData = await getProposalByDaoAddress(daoAddress, type);

  if (proposalData.status !== 200) {
    return null;
  } else return proposalData.data;
};

export const createRejectSafeTx = async ({
  pid,
  gnosisTransactionUrl,
  gnosisAddress,
  daoAddress,
  network,
  walletAddress,
}) => {
  try {
    const { safeSdk, safeService } = await getSafeSdk(
      gnosisAddress,
      walletAddress,
      gnosisTransactionUrl,
    );

    const proposalTxHash = await getProposalTxHash(pid);

    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const rejectionTransaction = await safeSdk.createRejectionTransaction(
      safetx.nonce,
    );

    const safeTxHash = await safeSdk.getTransactionHash(rejectionTransaction);

    const proposeTxn = await safeService.proposeTransaction({
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
      safeTransactionData: rejectionTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const senderSignature = await safeSdk.signTypedData(
      rejectionTransaction,
      "v4",
    );

    await safeService.confirmTransaction(safeTxHash, senderSignature.data);

    const cancelPayload = {
      proposalData: {
        createdBy: walletAddress,
        commands: [
          {
            proposalId: pid,
          },
        ],
        daoAddress,
      },
      txHash: safeTxHash,
    };

    await createCancelProposal(cancelPayload, network);

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const executeRejectTx = async ({
  pid,
  walletAddress,
  gnosisTransactionUrl,
  gnosisAddress,
}) => {
  try {
    const { safeSdk, safeService } = await getSafeSdk(
      gnosisAddress,
      walletAddress,
      gnosisTransactionUrl,
    );

    const proposalTxHash = await getProposalTxHash(pid);

    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const options = {
      gasPrice: await getIncreaseGasPrice(),
    };

    await safeSdk.executeTransaction(safetx, options);

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const signRejectTx = async ({
  pid,
  walletAddress,
  gnosisTransactionUrl,
  gnosisAddress,
}) => {
  try {
    const { safeSdk, safeService } = await getSafeSdk(
      gnosisAddress,
      walletAddress,
      gnosisTransactionUrl,
    );

    const proposalTxHash = await getProposalTxHash(pid);
    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const safeTransaction = await safeSdk.createRejectionTransaction(
      safetx.nonce,
    );

    const senderSignature = await safeSdk.signTypedData(safeTransaction, "v4");

    await safeService.confirmTransaction(
      safetx.safeTxHash,
      senderSignature.data,
    );

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const fetchABI = async (executionId, tokenType) => {
  switch (executionId) {
    case 0:
    case 4:
      return [
        "function approve(address spender, uint256 amount)",
        "function contractCalls(address _to, bytes memory _data)",
        "function airDropToken(address _airdropTokenAddress,uint256[] memory _airdropAmountArray,address[] memory _members)",
      ];
    case 1:
    case 2:
    case 5:
    case 9:
      if (tokenType === "erc721") return erc721DaoABI;
      else return erc20DaoABI;
    case 3:
    case 10:
    case 11:
    case 12:
    case 16:
    case 13:
    case 20:
    case 49:
    case 50:
      return factoryContractABI;
    case 8:
      return seaportABI;
    case 21:
    case 22:
    case 23:
      return [
        "function approve(address spender, uint256 amount)",
        "function contractCalls(address _to, bytes memory _data)",
        "function airDropToken(address _airdropTokenAddress,uint256[] memory _airdropAmountArray,address[] memory _members)",
      ];
    default:
      return null;
  }
};

export const getEncodedData = async ({
  proposalData,
  daoAddress,
  clubData,
  contractABI,
  setMembers,
  networkId,
}) => {
  let membersArray = [];
  let airDropAmountArray = [];
  let approvalData;
  let data;

  const {
    executionId,
    airDropAmount,
    airDropCarryFee,
    airDropToken,
    mintGTAmounts,
    mintGTAddresses,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customToken,
    customTokenAddresses,
    customNft,
    customNftToken,
    nftLink,
    merkleRoot,
    pricePerToken,
    nftSupply,
    sendTokenAmounts,
    sendTokenAddresses,
    sendToken,
    updatedMinimumDepositAmount,
    updatedMaximumDepositAmount,
  } = proposalData.commands[0];

  let iface;
  if (contractABI) iface = new Interface(contractABI);
  const tokenDecimals = clubData?.depositTokenDecimal;
  const { minDepositAmountFormatted, maxDepositAmountFormatted } = clubData;

  switch (executionId) {
    case 0:
      const membersData = await subgraphQuery(
        CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
        QUERY_ALL_MEMBERS(daoAddress),
      );

      setMembers(membersData);
      membersData.users.map((member) => membersArray.push(member.userAddress));

      approvalData = iface.encodeFunctionData("approve", [
        CHAIN_CONFIG[networkId]?.airdropContractAddress,
        airDropAmount,
      ]);

      data = iface.encodeFunctionData("airDropToken", [
        airDropToken,
        sendTokenAmounts,
        sendTokenAddresses,
      ]);

      return {
        data,
        approvalData,
        membersArray: sendTokenAddresses,
        airDropAmountArray: sendTokenAmounts,
      };

    case 1:
      if (clubData.tokenType === "erc20") {
        data = iface.encodeFunctionData("mintGTToAddress", [
          mintGTAmounts,
          mintGTAddresses,
        ]);
      } else {
        const clubDetails = await subgraphQuery(
          CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
          QUERY_STATION_DETAILS(daoAddress),
        );
        const tokenURI = clubDetails?.stations[0].imageUrl;

        const tokenURIArr = [];

        for (let i = 0; i < mintGTAddresses.length; i++) {
          tokenURIArr.push(tokenURI);
        }

        data = iface.encodeFunctionData("mintGTToAddress", [
          mintGTAmounts,
          tokenURIArr,
          mintGTAddresses,
        ]);
      }

      return { data };

    case 2:
      data = iface.encodeFunctionData("updateGovernanceSettings", [
        quorum * 100,
        threshold * 100,
      ]);
      return { data };

    case 3:
      const value = BigNumber(
        convertToWeiGovernance(totalDeposits, tokenDecimals),
      )
        .dividedBy(clubData?.pricePerTokenFormatted?.bigNumberValue)
        .integerValue()
        .toString();

      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        convertToWeiGovernance(value, 18),
        clubData?.pricePerTokenFormatted?.actualValue,
        daoAddress,
      ]);
      return { data };

    case 4:
      if (customToken === CHAIN_CONFIG[networkId].nativeToken) {
        return {};
      } else {
        approvalData = iface.encodeFunctionData("approve", [
          CHAIN_CONFIG[networkId]?.airdropContractAddress,
          customTokenAmounts[0],
        ]);

        data = iface.encodeFunctionData("airDropToken", [
          customToken,
          customTokenAmounts,
          customTokenAddresses,
        ]);

        membersArray = customTokenAddresses;
        airDropAmountArray = customTokenAmounts;

        return { data, approvalData, membersArray, airDropAmountArray };
      }

    case 5:
      data = iface.encodeFunctionData("transferNft", [
        customNft,
        customTokenAddresses[0],
        customNftToken,
      ]);
      return { data };

    case 8:
      const parts = nftLink.split("/");

      const linkData = parts.slice(-3);
      const nftdata = await retrieveNftListing(
        linkData[0],
        linkData[1],
        linkData[2],
      );
      let transactionData;
      if (nftdata) {
        const offer = {
          hash: nftdata.data.orders[0].order_hash,
          chain: linkData[0],
          protocol_address: nftdata.data.orders[0].protocol_address,
        };

        const fulfiller = {
          address: daoAddress,
        };
        const consideration = {
          asset_contract_address: linkData[1],
          token_id: linkData[2],
        };
        transactionData = await fulfillOrder(offer, fulfiller, consideration);

        const {
          considerationToken,
          considerationIdentifier,
          considerationAmount,
          offerer,
          zone,
          offerToken,
          offerIdentifier,
          offerAmount,
          basicOrderType,
          startTime,
          endTime,
          zoneHash,
          salt,
          offererConduitKey,
          fulfillerConduitKey,
          totalOriginalAdditionalRecipients,
          additionalRecipients,
          signature,
        } = transactionData.fulfillment_data.transaction.input_data.parameters;

        data = iface.encodeFunctionData("fulfillBasicOrder_efficient_6GL6yc", [
          [
            considerationToken,
            considerationIdentifier,
            considerationAmount,
            offerer,
            zone,
            offerToken,
            offerIdentifier,
            offerAmount,
            basicOrderType,
            startTime,
            endTime,
            zoneHash,
            salt,
            offererConduitKey,
            fulfillerConduitKey,
            totalOriginalAdditionalRecipients,
            additionalRecipients,
            signature,
          ],
        ]);
      }
      return { data, transactionData };
    case 10:
    case 11:
    case 12:
    case 16:
      let iface2 = new Interface(erc20DaoABI);
      approvalData = iface2.encodeFunctionData("toggleOnlyAllowWhitelist", []);

      data = iface.encodeFunctionData("changeMerkleRoot", [
        daoAddress,
        merkleRoot?.merkleRoot,
      ]);
      return { data, approvalData };
    case 13:
      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        clubData?.distributionAmountFormatted?.bigNumberValue
          ?.integerValue()
          .toFixed(),
        convertToWeiGovernance(pricePerToken, clubData?.depositTokenDecimal),
        daoAddress,
      ]);
      return { data };
    case 20:
      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        nftSupply,
        clubData?.pricePerTokenFormatted?.formattedValue,
        daoAddress,
      ]);
      return { data };

    case 21:
    case 22:
    case 23:
      if (sendToken === CHAIN_CONFIG[networkId].nativeToken) {
        return {};
      } else {
        const totalAmount = sendTokenAmounts.reduce(
          (partialSum, a) => BigNumber(partialSum).plus(BigNumber(a)),
          0,
        );

        approvalData = iface.encodeFunctionData("approve", [
          CHAIN_CONFIG[networkId]?.airdropContractAddress,
          BigNumber(totalAmount).times(2).integerValue().toString(),
        ]);

        data = iface.encodeFunctionData("airDropToken", [
          sendToken,
          sendTokenAmounts,
          sendTokenAddresses,
        ]);

        membersArray = sendTokenAddresses;
        airDropAmountArray = sendTokenAmounts;

        return { data, approvalData, membersArray, airDropAmountArray };
      }
    case 49:
      data = iface.encodeFunctionData("updateMinMaxDeposit", [
        convertToWeiGovernance(updatedMinimumDepositAmount, tokenDecimals),
        maxDepositAmountFormatted?.actualValue,
        daoAddress,
      ]);

      return { data };
    case 50:
      data = iface.encodeFunctionData("updateMinMaxDeposit", [
        minDepositAmountFormatted?.actualValue,
        convertToWeiGovernance(updatedMaximumDepositAmount, tokenDecimals),
        daoAddress,
      ]);

      return { data };
    default:
      return {};
  }
};

const approveDepositWithEncodeABI = (
  contractAddress,
  approvalContract,
  amount,
  web3Call,
) => {
  if (contractAddress) {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      erc20TokenABI,
      contractAddress,
    );

    return erc20TokenContractCall?.methods
      ?.approve(approvalContract, amount)
      .encodeABI();
  }
};

const checkSwapAvailability = async ({
  web3Call,
  networkId,
  depositAmount,
}) => {
  try {
    const sharesTokenContract = new web3Call.eth.Contract(
      SharesToken,
      CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
    );

    const sharesInPool = await sharesTokenContract.methods
      .balanceOf(CHAIN_CONFIG[networkId].clipFinanceSharesPoolAddressLinea)
      .call();

    const res = await axios.get(
      "https://shares-pool-csynu.ondigitalocean.app/get-one-usd-in-shares?chain=linea",
    );

    const rate = res.data?.data?.oneUsdInShares;
    const sharesUsdValueInPool = Number(sharesInPool) / Number(rate);
    const depositAmountInUsd = convertFromWeiGovernance(depositAmount, 6);

    if (Number(depositAmountInUsd) <= Number(sharesUsdValueInPool)) {
      // Opt for sharesPool deposit
      return true;
    } else {
      // Opt for batch deposit
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const clipFinanceBatchDeposit = async ({
  depositToken,
  depositAmount,
  web3Call,
  networkId,
}) => {
  const batchContract = new web3Call.eth.Contract(
    Batch,
    CHAIN_CONFIG[networkId].clipFinanceBatchAddressLinea,
  );

  const depositFee = await batchContract.methods
    .getDepositFeeInNative(depositAmount)
    .call();

  const strategyRouterContract = new web3Call.eth.Contract(
    StrategyRouter,
    CHAIN_CONFIG[networkId].clipFinanceStrategyRouterAddressLinea,
  );

  const data = strategyRouterContract.methods
    .depositToBatch(depositToken, depositAmount, "")
    .encodeABI();

  const allocateData = strategyRouterContract.methods
    .allocateToStrategies()
    .encodeABI();

  return { data, depositFee, allocateData };
};

const clipFinanceSharesPoolDeposit = async ({
  depositAmount,
  web3Call,
  networkId,
  depositToken,
}) => {
  try {
    const res = await axios.get(
      `https://shares-pool-csynu.ondigitalocean.app/deposit?chain=linea&token=usdc.e&amount=${convertFromWeiGovernance(
        depositAmount,
        6,
      )}`,
    );

    const swapData = [
      depositToken,
      true,
      res.data?.data?.amountIn,
      res.data?.data?.amountOut,
      res.data?.data?.deadline,
      res.data?.data?.fee,
      res.data?.data?.signature,
    ];

    const sharesPoolContract = new web3Call.eth.Contract(
      SharesPool,
      CHAIN_CONFIG[networkId].clipFinanceSharesPoolAddressLinea,
    );

    const data = sharesPoolContract.methods
      .swapShares(
        swapData,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      )
      .encodeABI();

    return { data, depositFee: res.data?.data?.fee };
  } catch (error) {
    console.log(error);
  }
};

const clipFinanceSharesPoolWithdraw = async ({
  sharesToWithdraw,
  web3Call,
  networkId,
}) => {
  try {
    const res = await axios.get(
      `https://shares-pool-csynu.ondigitalocean.app/withdrawl?chain=linea&token=usdc.e&amount=${sharesToWithdraw}`,
    );

    const swapData = [
      CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
      false,
      res.data?.data?.amountIn,
      res.data?.data?.amountOut,
      res.data?.data?.deadline,
      res.data?.data?.fee,
      res.data?.data?.signature,
    ];

    const sharesPoolContract = new web3Call.eth.Contract(
      SharesPool,
      CHAIN_CONFIG[networkId].clipFinanceSharesPoolAddressLinea,
    );

    const data = sharesPoolContract.methods
      .swapShares(
        swapData,
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      )
      .encodeABI();

    return { data, depositFee: res.data.data.fee };
  } catch (error) {
    console.log(error);
  }
};

const calculateSharesToWithdraw = async ({
  withdrawAmount,
  web3Call,
  gnosisAddress,
  networkId,
}) => {
  const shares = await getClipBalanceInShares(gnosisAddress);

  const strategyRouterContract = new web3Call.eth.Contract(
    StrategyRouter,
    CHAIN_CONFIG[networkId].clipFinanceStrategyRouterAddressLinea,
  );

  const usdFromShares = await strategyRouterContract.methods
    .calculateSharesUsdValue(shares)
    .call();

  const sharesToWithdraw =
    (Number(withdrawAmount) * Number(shares)) / Number(usdFromShares);
  return sharesToWithdraw;
};

const transferNFTfromSafe = (
  tokenAddress,
  gnosisAddress,
  receiverAddress,
  tokenId,
  web3Call,
) => {
  if (tokenAddress) {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      erc20TokenABI,
      tokenAddress,
    );

    return erc20TokenContractCall?.methods
      ?.transferFrom(gnosisAddress, receiverAddress, tokenId)
      .encodeABI();
  }
};

const airdropTokenMethodEncoded = (
  actionContractAddress,
  airdropTokenAddress,
  amountArray,
  members,
  web3Call,
) => {
  if (actionContractAddress) {
    const actionContractSend = new web3Call.eth.Contract(
      actionContractABI,
      actionContractAddress,
    );

    return actionContractSend.methods
      .airDropToken(airdropTokenAddress, amountArray, members)
      .encodeABI();
  }
};

const depositEthForEigen = (contractAddress, walletAddress, web3Call) => {
  if (contractAddress) {
    const stakeETHContractCall = new web3Call.eth.Contract(
      stakeETHABI,
      contractAddress,
    );

    return stakeETHContractCall?.methods
      ?.deposit(walletAddress, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      .encodeABI();
  }
};

const depositETHInStader = (staderPoolAddress, walletAddress, web3Call) => {
  if (staderPoolAddress) {
    const staderStakingPoolContract = new web3Call.eth.Contract(
      stakeETHABI,
      staderPoolAddress,
    );

    return staderStakingPoolContract?.methods
      ?.deposit(walletAddress, "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      .encodeABI();
  }
};

const kelpStakeMethodEncoded = async (
  kelpPoolContractAddress,
  depositAmount,
  web3Call,
  networkId,
) => {
  if (kelpPoolContractAddress) {
    const kelpPoolContract = new web3Call.eth.Contract(
      kelpPoolABI,
      kelpPoolContractAddress,
    );

    const previewAmount = await getStaderPreview(
      CHAIN_CONFIG[networkId].staderStakingPoolAddress,
      convertToWeiGovernance(depositAmount, 18).toString(),
      web3Call,
    );

    return kelpPoolContract.methods
      .depositAsset(
        CHAIN_CONFIG[networkId].staderETHxAddress,
        previewAmount,
        0,
        "",
      )
      .encodeABI();
  }
};

const renzoEthStakeEncoded = ({ renzoStakingPoolAddress, web3Call }) => {
  if (renzoStakingPoolAddress) {
    const renzoStakingPoolContract = new web3Call.eth.Contract(
      renzoStakingPoolABI, // OR swETHABI
      renzoStakingPoolAddress,
    );

    return renzoStakingPoolContract.methods
      .depositETH(REFERRAL_ADDRESS)
      .encodeABI();
  }
};

const matlePoolStakeEncoded = async ({
  web3Call,
  networkId,
  depositAmount,
}) => {
  const mantlePoolContract = new web3Call.eth.Contract(
    mantlePoolABI,
    CHAIN_CONFIG[networkId].mantleDepositPoolAddress,
  );

  const mETHRecieved = await mantlePoolContract.methods
    .ethToMETH(convertToWeiGovernance(depositAmount, 18))
    .call();

  const minimumMEthRecieved =
    Number(convertFromWeiGovernance(mETHRecieved, 18)) * 0.99;

  return mantlePoolContract.methods
    .stake(convertToWeiGovernance(minimumMEthRecieved, 18))
    .encodeABI();
};

const mantlePoolEigenStakeMethodEncoded = async ({
  eigenContractAddress,
  depositAmount,
  web3Call,
  networkId,
}) => {
  if (eigenContractAddress) {
    const eigenContract = new web3Call.eth.Contract(
      eigenContractABI,
      eigenContractAddress,
    );

    const mantlePoolContract = new web3Call.eth.Contract(
      mantlePoolABI,
      CHAIN_CONFIG[networkId].mantleDepositPoolAddress,
    );

    const mETHRecieved = await mantlePoolContract.methods
      .ethToMETH(convertToWeiGovernance(depositAmount, 18))
      .call();

    const newMETHRecieved = convertFromWeiGovernance(mETHRecieved, 18);
    const newMETH = newMETHRecieved.slice(0, -9) + "000000000";

    return eigenContract.methods
      .depositIntoStrategy(
        CHAIN_CONFIG[networkId].mantleEigenStrategyAddress,
        CHAIN_CONFIG[networkId].mantleMEthAddress,
        convertToWeiGovernance(newMETH, 18),
      )
      .encodeABI();
  }
};

const layerBankStakeMethodEncoded = async ({
  layerBankToken,
  layerBankPoolAddress,
  depositAmount,
  web3Call,
  networkId,
}) => {
  if (layerBankToken) {
    const layerBankContract = new web3Call.eth.Contract(
      LayerBankABI,
      layerBankPoolAddress,
    );

    return layerBankContract.methods
      .supply(layerBankToken, convertToWeiGovernance(depositAmount, 18))
      .encodeABI();
  }
};

const layerBankUnStakeMethodEncoded = async ({
  layerBankToken,
  layerBankPoolAddress,
  unstakeAmount,
  web3Call,
  networkId,
}) => {
  if (layerBankToken) {
    const layerBankContract = new web3Call.eth.Contract(
      LayerBankABI,
      layerBankPoolAddress,
    );

    return layerBankContract.methods
      .redeemToken(layerBankToken, unstakeAmount)
      .encodeABI();
  }
};

const rocketPoolStakeEncoded = ({ web3Call, networkId }) => {
  const rocketPoolContract = new web3Call.eth.Contract(
    rocketPoolABI,
    CHAIN_CONFIG[networkId].rocketDepositPoolAddress,
  );

  return rocketPoolContract.methods.deposit().encodeABI();
};

const rocketPoolEigenStakeMethodEncoded = async ({
  eigenContractAddress,
  depositAmount,
  web3Call,
  networkId,
}) => {
  if (eigenContractAddress) {
    const eigenContract = new web3Call.eth.Contract(
      eigenContractABI,
      eigenContractAddress,
    );

    const rETHContract = new web3Call.eth.Contract(
      rETHTokenABI,
      CHAIN_CONFIG[networkId].rocketRETHAddress,
    );

    const previewAmount = await rETHContract.methods
      .getRethValue(convertToWeiGovernance(depositAmount, 18))
      .call();

    return eigenContract.methods
      .depositIntoStrategy(
        CHAIN_CONFIG[networkId].rocketEigenStrategyAddress,
        CHAIN_CONFIG[networkId].rocketRETHAddress,
        previewAmount,
      )
      .encodeABI();
  }
};

const lidoEthStakeEncoded = ({ web3Call, networkId }) => {
  const lidoTokenContract = new web3Call.eth.Contract(
    stETHTokenABI,
    CHAIN_CONFIG[networkId].lidoStETHAddress,
  );

  return lidoTokenContract.methods
    .submit(REFERRAL_ADDRESS) // referall
    .encodeABI();
};

const lidoEigneStakeMethodEncoded = async ({
  eigenContractAddress,
  depositAmount,
  web3Call,
  networkId,
}) => {
  if (eigenContractAddress) {
    const eigenContract = new web3Call.eth.Contract(
      eigenContractABI,
      eigenContractAddress,
    );

    const stETHContract = new web3Call.eth.Contract(
      stETHTokenABI,
      CHAIN_CONFIG[networkId].lidoStETHAddress,
    );

    const sharesAllocated = await stETHContract.methods
      .getSharesByPooledEth(convertToWeiGovernance(depositAmount, 18))
      .call();

    const stETHAllocated = await stETHContract.methods
      .getPooledEthByShares(sharesAllocated)
      .call();

    return eigenContract.methods
      .depositIntoStrategy(
        CHAIN_CONFIG[networkId].lidoEigenStrategyAddress,
        CHAIN_CONFIG[networkId].lidoStETHAddress,
        stETHAllocated,
      )
      .encodeABI();
  }
};

const restakeFinanceStakeMethodEncoded = ({
  web3Call,
  depositAmount,
  networkId,
}) => {
  const abi = [
    {
      inputs: [{ internalType: "uint256", name: "vowID", type: "uint256" }],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const restakeDepositPoolContract = new web3Call.eth.Contract(
    abi,
    CHAIN_CONFIG[networkId].restakeDepositPoolAddress,
  );

  return restakeDepositPoolContract.methods
    .deposit(convertToWeiGovernance(depositAmount, 18))
    .encodeABI();
};

const swellEthStakeEncoded = ({ swellETHAddress, web3Call }) => {
  if (swellETHAddress) {
    const swellRswETHContract = new web3Call.eth.Contract(
      rswETHABI, // OR swETHABI
      swellETHAddress,
    );

    return swellRswETHContract.methods
      .depositWithReferral(REFERRAL_ADDRESS)
      .encodeABI();
  }
};

const swellEigenStakeMethodEncoded = async ({
  eigenContractAddress,
  depositAmount,
  web3Call,
  networkId,
}) => {
  if (eigenContractAddress) {
    const eigenContract = new web3Call.eth.Contract(
      eigenContractABI,
      eigenContractAddress,
    );

    const swETHContract = new web3Call.eth.Contract(
      swETHABI,
      CHAIN_CONFIG[networkId].swellSwETHAddress,
    );

    const ethToSwETHRate = await swETHContract.methods.ethToSwETHRate().call();

    const depositAmountToWei = convertToWeiGovernance(depositAmount, 18);
    const depositAmountBN = new web3Call.utils.BN(depositAmountToWei);
    const ethToSwETHRateBN = new web3Call.utils.BN(ethToSwETHRate);
    const previewAmountBN = depositAmountBN.mul(ethToSwETHRateBN);
    const previewAmount = web3Call.utils.fromWei(previewAmountBN, "ether");

    return eigenContract.methods
      .depositIntoStrategy(
        CHAIN_CONFIG[networkId].swellEigenStrategyAddress,
        CHAIN_CONFIG[networkId].swellSwETHAddress,
        previewAmount.toString().split(".")[0],
      )
      .encodeABI();
  }
};

const getStaderPreview = (contractAddress, amount, web3Call) => {
  if (contractAddress) {
    const stakeETHContractCall = new web3Call.eth.Contract(
      stakeETHABI,
      contractAddress,
    );

    return stakeETHContractCall?.methods?.previewDeposit(amount).call();
  }
};

const eigenStakeMethodEncoded = async (
  eigenContractAddress,
  amount,
  web3Call,
  networkId,
) => {
  if (eigenContractAddress) {
    const eigneContract = new web3Call.eth.Contract(
      eigenContractABI, // KELP Pool ABI
      eigenContractAddress, // KELP Pool Address
    );

    const previewAmount = await getStaderPreview(
      CHAIN_CONFIG[networkId].staderStakingPoolAddress,
      amount,
      web3Call,
    );

    return eigneContract.methods
      .depositIntoStrategy(
        CHAIN_CONFIG[networkId].staderEigenStrategyAddress, // Strategy Address
        CHAIN_CONFIG[networkId].staderETHxAddress, // Stader Eth Token Address
        previewAmount,
      )
      .encodeABI();
  }
};

const eigenUnstakeMethodEncoded = async (
  eigenContractAddress,
  gnosisAddress,
  eigenUnstakeAmount,
  web3Call,
) => {
  if (eigenContractAddress) {
    const eigneContract = new web3Call.eth.Contract(
      eigenContractABI,
      eigenContractAddress,
    );

    return eigneContract.methods
      .removeShares(
        gnosisAddress,
        "0x5d1E9DC056C906CBfe06205a39B0D965A6Df7C14",
        eigenUnstakeAmount,
      )
      .encodeABI();
  }
};

const depositErc20TokensToAavePool = (
  depositTokenAddress,
  depositAmount,
  addressWhereAssetsStored,
  referalCode = 0,
  web3Call,
  networkId,
) => {
  const depositInAavePoolCall = new web3Call.eth.Contract(
    erc20AaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return depositInAavePoolCall.methods
    .supply(
      depositTokenAddress,
      depositAmount,
      addressWhereAssetsStored,
      referalCode,
    )
    .encodeABI();
};

const stakeErc20TokensToStargate = (
  stakeTokenAddress,
  stakeAmount,
  gnosisAddress,
  web3Call,
  networkId,
) => {
  const stakeInStargate = new web3Call.eth.Contract(
    stargateStakeABI,
    CHAIN_CONFIG[networkId].stargateRouterAddress,
  );
  return stakeInStargate.methods
    .addLiquidity(
      CHAIN_CONFIG[networkId].stargatePoolIds[stakeTokenAddress],
      stakeAmount,
      gnosisAddress,
    )
    .encodeABI();
};

const stakeNativeTokensToStargate = (web3Call, networkId) => {
  const stakeInStargate = new web3Call.eth.Contract(
    stargateNativeABI,
    CHAIN_CONFIG[networkId].stargatNativeRouterAddress,
  );
  return stakeInStargate.methods.addLiquidityETH().encodeABI();
};

const unstakeErc20TokensToStargate = (
  unstakeTokenAddress,
  unstakeAmount,
  gnosisAddress,
  web3Call,
  networkId,
) => {
  const stakeInStargate = new web3Call.eth.Contract(
    stargateStakeABI,
    CHAIN_CONFIG[networkId].stargateRouterAddress,
  );
  return stakeInStargate.methods
    .instantRedeemLocal(
      CHAIN_CONFIG[networkId].stargatePoolIds[unstakeTokenAddress],
      unstakeAmount,
      gnosisAddress,
    )
    .encodeABI();
};

const swapWithUniswap = (
  swapToken,
  destinationToken,

  gnosisAddress,

  swapAmount,
  web3Call,
  networkId,
) => {
  const uniswapContract = new web3Call.eth.Contract(
    uniswapABI,
    CHAIN_CONFIG[networkId].uniswapRouterAddress,
  );

  return uniswapContract.methods
    .exactInputSingle([
      swapToken,
      destinationToken,
      500,
      gnosisAddress,
      Date.now() + 120,
      swapAmount,
      0,
      0,
    ])
    .encodeABI();
};

const depositEthMethodEncoded = (
  poolAddress,
  addressWhereAssetsStored,
  referalCode,
  web3Call,
  networkId,
) => {
  const depositEthCall = new web3Call.eth.Contract(
    maticAaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return depositEthCall.methods
    .depositETH(poolAddress, addressWhereAssetsStored, referalCode)
    .encodeABI();
};

const withdrawEthMethodEncoded = (
  poolAddress,
  withdrawAmount,
  addressWhereAssetsStored,
  web3Call,
  networkId,
) => {
  const withdrawEthCall = new web3Call.eth.Contract(
    maticAaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return withdrawEthCall.methods
    .withdrawETH(poolAddress, withdrawAmount, addressWhereAssetsStored)
    .encodeABI();
};

const withdrawErc20MethodEncoded = (
  tokenAddress,
  withdrawAmount,
  addressWhereAssetsStored,
  web3Call,
  networkId,
) => {
  const withdrawEthCall = new web3Call.eth.Contract(
    erc20AaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return withdrawEthCall.methods
    .withdraw(tokenAddress, withdrawAmount, addressWhereAssetsStored)
    .encodeABI();
};

const disburseTokenMethodEncoded = (
  actionContractAddress,
  amountArray,
  members,
  web3Call,
) => {
  if (actionContractAddress) {
    const actionContractSend = new web3Call.eth.Contract(
      disburseContractABI,
      actionContractAddress,
    );

    return actionContractSend.methods
      .disburseNative(members, amountArray)
      .encodeABI();
  }
};

export const getTransaction = async ({
  proposalData,
  daoAddress,
  walletAddress,
  factoryContractAddress,
  approvalData,
  transactionData,
  tokenData,
  gnosisAddress,
  parameters,
  isAssetsStoredOnGnosis,
  networkId,
  membersArray,
  airDropAmountArray,
}) => {
  const {
    executionId,
    safeThreshold,
    ownerAddress,
    airDropAmount,
    customTokenAmounts,
    customTokenAddresses,
    customNftToken,
    depositAmount,
    withdrawAmount,
    swapToken,
    destinationToken,
    swapAmount,
    stakeAmount,
    unstakeAmount,
    sendTokenAmounts,
    sendTokenAddresses,
    eigenStakeAmount,
    eigenUnstakeAmount,
  } = proposalData.commands[0];

  let approvalTransaction;
  let transaction;
  let stakeETHTransaction;
  const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

  switch (executionId) {
    case 0:
    case 4:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        transaction = {
          to: Web3.utils.toChecksumAddress(customTokenAddresses[0]),
          data: "0x",
          value: customTokenAmounts[0],
        };
        return { transaction };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
            executionId === 0 ? airDropAmount : customTokenAmounts[0],
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
          ),
          data: airdropTokenMethodEncoded(
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
            tokenData,
            airDropAmountArray,
            membersArray,
            web3Call,
          ),
          value: 0,
        };

        return { transaction, approvalTransaction };
      }

    case 1:
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [daoAddress, parameters],
        }),
        value: "0",
      };
      return { transaction };
    case 2:
    case 3:
    case 13:
    case 20:
    case 49:
    case 50:
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [
            factoryContractAddress ? factoryContractAddress : daoAddress,
            parameters,
          ],
        }),
        value: "0",
      };
      return { transaction };

    case 5:
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(tokenData),
        data: transferNFTfromSafe(
          tokenData,
          gnosisAddress,
          customTokenAddresses[0],
          customNftToken,
          web3Call,
        ),
        value: "0",
      };
      return { transaction };
    case 6:
    case 7:
      transaction = {
        ownerAddress,
        threshold: safeThreshold,
      };
      return { transaction };

    case 51:
      transaction = safeThreshold;
      return { transaction };
    case 8:
      if (isAssetsStoredOnGnosis) {
        const seaportContract = new web3Call.eth.Contract(
          seaportABI,
          SEAPORT_CONTRACT_ADDRESS,
        );
        transaction = {
          to: Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
          data: seaportContract.methods
            .fulfillBasicOrder_efficient_6GL6yc(
              transactionData.fulfillment_data.transaction.input_data
                .parameters,
            )
            .encodeABI(),
          value: transactionData.fulfillment_data.transaction.value.toString(),
        };
      } else {
        transaction = {
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: encodeFunctionData({
            abi: erc20DaoABI,
            functionName: "updateProposalAndExecution",
            args: [
              Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
              parameters,
            ],
          }),
          value: "10000000000000000",
        };
      }
      return { transaction };
    case 10:
    case 11:
    case 12:
    case 16:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [daoAddress, approvalData],
        }),
        value: "0",
      };
      transaction = {
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [
            factoryContractAddress ? factoryContractAddress : daoAddress,
            parameters,
          ],
        }),
        value: "0",
      };
      return { transaction, approvalTransaction };
    case 14:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveMaticPoolAddress,
          ),
          data: depositEthMethodEncoded(
            CHAIN_CONFIG[networkId]?.aavePoolAddress,
            gnosisAddress,
            0,
            web3Call,
            networkId,
          ),
          value: depositAmount.toString(),
        };

        return { transaction };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId].aavePoolAddress,
            depositAmount,
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aavePoolAddress,
          ),
          data: depositErc20TokensToAavePool(
            tokenData,
            depositAmount,
            gnosisAddress,
            0,
            web3Call,
            networkId,
          ),
          value: "0",
        };

        return { transaction, approvalTransaction };
      }

    case 15:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveWrappedMaticAddress,
          ),
          data: approveDepositWithEncodeABI(
            CHAIN_CONFIG[networkId].aaveWrappedMaticAddress,
            CHAIN_CONFIG[networkId].aaveMaticPoolAddress,
            withdrawAmount,
            web3Call,
          ),
          value: "0",
        };

        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveMaticPoolAddress,
          ),
          data: withdrawEthMethodEncoded(
            CHAIN_CONFIG[networkId].aavePoolAddress,
            withdrawAmount,
            gnosisAddress,
            web3Call,
            networkId,
          ),
          value: "0",
        };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveWrappedUsdcAddress,
          ),
          data: approveDepositWithEncodeABI(
            CHAIN_CONFIG[networkId].aaveWrappedUsdcAddress,
            CHAIN_CONFIG[networkId].aavePoolAddress,
            withdrawAmount,
            web3Call,
          ),
          value: "0",
        };

        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aavePoolAddress,
          ),
          data: withdrawErc20MethodEncoded(
            Web3.utils.toChecksumAddress(tokenData),
            withdrawAmount,
            gnosisAddress,
            web3Call,
            networkId,
          ),
          value: "0",
        };
      }
    case 19:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(tokenData),
        data: approveDepositWithEncodeABI(
          tokenData,
          CHAIN_CONFIG[networkId].uniswapRouterAddress,
          swapAmount,
          web3Call,
        ),
        value: "0",
      };
      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].uniswapRouterAddress,
        ),
        data: swapWithUniswap(
          swapToken,
          destinationToken,
          gnosisAddress,
          swapAmount,
          web3Call,
          networkId,
        ),
        value: "0",
      };
      return { approvalTransaction, transaction };
    case 17:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        transaction = {
          to: CHAIN_CONFIG[networkId].stargatNativeRouterAddress,
          data: stakeNativeTokensToStargate(web3Call, networkId),
          value: stakeAmount,
        };
      } else {
        approvalTransaction = {
          to: tokenData,
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId].stargateRouterAddress,
            stakeAmount,
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: CHAIN_CONFIG[networkId].stargateRouterAddress,
          data: stakeErc20TokensToStargate(
            tokenData,
            stakeAmount,
            gnosisAddress,
            web3Call,
            networkId,
          ),
          value: "0",
        };
      }
      return { transaction, approvalTransaction };
    case 18:
      approvalTransaction = {
        to: tokenData,
        data: approveDepositWithEncodeABI(
          tokenData,
          CHAIN_CONFIG[networkId].stargateRouterAddress,
          unstakeAmount,
          web3Call,
        ),
        value: "0",
      };
      transaction = {
        to: CHAIN_CONFIG[networkId].stargateRouterAddress,
        data: unstakeErc20TokensToStargate(
          tokenData,
          unstakeAmount,
          gnosisAddress,
          web3Call,
          networkId,
        ),
        value: "0",
      };
      return { transaction, approvalTransaction };
    case 21:
    case 22:
    case 23:
      const totalAmount = sendTokenAmounts.reduce(
        (partialSum, a) => partialSum + Number(a),
        0,
      );

      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.disburseContractAddress,
          ),
          data: disburseTokenMethodEncoded(
            CHAIN_CONFIG[networkId]?.disburseContractAddress,
            sendTokenAmounts,
            sendTokenAddresses,
            web3Call,
          ),
          value: totalAmount.toString(),
        };
        return { transaction };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
            (totalAmount * 2).toString(),
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
          ),
          data: airdropTokenMethodEncoded(
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
            tokenData,
            airDropAmountArray,
            membersArray,
            web3Call,
          ),
          value: 0,
        };
        return { transaction, approvalTransaction };
      }

    case 24:
      // token Data === usdc address

      const isSharesPoolSwapAvailable = await checkSwapAvailability({
        web3Call,
        depositAmount,
        networkId,
      });

      if (isSharesPoolSwapAvailable) {
        // Shares Pool Deposit
        const { data, depositFee } = await clipFinanceSharesPoolDeposit({
          depositAmount,
          networkId,
          web3Call,
          depositToken: tokenData,
        });

        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId].clipFinanceSharesPoolAddressLinea,
            depositAmount,
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.clipFinanceSharesPoolAddressLinea,
          ),
          data: data,
          value: depositFee,
        };

        return { transaction, approvalTransaction };
      } else {
        // Batch Deposit
        const { data, depositFee, allocateData } =
          await clipFinanceBatchDeposit({
            depositAmount,
            depositToken: tokenData,
            networkId,
            web3Call,
          });
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId].clipFinanceStrategyRouterAddressLinea,
            depositAmount,
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.clipFinanceStrategyRouterAddressLinea,
          ),
          data: data,
          value: depositFee,
        };
        stakeETHTransaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.clipFinanceStrategyRouterAddressLinea,
          ),
          data: allocateData,
          value: "0",
        };

        return { transaction, approvalTransaction, stakeETHTransaction };
      }
    case 25:
      const sharesToWithdraw = await calculateSharesToWithdraw({
        gnosisAddress,
        networkId,
        web3Call,
        withdrawAmount,
      });

      const { data, depositFee } = await clipFinanceSharesPoolWithdraw({
        networkId,
        sharesToWithdraw,
        web3Call,
      });

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].clipFinanceSharesTokenAddressLinea,
          CHAIN_CONFIG[networkId].clipFinanceSharesPoolAddressLinea,
          withdrawAmount,
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId]?.clipFinanceSharesPoolAddressLinea,
        ),
        data: data,
        value: depositFee,
      };

      return { transaction, approvalTransaction };

    case 26:
      //this txn will be diff for stader, lido, ankr, etc
      //currently, this is for stader
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].staderStakingPoolAddress, // Stader Staking Pool Address -
        ),
        data: depositEthForEigen(
          CHAIN_CONFIG[networkId].staderStakingPoolAddress, //  Stader Staking Pool Address
          gnosisAddress,
          web3Call,
        ),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].staderETHxAddress, // Stader Ethx Address - swETH Address
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].staderETHxAddress,
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress, // Eigen Layer Deposit Pool Address - (KELP pool)
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };

      const stakeData = await eigenStakeMethodEncoded(
        CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress, // KELP Pool
        convertToWeiGovernance(depositAmount, 18).toString(),
        web3Call,
        networkId,
      );

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        ),
        data: stakeData,
        value: 0,
      };
      return { stakeETHTransaction, transaction, approvalTransaction };
    case 27:
      const unstakeData = await eigenUnstakeMethodEncoded(
        "0x779d1b5315df083e3F9E94cB495983500bA8E907",
        gnosisAddress,
        eigenUnstakeAmount.toString(),
        web3Call,
      );
      transaction = {
        to: Web3.utils.toChecksumAddress(
          "0x779d1b5315df083e3F9E94cB495983500bA8E907",
        ),
        data: unstakeData,
        value: 0,
      };
      return { transaction };

    case 31:
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].staderStakingPoolAddress, // Stader Staking Pool Address
        ),
        data: depositETHInStader(
          CHAIN_CONFIG[networkId].staderStakingPoolAddress, //  Stader Staking Pool Address
          gnosisAddress,
          web3Call,
        ),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].staderETHxAddress, // Stader Ethx Address
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].staderETHxAddress,
          CHAIN_CONFIG[networkId].staderKelpPoolAddress, // (KELP pool)
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].staderKelpPoolAddress,
        ),
        data: await kelpStakeMethodEncoded(
          CHAIN_CONFIG[networkId].staderKelpPoolAddress,
          depositAmount,
          web3Call,
          networkId,
        ),
        value: "0",
      };

      return { stakeETHTransaction, approvalTransaction, transaction };

    case 33:
      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].swellRswETHAddress,
        ),
        data: swellEthStakeEncoded({
          swellETHAddress: CHAIN_CONFIG[networkId].swellRswETHAddress,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      return { transaction };

    case 35:
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].swellSwETHAddress,
        ),
        data: swellEthStakeEncoded({
          swellETHAddress: CHAIN_CONFIG[networkId].swellSwETHAddress,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].swellSwETHAddress,
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].swellSwETHAddress,
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress, // Eigen Layer Deposit Pool Address
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        ),
        data: await swellEigenStakeMethodEncoded({
          eigenContractAddress:
            CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
          depositAmount,
          web3Call,
          networkId,
        }),
        value: "0",
      };

      return { stakeETHTransaction, approvalTransaction, transaction };

    case 37:
      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].renzoStakingPoolAddress,
        ),
        data: renzoEthStakeEncoded({
          renzoStakingPoolAddress:
            CHAIN_CONFIG[networkId].renzoStakingPoolAddress,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      return { transaction };

    case 39:
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].lidoStETHAddress,
        ),

        data: lidoEthStakeEncoded({
          networkId,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].lidoStETHAddress,
        ),

        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].lidoStETHAddress,
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),

        value: "0",
      };
      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        ),
        data: await lidoEigneStakeMethodEncoded({
          depositAmount,
          networkId,
          web3Call,
          eigenContractAddress:
            CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        }),
        value: "0",
      };

      return { stakeETHTransaction, approvalTransaction, transaction };

    case 41:
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].lidoStETHAddress,
        ),
        data: lidoEthStakeEncoded({
          networkId,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].lidoStETHAddress,
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].lidoStETHAddress,
          CHAIN_CONFIG[networkId].restakeDepositPoolAddress,
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].restakeDepositPoolAddress,
        ),
        data: restakeFinanceStakeMethodEncoded({
          depositAmount,
          networkId,
          web3Call,
        }),
        value: "0",
      };

      return { stakeETHTransaction, approvalTransaction, transaction };

    case 43:
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].rocketDepositPoolAddress,
        ),
        data: rocketPoolStakeEncoded({
          networkId,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].rocketRETHAddress,
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].rocketRETHAddress,
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        ),
        data: await rocketPoolEigenStakeMethodEncoded({
          depositAmount,
          networkId,
          web3Call,
          eigenContractAddress:
            CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        }),
        value: "0",
      };

      return { stakeETHTransaction, approvalTransaction, transaction };

    case 45:
      stakeETHTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].mantleDepositPoolAddress,
        ),
        data: await matlePoolStakeEncoded({
          networkId,
          web3Call,
          depositAmount,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };

      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].mantleMEthAddress,
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].mantleMEthAddress,
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
          convertToWeiGovernance(depositAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        ),
        data: await mantlePoolEigenStakeMethodEncoded({
          depositAmount,
          networkId,
          web3Call,
          eigenContractAddress:
            CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        }),
        value: "0",
      };

    case 47:
      transaction = {
        to: Web3.utils.toChecksumAddress(CHAIN_CONFIG[networkId].layerBankPool),
        data: await layerBankStakeMethodEncoded({
          layerBankToken: CHAIN_CONFIG[networkId].layerBankToken,
          layerBankPoolAddress: CHAIN_CONFIG[networkId].layerBankPool,
          depositAmount,
          networkId,
          web3Call,
        }),
        value: convertToWeiGovernance(depositAmount, 18).toString(),
      };
      return { transaction };
    case 48:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].layerBankToken,
        ),
        data: approveDepositWithEncodeABI(
          CHAIN_CONFIG[networkId].layerBankToken,
          CHAIN_CONFIG[networkId].layerBankPool,
          convertToWeiGovernance(unstakeAmount, 18).toString(),
          web3Call,
        ),
        value: "0",
      };
      transaction = {
        to: Web3.utils.toChecksumAddress(CHAIN_CONFIG[networkId].layerBankPool),
        data: await layerBankUnStakeMethodEncoded({
          layerBankToken: CHAIN_CONFIG[networkId].layerBankToken,
          layerBankPoolAddress: CHAIN_CONFIG[networkId].layerBankPool,
          unstakeAmount,
          networkId,
          web3Call,
        }),
        value: "0",
      };
      return { transaction };
  }
};

export const createSafeTransactionData = ({
  approvalTransaction,
  stakeETHTransaction,
  transaction,
  nonce,
}) => {
  try {
    if (stakeETHTransaction !== "" && stakeETHTransaction !== undefined) {
      return [
        {
          to: stakeETHTransaction?.to,
          data: stakeETHTransaction?.data,
          value: stakeETHTransaction?.value,
          nonce,
        },
        {
          to: approvalTransaction?.to,
          data: approvalTransaction?.data,
          value: approvalTransaction?.value,
          nonce,
        },
        {
          to: transaction?.to,
          data: transaction?.data,
          value: transaction?.value,
          nonce,
        },
      ];
    } else if (
      approvalTransaction === "" ||
      approvalTransaction === undefined
    ) {
      return {
        to: transaction?.to,
        data: transaction?.data,
        value: transaction?.value,
        nonce,
      };
    } else {
      return [
        {
          to: approvalTransaction?.to,
          data: approvalTransaction?.data,
          value: approvalTransaction?.value,
          nonce,
        },
        {
          to: transaction?.to,
          data: transaction?.data,
          value: transaction?.value,
          nonce,
        },
      ];
    }
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const getTokenTypeByExecutionId = (commands) => {
  const executionId = commands[0]?.executionId;

  switch (executionId) {
    case 0:
      return commands[0]?.airDropToken;
    case 4:
      return commands[0]?.customToken;
    case 5:
      return commands[0]?.customNft;
    case 14:
      return commands[0]?.depositToken;
    case 15:
      return commands[0]?.withdrawToken;
    case 19:
      return commands[0]?.swapToken;
    case 17:
      return commands[0]?.stakeToken;
    case 18:
    case 48:
      return commands[0]?.unstakeToken;
    case 21:
    case 22:
    case 23:
      return commands[0]?.sendToken;
    case 24:
    case 26:
    case 31:
    case 33:
    case 35:
    case 37:
    case 39:
    case 41:
    case 43:
    case 47:
    case 45:
      return commands[0]?.depositToken;
    case 25:
      return commands[0]?.withdrawToken;
    default:
      return "";
  }
};
