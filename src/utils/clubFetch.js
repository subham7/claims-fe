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
import ImplementationContract from "../abis/implementationABI.json";
import { addWalletAddress } from "../redux/reducers/user";
import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";

const ClubFetch = (Component) => {
  const RetrieveDataComponent = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [{ wallet }] = useConnectWallet();

    const walletAddress = Web3.utils.toChecksumAddress(
      wallet?.accounts[0].address,
    );
    if (wallet) {
      localStorage.setItem("wallet", walletAddress);
    }

    const { clubId: daoAddress } = router.query;
    console.log(router.query);

    // const provider = new Web3.providers.HttpProvider("http://localhost:3000");
    // const web3 = new Web3(provider);
    // console.log(web3);

    // const ethAdapter = new Web3Adapter({
    //   web3,
    //   signerAddress: walletAddress,
    // });

    // console.log("ethAdapter", ethAdapter?.getChainId());

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
      console.log(daoAddress);

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

        if (daoAddress && wallet) {
          const networkData = fetchConfigById(wallet.chains[0].id);
          networkData.then((result) => {
            if (result.status != 200) {
              console.log(result.error);
            } else {
              console.log(result);
              dispatch(
                addContractAddress({
                  factoryContractAddress:
                    "0x43d087bE7aa873B3F7cF012E6650b14042CF5129",
                  usdcContractAddress: result.data[0].usdcContractAddress,
                  transactionUrl: result.data[0].gnosisTransactionUrl,
                  networkHex: result.data[0].networkHex,
                  networkId: result.data[0].networkId,
                  networkName: result.data[0].name,
                }),
              );
            }
          });

          const clubData = await subgraphQuery(QUERY_CLUB_DETAILS(daoAddress));
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
          console.log("Clubdatasaaaaaa", clubData.stations[0].gnosisAddress);

          if (clubData.stations[0].tokenType === "erc20") {
            const erc20Contract = new SmartContract(
              Erc20Dao,
              daoAddress,
              undefined,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
            );
            console.log(erc20Contract);
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
                console.log("responseeeeeeee", result);

                const safeSdk = await getSafeSdk();
                const ownerAddresses = await safeSdk.getOwners();
                console.log("ownerAddresses", ownerAddresses);
                const ownerAddressesArray = ownerAddresses.map((value) =>
                  Web3.utils.toChecksumAddress(value),
                );
                console.log(ownerAddressesArray, walletAddress);
                if (ownerAddressesArray.includes(walletAddress)) {
                  console.log("here");
                  dispatch(setAdminUser(true));
                } else {
                  if (result === "0") {
                    dispatch(setMemberUser(false));
                    router.push("/");
                  } else {
                    console.log("here");
                    dispatch(setMemberUser(true));
                  }
                }
              },
              (error) => {
                router.push("/");
              },
            );
            console.log(daoDetails);
          } else if (clubData.stations[0].tokenType === "erc721") {
            const erc721Contract = new SmartContract(
              Erc721Dao,
              daoAddress,
              undefined,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
            );
            console.log(erc721Contract);
            const daoDetails = await erc721Contract.erc721ClubDetails();
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

            response.then(async (result) => {
              console.log("responseeeeeeee", result);

              const safeSdk = getSafeSdk();
              safeSdk
                .then(async () => {
                  const ownerAddresses = await safeSdk.getOwners();
                  const ownerAddressesArray = ownerAddresses.map((value) =>
                    Web3.utils.toChecksumAddress(value),
                  );
                  console.log(ownerAddressesArray, walletAddress);
                  if (ownerAddressesArray.includes(walletAddress)) {
                    console.log("here");
                    dispatch(setAdminUser(true));
                  } else {
                    if (result === "0") {
                      dispatch(setMemberUser(false));
                      router.push("/");
                    } else {
                      console.log("here");
                      dispatch(setMemberUser(true));
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                  router.push("/");
                });
            });
            console.log(daoDetails);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, [
      GNOSIS_TRANSACTION_URL,
      USDC_CONTRACT_ADDRESS,
      daoAddress,
      dispatch,
      gnosisAddress,
      router,
      wallet,
      walletAddress,
      // ethAdapter,
    ]);

    useEffect(() => {
      checkUserExists();
    }, [
      GNOSIS_TRANSACTION_URL,
      USDC_CONTRACT_ADDRESS,
      daoAddress,
      dispatch,
      gnosisAddress,
      router,
      wallet,
      walletAddress,
      // ethAdapter,
    ]);
    return <Component />;
  };
  return RetrieveDataComponent;
};

export default ClubFetch;
