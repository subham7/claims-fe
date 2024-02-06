import { retrieveNftListing } from "api/assets";
import { CHAIN_CONFIG } from "utils/constants";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { convertToFullNumber } from "utils/helper";
import { isMember } from "utils/stationsSubgraphHelper";
import { getPublicClient } from "utils/viemConfig";
import * as yup from "yup";

export const step1ValidationSchema = yup.object({
  clubName: yup
    .string("Enter club name")
    .min(2, "Name should be of minimum 2 characters length")
    .required("Club Name is required"),
  clubSymbol: yup
    .string("Enter club symbol")
    .required("Club Symbol is required"),
  email: yup.string("Enter email address").email("Enter valid email"),
});

export const ERC20Step2ValidationSchema = yup.object({
  depositClose: yup
    .date()
    .min(new Date(), "Date-time must be greater than now.")
    .required("Deposit close date is required"),
  minDepositPerUser: yup
    .number()
    .required("Min deposit amount is required")
    .moreThan(0, "Min deposit should be greater than 0"),
  maxDepositPerUser: yup
    .number()
    .moreThan(
      yup.ref("minDepositPerUser"),
      "Amount should be greater than min deposit",
    )
    .required("Max deposit amount is required"),
  totalRaiseAmount: yup
    .number()
    .required("Raise amount is required")
    .moreThan(
      yup.ref("minDepositPerUser"),
      "Amount should be greater than min deposit",
    ),
  pricePerToken: yup
    .number()
    .required("Price per token is required")
    .moreThan(0, "Price should be greater than 0"),
});

export const step3ValidationSchema = yup.object({
  addressList: yup
    .array()
    .of(
      yup
        .string()
        .test("Address", "Invalid address", (value) => {
          return value && value.length === 42 && value.startsWith("0x");
        })
        .required("Wallet address is required"),
    )
    .test("Duplicate address", "Duplicate address found", function (value) {
      if (value) {
        const uniqueSet = new Set(value);
        const isUnique = uniqueSet.size === value.length;

        if (!isUnique) {
          const duplicates = [];
          value.forEach((address, index) => {
            if (value.indexOf(address) !== index) {
              duplicates.push(index);
            }
          });

          return this.createError({
            path: `addressList[${duplicates[0]}]`,
            message: "Duplicate address found",
          });
        }
      }

      return true;
    }),
});

export const step4ValidationSchema = yup.object({
  deploySafe: yup.boolean(),
  safeAddress: yup.string().when("deploySafe", {
    is: false,
    then: () =>
      yup.string("Enter safe address").required("Safe address is required"),
  }),
});

export const ERC721Step2ValidationSchema = yup.object({
  nftImage: yup.mixed().required("File is required"),
  pricePerToken: yup
    .number("Enter amount of tokens")
    .required("Price per token is required")
    .test(
      "invalidPricePerToken",
      "Invalid price per token value",
      async (value, context) => {
        const { isNftTotalSupplylimited } = context.parent;
        if (isNftTotalSupplylimited === true) {
          try {
            if (Number(value) >= 0) {
              return true;
            } else return false;
          } catch (error) {
            return false;
          }
        } else {
          try {
            if (Number(value) > 0) {
              return true;
            } else return false;
          } catch (error) {
            return false;
          }
        }
      },
    ),
  maxTokensPerUser: yup
    .number("Enter amount of tokens")
    .test(
      "invalidMaxTokenPerUser",
      "Enter token less than total supply",
      async (value, context) => {
        const { isNftTotalSupplylimited, totalTokenSupply } = context.parent;
        if (isNftTotalSupplylimited === true) {
          try {
            if (Number(value) <= totalTokenSupply && Number(value) > 0) {
              return true;
            } else return false;
          } catch (error) {
            return false;
          }
        }
        return true;
      },
    ),
  isNftTotalSupplylimited: yup.boolean(),
  totalTokenSupply: yup.number().when("isNftTotalSupplylimited", {
    is: true,
    then: () => yup.number().required("Total supply of nft is required"),
  }),
  depositClose: yup
    .date()
    .min(new Date(), "Date-time must be greater than now.")
    .required("Deposit close date is required"),
});

export const getProposalValidationSchema = ({
  networkId,
  getBalance,
  getDecimals,
  gnosisAddress,
  factoryData,
  walletAddress,
  daoAddress,
  getERC20TotalSupply,
  getNftOwnersCount,
  tokenType,
}) => {
  return yup.object({
    proposalDeadline: yup.date().required("Deposit close date is required"),
    proposalTitle: yup
      .string("Enter proposal title")
      .required("Title is required"),
    proposalDescription: yup
      .string("Enter proposal description")
      .required("Description is required"),
    optionList: yup.array().of(
      yup.object({
        text: yup.string().required("Option is required"),
      }),
    ),
    blockNum: yup
      .number()
      .test(
        "invalidBlockNum",
        "Enter a block number less than current block number",
        async (value, context) => {
          try {
            const publicClient = getPublicClient(networkId);
            const block = Number(await publicClient.getBlockNumber());
            if (
              Number(value) <= block ||
              value === undefined ||
              value.length === 0
            ) {
              return true;
            } else return false;
          } catch (error) {
            return false;
          }
        },
      ),
    actionCommand: yup.string("Enter proposal action").when("typeOfProposal", {
      is: "action",
      then: () =>
        yup
          .number("Enter proposal action")
          .required("Action command is required"),
    }),
    amountToAirdrop: yup
      .number("Enter amount of tokens")
      .test(
        "invalidAirdropAmount",
        "Enter an amount less or equal to treasury balance",
        async (value, context) => {
          const { actionCommand, airdropToken } = context.parent;
          if (actionCommand === 0) {
            try {
              const balance = await getBalance(airdropToken, gnosisAddress);
              const decimals = await getDecimals(airdropToken);
              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),
    mintGTAmounts: yup
      .array()
      .test(
        "invalidMintGTAmount",
        "Enter an amount less or equal to total supply",
        async (value, context) => {
          if (context.parent.actionCommand !== 1) return true;

          try {
            const { distributionAmount } = factoryData;
            const totalAmount = value.reduce(
              (partialSum, a) => partialSum + Number(a),
              0,
            );
            if (totalAmount <= 0) return false;

            let availableAmount;
            if (tokenType === "erc20") {
              const clubTokensMinted = await getERC20TotalSupply();

              availableAmount = convertFromWeiGovernance(
                convertToFullNumber(
                  (distributionAmount - clubTokensMinted).toString(),
                ),
                18,
              );
            } else if (tokenType === "erc721") {
              if (distributionAmount == 0) return true;

              const clubTokensMinted = await getNftOwnersCount();
              availableAmount = convertToFullNumber(
                (distributionAmount - clubTokensMinted).toString(),
              );
            } else {
              return true;
            }

            return Number(totalAmount) <= Number(availableAmount);
          } catch (error) {
            return false;
          }
        },
      ),

    quorum: yup.number("Enter Quorum in percentage").when("actionCommand", {
      is: 2,
      then: () =>
        yup
          .number("Enter Quorum in percentage")
          .required("Quorum is required")
          .moreThan(51, "Quorum should be greater than 51")
          .max(100, "Quorum should be less than 100"),
    }),
    threshold: yup
      .number("Enter Threshold in percentage")
      .when("actionCommand", {
        is: 2,
        then: () =>
          yup
            .number("Enter Threshold in percentage")
            .required("Threshold is required")
            .moreThan(0, "Threshold should be greater than 0")
            .max(100, "Threshold should be less than 100"),
      }),

    totalDeposit: yup
      .number("Enter total deposit amount")
      .test(
        "invalidDepositAmount",
        "Enter deposit amount should be greater than current amount",
        async (value, context) => {
          const { actionCommand } = context.parent;
          if (actionCommand === 3) {
            try {
              const { distributionAmount, pricePerToken } = factoryData;
              if (
                Number(value) >
                Number(convertFromWeiGovernance(distributionAmount, 18)) *
                  Number(convertFromWeiGovernance(pricePerToken, 6))
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    pricePerToken: yup
      .number("Enter price per token")
      .test(
        "invalidPricePerToken",
        "price of token should be greater than current price",
        async (value, context) => {
          const { actionCommand } = context.parent;
          if (actionCommand === 13) {
            try {
              const { pricePerToken, depositTokenAddress } = factoryData;
              const decimals = await getDecimals(depositTokenAddress);
              if (
                Number(value) >
                Number(convertFromWeiGovernance(pricePerToken, decimals))
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),
    nftSupply: yup
      .number("Enter new nft supply")
      .test(
        "invalidNFTSupply",
        "NFT supply is unlimited or should be greater than current supply",
        async (value, context) => {
          const { actionCommand } = context.parent;
          if (actionCommand === 20) {
            try {
              const { distributionAmount } = factoryData;
              if (
                distributionAmount > 0 &&
                Number(value) > Number(distributionAmount)
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    amountToSend: yup
      .number("Enter amount to be sent")
      .test(
        "invalidSendAmount",
        "Enter an amount less or equal to treasury balance",
        async (value, context) => {
          const { actionCommand, customToken } = context.parent;
          if (actionCommand === 4) {
            try {
              const balance = await getBalance(customToken, gnosisAddress);
              const decimals = await getDecimals(customToken);
              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    lensId: yup.string("Please enter lens id").when("actionCommand", {
      is: 11,
      then: () =>
        yup.string("Enter lens profile id").required("Lens id is required"),
    }),

    lensPostLink: yup.string("Please enter lens id").when("actionCommand", {
      is: 12,
      then: () =>
        yup
          .string("Enter lens post's link")
          .required("Lens post's link is required"),
    }),

    recieverAddress: yup
      .string("Please enter reciever address")
      .when("actionCommand", {
        is: 4,
        then: () =>
          yup
            .string("Enter reciever address")
            .matches(/^0x[a-zA-Z0-9]+/gm, " Proper wallet address is required")
            .required("Reciever address is required"),
      }),

    safeThreshold: yup.number("Enter threshold").when(["actionCommand"], {
      is: (actionCommand) => actionCommand === 7 || actionCommand === 6,
      then: () =>
        yup
          .number("Enter threshold")
          .required("Safe Threshold is required")
          .moreThan(0, "Safe threshold can't be less than 1"),
    }),
    ownerAddress: yup
      .string()
      .test(
        "validate-owner",
        "Address is not a member of a club",
        async (value, context) => {
          const { actionCommand } = context.parent;

          if (actionCommand === 6) {
            try {
              // Make your API call here and check the response
              const isStationMember = await isMember(
                value,
                daoAddress,
                networkId,
              );

              if (isStationMember?.users?.length > 0) {
                return true;
              } else return false;
            } catch (error) {
              console.error(error);
              return false; // Return false for any error
            }
          }

          return true; // Return true for other cases or successful API response
        },
      ),
    nftLink: yup.string("Please enter nft Link").when("actionCommand", {
      is: 8,
      then: () => yup.string("Enter nft link").required("Nft link is required"),
    }),
    nftLink: yup
      .string()
      .test(
        "validate-nft-link",
        "Invalid URL or this item has already been sold",
        async (value, context) => {
          const { actionCommand } = context.parent;

          if (actionCommand === 8) {
            try {
              // Make your API call here and check the response
              const parts = value?.split("/");

              if (parts) {
                const linkData = parts.slice(-3);
                const nftdata = await retrieveNftListing(
                  linkData[0],
                  linkData[1],
                  linkData[2],
                );
                if (!nftdata?.data?.orders.length && actionCommand === 8) {
                  return false;
                }
              }
            } catch (error) {
              console.error(error);
              return false; // Return false for any error
            }
          }

          return true; // Return true for other cases or successful API response
        },
      ),
    aaveDepositAmount: yup
      .number("Please enter amount")
      .test(
        "invalidAaveDepositAmt",
        "Enter an amount less or equal to treasury balance",
        async (value, context) => {
          const { actionCommand, aaveDepositToken } = context.parent;

          if (actionCommand === 14) {
            try {
              const balance = await getBalance(aaveDepositToken, gnosisAddress);
              const decimals = await getDecimals(aaveDepositToken);
              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    aaveWithdrawAmount: yup
      .number("Please enter amount")
      .test(
        "invalidAaveWithdrawAmt",
        "Enter an amount less or equal to wrapped-AAVE token (aPolUSDC / aPolWMATIC) ",
        async (value, context) => {
          const { actionCommand, aaveWithdrawToken } = context.parent;

          if (actionCommand === 15) {
            let tokenAddress;

            if (aaveWithdrawToken === CHAIN_CONFIG[networkId].nativeToken) {
              tokenAddress = CHAIN_CONFIG[networkId].aaveWrappedMaticAddress;
            } else {
              tokenAddress = CHAIN_CONFIG[networkId].aaveWrappedUsdcAddress;
            }
            try {
              const balance = await getBalance(tokenAddress, gnosisAddress);
              const decimals = await getDecimals(tokenAddress);
              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    uniswapRecieverToken: yup
      .string("Please enter token address")
      .test(
        "invalidUniswapRecieverToken",
        "Reciever chain address should be same as sender chain ",
        async (value, context) => {
          const { actionCommand } = context.parent;

          if (actionCommand === 19) {
            try {
              const decimals = await getDecimals(value);
              if (decimals > 0) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    uniswapSwapAmount: yup
      .number("Please enter amount")
      .test(
        "invalidUniswapSwapAmount",
        "Enter an amount less or equal to treasury balance",
        async (value, context) => {
          const { actionCommand, uniswapSwapToken } = context.parent;
          if (actionCommand === 19) {
            try {
              const balance = await getBalance(uniswapSwapToken, gnosisAddress);
              const decimals = await getDecimals(uniswapSwapToken);
              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    stargateStakeAmount: yup
      .number("Please enter amount")
      .test(
        "invalidStargateStakeAmt",
        "Enter an amount less or equal to treasury balance",
        async (value, context) => {
          const { actionCommand, stargateStakeToken } = context.parent;
          let balance;
          let decimals;
          if (actionCommand === 17) {
            try {
              if (CHAIN_CONFIG[networkId].nativeToken === stargateStakeToken) {
                const publicClient = getPublicClient(networkId);
                balance = await publicClient.getBalance(gnosisAddress);
                decimals = 18;
              } else {
                balance = await getBalance(stargateStakeToken, gnosisAddress);
                decimals = await getDecimals(stargateStakeToken);
              }
              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),

    stargateUnstakeToken: yup
      .string("Enter stargate unstaking token")
      .when("actionCommand", {
        is: 18,
        then: () =>
          yup
            .string("Enter stargate unstaking token")
            .required("Token is required"),
      }),
    stargateUnstakeAmount: yup
      .number("Please enter amount")
      .test(
        "invalidStargateUnstakeAmt",
        "Enter an amount less or equal to treasury balance",
        async (value, context) => {
          const { actionCommand, stargateUnstakeToken } = context.parent;

          if (actionCommand === 18) {
            try {
              const balance = await getBalance(
                stargateUnstakeToken,
                gnosisAddress,
              );
              const decimals = await getDecimals(stargateUnstakeToken);

              if (
                Number(value) <=
                  Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(balance.toString()),
                      decimals,
                    ),
                  ) &&
                Number(value) > 0
              ) {
                return true;
              } else return false;
            } catch (error) {
              return false;
            }
          }
          return true;
        },
      ),
  });
};

export const disburseFormValidation = yup.object({
  selectedToken: yup.object({}).required("Token is required"),
  disburseList: yup.string().required("Disburse info required"),
});

export const claimStep1ValidationSchema = yup.object({
  description: yup
    .string("Enter one-liner description")
    .required("description is required"),
  numberOfTokens: yup
    .number()
    .required("Enter amount of tokens")
    .moreThan(0, "Amount should be greater than 0"),
  startDate: yup.date().required("start date is required"),
  endDate: yup
    .date()
    .required("end date is required")
    .min(yup.ref("startDate")),
  selectedToken: yup.object({}).required("Token is required"),
});

export const claimStep2ValidationSchema = yup.object({
  daoTokenAddress: yup
    .string("Enter dao address")
    .notRequired()
    .when("eligible", {
      is: "token",
      then: () => yup.string().required("Enter token address"),
    }),
  tokenGatingAmt: yup
    .string("Enter token gating amount")
    .notRequired()
    .when("eligible", {
      is: "token",
      then: () => yup.string().required("Enter token gating amount"),
    }),
  // .required("Dao token is required"),
  customAmount: yup
    .number("Enter custom Amount")
    .notRequired()
    .when("maximumClaim", {
      is: "custom",
      then: () =>
        yup
          .number("Enter custom Amount")
          // .required("Please enter custom amount")
          .moreThan(0, "Amount should be greater than 0"),
      // .lessThan(yup.ref("numberOfTokens")),
    }),
});

export const eoaWalletTrackerValidation = yup.object({
  walletAddress: yup
    .string("Enter wallet address")
    .required("Wallet address is required"),
});

export const stakingValidation = ({ amount, isRocketPool, isMantlePool }) => {
  return yup.object({
    stakeAmount: yup
      .number()
      .required("Amount is required")
      .moreThan(
        isRocketPool ? 0.01 : isMantlePool ? 0.02 : 0,
        `${
          isRocketPool
            ? "Rocket Pool accepts a minimum of 0.01 ETH as deposits"
            : isMantlePool
            ? "Mantle Pool accepts a minimum of 0.02 ETH as deposits"
            : "0"
        } `,
      )
      .max(amount, "You don't have enough ETH."),
  });
};
