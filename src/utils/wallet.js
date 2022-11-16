import React from "react";
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import { useDispatch } from "react-redux";
import { addWallet, removeWallet } from "../redux/reducers/create";
import { RINKEYBY_RPC_URL } from "../api/index";

const INFURA_ID = "sdf";
const ETH_ROPSTEN_RPC = `https://ropsten.infura.io/v3/946205020d6c477192b1178b3c5f8590`;
const ETH_MAINNET_RPC = `https://mainnet.infura.io/v3/${INFURA_ID}`;
const ETH_RINKEBY_RPC = RINKEYBY_RPC_URL;
const ETH_GOERLI_RPC = `https://eth-goerli.g.alchemy.com/v2/kVRnoC6Kb95260vGYxLHCD7J_ZyfYEtu`;
const MATIC_MAINNET_RPC = "https://matic-mainnet.chainstacklabs.com";

const injected = injectedModule();

export const onboard = Onboard({
	wallets: [injected],
	chains: [
		{
			id: "0x1",
			token: "ETH",
			label: "Ethereum Mainnet",
			rpcUrl: ETH_MAINNET_RPC,
		},
		{
			id: "0x5",
			token: "gETH",
			label: "Ethereum Goerli Testnet",
			rpcUrl: ETH_GOERLI_RPC,
		},
		{
			id: "0x4",
			token: "rETH",
			label: "Ethereum Rinkeby Testnet",
			rpcUrl: ETH_RINKEBY_RPC,
		},
		{
			id: "0x38",
			token: "BNB",
			label: "Binance Smart Chain",
			rpcUrl: "https://bsc-dataseed.binance.org/",
		},
		{
			id: "0x89",
			token: "MATIC",
			label: "Matic Mainnet",
			rpcUrl: "https://matic-mainnet.chainstacklabs.com",
		},
		{
			id: "0xfa",
			token: "FTM",
			label: "Fantom Mainnet",
			rpcUrl: "https://rpc.ftm.tools/",
		},
	],
	appMetadata: {
		name: "StationX",
		icon: "/assets/images/monogram.png",
		logo: "/assets/images/monogram.png",
		description: "My app using Onboard",
		recommendedInjectedWallets: [
			{ name: "MetaMask", url: "https://metamask.io" },
		],
	},
});

export async function checkNetwork() {
	if (window.ethereum) {
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x5" }],
			});
			return true;
		} catch (error) {
			if (error.code === 4902) {
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: "0x5",
								rpcUrl: ETH_GOERLI_RPC,
							},
						],
					});
				} catch (addError) {
					console.error(addError);
				}
			}
			console.error(error);
			return false;
		}
	} else {
		alert(
			"MetaMask is not installed. Please consider installing it: https://metamask.io/download.html",
		);
		return false;
	}
}

export async function switchNetwork(networkHex, rpcURL) {
	if (window.ethereum) {
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: networkHex }],
			});
			return true;
		} catch (error) {
			if (error.code === 4902) {
				try {
					await window.ethereum.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: networkHex,
								rpcUrl: rpcURL,
							},
						],
					});
				} catch (addError) {
					console.error(addError);
				}
			}
			console.error(error);
			return false;
		}
	} else {
		alert(
			"MetaMask is not installed. Please consider installing it: https://metamask.io/download.html",
		);
		return false;
	}
}

export async function connectWallet(dispatch) {
	const wallets = await onboard.connectWallet();
	if (wallets.length == 0) {
		localStorage.setItem("isWalletConnected", false);
		return false;
	} else {
		dispatch(addWallet(wallets.map(({ accounts }) => accounts)));
		localStorage.setItem(
			"wallet",
			wallets.map(({ accounts }) => accounts)[0][0].address,
		);
		localStorage.setItem("isWalletConnected", true);
		localStorage.setItem("label", wallets[0].label);
		return true;
	}
}

export async function setUserChain() {
	const setChain = await onboard.setChain({ chainId: "0x1" });
}

export const walletsSub = onboard.state.select("wallets");

export async function disconnectWallet(dispatch) {
	dispatch(removeWallet());
	localStorage.setItem("wallet", null);
	localStorage.setItem("isWalletConnected", false);
}
