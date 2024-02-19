import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addClubData,
  addErc20ClubDetails,
  addErc721ClubDetails,
  addFactoryData,
} from "../redux/reducers/club";
import {
  // addContractAddress,
  setAdminUser,
  setMemberUser,
} from "../redux/reducers/gnosis";
// import { fetchConfigById } from "../api/config";

import { convertToFullNumber, getSafeSdk } from "../utils/helper";
import { useAccount, useNetwork } from "wagmi";
import { useRouter } from "next/router";
import useAppContractMethods from "./useAppContractMethods";
import { queryStationDataFromSubgraph } from "utils/stationsSubgraphHelper";

const useClubFetch = ({ daoAddress, routeNetworkId }) => {
  const [clubData, setClubData] = useState();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const dispatch = useDispatch();

  const router = useRouter();
  const { address: walletAddress } = useAccount();

  const reduxClubData = useSelector((state) => {
    return state.club.clubData;
  });

  const {
    getDaoDetails,
    getERC20DAOdetails,
    getDaoBalance,
    getERC721DAOdetails,
  } = useAppContractMethods({
    daoAddress,
    routeNetworkId,
  });

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        const data = await queryStationDataFromSubgraph(
          daoAddress,
          routeNetworkId,
        );
        const daoDetails = await getDaoDetails();
        const depositTokenAddress = daoDetails.depositTokenAddress;

        // Loop through the stations in data and add depositTokenAddress to each station
        const updatedData = {
          ...data,
          stations: data.stations.map((station) => ({
            ...station,
            depositTokenAddress: depositTokenAddress,
          })),
        };
        if (data) {
          setClubData(updatedData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (daoAddress && routeNetworkId && walletAddress) fetchStationData();
  }, [daoAddress, routeNetworkId, networkId, walletAddress, reduxClubData]);

  useEffect(() => {
    const addClubDataToRedux = async () => {
      if (!reduxClubData.gnosisAddress && routeNetworkId) {
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
              depositTokenAddress: clubData.stations[0].depositTokenAddress,
            }),
          );
        }
      }
    };

    addClubDataToRedux();
  }, [reduxClubData, routeNetworkId, networkId, daoAddress, clubData]);

  const checkUserExists = async () => {
    try {
      const factoryData = await getDaoDetails();

      if (factoryData) {
        dispatch(
          addFactoryData({
            assetsStoredOnGnosis: factoryData?.assetsStoredOnGnosis,
            depositCloseTime: factoryData.depositCloseTime,
            depositTokenAddress: factoryData.depositTokenAddress,
            distributionAmount: convertToFullNumber(
              factoryData.distributionAmount.toString(),
            ),
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

      const balance = await getDaoBalance(reduxClubData.tokenType === "erc721");

      const { safeSdk } = await getSafeSdk(
        reduxClubData.gnosisAddress,
        walletAddress,
      );

      const ownerAddresses = await safeSdk.getOwners();
      const ownerAddressesArray = ownerAddresses.map((value) =>
        value.toLowerCase(),
      );
      if (ownerAddressesArray.includes(walletAddress.toLowerCase())) {
        dispatch(setAdminUser(true));
      } else {
        if (
          balance == 0 &&
          !router.pathname.includes("join") &&
          !router.pathname.includes("documents")
        ) {
          dispatch(setMemberUser(false));
          router.push("/");
        } else {
          dispatch(setMemberUser(true));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      walletAddress &&
      routeNetworkId &&
      daoAddress &&
      reduxClubData.gnosisAddress
    ) {
      checkUserExists();
    }
  }, [
    walletAddress,
    routeNetworkId,
    daoAddress,
    networkId,
    reduxClubData.gnosisAddress,
  ]);
};

export default useClubFetch;
