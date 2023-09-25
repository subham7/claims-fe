import { addClubData } from "../redux/reducers/club";
import {
  setCreateDaoAuthorized,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
} from "../redux/reducers/gnosis";
import { useRouter } from "next/router";
import { createClubData } from "../api/club";
import useAppContractMethods from "./useAppContractMethods";
import { ZERO_ADDRESS } from "utils/constants";
import { uploadNFT } from "api/assets";

const useSafe = () => {
  const { createERC721DAO, createERC20DAO } = useAppContractMethods();
  const router = useRouter();

  const initiateConnection = async (
    params,
    dispatch,
    addressList,
    clubTokenType,
    metadataURL = "",
    useStationFor,
    email = "",
    networkId,
    imageFile = null,
  ) => {
    const uploadFileToAWS = async () => {
      return new Promise(async (resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", async () => {
          const path = imageFile?.name.split("/");
          const fileName = path[path.length - 1];
          const res = await fetch(
            `https://k3hu9vqwv4.execute-api.ap-south-1.amazonaws.com/upload?filename=${fileName}`,
            {
              method: "POST",
              body: new Blob([reader.result]),
            },
          );

          const data = await res.json();
          resolve(data?.saveFileResponse?.Location);
        });

        reader.readAsArrayBuffer(imageFile);
      });
    };

    dispatch(setCreateSafeLoading(true));
    dispatch(setCreateDaoAuthorized(false));

    let daoAddress = null;

    try {
      dispatch(setCreateSafeLoading(false));
      dispatch(setCreateDaoAuthorized(true));

      let value;
      if (clubTokenType === "NFT") {
        value = await createERC721DAO({
          ...params,
          metadataURL,
          addressList,
        });
      } else {
        value = await createERC20DAO({
          ...params,
          addressList,
        });
      }

      try {
        dispatch(
          addClubData({
            gnosisAddress:
              params.treasuryAddress === ZERO_ADDRESS
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
          params.treasuryAddress === ZERO_ADDRESS
            ? value.logs[2].address
            : value.logs[0].address;

        await createClubData({
          daoAddress,
          clubType: useStationFor,
          deployerEmail: email,
        });

        if (clubTokenType === "NFT") {
          const imageLink = await uploadFileToAWS();
          await uploadNFT(daoAddress, imageLink);
        }

        router.push(`/dashboard/${daoAddress}/${networkId}`, undefined, {
          shallow: true,
        });
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
