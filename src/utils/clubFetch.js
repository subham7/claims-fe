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
import Erc20Dao from "../abis/newArch/erc20Dao.json";
import Erc721Dao from "../abis/newArch/erc721Dao.json";
import { fetchConfigById } from "../api/config";
import { SmartContract } from "../api/contract";

import Web3 from "web3";
import {
  AIRDROP_ACTION_ADDRESS_GOERLI,
  AIRDROP_ACTION_ADDRESS_POLYGON,
  FACTORY_ADDRESS_GOERLI,
  FACTORY_ADDRESS_POLYGON,
  SUBGRAPH_URL_GOERLI,
  SUBGRAPH_URL_POLYGON,
} from "../api";
import { Backdrop, CircularProgress } from "@mui/material";
import { getSafeSdk } from "./helper";

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
    const { pid } = router.query;

    const USDC_CONTRACT_ADDRESS = useSelector((state) => {
      return state.gnosis.usdcContractAddress;
    });

    const GNOSIS_TRANSACTION_URL = useSelector((state) => {
      return state.gnosis.transactionUrl;
    });

    const reduxClubData = useSelector((state) => {
      return state.club.clubData;
    });

    useEffect(() => {
      dispatch(addDaoAddress(Web3.utils.toChecksumAddress(daoAddress)));
    }, [daoAddress]);

    useEffect(() => {
      const getNetworkConfig = async () => {
        try {
          const networkData = await fetchConfigById(networkId);
          dispatch(
            addContractAddress({
              factoryContractAddress:
                networkId == "0x5"
                  ? FACTORY_ADDRESS_GOERLI
                  : networkId == "0x89"
                  ? FACTORY_ADDRESS_POLYGON
                  : null,
              usdcContractAddress: networkData?.data[0]?.usdcContractAddress,
              actionContractAddress:
                networkId == "0x5"
                  ? AIRDROP_ACTION_ADDRESS_GOERLI
                  : networkId == "0x89"
                  ? AIRDROP_ACTION_ADDRESS_POLYGON
                  : null,
              subgraphUrl:
                networkId == "0x5"
                  ? SUBGRAPH_URL_GOERLI
                  : networkId == "0x89"
                  ? SUBGRAPH_URL_POLYGON
                  : null,
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
    }, [networkId]);

    useEffect(() => {
      const addClubDataToRedux = async () => {
        if (!reduxClubData.gnosisAddress && networkId) {
          const clubData = await subgraphQuery(
            networkId == "0x5"
              ? SUBGRAPH_URL_GOERLI
              : networkId == "0x89"
              ? SUBGRAPH_URL_POLYGON
              : "",
            QUERY_CLUB_DETAILS(daoAddress ? daoAddress : pid),
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
    }, [reduxClubData, networkId]);

    const checkUserExists = useCallback(async () => {
      try {
        if ((daoAddress && wallet) || (pid && wallet)) {
          if (
            USDC_CONTRACT_ADDRESS &&
            GNOSIS_TRANSACTION_URL &&
            reduxClubData.gnosisAddress
          ) {
            if (reduxClubData.tokenType === "erc20") {
              const erc20Contract = new SmartContract(
                Erc20Dao,
                daoAddress ? daoAddress : pid,
                walletAddress,
                USDC_CONTRACT_ADDRESS,
                GNOSIS_TRANSACTION_URL,
              );

              const daoDetails = await erc20Contract.getERC20DAOdetails();

              const erc20BalanceResponse = await erc20Contract.balanceOf();

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
                  if (erc20BalanceResponse === "0" && !pid) {
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
                debugger;
                const erc721Contract = new SmartContract(
                  Erc721Dao,
                  daoAddress ?? pid,
                  walletAddress,
                  USDC_CONTRACT_ADDRESS,
                  GNOSIS_TRANSACTION_URL,
                );
                const daoDetails = await erc721Contract.getERC721DAOdetails();
                const erc721BalanceResponse = await erc721Contract.balanceOf();

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
                  if (erc721BalanceResponse === "0" && !pid) {
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
      pid,
      walletAddress,
      reduxClubData,
      networkId,
      USDC_CONTRACT_ADDRESS,
      GNOSIS_TRANSACTION_URL,
    ]);

    useEffect(() => {
      if (wallet && networkId) {
        checkUserExists();
      }
    }, [checkUserExists, pid, daoAddress, wallet, networkId]);

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
