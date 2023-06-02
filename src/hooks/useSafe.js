import useSmartContractMethods from "./useSmartContractMethods";
import { addClubData, addDaoAddress } from "../redux/reducers/club";
import {
  setCreateDaoAuthorized,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
} from "../redux/reducers/gnosis";
import Router from "next/router";

const useSafe = () => {
  const { createERC721DAO, createERC20DAO } = useSmartContractMethods();

  async function initiateConnection(
    params,
    dispatch,
    gnosisTransactionUrl,
    addressList,
    clubTokenType,
    factoryContractAddress,
    tokenURI = "",
    metadataURL = "",
  ) {
    dispatch(setCreateSafeLoading(true));
    dispatch(setCreateDaoAuthorized(false));
    // const { createERC20DAO } = useSmartContractMethods();

    let daoAddress = null;

    try {
      dispatch(setCreateSafeLoading(false));
      dispatch(setCreateDaoAuthorized(true));

      let value;
      if (clubTokenType === "NFT") {
        let modifiedTokenURI;
        if (clubTokenType === "NFT") {
          if (
            tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))
          ) {
            let imgUrl = tokenURI?.split("//");
            modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;
          } else {
            let imgUrl = tokenURI?.split("/");
            modifiedTokenURI = `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`;
          }
        }

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
          false, // assets Stored on Gnosis
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
          false, // assets Stored on Gnosis
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
  }

  return { initiateConnection };
};

export default useSafe;
