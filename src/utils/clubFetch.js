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
  setClubNetworkId,
} from "../redux/reducers/club";
import { useConnectWallet } from "@web3-onboard/react";

import {
  addContractAddress,
  setAdminUser,
  setMemberUser,
  setWrongNetwork,
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
  POLYGON_MAINNET_RPC_URL,
  RPC_URL,
  SUBGRAPH_URL_GOERLI,
  SUBGRAPH_URL_POLYGON,
} from "../api";
import { fetchClubbyDaoAddress } from "../api/club";
import { Backdrop, CircularProgress } from "@mui/material";

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
      try {
        const getSafeSdk = async () => {
          const web3 = new Web3(RPC_URL);
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
        if ((daoAddress && wallet) || (pid && wallet)) {
          const networkData = fetchConfigById(wallet.chains[0].id);

          networkData.then(async (result) => {
            if (result.status != 200) {
            } else {
              const clubData = await fetchClubbyDaoAddress(
                daoAddress ? daoAddress : pid,
              );

              dispatch(
                addContractAddress({
                  factoryContractAddress:
                    networkId == "0x5"
                      ? FACTORY_ADDRESS_GOERLI
                      : networkId == "0x89"
                      ? FACTORY_ADDRESS_POLYGON
                      : null,
                  usdcContractAddress: result?.data[0]?.usdcContractAddress,
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
                  transactionUrl: result?.data[0]?.gnosisTransactionUrl,
                  networkHex: result?.data[0]?.networkHex,
                  networkId: result?.data[0]?.networkId,
                  networkName: result?.data[0]?.name,
                  clubNetworkId: clubData?.data[0]?.networkId,
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
            QUERY_CLUB_DETAILS(daoAddress ? daoAddress : pid),
          );
          console.log("clubdataaaaaaa", clubData, SUBGRAPH_URL_POLYGON, pid);

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

          if (
            USDC_CONTRACT_ADDRESS &&
            GNOSIS_TRANSACTION_URL &&
            gnosisAddress
          ) {
            console.log(
              "yyyyyyyyyyyyyyyyyyy",
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
            );
            if (clubData.stations[0].tokenType === "erc20") {
              const erc20Contract = new SmartContract(
                Erc20Dao,
                daoAddress ? daoAddress : pid,
                walletAddress,
                USDC_CONTRACT_ADDRESS,
                GNOSIS_TRANSACTION_URL,
              );

              const daoDetails = await erc20Contract.getERC20DAOdetails();

              console.log("daoDetails", daoDetails);
              const response = erc20Contract.balanceOf();
              console.log("response", response);
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

              response
                .then(
                  async (result) => {
                    try {
                      console.log("first", gnosisAddress, result, response);
                      const safeSdk = await getSafeSdk();
                      console.log("safeSdk", safeSdk);
                      const ownerAddresses = await safeSdk.getOwners();
                      console.log("ownerAddresses", ownerAddresses);
                      const ownerAddressesArray = ownerAddresses.map((value) =>
                        Web3.utils.toChecksumAddress(value),
                      );
                      if (ownerAddressesArray.includes(walletAddress)) {
                        dispatch(setAdminUser(true));
                        setTracker(true);
                      } else {
                        if (result === "0" && !pid) {
                          console.log("heree");
                          dispatch(setMemberUser(false));
                          router.push("/");
                          setTracker(true);
                        } else {
                          dispatch(setMemberUser(true));
                          setTracker(true);
                        }
                      }
                    } catch (error) {
                      console.log("errrrrrrrrr", error);
                    }
                  },
                  (error) => {
                    router.push("/");
                  },
                )
                .catch((err) => console.log(err));
            } else if (clubData.stations[0].tokenType === "erc721") {
              const erc721Contract = new SmartContract(
                Erc721Dao,
                daoAddress ?? pid,
                walletAddress,
                USDC_CONTRACT_ADDRESS,
                GNOSIS_TRANSACTION_URL,
              );
              const daoDetails = await erc721Contract.getERC721DAOdetails();
              console.log("daoDetails", daoDetails);
              const response = erc721Contract.balanceOf();
              console.log("response", response);
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

              response
                .then(
                  async (result) => {
                    const safeSdk = await getSafeSdk();
                    const ownerAddresses = await safeSdk.getOwners();
                    const ownerAddressesArray = ownerAddresses.map((value) =>
                      Web3.utils.toChecksumAddress(value),
                    );
                    if (ownerAddressesArray.includes(walletAddress)) {
                      dispatch(setAdminUser(true));
                      setTracker(true);
                    } else {
                      if (result === "0" && !pid) {
                        dispatch(setMemberUser(false));
                        router.push("/");
                        setTracker(true);
                      } else {
                        dispatch(setMemberUser(true));
                        setTracker(true);
                      }
                    }
                  },
                  (error) => {
                    router.push("/");
                  },
                )
                .catch((err) => {
                  console.log(err);
                });
              console.log(daoDetails);
            }
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

    const checkClubExistsOnNetwork = useCallback(async () => {
      try {
        if ((daoAddress && wallet) || (pid && wallet)) {
          console.log("now", pid, wallet);
          const networkData = await fetchClubbyDaoAddress(
            daoAddress ? daoAddress : pid,
          );
          console.log("now Network Data", networkData, daoAddress);
          const clubNetworkId = networkData.data[0].networkId;
          console.log("CLUB ID", clubNetworkId);

          console.log("now wallet", wallet);

          if (clubNetworkId === 5 && wallet?.chains[0].id === "0x5") {
            console.log("Nice club");
            dispatch(setWrongNetwork(false));
          } else if (clubNetworkId === 137 && wallet?.chains[0].id === "0x89") {
            console.log("Polygon club it is");
            dispatch(setWrongNetwork(false));
          } else {
            console.log("Wrong Club");
            dispatch(setWrongNetwork(true));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, [daoAddress, dispatch, pid, wallet]);

    useEffect(() => {
      console.log("first useeffect called", wallet, pid);

      if (wallet) {
        checkUserExists();
      }
    }, [checkClubExistsOnNetwork, checkUserExists, pid, wallet]);

    useEffect(() => {
      if (wallet) {
        checkClubExistsOnNetwork();
      }
    }, [checkClubExistsOnNetwork, wallet]);

    // useEffect(() => {
    //   console.log("use", wallet);
    // }, [wallet]);
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
