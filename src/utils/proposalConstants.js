import sendIcon from "../../public/assets/icons/send_icon.svg";
import nftIcon from "../../public/assets/icons/NFT.svg";
import piggyIcon from "../../public/assets/icons/piggy_icon.svg";
import whitelistIcon from "../../public/assets/icons/whitelist_icon.svg";
// import lensIcon from "../../public/assets/icons/Lens_icon.svg";
import rewardIcon from "../../public/assets/icons/reward_icon.svg";
import walletIcon from "../../public/assets/icons/Wallet_icon.svg";
import govIcon from "../../public/assets/icons/gov_icon.svg";
import adduserIcon from "../../public/assets/icons/adduser_icon.svg";
import removeUserIcon from "../../public/assets/icons/removeuser_icon.svg";
import moneyIcon from "../../public/assets/icons/money_icon.svg";
import { CHAIN_CONFIG } from "./constants";

export const proposalActionCommands = {
  0: "Distribute tokens to members",
  1: "Mint club token",
  2: "Modify governance",
  3: "Update total raise amount",
  4: "Send assets to an address",
  5: "Send nft to an address",
  6: "Add multisig signer",
  7: "Remove multisig signer",
  // 8: "Buy an NFT via Opensea",
  // 9: "Sell nft",
  10: "Whitelist addresses",
  // 11: "Whitelist Lens profile followers",
  // 12: "Whitelist addresses who commented on Lens post",
  13: "Update price per share",
  20: "Update total NFT supply",
  // 14: "Deposit tokens in AAVE pool",
  // 15: "Withdraw tokens from AAVE pool",
  // 16: "Whitelist addresses who mirrored Lens post",
  17: "Stake tokens through stargate",
  18: "Unstake tokens through stargate",
  // 19: "Swap tokens through uniswap",
  21: "Send tokens through csv",
  22: "Send tokens to all members",
  23: "Send tokens pro rata basis",
  24: "Deposit tokens with clip-finance",
  25: "Withdraw tokens with clip-finance",
  26: "Stake eth through eigen layer",
  27: "Remove stake from eigen layer",
  47: "Stake tokens through layer-bank",
  48: "Unstake tokens through layer-bank",
  49: "Stake tokens through mendi-finance",
  50: "Unstake tokens through mendi-finance",
  51: "Stake tokens through AAVE",
  52: "Unstake tokens from AAVE",

  53: "Stake ezETH(Renzo) on Zerolend",

  // 49: "Update minimum deposit amount per user",
  // 50: "Update maximum deposit amount per user",
  // 51: "Update signing threshold",

  60: "Update minimum deposit amount per user",
  61: "Update maximum deposit amount per user",
  62: "Update signing threshold",
};

export const PROPOSAL_MENU_ITEMS = (isGovernanceActive, tokenType) => {
  return [
    {
      key: 0,
      icon: rewardIcon,
      value: "Distribute tokens to members",
      text: "Distribute tokens to member(s)",
      section: "Administrative",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 1,
      icon: walletIcon,
      value: "Mint club token",
      text: "Mint station tokens",
      section: "Administrative",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 2,
      icon: govIcon,
      value: "Modify governance",
      text: "Modify governance",
      section: "Administrative",
      condition: () => isGovernanceActive,
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 3,
      icon: piggyIcon,
      value: "Update total raise amount",
      text: "Update total raise amount",
      section: "Deposits",
      condition: () => tokenType !== "erc721",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 13,
      icon: moneyIcon,
      value: "Update price per share",
      text: "Update price per share",
      section: "Deposits",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 20,
      icon: moneyIcon,
      value: "Update total NFT supply",
      text: "Update total NFT supply",
      section: "Deposits",
      condition: () => tokenType === "erc721",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 4,
      icon: sendIcon,
      value: "Send assets to an address",
      text: "Send assets to an address",
      section: "Manage Assets",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 5,
      value: "Send nft to an address",
      icon: nftIcon,
      text: "Send NFT",
      section: "Manage Assets",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    // {
    //   key: 8,
    //   value: "Buy an NFT via Opensea",
    //   text: "Buy an NFT via Opensea",
    //   section: "Manage Assets",
    // availableOnNetworkIds: [
    //   "0x89",
    //   "0x5",
    //   "0x1",
    //   "0x2105",
    //   "0xa4b1",
    //   "0xe708",
    //   "0x38",
    //   "0x1388",
    //   "0x64",
    //   "0x82750",
    //   "0xa9",
    //   "0x28c5f",
    // ],
    // },
    {
      key: 6,
      icon: adduserIcon,
      value: "Add multisig signer",
      text: "Add multisig signer",
      section: "Administrative",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 7,
      icon: removeUserIcon,
      value: "Remove multisig signer",
      text: "Remove multisig signer",
      section: "Administrative",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    {
      key: 10,
      icon: whitelistIcon,
      value: "Whitelist addresses",
      text: "Whitelist custom addresses",
      section: "Deposits",
      availableOnNetworkIds: [
        "0x89",
        "0x5",
        "0x1",
        "0x2105",
        "0xa4b1",
        "0xe708",
        "0x38",
        "0x1388",
        "0x64",
        "0x82750",
        "0xa9",
        "0x28c5f",
        "0xa86a",
      ],
    },
    // {
    //   key: 11,
    //   icon: lensIcon,
    //   value: "Whitelist Lens profile followers",
    //   text: "Whitelist Lens profile followers",
    //   section: "Deposits",
    //   availableOnNetworkIds: [
    //     "0x89",
    //     "0x5",
    //     "0x1",
    //     "0x2105",
    //     "0xa4b1",
    //     "0xe708",
    //     "0x38",
    //     "0x1388",
    //     "0x64",
    //     "0x82750",
    //     "0xa9",
    //     "0x28c5f",
    //   ],
    // },
    // {
    //   key: 12,
    //   icon: lensIcon,
    //   value: "Whitelist addresses who commented on Lens post",
    //   text: "Whitelist comments on Lens post",
    //   section: "Deposits",
    //   availableOnNetworkIds: [
    //     "0x89",
    //     "0x5",
    //     "0x1",
    //     "0x2105",
    //     "0xa4b1",
    //     "0xe708",
    //     "0x38",
    //     "0x1388",
    //     "0x64",
    //     "0x82750",
    //     "0xa9",
    //     "0x28c5f",
    //   ],
    // },
    // {
    //   key: 16,
    //   icon: lensIcon,
    //   value: "Whitelist addresses who mirrored Lens post",
    //   text: "Whitelist Lens post mirrors",
    //   section: "Deposits",
    //   availableOnNetworkIds: [
    //     "0x89",
    //     "0x5",
    //     "0x1",
    //     "0x2105",
    //     "0xa4b1",
    //     "0xe708",
    //     "0x38",
    //     "0x1388",
    //     "0x64",
    //     "0x82750",
    //     "0xa9",
    //     "0x28c5f",
    //   ],
    // },
    // {
    //   key: 14,
    //   value: "Deposit tokens in AAVE pool",
    //   text: "AAVE Pool - Deposit",
    //   section: "DeFi Pools",
    //   availableOnNetworkIds: ["0x89"],
    // },
    // {
    //   key: 15,
    //   value: "Withdraw tokens from AAVE pool",
    //   text: "AAVE Pool - Withdraw",
    //   section: "DeFi Pools",
    //   availableOnNetworkIds: ["0x89"],
    // },
    {
      key: 17,
      value: "Stake tokens through stargate",
      text: "Stargate - Stake",
      section: "DeFi Pools",
      icon: sendIcon,
      availableOnNetworkIds: ["0x89", "0xe708"],
    },
    {
      key: 18,
      value: "Unstake tokens through stargate",
      text: "Stargate - Unstake",
      section: "DeFi Pools",
      icon: sendIcon,
      availableOnNetworkIds: ["0x89", "0xe708"],
    },
    // {
    //   key: 19,
    //   value: "Swap tokens through uniswap",
    //   text: "Uniswap - Swap",
    //   section: "Manage Assets",
    //   availableOnNetworkIds: ["0x89"],
    // },
    // {
    //   key: 21,
    //   value: "Send tokens through csv",
    //   text: "Send tokens through csv",
    //   section: "Manage Assets",
    //   icon: sendIcon,
    //   availableOnNetworkIds: ["0x89"],
    // },
    // {
    //   key: 22,
    //   value: "Send tokens to all members",
    //   text: "Send tokens to all members",
    //   section: "Manage Assets",
    //   icon: sendIcon,
    //   availableOnNetworkIds: ["0x89"],
    // },
    // {
    //   key: 23,
    //   value: "Send tokens pro rata basis",
    //   text: "Send tokens pro rata basis",
    //   section: "Manage Assets",
    //   icon: sendIcon,
    //   availableOnNetworkIds: ["0x89"],
    // },
  ];
};

export const DEFI_PROPOSALS_ETH_POOLS = ({
  staderETHStaked = 0,
  stargateStaked,
  kelpEthStaked,
  swellRswEthStaked,
  swellEigenEthStaked,
  renzoEzEthStaked,
  lidoEigenEthStaked,
  restakeRstETHStaked,
  mantleEigenStaked,
  layerBankStaked,
  aaveScrollStaked,
  renzoZerolLendStaked,
  zeroLendNativeETHStaked,
  networkId,
}) => {
  return [
    {
      name: "Stargate Finance",
      logo: "/assets/icons/stargate.png",
      APY: "3.5",
      staked: stargateStaked,
      token: "ETH",
      executionIds: {
        Stake: 17,
        Unstake: 18,
      },
      availableOnNetworkIds: ["0xe708"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.stargateUnstakingAddresses
        ? CHAIN_CONFIG[networkId].stargateUnstakingAddresses[0]
        : "",
      risk: "Low",
      info: (
        <span>
          This strategy stake ETH for sETH. You earn 3.5% native yield on
          holding the sETH from Stargate Finance.
          <br />
          <br />
          This is a new protocol, deposit at your own risk.
        </span>
      ),
    },

    {
      name: "Stader X Eigen",
      logo: "/assets/icons/stader.png",
      APY: "3.4",
      staked: staderETHStaked,
      token: "ETH",
      executionIds: {
        Stake: 26,
        Unstake: 27,
      },
      availableOnNetworkIds: ["0x1"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.staderETHxAddress
        ? CHAIN_CONFIG[networkId].staderETHxAddress
        : "",
      isUnstakeDisabled: true,
      risk: "Low",

      info: (
        <span>
          This strategy earns Eigen Points by staking ETH on Stader to get ETHx
          (an LST by Staderlabs with 3.4% APR on ETH) and by restaking ETHx
          directly on Eigen Pool. All of it in a single transaction.
          <br /> <br /> Reward points are accrued on your Stations treasury
          address.
        </span>
      ),
      tags: ["🏆 EIGEN POINTS", "⭐ STARS"],
    },

    {
      name: "Lido X Eigen",
      logo: "/assets/images/lido_eigen.png",
      APY: "3.4",
      staked: lidoEigenEthStaked,
      token: "ETH",
      executionIds: {
        Stake: 39,
        Unstake: 40,
      },
      availableOnNetworkIds: ["0x1"],
      isUnstakeDisabled: true,
      risk: "Low",

      info: (
        <span>
          This strategy earns Eigen Points by staking ETH on Lido to get stETH
          (an LST by Lido with 3.4% APR on ETH) and by restaking stETH directly
          on Eigen Pool. All of it in a single transaction.
          <br /> <br /> Reward points are accrued on your Stations treasury
          address.
        </span>
      ),
      tags: ["🏆 EIGEN POINTS", "⭐ STARS"],
    },
    {
      name: "Mantle X Eigen",
      logo: "/assets/icons/mantle.png",
      APY: "7.23",
      staked: mantleEigenStaked,
      token: "ETH",
      executionIds: {
        Stake: 45,
        Unstake: 46,
      },
      availableOnNetworkIds: ["0x1"],
      isUnstakeDisabled: true,
      risk: "Low",
      info: (
        <span>
          This strategy earns Eigen Points by staking ETH on MantlePool to get
          mETH (an LST by Mantle with ~7.23% APR on ETH) and by restaking mETH
          directly on Eigen Pool. All of it in a single transaction.
          <br /> <br /> Reward points are accrued on your Stations treasury
          address.
        </span>
      ),
      tags: ["🏆 EIGEN POINTS", "⭐ STARS"],
    },

    {
      name: "Swell X Eigen",
      logo: "/assets/icons/swell_eigen.png",
      APY: "3.32",
      staked: swellEigenEthStaked,
      token: "ETH",
      executionIds: {
        Stake: 35,
        Unstake: 36,
      },
      availableOnNetworkIds: ["0x1"],
      isUnstakeDisabled: true,
      info: (
        <span>
          This strategy earns Eigen Points + Swell Pearls by staking ETH on
          Swell to get swETH (an LST by Swell with 3.32% APR on ETH) and by
          restaking swETH directly on Eigen Pool. All of it in a single
          transaction.
          <br /> <br /> Reward points are accrued on your Stations treasury
          address.
        </span>
      ),
      tags: ["🏆 EIGEN POINTS", "⭐ STARS"],
      risk: "Low",

      // unstakeTokenAddress: CHAIN_CONFIG[networkId]?.swellRswETHAddress
      //   ? CHAIN_CONFIG[networkId].swellRswETHAddress
      //   : "",
    },
    {
      name: "Stader X Kelp LRT",
      logo: "/assets/icons/kelp.png",
      APY: "3.4",
      staked: kelpEthStaked,
      token: "ETH",
      executionIds: {
        Stake: 31,
        Unstake: 32,
      },
      availableOnNetworkIds: ["0x1"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.kelpRsETHAddress
        ? CHAIN_CONFIG[networkId].kelpRsETHAddress
        : "",
      isUnstakeDisabled: true,
      risk: "Low",
      info: (
        <span>
          This strategy earns Eigen Points + Kelp Miles by staking ETH on Stader
          to get ETHx (an LST by Staderlabs with 3.4% APR on ETH) and by
          restaking ETHx via KelpDAO to get reETH(a liquid restaked token by
          Kelp DAO). All of it in a single transaction.
          <br /> <br /> Reward points are accrued on your Stations treasury
          address.
        </span>
      ),
      tags: ["🏆 EIGEN POINTS", "⭐ STARS", "🏆 KELP MILES"],
    },

    {
      name: "Swell LRT",
      logo: "/assets/icons/swell.png",
      APY: "3.32",
      staked: swellRswEthStaked,
      token: "ETH",
      executionIds: {
        Stake: 33,
        Unstake: 34,
      },
      availableOnNetworkIds: ["0x1"],
      risk: "Medium",
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.swellRswETHAddress
        ? CHAIN_CONFIG[networkId].swellRswETHAddress
        : "",
      isUnstakeDisabled: true,

      info: (
        <span>
          This strategy earns Eigen Points + Swell Pearls by minting rswETH in
          exchange of ETH. rswETH is a liquid restaked token by Swell. Minting 1
          rswETH gives you 30 bonus Peals. <br />
          <br />
          This is a new protocol, deposit at your own risk. Reward points are
          accrued on your Stations treasury address.
        </span>
      ),
      tags: ["🏆 EIGEN POINTS", "⭐ STARS", "🐚 PEARLS"],
    },

    {
      name: "Renzo Protocol LRT",
      logo: "/assets/icons/renzo_logo.png",
      APY: "2.99",
      staked: renzoEzEthStaked,
      token: "ETH",
      executionIds: {
        Stake: 37,
        Unstake: 38,
      },
      availableOnNetworkIds: ["0x1", "0xe708"],
      risk: "Low",
      // unstakeTokenAddress: CHAIN_CONFIG[networkId]?.renzoEzETHAddress
      //   ? CHAIN_CONFIG[networkId].renzoEzETHAddress
      //   : "",
      isUnstakeDisabled: true,
      info: (
        <span>
          This strategy earns Eigen Points + Renzo ezPoints by minting ezETH in
          exchange of ETH. ezETH is a liquid restaked token by Rezo.
          <br />
          <br />
          This is a new protocol, deposit at your own risk. Reward points are
          accrued on your Stations treasury address.
        </span>
      ),
      // tags: ["🏆 EIGEN POINTS", "⭐ STARS", "🏆 exPoints"],
    },

    {
      name: "stETH X Restake LRT",
      logo: "/assets/images/restake.png",
      APY: "3.4",
      staked: restakeRstETHStaked,
      token: "ETH",
      executionIds: {
        Stake: 41,
        Unstake: 42,
      },
      availableOnNetworkIds: ["0x1"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.restakeRstETHAddress
        ? CHAIN_CONFIG[networkId].restakeRstETHAddress
        : "",
      isUnstakeDisabled: true,
      risk: "High",
      info: (
        <span>
          This strategy swaps ETH for stETH and then restakes it to get rstETH
          (LRT by restakefinance.com). You earn 3.4% native yield on holding the
          LRT & ~10% APR from Eigen Rewards from Restake Finance.
          <br />
          <br />
          This is a new protocol, deposit at your own risk. Reward points are
          accrued on your Stations treasury address.
        </span>
      ),
      tags: ["🏆 RSTK APR"],
    },
    {
      name: "LayerBank",
      logo: "/assets/images/restake.png",
      APY: "3.4",
      staked: layerBankStaked,
      token: "ETH",
      executionIds: {
        Stake: 47,
        Unstake: 48,
      },
      availableOnNetworkIds: ["0xe708", "0x82750"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.layerBankToken
        ? CHAIN_CONFIG[networkId].layerBankToken
        : "",
      isUnstakeDisabled: false,
      risk: "Low",
      info: (
        <span>
          This strategy swaps ETH for lETH. You earn 3.4% native yield on
          holding the lETH from LayerBank Finance.
          <br />
          <br />
          This is a new protocol, deposit at your own risk.
        </span>
      ),
      tags: [],
    },
    {
      name: "Zerolend",
      logo: "/assets/icons/zerolend.png",
      APY: "3.4",
      staked: zeroLendNativeETHStaked,
      token: "ETH",
      executionIds: {
        Stake: 57,
        Unstake: 58,
      },
      availableOnNetworkIds: ["0xe708"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.zeroWETHAddress
        ? CHAIN_CONFIG[networkId].zeroWETHAddress
        : "",
      isUnstakeDisabled: false,
      risk: "Low",
      info: (
        <span>
          This strategy swaps USDC for z0USDC in Zerolend&apos;s USDC pool. You
          earn 12.4% APY holding z0USDC by Zerolend.
        </span>
      ),
      tags: ["🐚 ZERO POINTS"],
    },
    {
      name: "Aave",
      logo: "/assets/icons/aave.svg",
      APY: "3.4",
      staked: aaveScrollStaked,
      token: "ETH",
      executionIds: {
        Stake: 51,
        Unstake: 52,
      },
      availableOnNetworkIds: ["0x82750"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.aaveWrappedScrollEthAddress
        ? CHAIN_CONFIG[networkId].aaveWrappedScrollEthAddress
        : "",
      isUnstakeDisabled: false,
      risk: "High",
      info: (
        <span>
          This strategy swaps ETH for aaveWETH. You earn 3.4% native yield on
          holding aaveWETH by AAVE.
        </span>
      ),
      tags: [],
    },
    // {
    //   name: "Renzo X Zerolend",
    //   logo: "/assets/icons/zerolend.png",
    //   APY: "3.4",
    //   staked: renzoZerolLendStaked,
    //   token: "ETH",
    //   executionIds: {
    //     Stake: 53,
    //     Unstake: 54,
    //   },
    //   availableOnNetworkIds: ["0xe708"],
    //   unstakeTokenAddress: CHAIN_CONFIG[networkId]?.zeroETHAddress
    //     ? CHAIN_CONFIG[networkId].zeroETHAddress
    //     : "",
    //   isUnstakeDisabled: true,
    //   risk: "Low",
    //   info: (
    //     <span>
    //       This strategy swaps ETH for ezETH and then stake ezETH in Zerolend to
    //       get z0ETH (an LST by Zerolend). All of it in a single transaction. You
    //       earn 3.4% native yield on holding z0ETH by AAVE.
    //     </span>
    //   ),
    //   tags: ["🐚 ZERO POINTS", "⭐ ezPOINTS", "🏆 EIGEN POINTS"],
    // },
  ];
};

export const DEFI_PROPOSALS_USDC_POOLS = ({
  mendiStaked,
  zeroLendUSDCStaked,
  networkId,
}) => {
  return [
    {
      name: "Mendi Finance",
      logo: "/assets/icons/mendi.jpeg",
      APY: "8.7",
      staked: mendiStaked,
      token: "USDC",
      executionIds: {
        Stake: 49,
        Unstake: 50,
      },
      availableOnNetworkIds: ["0xe708"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.mendiTokenAddress
        ? CHAIN_CONFIG[networkId].mendiTokenAddress
        : "",
      isUnstakeDisabled: false,
      risk: "Low",
      info: (
        <span>
          This strategy swaps USDC for meUSDC. You earn 8.79% interest on
          supplying the USDC from Mendi Finance.
          <br />
          <br />
          This is a new protocol, deposit at your own risk.
        </span>
      ),
      tags: [],
    },
    {
      name: "Zerolend",
      logo: "/assets/icons/zerolend.png",
      APY: "3.4",
      staked: zeroLendUSDCStaked,
      token: "USDC",
      executionIds: {
        Stake: 55,
        Unstake: 56,
      },
      availableOnNetworkIds: ["0xe708"],
      unstakeTokenAddress: CHAIN_CONFIG[networkId]?.zeroUSDCAddress
        ? CHAIN_CONFIG[networkId].zeroUSDCAddress
        : "",
      isUnstakeDisabled: false,
      risk: "Low",
      info: (
        <span>
          This strategy swaps USDC for z0USDC in Zerolend&apos;s USDC pool. You
          earn 12.4% APY holding z0USDC by Zerolend.
        </span>
      ),
      tags: ["🐚 ZERO POINTS"],
    },
  ];
};
