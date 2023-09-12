import Web3 from "web3";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import WrongNetworkModal from "../components/modals/WrongNetworkModal";
import { QUERY_ALL_MEMBERS } from "api/graphql/stationQueries";
import { subgraphQuery } from "./subgraphs";
import { BLOCK_CONFIRMATIONS, BLOCK_TIMEOUT, CHAIN_CONFIG } from "./constants";
import { getPublicClient, getWalletClient } from "utils/viemConfig";

export const getCustomSafeSdk = async (
  gnosisAddress,
  walletAddress,
  networkId = "0x2105",
) => {
  const web3 = await web3InstanceCustomRPC(networkId);
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: walletAddress,
  });

  console.log(
    "xxxxxx",
    networkId,

    walletAddress,
    ethAdapter,
    gnosisAddress,
  );

  const contractNetworks = {
    [8453]: {
      safeMasterCopyAddress: "0x69f4D1788e39c87893C980c06EdF4b7f686e2938",
      safeProxyFactoryAddress: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
      multiSendAddress: "0x998739BFdAAdde7C933B942a68053933098f9EDa",
      multiSendCallOnlyAddress: "0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B",
      fallbackHandlerAddress: "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804",
      signMessageLibAddress: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
      createCallAddress: "0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d",
      simulateTxAccessorAddress: "0x727a77a074D1E6c4530e814F89E618a3298FC044",
      safeMasterCopyAbi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "AddedOwner",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "approvedHash",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ApproveHash",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "handler",
              type: "address",
            },
          ],
          name: "ChangedFallbackHandler",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "guard",
              type: "address",
            },
          ],
          name: "ChangedGuard",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
          ],
          name: "ChangedThreshold",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "DisabledModule",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "EnabledModule",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bytes32",
              name: "txHash",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "payment",
              type: "uint256",
            },
          ],
          name: "ExecutionFailure",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "ExecutionFromModuleFailure",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "ExecutionFromModuleSuccess",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bytes32",
              name: "txHash",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "payment",
              type: "uint256",
            },
          ],
          name: "ExecutionSuccess",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "RemovedOwner",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "SafeReceived",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "initiator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address[]",
              name: "owners",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "initializer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "fallbackHandler",
              type: "address",
            },
          ],
          name: "SafeSetup",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "msgHash",
              type: "bytes32",
            },
          ],
          name: "SignMsg",
          type: "event",
        },
        {
          stateMutability: "nonpayable",
          type: "fallback",
        },
        {
          inputs: [],
          name: "VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
          ],
          name: "addOwnerWithThreshold",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "hashToApprove",
              type: "bytes32",
            },
          ],
          name: "approveHash",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "approvedHashes",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
          ],
          name: "changeThreshold",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "dataHash",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "signatures",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "requiredSignatures",
              type: "uint256",
            },
          ],
          name: "checkNSignatures",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "dataHash",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "signatures",
              type: "bytes",
            },
          ],
          name: "checkSignatures",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prevModule",
              type: "address",
            },
            {
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "disableModule",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "domainSeparator",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "enableModule",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "safeTxGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "baseGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gasPrice",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "gasToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "refundReceiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_nonce",
              type: "uint256",
            },
          ],
          name: "encodeTransactionData",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "safeTxGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "baseGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gasPrice",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "gasToken",
              type: "address",
            },
            {
              internalType: "address payable",
              name: "refundReceiver",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "signatures",
              type: "bytes",
            },
          ],
          name: "execTransaction",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "execTransactionFromModule",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "execTransactionFromModuleReturnData",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
            {
              internalType: "bytes",
              name: "returnData",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getChainId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "start",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "pageSize",
              type: "uint256",
            },
          ],
          name: "getModulesPaginated",
          outputs: [
            {
              internalType: "address[]",
              name: "array",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "next",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getOwners",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "offset",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "length",
              type: "uint256",
            },
          ],
          name: "getStorageAt",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getThreshold",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "safeTxGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "baseGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gasPrice",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "gasToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "refundReceiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_nonce",
              type: "uint256",
            },
          ],
          name: "getTransactionHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "isModuleEnabled",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "isOwner",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nonce",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prevOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
          ],
          name: "removeOwner",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "requiredTxGas",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "handler",
              type: "address",
            },
          ],
          name: "setFallbackHandler",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "guard",
              type: "address",
            },
          ],
          name: "setGuard",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address[]",
              name: "_owners",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "address",
              name: "fallbackHandler",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "payment",
              type: "uint256",
            },
            {
              internalType: "address payable",
              name: "paymentReceiver",
              type: "address",
            },
          ],
          name: "setup",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "signedMessages",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "targetContract",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "calldataPayload",
              type: "bytes",
            },
          ],
          name: "simulateAndRevert",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prevOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "oldOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "swapOwner",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ], // Optional. Only needed with web3.js
      safeProxyFactoryAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "singleton",
              type: "address",
            },
          ],
          name: "ProxyCreation",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "initializer",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "saltNonce",
              type: "uint256",
            },
          ],
          name: "calculateCreateProxyWithNonceAddress",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "createProxy",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "initializer",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "saltNonce",
              type: "uint256",
            },
            {
              internalType: "contract IProxyCreationCallback",
              name: "callback",
              type: "address",
            },
          ],
          name: "createProxyWithCallback",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "initializer",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "saltNonce",
              type: "uint256",
            },
          ],
          name: "createProxyWithNonce",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxyCreationCode",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "proxyRuntimeCode",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      multiSendAbi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "transactions",
              type: "bytes",
            },
          ],
          name: "multiSend",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      multiSendCallOnlyAbi: [
        {
          inputs: [
            {
              internalType: "bytes",
              name: "transactions",
              type: "bytes",
            },
          ],
          name: "multiSend",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      fallbackHandlerAbi: [
        {
          inputs: [],
          name: "NAME",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "getMessageHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract GnosisSafe",
              name: "safe",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "getMessageHashForSafe",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getModules",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_dataHash",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "_signature",
              type: "bytes",
            },
          ],
          name: "isValidSignature",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "_signature",
              type: "bytes",
            },
          ],
          name: "isValidSignature",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "onERC1155BatchReceived",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "onERC1155Received",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "onERC721Received",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "targetContract",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "calldataPayload",
              type: "bytes",
            },
          ],
          name: "simulate",
          outputs: [
            {
              internalType: "bytes",
              name: "response",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "tokensReceived",
          outputs: [],
          stateMutability: "pure",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      signMessageLibAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "msgHash",
              type: "bytes32",
            },
          ],
          name: "SignMsg",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "getMessageHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          name: "signMessage",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      createCallAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "newContract",
              type: "address",
            },
          ],
          name: "ContractCreation",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "deploymentData",
              type: "bytes",
            },
          ],
          name: "performCreate",
          outputs: [
            {
              internalType: "address",
              name: "newContract",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "deploymentData",
              type: "bytes",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
          ],
          name: "performCreate2",
          outputs: [
            {
              internalType: "address",
              name: "newContract",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      simulateTxAccessorAbi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "simulate",
          outputs: [
            {
              internalType: "uint256",
              name: "estimate",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
            {
              internalType: "bytes",
              name: "returnData",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
    },
  };

  console.log(contractNetworks[8453]);

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: gnosisAddress,
    contractNetworks,
  });

  return safeSdk;
};

export const getSafeSdk = async (
  gnosisAddress,
  walletAddress,
  networkId = "0x2105",
) => {
  const web3 = await web3InstanceEthereum();
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: walletAddress,
  });

  console.log(
    "xxxxxx",
    networkId,

    walletAddress,
    ethAdapter,
    gnosisAddress,
  );

  const contractNetworks = {
    [8453]: {
      safeMasterCopyAddress: "0x69f4D1788e39c87893C980c06EdF4b7f686e2938",
      safeProxyFactoryAddress: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
      multiSendAddress: "0x998739BFdAAdde7C933B942a68053933098f9EDa",
      multiSendCallOnlyAddress: "0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B",
      fallbackHandlerAddress: "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804",
      signMessageLibAddress: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
      createCallAddress: "0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d",
      simulateTxAccessorAddress: "0x727a77a074D1E6c4530e814F89E618a3298FC044",
      safeMasterCopyAbi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "AddedOwner",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "approvedHash",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ApproveHash",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "handler",
              type: "address",
            },
          ],
          name: "ChangedFallbackHandler",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "guard",
              type: "address",
            },
          ],
          name: "ChangedGuard",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
          ],
          name: "ChangedThreshold",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "DisabledModule",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "EnabledModule",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bytes32",
              name: "txHash",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "payment",
              type: "uint256",
            },
          ],
          name: "ExecutionFailure",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "ExecutionFromModuleFailure",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "ExecutionFromModuleSuccess",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bytes32",
              name: "txHash",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "payment",
              type: "uint256",
            },
          ],
          name: "ExecutionSuccess",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "RemovedOwner",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "SafeReceived",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "initiator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address[]",
              name: "owners",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "threshold",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "initializer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "fallbackHandler",
              type: "address",
            },
          ],
          name: "SafeSetup",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "msgHash",
              type: "bytes32",
            },
          ],
          name: "SignMsg",
          type: "event",
        },
        {
          stateMutability: "nonpayable",
          type: "fallback",
        },
        {
          inputs: [],
          name: "VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
          ],
          name: "addOwnerWithThreshold",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "hashToApprove",
              type: "bytes32",
            },
          ],
          name: "approveHash",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "approvedHashes",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
          ],
          name: "changeThreshold",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "dataHash",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "signatures",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "requiredSignatures",
              type: "uint256",
            },
          ],
          name: "checkNSignatures",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "dataHash",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "signatures",
              type: "bytes",
            },
          ],
          name: "checkSignatures",
          outputs: [],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prevModule",
              type: "address",
            },
            {
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "disableModule",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "domainSeparator",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "enableModule",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "safeTxGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "baseGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gasPrice",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "gasToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "refundReceiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_nonce",
              type: "uint256",
            },
          ],
          name: "encodeTransactionData",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "safeTxGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "baseGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gasPrice",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "gasToken",
              type: "address",
            },
            {
              internalType: "address payable",
              name: "refundReceiver",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "signatures",
              type: "bytes",
            },
          ],
          name: "execTransaction",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "execTransactionFromModule",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "execTransactionFromModuleReturnData",
          outputs: [
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
            {
              internalType: "bytes",
              name: "returnData",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getChainId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "start",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "pageSize",
              type: "uint256",
            },
          ],
          name: "getModulesPaginated",
          outputs: [
            {
              internalType: "address[]",
              name: "array",
              type: "address[]",
            },
            {
              internalType: "address",
              name: "next",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getOwners",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "offset",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "length",
              type: "uint256",
            },
          ],
          name: "getStorageAt",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getThreshold",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "safeTxGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "baseGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "gasPrice",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "gasToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "refundReceiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_nonce",
              type: "uint256",
            },
          ],
          name: "getTransactionHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "module",
              type: "address",
            },
          ],
          name: "isModuleEnabled",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "isOwner",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nonce",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prevOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
          ],
          name: "removeOwner",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "requiredTxGas",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "handler",
              type: "address",
            },
          ],
          name: "setFallbackHandler",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "guard",
              type: "address",
            },
          ],
          name: "setGuard",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address[]",
              name: "_owners",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "_threshold",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "address",
              name: "fallbackHandler",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "payment",
              type: "uint256",
            },
            {
              internalType: "address payable",
              name: "paymentReceiver",
              type: "address",
            },
          ],
          name: "setup",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          name: "signedMessages",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "targetContract",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "calldataPayload",
              type: "bytes",
            },
          ],
          name: "simulateAndRevert",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prevOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "oldOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "swapOwner",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ], // Optional. Only needed with web3.js
      safeProxyFactoryAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "singleton",
              type: "address",
            },
          ],
          name: "ProxyCreation",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "initializer",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "saltNonce",
              type: "uint256",
            },
          ],
          name: "calculateCreateProxyWithNonceAddress",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "createProxy",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "initializer",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "saltNonce",
              type: "uint256",
            },
            {
              internalType: "contract IProxyCreationCallback",
              name: "callback",
              type: "address",
            },
          ],
          name: "createProxyWithCallback",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_singleton",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "initializer",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "saltNonce",
              type: "uint256",
            },
          ],
          name: "createProxyWithNonce",
          outputs: [
            {
              internalType: "contract GnosisSafeProxy",
              name: "proxy",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxyCreationCode",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [],
          name: "proxyRuntimeCode",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      multiSendAbi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "transactions",
              type: "bytes",
            },
          ],
          name: "multiSend",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      multiSendCallOnlyAbi: [
        {
          inputs: [
            {
              internalType: "bytes",
              name: "transactions",
              type: "bytes",
            },
          ],
          name: "multiSend",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      fallbackHandlerAbi: [
        {
          inputs: [],
          name: "NAME",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "getMessageHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "contract GnosisSafe",
              name: "safe",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "getMessageHashForSafe",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getModules",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_dataHash",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "_signature",
              type: "bytes",
            },
          ],
          name: "isValidSignature",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "_signature",
              type: "bytes",
            },
          ],
          name: "isValidSignature",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "onERC1155BatchReceived",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "onERC1155Received",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "onERC721Received",
          outputs: [
            {
              internalType: "bytes4",
              name: "",
              type: "bytes4",
            },
          ],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "targetContract",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "calldataPayload",
              type: "bytes",
            },
          ],
          name: "simulate",
          outputs: [
            {
              internalType: "bytes",
              name: "response",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          name: "tokensReceived",
          outputs: [],
          stateMutability: "pure",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      signMessageLibAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "msgHash",
              type: "bytes32",
            },
          ],
          name: "SignMsg",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "message",
              type: "bytes",
            },
          ],
          name: "getMessageHash",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          name: "signMessage",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      createCallAbi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "newContract",
              type: "address",
            },
          ],
          name: "ContractCreation",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "deploymentData",
              type: "bytes",
            },
          ],
          name: "performCreate",
          outputs: [
            {
              internalType: "address",
              name: "newContract",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "deploymentData",
              type: "bytes",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
          ],
          name: "performCreate2",
          outputs: [
            {
              internalType: "address",
              name: "newContract",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
      simulateTxAccessorAbi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
            {
              internalType: "enum Enum.Operation",
              name: "operation",
              type: "uint8",
            },
          ],
          name: "simulate",
          outputs: [
            {
              internalType: "uint256",
              name: "estimate",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "success",
              type: "bool",
            },
            {
              internalType: "bytes",
              name: "returnData",
              type: "bytes",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ], // Optional. Only needed with web3.js
    },
  };

  console.log(contractNetworks[8453]);

  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: gnosisAddress,
    contractNetworks,
  });

  return safeSdk;
};

export const getIncreaseGasPrice = async (networkId = "0x89") => {
  const web3 = await web3InstanceCustomRPC(networkId);

  if (!sessionStorage.getItem("gasPrice" + networkId)) {
    const gasPrice = await web3.eth.getGasPrice();

    let increasedGasPrice;

    if (networkId === "0x89") {
      increasedGasPrice = +gasPrice + 30000000000;
    } else {
      increasedGasPrice = +gasPrice + 1000;
    }

    sessionStorage.setItem("gasPrice" + networkId, increasedGasPrice);
    return increasedGasPrice;
  } else {
    return Number(sessionStorage.getItem("gasPrice" + networkId));
  }
};

export const web3InstanceEthereum = async () => {
  const web3 = new Web3(window.ethereum);
  return web3;
};

export const web3InstanceCustomRPC = async (networkId = "0x89") => {
  const web3 = new Web3(CHAIN_CONFIG[networkId].appRpcUrl);
  return web3;
};

export const convertEpochTimeInCounterFormat = (epochTime) => {
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;

  const days = Math.floor(epochTime / millisecondsPerDay);
  epochTime %= millisecondsPerDay;

  const hours = Math.floor(epochTime / millisecondsPerHour);
  epochTime %= millisecondsPerHour;

  const minutes = Math.floor(epochTime / millisecondsPerMinute);

  return `${days}D: ${hours < 10 ? "0" : ""}${hours}H: ${
    minutes < 10 ? "0" : ""
  }${minutes}M`;
};

export function formatEpochTime(epochTime) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDiff = epochTime - currentTime;
  const days = Math.floor(timeDiff / (24 * 60 * 60));
  const hours = Math.floor((timeDiff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
  return `${days}D: ${hours}H: ${minutes}M`;
}

export function returnRemainingTime(epochTime) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDiff = currentTime - epochTime;
  const days = Math.abs(Math.floor(timeDiff / (24 * 60 * 60)));
  const hours = Math.abs(Math.floor((timeDiff % (24 * 60 * 60)) / (60 * 60)));
  const minutes = Math.abs(Math.floor((timeDiff % (60 * 60)) / 60));

  return days > 0
    ? `${days} days`
    : (days === 0) & (hours > 0)
    ? `${hours} hours`
    : days === 0 && hours === 0
    ? `${minutes} mins`
    : 0;
}

export const showWrongNetworkModal = (
  walletAddress,
  networkId,
  isClaims = false,
  routeNetworkId,
) => {
  if (isClaims) {
    if (routeNetworkId && routeNetworkId !== networkId) {
      return <WrongNetworkModal chainId={parseInt(routeNetworkId, 16)} />;
    }

    return walletAddress && !CHAIN_CONFIG[networkId] ? (
      <WrongNetworkModal />
    ) : null;
  }

  return walletAddress && networkId !== "0x89" && networkId !== "0x2105" ? (
    <WrongNetworkModal isClaims={isClaims} />
  ) : null;
};

export const getAllEntities = async (
  SUBGRAPH_URL,
  daoAddress,
  entity,
  startDate,
  endDate,
) => {
  try {
    let allEntities = [];
    let skip = 0;
    let continueFetching = true;

    while (continueFetching) {
      let query = QUERY_ALL_MEMBERS(daoAddress, 100, skip, startDate, endDate);
      let result = await subgraphQuery(SUBGRAPH_URL, query);

      allEntities = [...allEntities, ...result[entity]];

      if (result[entity].length < 100) {
        continueFetching = false;
      } else {
        skip += 100;
      }
    }

    return allEntities;
  } catch (error) {
    console.log(error);
  }
};

export const extractPartFromUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export const extractNftAdressAndId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const parts = pathname.split("/");

    return {
      nftAddress: parts[parts.length - 2],
      tokenId: parts[parts.length - 1],
    };
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export const getUserTokenData = async (
  tokenData,
  networkId,
  isProposal = false,
) => {
  const filteredData = !isProposal
    ? tokenData.filter(
        (token) =>
          token.contract_address !== CHAIN_CONFIG[networkId].nativeToken,
      )
    : tokenData;

  return filteredData.map((token) => {
    return {
      balance: token.balance,
      address: token.contract_address,
      decimals: token.contract_decimals,
      symbol: token.contract_ticker_symbol,
    };
  });
};

export const requestEthereumChain = async (method, params) => {
  return await window.ethereum.request({ method, params });
};

export const writeContractFunction = async ({
  address,
  abi,
  functionName,
  args,
  account,
  networkId,
}) => {
  try {
    const publicClient = getPublicClient(networkId);
    const walletClient = getWalletClient(networkId);

    const { request } = await publicClient.simulateContract({
      address,
      abi,
      functionName,
      args,
      account,
      // gasPrice: await getIncreaseGasPrice(networkId),
    });

    const txHash = await walletClient.writeContract(request);
    const txReciept = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: BLOCK_CONFIRMATIONS,
      timeout: BLOCK_TIMEOUT,
    });

    return txReciept;
  } catch (error) {
    throw error;
  }
};

export const csvToObjectForMintGT = (csvString) => {
  const lines = csvString.trim().split("\n");
  const addresses = [];
  const amounts = [];

  for (const line of lines) {
    const [address, amount] = line.trim().split(",");
    addresses.push(address);
    amounts.push(parseInt(amount, 10));
  }

  return { addresses, amounts };
};

export const shortAddress = (address) => {
  if (address) {
    return (
      address?.substring(0, 6) +
      "....." +
      address?.substring(address.length - 4)
    );
  }
};
