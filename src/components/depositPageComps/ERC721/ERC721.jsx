import React, { useEffect, useState } from "react";
import DepositPreRequisites from "../DepositPreRequisites";
import { useDispatch, useSelector } from "react-redux";
import { getUploadedNFT } from "api/assets";
import { convertFromWeiGovernance, getImageURL } from "utils/globalFunctions";
import {
  queryLatestMembersFromSubgraph,
  queryStationDataFromSubgraph,
} from "utils/stationsSubgraphHelper";
import dayjs from "dayjs";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useAccount } from "wagmi";
import Mint from "./Mint";
import { useRouter } from "next/router";
import { getDocumentsByClubId } from "api/document";
import PublicPageLayout from "@components/common/PublicPageLayout";
import { CHAIN_CONFIG } from "utils/constants";
import { whitelistOnDeposit } from "api/invite/invite";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import { setAlertData } from "redux/reducers/alert";
import { formatEther } from "viem";
import { getPublicClient } from "utils/viemConfig";
import { isNative } from "utils/helper";
import { addClubData } from "redux/reducers/club";

const DepositInputComponents = ({ depositPreRequisitesProps, mintProps }) => {
  return (
    <>
      <DepositPreRequisites {...depositPreRequisitesProps} />
      <Mint {...mintProps} />
    </>
  );
};

const ERC721 = ({
  daoAddress,
  clubInfo,
  isEligibleForTokenGating,
  isTokenGated,
  daoDetails,
  whitelistUserData,
  networkId,
  gatedTokenDetails,
  depositConfig,
  isSignable,
  allowanceValue,
  fetchCurrentAllowance,
  fetchErc721ContractDetails,
  routeNetworkId,
  isMetamaskPresent,
}) => {
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    userBalance: 0,
    tokenName: "",
    isNativeToken: false,
  });
  const [active, setActive] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [balanceOfNft, setBalanceOfNft] = useState();
  const [imgUrl, setImgUrl] = useState("");
  const [count, setCount] = useState(1);
  const [claimSuccessfull, setClaimSuccessfull] = useState(null);
  const [failed, setFailed] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isW8BenSigned, setIsW8BenSigned] = useState(false);
  const [uploadedDocInfo, setUploadedDocInfo] = useState({});
  const publicClient = getPublicClient(networkId);

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails?.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

  const { address: walletAddress } = useAccount();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    approveDeposit,
    getDecimals,
    getTokenSymbol,
    getBalance,
    getTokenName,
  } = useCommonContractMethods({ routeNetworkId });

  const { buyGovernanceTokenERC721DAO, getDaoDetails } = useAppContractMethods({
    daoAddress,
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const fetchActivities = async () => {
    try {
      const { users } = await queryLatestMembersFromSubgraph(
        daoAddress,
        routeNetworkId,
      );
      if (users) setMembers(users);
    } catch (error) {
      dispatch(
        setAlertData({
          open: true,
          message: "Unable to fetch latest Activity!",
          severity: "error",
        }),
      );
      console.log(error);
    }
  };

  const fetchTokenDetails = async () => {
    try {
      if (daoAddress) {
        const balance = await getBalance(daoAddress);
        setBalanceOfNft(balance);

        if (+balance >= +clubData?.maxTokensPerUser) {
          setHasClaimed(true);
        } else {
          setHasClaimed(false);
        }

        const depositTokenAddress = clubData.depositTokenAddress;
        const isNativeToken = isNative(
          clubData.depositTokenAddress,
          routeNetworkId,
        );

        const decimals = await getDecimals(depositTokenAddress);
        const symbol = await getTokenSymbol(depositTokenAddress);
        const name = await getTokenName(depositTokenAddress);

        let userBalance = 0;

        if (walletAddress) {
          if (isNativeToken) {
            userBalance = formatEther(
              await publicClient.getBalance({
                address: walletAddress,
              }),
            );
          } else {
            userBalance = convertFromWeiGovernance(
              await getBalance(depositTokenAddress),
              decimals,
            );
          }
        }

        setTokenDetails({
          tokenSymbol: symbol,
          tokenName: name,
          tokenDecimal: decimals,
          userBalance: userBalance,
          isNativeToken: isNativeToken,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStationData = async () => {
    try {
      const data = await queryStationDataFromSubgraph(
        daoAddress,
        routeNetworkId,
      );
      if (data?.stations?.length > 0) {
        dispatch(
          addClubData({
            ...clubData,
            totalAmountRaised: data?.stations[0]?.totalAmountRaised,
          }),
        );
      }
    } catch (error) {
      dispatch(
        setAlertData({
          open: true,
          message: "Unable to fetch Station Data!",
          severity: "error",
        }),
      );
      console.log(error);
    }
  };

  const approveERC721Handler = async () => {
    setLoading(true);
    try {
      await approveDeposit(
        clubData.depositTokenAddress,
        CHAIN_CONFIG[networkId].factoryContractAddress,
        Number(
          convertFromWeiGovernance(
            clubData?.pricePerToken,
            tokenDetails.tokenDecimal,
          ),
        ) * count,
        tokenDetails.tokenDecimal,
      );

      fetchCurrentAllowance();
      setLoading(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Approved Successfully!",
          severity: "success",
        }),
      );
    } catch (error) {
      setLoading(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Approval failed!",
          severity: "error",
        }),
      );
    }
  };

  const claimNFTHandler = async () => {
    try {
      setLoading(true);

      await buyGovernanceTokenERC721DAO(
        walletAddress,
        clubData?.imageUrl,
        count,
        whitelistUserData?.proof ? whitelistUserData.proof : [],
        clubData.depositTokenAddress.toLowerCase() ===
          CHAIN_CONFIG[networkId].nativeToken.toLowerCase()
          ? (clubData?.pricePerToken * count).toString()
          : "0",
      );
      await whitelistOnDeposit(walletAddress);

      setTimeout(() => {
        fetchErc721ContractDetails();
        fetchTokenDetails();
        fetchActivities();
        fetchStationData();
      }, 500);

      setLoading(false);
      setClaimSuccessfull(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setFailed(true);
    }
  };

  const handleIsSignedChange = (newValue) => {
    setIsSigned(newValue);
  };

  const handleIsW8BenSignedChange = (newValue) => {
    setIsW8BenSigned(newValue);
  };

  const fetchDocs = async () => {
    try {
      const docList = await getDocumentsByClubId(daoAddress.toLowerCase());

      const document = docList.find(
        (doc) => doc.docIdentifier === depositConfig?.uploadDocId,
      );
      setUploadedDocInfo(document);
    } catch (error) {
      dispatch(
        setAlertData({
          open: true,
          message: "Unable to fetch docs !",
          severity: "error",
        }),
      );
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [daoAddress, depositConfig?.uploadDocId]);

  useEffect(() => {
    fetchTokenDetails();
  }, [daoAddress, networkId, walletAddress]);

  useEffect(() => {
    const fetchSubgraphData = async () => {
      try {
        const imageUrl = await getUploadedNFT(daoAddress?.toLowerCase());
        if (imageUrl?.data.length) {
          setImgUrl(imageUrl?.data[0]?.imageUrl);
        } else {
          const imageUrl = await getImageURL(clubData?.imgUrl);
          setImgUrl(imageUrl);
        }
      } catch (error) {
        dispatch(
          setAlertData({
            open: true,
            message: "Unable to fetch data from subgraph !",
            severity: "error",
          }),
        );
        console.log(error);
      }
    };

    if (daoAddress) {
      fetchSubgraphData();
    }
  }, [clubData?.imgUrl, daoAddress, networkId]);

  useEffect(() => {
    if (daoAddress) {
      fetchActivities();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (new Date(day2).getTime() / 1000 >= new Date(day1).getTime() / 1000) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1, daoDetails?.depositDeadline]);

  return (
    <>
      <PublicPageLayout
        clubData={clubData}
        tokenDetails={tokenDetails}
        headerProps={{
          contractData: clubData,
          deadline: daoDetails?.depositDeadline,
          tokenDetails: tokenDetails,
          isDeposit: true,
          isActive: active,
          networkId: routeNetworkId,
        }}
        inputComponents={
          <DepositInputComponents
            depositPreRequisitesProps={{
              uploadedDocInfo: uploadedDocInfo,
              daoAddress: daoAddress,
              onIsSignedChange: handleIsSignedChange,
              onIsW8BenSignedChange: handleIsW8BenSignedChange,
            }}
            mintProps={{
              claimNFTHandler,
              clubData,
              count,
              hasClaimed,
              remainingDays,
              remainingTimeInSecs,
              setCount,
              balanceOfNft,
              isEligibleForTokenGating,
              isTokenGated,
              whitelistUserData,
              isSigned,
              isW8BenSigned,
              isSignable,
              approveERC721Handler,
              allowanceValue,
              tokenDetails,
              networkId,
              userBalance: tokenDetails?.userBalance,
              routeNetworkId,
            }}
          />
        }
        socialData={clubInfo}
        imgUrl={imgUrl}
        isDeposit={true}
        bio={clubInfo?.bio}
        eligibilityProps={{
          gatedTokenDetails: gatedTokenDetails,
          isDeposit: true,
          isTokenGated: isTokenGated,
          isWhitelist: whitelistUserData?.setWhitelist,
        }}
        members={members}
        isSuccessfull={claimSuccessfull}
        loading={loading}
        nftMinted={daoDetails?.nftMinted}
      />

      {claimSuccessfull ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Minted DAO's NFT successfully."
          isError={false}
          onClose={() => {
            setClaimSuccessfull(false);
          }}
          buttonText="Go to Dashboard"
          onButtonClick={() => {
            router.push(`/dashboard/${daoAddress}/${networkId}?join=true`);
          }}
        />
      ) : failed ? (
        <StatusModal
          heading={"Something went wrong"}
          subheading="Looks like we hit a bump here, try again?"
          isError={true}
          onClose={() => {
            setFailed(false);
          }}
          buttonText="Try Again?"
          onButtonClick={() => {
            setFailed(false);
          }}
        />
      ) : null}

      {/* {!isMetamaskPresent ? (
        <Modal className={classes.warningModal}>
          <div className={classes.image}>
            <Image
              src={"/assets/images/astronaut3.png"}
              height={200}
              width={200}
              alt="No wallet found"
            />
          </div>
          <Typography className={classes.heading} variant="inherit">
            Uh oh, we currently do not support this browser!
          </Typography>

          <Typography className={classes.subheading} variant="inherit">
            Please open this link on a supported browser like Google
            Chrome/Brave or inside a mobile wallets like Metamask.
          </Typography>
        </Modal>
      ) : null} */}
    </>
  );
};

export default ERC721;
