import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "../redux/reducers/gnosis";
import { fetchConfigById } from "../api/config";

import { getSafeSdk } from "../utils/helper";
import useAppContract from "./useAppContract";
import { useAccount, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import useAppContractMethods from "./useAppContractMethods";
import { queryStationDataFromSubgraph } from "utils/stationsSubgraphHelper";

const useClubFetch = ({ daoAddress }) => {
  const [clubData, setClubData] = useState();

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
    const fetchStationData = async () => {
      try {
        const data = await queryStationDataFromSubgraph(daoAddress, networkId);
        if (data) {
          setClubData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (daoAddress && networkId && walletAddress) fetchStationData();
  }, [daoAddress, networkId, walletAddress, reduxClubData]);

  useEffect(() => {
    const addClubDataToRedux = async () => {
      if (!reduxClubData.gnosisAddress && networkId) {
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
              imgUrl: clubData.stations[0].imageUrl,
              minDepositAmount: clubData.stations[0].minDepositAmount,
              maxDepositAmount: clubData.stations[0].maxDepositAmount,
              pricePerToken: clubData.stations[0].pricePerToken,
              isGovernanceActive: clubData.stations[0].isGovernanceActive,
              quorum: clubData.stations[0].quorum,
              threshold: clubData.stations[0].threshold,
              raiseAmount: clubData.stations[0].raiseAmount,
              totalAmountRaised: clubData.stations[0].totalAmountRaised,
              distributionAmount: clubData.stations[0].distributionAmount,
              maxTokensPerUser: clubData.stations[0].maxTokensPerUser,
            }),
          );
        }
      }
    };

    addClubDataToRedux();
  }, [reduxClubData, networkId, daoAddress, dispatch, clubData]);

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
          if (balance === "0" && !router.pathname.includes("join")) {
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
    router,
  ]);

  useEffect(() => {
    if (walletAddress && networkId) {
      checkUserExists();
    }
  }, [checkUserExists, walletAddress, networkId, daoAddress]);
};

export default useClubFetch;
