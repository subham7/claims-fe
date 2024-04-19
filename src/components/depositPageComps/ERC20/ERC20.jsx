import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  queryLatestMembersFromSubgraph,
  queryStationDataFromSubgraph,
} from "utils/stationsSubgraphHelper";
import dayjs from "dayjs";
import DepositInput from "./DepositInput";
import { useFormik } from "formik";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import * as yup from "yup";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useAccount } from "wagmi";
import DepositDetails from "./DepositDetails";
import { getDocumentsByClubId } from "api/document";
import PublicPageLayout from "@components/common/PublicPageLayout";
import DepositPreRequisites from "../DepositPreRequisites";
import { CHAIN_CONFIG } from "utils/constants";
import { whitelistOnDeposit } from "api/invite/invite";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import { useRouter } from "next/router";
import { setAlertData } from "redux/reducers/alert";
import { getPublicClient } from "utils/viemConfig";
import { formatEther } from "viem";
import { isNative } from "utils/helper";
import { addClubData } from "redux/reducers/club";
import Modal from "@components/common/Modal/Modal";
import Image from "next/image";
import { Typography } from "@mui/material";
import classes from "@components/modals/StatusModal/StatusModal.module.scss";
import { BigNumber } from "bignumber.js";
import { getClubData } from "api/club";
import { verifyWithZkMeServices } from "@zkmelabs/widget";

const DepositInputComponents = ({
  formik,
  tokenDetails,
  isDepositDisabled,
  clubData,
  depositPreRequisitesProps,
  approveERC20Handler,
  allowanceValue,
  routeNetworkId,
  daoAddress,
}) => {
  return (
    <>
      <DepositPreRequisites {...depositPreRequisitesProps} />
      <DepositInput
        routeNetworkId={routeNetworkId}
        formik={formik}
        tokenDetails={tokenDetails}
        isDisabled={isDepositDisabled}
        approveERC20Handler={approveERC20Handler}
        allowanceValue={allowanceValue}
        daoAddress={daoAddress}
      />
      <DepositDetails />
    </>
  );
};

const ERC20 = ({
  clubInfo,
  daoAddress,
  remainingClaimAmount,
  daoDetails,
  isEligibleForTokenGating,
  isTokenGated,
  whitelistUserData,
  networkId,
  gatedTokenDetails,
  depositConfig,
  allowanceValue,
  fetchCurrentAllowance,
  fetchErc20ContractDetails,
  routeNetworkId,
  isMetamaskPresent,
}) => {
  const [loading, setLoading] = useState(false);
  const [depositSuccessfull, setDepositSuccessfull] = useState(null);
  const [failed, setFailed] = useState(null);
  const [active, setActive] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    userBalance: 0,
    isNativeToken: false,
  });
  const [members, setMembers] = useState([]);
  const [uploadedDocInfo, setUploadedDocInfo] = useState({});
  const [isSigned, setIsSigned] = useState(false);
  const [isW8BenSigned, setIsW8BenSigned] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const { approveDeposit, getBalance } = useCommonContractMethods({
    routeNetworkId,
  });
  const publicClient = getPublicClient(networkId);

  const { buyGovernanceTokenERC20DAO } = useAppContractMethods({
    daoAddress,
  });
  const { address: walletAddress } = useAccount();

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);
  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");

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
      console.error(error);
    }
  };

  const handleIsSignedChange = (newValue) => {
    setIsSigned(newValue);
  };

  const handleIsW8BenSignedChange = (newValue) => {
    setIsW8BenSigned(newValue);
  };

  const minValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(
        Number(clubData?.minDepositAmountFormatted?.formattedValue),
        "Amount should be greater than min deposit",
      )
      .lessThan(
        tokenDetails.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        Number(clubData?.maxDepositAmountFormatted?.formattedValue),
        "Amount should be less than max deposit",
      ),
  });

  const remainingValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(0.0000001, "Amount should be greater than min deposit")
      .lessThan(
        tokenDetails?.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        remainingClaimAmount,
        "Amount should be less than remaining deposit amount",
      ),
  });

  const approveERC20Handler = async () => {
    setLoading(true);
    try {
      await approveDeposit(
        CHAIN_CONFIG[networkId].usdcAddress,
        CHAIN_CONFIG[networkId].factoryContractAddress,
        formik.values.tokenInput,
        tokenDetails?.tokenDecimal,
      );

      fetchCurrentAllowance();
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
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      tokenInput: 0,
    },
    validationSchema:
      remainingClaimAmount === undefined ? minValidation : remainingValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const inputValue = convertToWeiGovernance(
          values.tokenInput,
          clubData?.depositTokenDecimal,
        );

        await buyGovernanceTokenERC20DAO(
          convertToWeiGovernance(
            BigNumber(inputValue)
              .dividedBy(clubData?.pricePerTokenFormatted?.bigNumberValue)
              .toString(),
            18,
          ),
          whitelistUserData?.proof ? whitelistUserData.proof : [],
          clubData.depositTokenAddress.toLowerCase() ===
            CHAIN_CONFIG[networkId].nativeToken.toLowerCase()
            ? inputValue
            : "0",
        );

        await whitelistOnDeposit(walletAddress);

        setTimeout(() => {
          fetchTokenDetails();
          fetchActivities();
          fetchErc20ContractDetails();
          fetchStationData();
        }, 500);

        setLoading(false);
        setDepositSuccessfull(true);
        formik.values.tokenInput = 0;
      } catch (error) {
        console.error(error);
        setFailed(true);
        setLoading(false);
      }
    },
  });

  const fetchTokenDetails = async () => {
    try {
      const depositTokenAddress = clubData.depositTokenAddress;
      const isNativeToken = isNative(
        clubData.depositTokenAddress,
        routeNetworkId,
      );

      const decimals = clubData.depositTokenDecimal;
      const symbol = clubData.depositTokenSymbol;
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
        tokenDecimal: decimals,
        userBalance: userBalance,
        isNativeToken: isNativeToken,
      });
    } catch (error) {
      dispatch(
        setAlertData({
          open: true,
          message: "Unable to fetch token details!",
          severity: "error",
        }),
      );
      console.error(error);
    }
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
          message: "Unable to fetch docs!",
          severity: "error",
        }),
      );
      console.error(error);
    }
  };

  const getKycSetting = async () => {
    try {
      const response = await getClubData(daoAddress);
      if (response) {
        if (response?.kyc?.isKycEnabled) {
          const results = await verifyWithZkMeServices(
            response?.kyc?.zkmeAppId,
            walletAddress,
          );
          setIsVerified(results);
        } else {
          setIsVerified(true);
        }
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const isDepositDisabled = () => {
    // if (
    //   typeof isSigned !== "undefined" &&
    //   typeof isW8BenSigned !== "undefined"
    // ) {
    //   if (!isSigned) return true;
    //   if (!isW8BenSigned) return true;
    // }

    if (!isVerified) {
      return true;
    }

    const isRemainingTimeInvalid =
      remainingDays < 0 || remainingTimeInSecs <= 0;

    if (isRemainingTimeInvalid) return true;
    else if (isTokenGated && !isEligibleForTokenGating) return true;
    else if (+clubData?.raiseAmount <= +clubData?.totalAmountRaised)
      return true;
    else if (+remainingClaimAmount <= 0) return true;
    else if (
      whitelistUserData?.setWhitelist === true &&
      whitelistUserData?.proof === null
    )
      return true;
    else if (formik.values.tokenInput === 0) return true;
    else if (Number(tokenDetails.userBalance) === 0) return true;
    else if (Number(tokenDetails.userBalance) < formik.values.tokenInput)
      return true;
    else if (formik.errors.tokenInput) return true;
    else return false;
  };

  useEffect(() => {
    fetchDocs();
  }, [daoAddress, depositConfig?.uploadDocId]);

  useEffect(() => {
    fetchTokenDetails();
    getKycSetting();
  }, [networkId, walletAddress]);

  useEffect(() => {
    if (daoAddress) {
      fetchActivities();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (day2 >= day1) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [day2, day1]);

  return (
    <>
      <PublicPageLayout
        clubData={clubData}
        tokenDetails={tokenDetails}
        headerProps={{
          daoAddress: daoAddress,
          contractData: clubData,
          deadline: daoDetails?.depositDeadline,
          tokenDetails: tokenDetails,
          isDeposit: true,
          isActive: active,
          networkId: routeNetworkId,
          logoUrl: clubInfo?.logoUrl,
          routeNetworkId,
        }}
        inputComponents={
          <DepositInputComponents
            routeNetworkId={routeNetworkId}
            clubData={clubData}
            formik={formik}
            approveERC20Handler={approveERC20Handler}
            allowanceValue={allowanceValue}
            isDepositDisabled={isDepositDisabled()}
            tokenDetails={tokenDetails}
            daoAddress={daoAddress}
            depositPreRequisitesProps={{
              uploadedDocInfo: uploadedDocInfo,
              daoAddress: daoAddress,
              onIsSignedChange: handleIsSignedChange,
              onIsW8BenSignedChange: handleIsW8BenSignedChange,
            }}
          />
        }
        socialData={clubInfo}
        isDeposit={true}
        bio={clubInfo?.bio}
        imgUrl={clubInfo?.bannerImage}
        eligibilityProps={{
          gatedTokenDetails: gatedTokenDetails,
          isDeposit: true,
          isTokenGated: isTokenGated,
          isWhitelist: whitelistUserData?.setWhitelist,
          routeNetworkId,
        }}
        members={members}
        loading={loading}
      />

      {depositSuccessfull ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="You have deposited successfully."
          isError={false}
          onClose={() => {
            setDepositSuccessfull(false);
          }}
          buttonText="Go to Dashboard"
          onButtonClick={() => {
            router.push(`/dashboard/${daoAddress}/${networkId}?join=true`);
          }}
          isErc20={true}
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

      {!isMetamaskPresent && walletAddress && routeNetworkId !== networkId ? (
        <Modal className={classes.warningModal}>
          <div className={classes.image}>
            <Image
              src={"/assets/images/astronaut3.png"}
              height={200}
              width={200}
              alt={`Change network`}
            />
          </div>
          <Typography className={classes.heading} variant="inherit">
            Switch to {CHAIN_CONFIG[routeNetworkId]?.shortName}!
          </Typography>

          <Typography className={classes.subheading} variant="inherit">
            Please switch to {CHAIN_CONFIG[routeNetworkId]?.shortName} from your
            phone&apos;s wallet to access deposit.
          </Typography>
        </Modal>
      ) : null}
    </>
  );
};

export default ERC20;
