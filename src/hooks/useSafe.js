import useSmartContractMethods from "./useSmartContractMethods";
import { addClubData, addDaoAddress } from "../redux/reducers/club";
import {
  setCreateDaoAuthorized,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
} from "../redux/reducers/gnosis";
import Router from "next/router";
import { createClubData } from "../api/club";

const useSafe = () => {
  const { createERC721DAO, createERC20DAO } = useSmartContractMethods();

  const initiateConnection = async (
    params,
    dispatch,
    addressList,
    clubTokenType,
    tokenURI = "",
    metadataURL = "",
    useStationFor,
    email = "",
  ) => {
    dispatch(setCreateSafeLoading(true));
    dispatch(setCreateDaoAuthorized(false));

    let daoAddress = null;

    try {
      dispatch(setCreateSafeLoading(false));
      dispatch(setCreateDaoAuthorized(true));

      let value;
      if (clubTokenType === "NFT") {
        value = await createERC721DAO(
          params.clubName,
          params.clubSymbol,
          metadataURL,
          params.ownerFeePerDepositPercent,
          params.depositClose,
          params.quorum,
          params.threshold,
          params.safeThreshold,
          params.depositTokenAddress,
          params.treasuryAddress,
          addressList,
          params.maxTokensPerUser,
          params.distributeAmount,
          params.pricePerToken,
          params.isNftTransferable,
          params.isNftTotalSupplyUnlimited,
          params.isGovernanceActive,
          params.allowWhiteList,
          params.storeAssetsOnGnosis,
          params.merkleRoot,
        );
      } else {
        value = await createERC20DAO(
          params.clubName,
          params.clubSymbol,
          params.distributeAmount,
          params.pricePerToken,
          params.minDepositPerUser,
          params.maxDepositPerUser,
          params.ownerFeePerDepositPercent,
          params.depositClose,
          params.quorum,
          params.threshold,
          params.safeThreshold,
          params.depositTokenAddress,
          params.treasuryAddress,
          addressList,
          params.isGovernanceActive,
          params.isGtTransferable,
          params.allowWhiteList,
          params.storeAssetsOnGnosis,
          params.merkleRoot,
        );
      }
      try {
        dispatch(
          addClubData({
            gnosisAddress:
              params.treasuryAddress ===
              "0x0000000000000000000000000000000000000000"
                ? value.events[0].address
                : params.treasuryAddress,
            isGtTransferable: params.isGtTransferable,
            name: params.clubName,
            ownerAddress: addressList,
            symbol: params.clubSymbol,
            tokenType: clubTokenType === "NFT" ? "erc721" : "erc20",
          }),
        );

        daoAddress =
          params.treasuryAddress ===
          "0x0000000000000000000000000000000000000000"
            ? value.events[2].address
            : value.events[0].address;
        dispatch(addDaoAddress(daoAddress));

        await createClubData({
          daoAddress,
          clubType: useStationFor,
          deployerEmail: email,
        });

        const { pathname } = Router;
        if (pathname == "/create") {
          Router.push(`/dashboard/${daoAddress}?clubCreate=true`, undefined, {
            shallow: true,
          });
        }
      } catch (error) {
        dispatch(setCreateDaoAuthorized(false));
        dispatch(setCreateSafeError(true));
        console.error(error);
        if (error.code === 4001) {
          dispatch(setCreateSafeErrorCode(4001));
        }
      }
    } catch (error) {
      console.error("error");
      dispatch(setCreateSafeLoading(false));
      dispatch(setCreateDaoAuthorized(false));
      dispatch(setCreateSafeError(true));
      return "Gnosis safe connection cannot be established!";
    }
  };

  return { initiateConnection };
};

export default useSafe;
