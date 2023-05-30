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
} from "../redux/reducers/club";
import { useConnectWallet } from "@web3-onboard/react";

import {
  addContractAddress,
  setAdminUser,
  setMemberUser,
} from "../redux/reducers/gnosis";
import { fetchConfigById } from "../api/config";

import Web3 from "web3";
import { SUBGRAPH_URL_GOERLI, SUBGRAPH_URL_POLYGON, getRpcUrl } from "../api";
import { Backdrop, CircularProgress } from "@mui/material";
import { getSafeSdk } from "./helper";
import useSmartContract from "../hooks/useSmartContract";

const ClubFetch = (Component) => {
  const RetrieveDataComponent = () => {
    const [tracker, setTracker] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [{ wallet }] = useConnectWallet();
    const networkId = wallet?.chains[0]?.id;

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

    const { erc20DaoContract, erc721DaoContract } = useSmartContract();

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
            if (
              reduxClubData.tokenType === "erc20" &&
              erc20DaoContract !== null
            ) {
              const daoDetails = await erc20DaoContract.getERC20DAOdetails();
              const erc20BalanceResponse = await erc20DaoContract.balanceOf();

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
            } else if (
              reduxClubData.tokenType === "erc721" &&
              erc721DaoContract !== null
            ) {
              try {
                const daoDetails =
                  await erc721DaoContract.getERC721DAOdetails();
                const erc721BalanceResponse =
                  await erc721DaoContract.balanceOf();

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
      erc20DaoContract,
      dispatch,
      walletAddress,
      router,
      erc721DaoContract,
    ]);

    useEffect(() => {
      if (wallet && networkId) {
        checkUserExists();
      }
    }, [checkUserExists, jid, daoAddress, wallet, networkId]);

    if (tracker === true) {
      return (
        <div>
          <Component />
        </div>
      );
    } else {
      return (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!tracker}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
  };
  return RetrieveDataComponent;
};

export default ClubFetch;
