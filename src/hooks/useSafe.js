import { addClubData } from "../redux/reducers/club";
// import {
//   setCreateDaoAuthorized,
//   setCreateSafeError,
//   setCreateSafeErrorCode,
//   setCreateSafeLoading,
// } from "../redux/reducers/gnosis";
import { useRouter } from "next/router";
import { createStation } from "../api/club";
import useAppContractMethods from "./useAppContractMethods";
import { ZERO_ADDRESS } from "utils/constants";
import { uploadNFT } from "api/assets";
import { handleSignMessage, uploadFileToAWS } from "utils/helper";
import { setAlertData } from "redux/reducers/alert";
// import { AnnouncementContext } from "@components/AnnouncementContext";
// import { useContext } from "react";

const useSafe = () => {
  const { createERC721DAO, createERC20DAO } = useAppContractMethods();
  // const { openAnnouncement } = useContext(AnnouncementContext);
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
    setLoader,
  ) => {
    // dispatch(setCreateSafeLoading(true));
    // dispatch(setCreateDaoAuthorized(false));

    let daoAddress = null;

    try {
      // dispatch(setCreateSafeLoading(false));
      // dispatch(setCreateDaoAuthorized(true));

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

      daoAddress =
        params.treasuryAddress === ZERO_ADDRESS
          ? value.logs[2].address
          : value.logs[0].address;

      const payload = {
        depositConfig: {
          subscriptionDocId: null,
          enableKyc: false,
          uploadDocId: null,
        },
        name: params.clubName,
        daoAddress: daoAddress?.toLowerCase(),
        votingStrategy: "onePersonOneVote",
        safeAddress:
          params.treasuryAddress === ZERO_ADDRESS
            ? value.logs[0].address
            : params.treasuryAddress,
        networkId,
        tokenType: clubTokenType === "NFT" ? "erc721" : "erc20NonTransferable",
      };

      const { signature } = await handleSignMessage(
        addressList[0],
        JSON.stringify(payload),
      );

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

        await createStation({ ...payload, signature });

        if (clubTokenType === "NFT") {
          const imageLink = await uploadFileToAWS(imageFile);
          await uploadNFT(daoAddress?.toLowerCase(), imageLink);
        }
        setLoader(false);
        router.push(
          `/dashboard/${daoAddress}/${networkId}?create=true`,
          undefined,
          {
            shallow: true,
          },
        );
        // openAnnouncement(true);
      } catch (error) {
        // dispatch(setCreateDaoAuthorized(false));
        // dispatch(setCreateSafeError(true));
        console.error(error);
        setLoader(false);
        if (error.code === 4001) {
          // dispatch(setCreateSafeErrorCode(4001));
          dispatch(
            setAlertData({
              open: true,
              message: "Metamask Signature denied",
              severity: "error",
            }),
          );
        } else {
          dispatch(
            setAlertData({
              open: true,
              message: "Some error occured",
              severity: "error",
            }),
          );
        }
      }
    } catch (error) {
      console.error("error");
      dispatch(
        setAlertData({
          open: true,
          message: "Some error occured",
          severity: "error",
        }),
      );
      // dispatch(setCreateSafeLoading(false));
      // dispatch(setCreateDaoAuthorized(false));
      // dispatch(setCreateSafeError(true));
      setLoader(false);
      return "Gnosis safe connection cannot be established!";
    }
  };

  return { initiateConnection };
};

export default useSafe;
