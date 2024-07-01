import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addClubData,
  addErc20ClubDetails,
  addErc721ClubDetails,
} from "../redux/reducers/club";
import { setAdminUser, setMemberUser } from "../redux/reducers/gnosis";
import { convertToFullNumber, getSafeSdk } from "../utils/helper";
import { useAccount, useChainId } from "wagmi";
import { useRouter } from "next/router";
import useAppContractMethods from "./useAppContractMethods";
import { queryStationDataFromSubgraph } from "utils/stationsSubgraphHelper";
import { BigNumber } from "bignumber.js";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import useCommonContractMethods from "./useCommonContractMehods";
import { CHAIN_CONFIG } from "utils/constants";

const useClubFetch = ({ daoAddress, routeNetworkId }) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const reduxClubData = useSelector((state) => {
    return state.club.clubData;
  });

  const {
    getDaoDetails,
    getERC20DAOdetails,
    getERC721DAOdetails,
    getDaoBalance,
  } = useAppContractMethods({
    daoAddress,
    routeNetworkId,
  });

  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
    routeNetworkId,
  });

  const addClubDataToRedux = async (clubData) => {
    if (!reduxClubData.gnosisAddress && routeNetworkId) {
      if (clubData) {
        dispatch(
          addClubData({
            gnosisAddress: clubData.gnosisAddress,
            isGtTransferable: clubData.isGtTransferable,
            name: clubData.name,
            ownerAddress: clubData.ownerAddress,
            symbol: clubData.symbol,
            tokenType: clubData.tokenType,
            membersCount: clubData.membersCount,
            deployedTime: clubData.timeStamp,
            imgUrl: clubData.imageUrl,
            minDepositAmount: clubData.minDepositAmount,
            maxDepositAmount: clubData.maxDepositAmount,
            pricePerToken: clubData.pricePerToken,
            isGovernanceActive: clubData.isGovernanceActive,
            quorum: clubData.quorum,
            threshold: clubData.threshold,
            raiseAmount: clubData.raiseAmount,
            totalAmountRaised: clubData.totalAmountRaised,
            distributionAmount: clubData.distributionAmount,
            maxTokensPerUser: clubData.maxTokensPerUser,
            depositTokenAddress: clubData.depositTokenAddress,
            depositTokenSymbol: clubData.depositTokenSymbol,
            depositTokenDecimal: clubData.depositTokenDecimal,
            assetsStoredOnGnosis: clubData.assetsStoredOnGnosis,
            depositCloseTime: clubData.depositCloseTime,
            isDeployedByFactory: clubData.isDeployedByFactory,
            isTokenGatingApplied: clubData.isTokenGatingApplied,
            maxDepositPerUser: clubData.maxDepositPerUser,
            merkleRoot: clubData.merkleRoot,
            minDepositPerUser: clubData.minDepositPerUser,
            ownerFeePerDepositPercent: clubData.ownerFeePerDepositPercent,

            raiseAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.raiseAmount,
                clubData.depositTokenDecimal,
              ),
              actualValue: clubData.raiseAmount,
              bigNumberValue: BigNumber(clubData.raiseAmount),
            },

            totalAmountRaisedFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.totalAmountRaised,
                clubData.depositTokenDecimal,
              ),
              actualValue: clubData.totalAmountRaised,
              bigNumberValue: BigNumber(clubData.totalAmountRaised),
            },

            distributionAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData.distributionAmount,
                18,
              ),
              actualValue: clubData.distributionAmount,
              bigNumberValue: BigNumber(clubData.distributionAmount),
            },

            minDepositAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData?.minDepositAmount,
                clubData?.depositTokenDecimal,
              ),
              actualValue: clubData?.minDepositAmount,
              bigNumberValue: BigNumber(clubData?.minDepositAmount),
            },

            maxDepositAmountFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData?.maxDepositAmount,
                clubData?.depositTokenDecimal,
              ),
              actualValue: clubData?.maxDepositAmount,
              bigNumberValue: BigNumber(clubData?.maxDepositAmount),
            },

            pricePerTokenFormatted: {
              formattedValue: convertFromWeiGovernance(
                clubData?.pricePerToken,
                clubData?.depositTokenDecimal,
              ),
              actualValue: clubData?.pricePerToken,
              bigNumberValue: BigNumber(clubData?.pricePerToken),
            },
          }),
        );
      }
    }
  };

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        const data = await queryStationDataFromSubgraph(
          daoAddress,
          routeNetworkId,
        );
        const daoDetails = await getDaoDetails();
        const depositTokenDecimal = await getDecimals(
          daoDetails.depositTokenAddress,
        );
        const depositTokenSymbol = await getTokenSymbol(
          daoDetails.depositTokenAddress,
        );

        // Loop through the stations in data and add depositTokenAddress to each station
        const updatedData = {
          ...data,
          stations: data.stations.map((station) => ({
            ...station,
            ...daoDetails,
            distributionAmount: convertToFullNumber(
              daoDetails.distributionAmount.toString(),
            ),
            depositTokenDecimal,
            depositTokenSymbol,
          })),
        };
        if (data) {
          addClubDataToRedux(updatedData?.stations[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (daoAddress && routeNetworkId) fetchStationData();
  }, [daoAddress, routeNetworkId, networkId, walletAddress, reduxClubData]);

  const checkUserExists = async () => {
    try {
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
        CHAIN_CONFIG[networkId]?.gnosisTxUrl,
        routeNetworkId,
      );

      const safeThreshold = await safeSdk.getThreshold();
      const ownerAddresses = await safeSdk.getOwners();
      const ownerAddressesArray = ownerAddresses.map((value) =>
        value.toLowerCase(),
      );

      dispatch(
        addClubData({
          ...reduxClubData,
          adminAddresses: ownerAddressesArray,
          currentSafeThreshold: safeThreshold,
        }),
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
        dispatch(setAdminUser(false));
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
  }, [walletAddress, routeNetworkId, daoAddress, reduxClubData.gnosisAddress]);
};

export default useClubFetch;
