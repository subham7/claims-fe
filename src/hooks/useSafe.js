import { addClubData, addDaoAddress } from "../redux/reducers/club";
import {
  setCreateDaoAuthorized,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
} from "../redux/reducers/gnosis";
import Router from "next/router";
import { createClubData } from "../api/club";
import useAppContractMethods from "./useAppContractMethods";
// import { uploadNFT } from "api/assets";

const useSafe = () => {
  const { createERC721DAO, createERC20DAO } = useAppContractMethods();

  const initiateConnection = async (
    params,
    dispatch,
    addressList,
    clubTokenType,
    tokenURI = "",
    metadataURL = "",
    imgFile = "",
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
        value = await createERC721DAO({
          clubName: params.clubName,
          clubSymbol: params.clubSymbol,
          metadataURL,
          ownerFeePerDepositPercent: params.ownerFeePerDepositPercent,
          depositClose: params.depositClose,
          quorum: params.quorum,
          threshold: params.threshold,
          safeThreshold: params.safeThreshold,
          depositTokenAddress: params.depositTokenAddress,
          treasuryAddress: params.treasuryAddress,
          addressList,
          maxTokensPerUser: params.maxTokensPerUser,
          distributeAmount: params.distributeAmount,
          pricePerToken: params.pricePerToken,
          isNftTransferable: params.isNftTransferable,
          isNftTotalSupplyUnlimited: params.isNftTotalSupplyUnlimited,
          isGovernanceActive: params.isGovernanceActive,
          allowWhiteList: params.allowWhiteList,
          assetsStoredOnGnosis: params.storeAssetsOnGnosis,
          merkleRoot: params.merkleRoot,
        });
      } else {
        value = await createERC20DAO({
          clubName: params.clubName,
          clubSymbol: params.clubSymbol,
          distributeAmount: params.distributeAmount,
          pricePerToken: params.pricePerToken,
          minDepositPerUser: params.minDepositPerUser,
          maxDepositPerUser: params.maxDepositPerUser,
          ownerFeePerDepositPercent: params.ownerFeePerDepositPercent,
          depositClose: params.depositClose,
          quorum: params.quorum,
          threshold: params.threshold,
          safeThreshold: params.safeThreshold,
          depositTokenAddress: params.depositTokenAddress,
          treasuryAddress: params.treasuryAddress,
          addressList,
          isGovernanceActive: params.isGovernanceActive,
          isGtTransferable: params.isGtTransferable,
          allowWhiteList: params.allowWhiteList,
          assetsStoredOnGnosis: params.storeAssetsOnGnosis,
          merkleRoot: params.merkleRoot,
        });
      }

      try {
        dispatch(
          addClubData({
            gnosisAddress:
              params.treasuryAddress ===
              "0x0000000000000000000000000000000000000000"
                ? value.logs[0].address
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
            ? value.logs[2].address
            : value.logs[0].address;
        dispatch(addDaoAddress(daoAddress));

        await createClubData({
          daoAddress,
          clubType: useStationFor,
          deployerEmail: email,
        });

        // if (clubTokenType === "NFT") {
        //   const formData = new FormData();
        //   formData.append("file", imgFile);
        //   formData.append("daoAddress", daoAddress);
        //   await uploadNFT(formData);
        // }

        const { pathname } = Router;
        if (pathname == "/create") {
          Router.push(`/dashboard/${daoAddress}`, undefined, {
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
