import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subgraphQuery } from "./subgraphs";
import { QUERY_CLUB_DETAILS } from "../api/graphql/queries";
import {
  addClubData,
  addDaoAddress,
  addErc20ClubDetails,
  addErc721ClubDetails,
} from "../redux/reducers/club";
import { useConnectWallet } from "@web3-onboard/react";

import {
  addContractAddress,
  setAdminUser,
  setMemberUser,
} from "../redux/reducers/gnosis";
import Erc20Dao from "../abis/newArch/erc20Dao.json";
import Erc721Dao from "../abis/newArch/erc721Dao.json";
import { fetchConfigById } from "../api/config";
import { SmartContract } from "../api/contract";

import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";
import {
  AIRDROP_ACTION_ADDRESS_GOERLI,
  AIRDROP_ACTION_ADDRESS_POLYGON,
  FACTORY_ADDRESS_GOERLI,
  FACTORY_ADDRESS_POLYGON,
  SUBGRAPH_URL_GOERLI,
  SUBGRAPH_URL_POLYGON,
} from "../api";

const ClubFetch = (Component) => {
  console.log("SUBGRAPH", SUBGRAPH_URL_GOERLI, SUBGRAPH_URL_POLYGON);
  const RetrieveDataComponent = () => {
    console.log("first");
    const router = useRouter();
    const dispatch = useDispatch();
    const [{ wallet }] = useConnectWallet();
    const networkId = wallet?.chains[0]?.id;

    console.log("Networrrk ID", wallet);

    const walletAddress = Web3.utils.toChecksumAddress(
      wallet?.accounts[0].address,
    );
    if (wallet) {
      localStorage.setItem("wallet", walletAddress);
    }

    const { clubId: daoAddress } = router.query;
    const { pid } = router.query;
    console.log("first", router.query);

    dispatch(addDaoAddress(Web3.utils.toChecksumAddress(daoAddress)));
    const USDC_CONTRACT_ADDRESS = useSelector((state) => {
      return state.gnosis.usdcContractAddress;
    });
    const GNOSIS_TRANSACTION_URL = useSelector((state) => {
      return state.gnosis.transactionUrl;
    });
    const gnosisAddress = useSelector((state) => {
      return state.club.clubData.gnosisAddress;
    });

    const checkUserExists = useCallback(async () => {
      console.log("first");
      try {
        const getSafeSdk = async () => {
          const web3 = new Web3(window.ethereum);
          const ethAdapter = new Web3Adapter({
            web3,
            signerAddress: walletAddress,
          });
          const safeSdk = await Safe.create({
            ethAdapter: ethAdapter,
            safeAddress: gnosisAddress,
          });

          return safeSdk;
        };
        console.log("first", daoAddress, wallet);
        if ((daoAddress && wallet) || (pid && wallet)) {
          console.log("first", pid, wallet);
          const networkData = fetchConfigById(wallet.chains[0].id);
          networkData.then((result) => {
            if (result.status != 200) {
              console.log(result.error);
            } else {
              console.log("firstyyyyy");

              dispatch(
                addContractAddress({
                  factoryContractAddress:
                    networkId == "0x5"
                      ? FACTORY_ADDRESS_GOERLI
                      : networkId == "0x89"
                      ? FACTORY_ADDRESS_POLYGON
                      : "",
                  usdcContractAddress: result.data[0].usdcContractAddress,
                  actionContractAddress:
                    networkId == "0x5"
                      ? AIRDROP_ACTION_ADDRESS_GOERLI
                      : networkId == "0x89"
                      ? AIRDROP_ACTION_ADDRESS_POLYGON
                      : "",
                  subgraphUrl:
                    networkId == "0x5"
                      ? SUBGRAPH_URL_GOERLI
                      : networkId == "0x89"
                      ? SUBGRAPH_URL_POLYGON
                      : "",
                  transactionUrl: result.data[0].gnosisTransactionUrl,
                  networkHex: result.data[0].networkHex,
                  networkId: result.data[0].networkId,
                  networkName: result.data[0].name,
                }),
              );
            }
          });

          const clubData = await subgraphQuery(
            networkId == "0x5"
              ? SUBGRAPH_URL_GOERLI
              : networkId == "0x89"
              ? SUBGRAPH_URL_POLYGON
              : "",
            QUERY_CLUB_DETAILS(daoAddress),
          );

          console.log("TOKENNNNNN CLUB", clubData.stations[0].tokenType);
          dispatch(
            addClubData({
              gnosisAddress: clubData.stations[0].gnosisAddress,
              isGtTransferable: clubData.stations[0].isGtTransferable,
              name: clubData.stations[0].name,
              ownerAddress: clubData.stations[0].ownerAddress,
              symbol: clubData.stations[0].symbol,
              tokenType: clubData.stations[0].tokenType,
            }),
          );

          if (clubData.stations[0].tokenType === "erc20") {
            const erc20Contract = new SmartContract(
              Erc20Dao,
              daoAddress,
              undefined,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
            );
            const daoDetails = await erc20Contract.getERC20DAOdetails();
            dispatch(
              addErc20ClubDetails({
                quorum: daoDetails.quorum / 100,
                threshold: daoDetails.threshold / 100,
                isGovernanceActive: daoDetails.isGovernanceActive,
                isTransferable: daoDetails.isTransferable,
                onlyAllowWhitelist: daoDetails.onlyAllowWhitelist,
                deployerAddress: daoDetails.deployerAddress,
              }),
            );
            const response = erc20Contract.balanceOf();

            response.then(
              async (result) => {
                const safeSdk = await getSafeSdk();
                const ownerAddresses = await safeSdk.getOwners();
                const ownerAddressesArray = ownerAddresses.map((value) =>
                  Web3.utils.toChecksumAddress(value),
                );
                if (ownerAddressesArray.includes(walletAddress)) {
                  dispatch(setAdminUser(true));
                } else {
                  if (result === "0") {
                    dispatch(setMemberUser(false));
                    router.push("/");
                  } else {
                    dispatch(setMemberUser(true));
                  }
                }
              },
              (error) => {
                router.push("/");
              },
            );
          } else if (clubData.stations[0].tokenType === "erc721") {
            const erc721Contract = new SmartContract(
              Erc721Dao,
              daoAddress,
              undefined,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
            );
            const daoDetails = await erc721Contract.getERC721DAOdetails();
            dispatch(
              addErc721ClubDetails({
                quorum: daoDetails.quorum / 100,
                threshold: daoDetails.threshold / 100,
                maxTokensPerUser: daoDetails.maxTokensPerUser,
                isNftTotalSupplyUnlimited: daoDetails.isNftTotalSupplyUnlimited,
                isGovernanceActive: daoDetails.isGovernanceActive,
                isTransferable: daoDetails.isTransferable,
                onlyAllowWhitelist: daoDetails.onlyAllowWhitelist,
                deployerAddress: daoDetails.deployerAddress,
              }),
            );

            const response = erc721Contract.balanceOf();

            response.then(
              async (result) => {
                const safeSdk = await getSafeSdk();
                const ownerAddresses = await safeSdk.getOwners();
                const ownerAddressesArray = ownerAddresses.map((value) =>
                  Web3.utils.toChecksumAddress(value),
                );
                if (ownerAddressesArray.includes(walletAddress)) {
                  dispatch(setAdminUser(true));
                } else {
                  if (result === "0") {
                    dispatch(setMemberUser(false));
                    router.push("/");
                  } else {
                    dispatch(setMemberUser(true));
                  }
                }
              },
              (error) => {
                router.push("/");
              },
            ),
              console.log(daoDetails);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, [
      daoAddress,
      wallet,
      pid,
      walletAddress,
      gnosisAddress,
      networkId,
      dispatch,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
      router,
    ]);

    useEffect(() => {
      console.log("first second", wallet, pid);

      if (wallet) checkUserExists();
    }, [checkUserExists, pid, wallet]);

    useEffect(() => {
      console.log("Wallettt", wallet);
    }, [wallet]);
    return <Component />;
  };
  return RetrieveDataComponent;
};

export default ClubFetch;
