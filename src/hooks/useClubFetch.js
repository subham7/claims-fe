import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subgraphQuery } from "../utils/subgraphs";
import { QUERY_CLUB_DETAILS } from "../api/graphql/queries";
import {
  addClubData,
  addErc20ClubDetails,
  addErc721ClubDetails,
  addFactoryData,
} from "../redux/reducers/club";

import {
  addContractAddress,
  setAdminUser,
  setMemberUser,
  setWrongNetwork,
} from "../redux/reducers/gnosis";
import { fetchConfigById } from "../api/config";

import { SUBGRAPH_URL_GOERLI, SUBGRAPH_URL_POLYGON } from "../api";
import { getSafeSdk } from "../utils/helper";
import useAppContract from "./useAppContract";
import { useAccount, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import useAppContractMethods from "./useAppContractMethods";

const useClubFetch = ({ daoAddress }) => {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  useAppContract(daoAddress);

  const router = useRouter();
  const { address: walletAddress } = useAccount();

  const networkId = "0x" + chain?.id.toString(16);

  const reduxClubData = useSelector((state) => {
    return state.club.clubData;
  });

  const {
    getDaoDetails,
    getERC20DAOdetails,
    getERC20Balance,
    getERC721Balance,
    getERC721DAOdetails,
  } = useAppContractMethods();

  useEffect(() => {
    const getNetworkConfig = async () => {
      try {
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
          QUERY_CLUB_DETAILS(daoAddress),
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
              membersCount: clubData.stations[0].membersCount,
              deployedTime: clubData.stations[0].timeStamp,
            }),
          );
        }
      }
    };

    addClubDataToRedux();
  }, [reduxClubData, networkId, daoAddress, dispatch]);

  const checkUserExists = useCallback(async () => {
    try {
      if (daoAddress && walletAddress && reduxClubData.gnosisAddress) {
        const factoryData = await getDaoDetails(daoAddress);

        if (factoryData) {
          dispatch(
            addFactoryData({
              assetsStoredOnGnosis: factoryData?.assetsStoredOnGnosis,
              depositCloseTime: factoryData.depositCloseTime,
              depositTokenAddress: factoryData.depositTokenAddress,
              distributionAmount: factoryData.distributionAmount,
              gnosisAddress: factoryData.gnosisAddress,
              isDeployedByFactory: factoryData.isDeployedByFactory,
              isTokenGatingApplied: factoryData.isTokenGatingApplied,
              maxDepositPerUser: factoryData.maxDepositPerUser,
              merkleRoot: factoryData.merkleRoot,
              minDepositPerUser: factoryData.minDepositPerUser,
              ownerFeePerDepositPercent: factoryData.ownerFeePerDepositPercent,
              pricePerToken: factoryData.pricePerToken,
            }),
          );
        }

        if (reduxClubData.tokenType === "erc20") {
          const daoDetails = await getERC20DAOdetails();

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
        } else if (reduxClubData.tokenType === "erc721") {
          const daoDetails = await getERC721DAOdetails();
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
        }

        let balance = 0;
        if (reduxClubData.tokenType === "erc721") {
          balance = await getERC721Balance();
        } else {
          balance = await getERC20Balance();
        }

        const safeSdk = await getSafeSdk(
          reduxClubData.gnosisAddress,
          walletAddress,
          networkId,
        );
        const ownerAddresses = await safeSdk.getOwners();
        const ownerAddressesArray = ownerAddresses.map((value) =>
          value.toLowerCase(),
        );
        if (ownerAddressesArray.includes(walletAddress.toLowerCase())) {
          dispatch(setAdminUser(true));
        } else {
          if (balance === "0") {
            dispatch(setMemberUser(false));
            router.push("/");
          } else {
            dispatch(setMemberUser(true));
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    daoAddress,
    walletAddress,
    reduxClubData.gnosisAddress,
    reduxClubData.tokenType,
    networkId,
  ]);

  const checkClubExist = useCallback(async () => {
    if (networkId) {
      const clubData = await subgraphQuery(
        networkId == "0x89" ? SUBGRAPH_URL_POLYGON : "",
        QUERY_CLUB_DETAILS(daoAddress),
      );

      if (clubData?.stations.length) {
        dispatch(setWrongNetwork(false));
      } else {
        dispatch(setWrongNetwork(true));
      }
    }
  }, [daoAddress, dispatch, networkId]);

  useEffect(() => {
    if (walletAddress && networkId) {
      checkUserExists();
      checkClubExist();
    }
  }, [checkUserExists, daoAddress, walletAddress, networkId, checkClubExist]);
};

export default useClubFetch;
