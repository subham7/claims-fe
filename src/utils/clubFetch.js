import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subgraphQuery } from "./subgraphs";
import { QUERY_CLUB_DETAILS } from "../api/graphql/queries";
import {
  addClubData,
  addDaoAddress,
  addErc20ClubDetails,
  addErc721ClubDetails,
  addFactoryData,
} from "../redux/reducers/club";
import { useConnectWallet } from "@web3-onboard/react";

import {
  addContractAddress,
  setAdminUser,
  setMemberUser,
  setWrongNetwork,
} from "../redux/reducers/gnosis";
import { fetchConfigById } from "../api/config";

import Web3 from "web3";
import { SUBGRAPH_URL_GOERLI, SUBGRAPH_URL_POLYGON, getRpcUrl } from "../api";
import { getSafeSdk } from "./helper";
import useSmartContractMethods from "../hooks/useSmartContractMethods";
import useSmartContract from "../hooks/useSmartContract";

const ClubFetch = (Component) => {
  const RetrieveDataComponent = () => {
    const [tracker, setTracker] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [{ wallet }] = useConnectWallet();
    const networkId = wallet?.chains[0]?.id;
    useSmartContract();

    const walletAddress = Web3.utils.toChecksumAddress(
      wallet?.accounts[0].address,
    );

    if (wallet) {
      localStorage.setItem("wallet", walletAddress);
    }

    const { clubId: daoAddress } = router.query;
    const { jid } = router.query;

    const reduxClubData = useSelector((state) => {
      return state.club.clubData;
    });

    const {
      getDaoDetails,
      getERC20DAOdetails,
      getERC20Balance,
      getERC721Balance,
      getERC721DAOdetails,
    } = useSmartContractMethods();

    useEffect(() => {
      dispatch(addDaoAddress(Web3.utils.toChecksumAddress(daoAddress)));
    }, [daoAddress, dispatch]);

    useEffect(() => {
      const getNetworkConfig = async () => {
        try {
          getRpcUrl(networkId);

          const networkData = await fetchConfigById(networkId);

          dispatch(
            addContractAddress({
              factoryContractAddress: networkData?.data[0]?.factoryContract,
              usdcContractAddress: networkData?.data[0]?.depositTokenContract,
              actionContractAddress:
                networkData?.data[0]?.tokenTransferActionContract,
              subgraphUrl: networkData?.data[0]?.subgraph,
              transactionUrl: networkData?.data[0]?.gnosisTransactionUrl,
              networkHex: networkData?.data[0]?.networkHex,
              networkId: networkData?.data[0]?.networkId,
              networkName: networkData?.data[0]?.name,
              // Repair this
              clubNetworkId: networkId,
            }),
          );
        } catch (e) {
          console.error(e);
        }
      };
      networkId && getNetworkConfig();
    }, [dispatch, networkId]);

    useEffect(() => {
      const addClubDataToRedux = async () => {
        if (!reduxClubData.gnosisAddress && networkId) {
          const clubData = await subgraphQuery(
            networkId == "0x5"
              ? SUBGRAPH_URL_GOERLI
              : networkId == "0x89"
              ? SUBGRAPH_URL_POLYGON
              : "",
            QUERY_CLUB_DETAILS(daoAddress ? daoAddress : jid),
          );

          if (clubData) {
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
          }
        }
      };

      addClubDataToRedux();
    }, [reduxClubData, networkId, daoAddress, jid, dispatch]);

    const checkUserExists = useCallback(async () => {
      try {
        if ((daoAddress && wallet) || (jid && wallet)) {
          if (reduxClubData.gnosisAddress) {
            const factoryData = await getDaoDetails(
              daoAddress ? daoAddress : jid,
            );

            dispatch(
              addFactoryData({
                assetsStoredOnGnosis: factoryData.assetsStoredOnGnosis,
                depositCloseTime: factoryData.depositCloseTime,
                depositTokenAddress: factoryData.depositTokenAddress,
                distributionAmount: factoryData.distributionAmount,
                gnosisAddress: factoryData.gnosisAddress,
                isDeployedByFactory: factoryData.isDeployedByFactory,
                isTokenGatingApplied: factoryData.isTokenGatingApplied,
                maxDepositPerUser: factoryData.maxDepositPerUser,
                merkleRoot: factoryData.merkleRoot,
                minDepositPerUser: factoryData.minDepositPerUser,
                ownerFeePerDepositPercent:
                  factoryData.ownerFeePerDepositPercent,
                pricePerToken: factoryData.pricePerToken,
              }),
            );

            if (reduxClubData.tokenType === "erc20") {
              const daoDetails = await getERC20DAOdetails();

              const erc20BalanceResponse = await getERC20Balance();

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

              try {
                const safeSdk = await getSafeSdk(
                  reduxClubData.gnosisAddress,
                  walletAddress,
                );
                const ownerAddresses = await safeSdk.getOwners();
                const ownerAddressesArray = ownerAddresses.map((value) =>
                  Web3.utils.toChecksumAddress(value),
                );
                if (ownerAddressesArray.includes(walletAddress)) {
                  dispatch(setAdminUser(true));
                  setTracker(true);
                } else {
                  if (erc20BalanceResponse === "0" && !jid) {
                    dispatch(setMemberUser(false));
                    router.push("/");
                    setTracker(true);
                  } else {
                    dispatch(setMemberUser(true));
                    setTracker(true);
                  }
                }
              } catch (error) {
                console.error(error);
              }
            } else if (reduxClubData.tokenType === "erc721") {
              try {
                const daoDetails = await getERC721DAOdetails();

                const erc721BalanceResponse = await getERC721Balance();

                dispatch(
                  addErc721ClubDetails({
                    quorum: daoDetails.quorum / 100,
                    threshold: daoDetails.threshold / 100,
                    maxTokensPerUser: daoDetails.maxTokensPerUser,
                    isNftTotalSupplyUnlimited:
                      daoDetails.isNftTotalSupplyUnlimited,
                    isGovernanceActive: daoDetails.isGovernanceActive,
                    isTransferable: daoDetails.isTransferable,
                    onlyAllowWhitelist: daoDetails.onlyAllowWhitelist,
                    deployerAddress: daoDetails.deployerAddress,
                  }),
                );

                const safeSdk = await getSafeSdk(
                  reduxClubData.gnosisAddress,
                  walletAddress,
                );
                const ownerAddresses = await safeSdk.getOwners();
                const ownerAddressesArray = ownerAddresses.map((value) =>
                  Web3.utils.toChecksumAddress(value),
                );
                if (ownerAddressesArray.includes(walletAddress)) {
                  dispatch(setAdminUser(true));
                  setTracker(true);
                } else {
                  if (erc721BalanceResponse === "0" && !jid) {
                    dispatch(setMemberUser(false));
                    router.push("/");
                    setTracker(true);
                  } else {
                    dispatch(setMemberUser(true));
                    setTracker(true);
                  }
                }
              } catch (error) {
                console.error(error);
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, [
      daoAddress,
      wallet,
      jid,
      reduxClubData.gnosisAddress,
      reduxClubData.tokenType,
      getDaoDetails,
      dispatch,
      getERC20DAOdetails,
      getERC20Balance,
      walletAddress,
      router,
      getERC721DAOdetails,
      getERC721Balance,
    ]);

    const checkClubExist = useCallback(async () => {
      const clubData = await subgraphQuery(
        networkId == "0x5"
          ? SUBGRAPH_URL_GOERLI
          : networkId == "0x89"
          ? SUBGRAPH_URL_POLYGON
          : "",
        QUERY_CLUB_DETAILS(daoAddress ? daoAddress : jid),
      );

      if (clubData?.stations.length) {
        dispatch(setWrongNetwork(false));
      } else {
        dispatch(setWrongNetwork(true));
      }
    }, [daoAddress, dispatch, jid, networkId]);

    useEffect(() => {
      if (wallet && networkId) {
        checkUserExists();
        checkClubExist();
      }
    }, [checkUserExists, jid, daoAddress, wallet, networkId, checkClubExist]);

    return (
      <div>
        <Component />
      </div>
    );
  };
  return RetrieveDataComponent;
};

export default ClubFetch;
