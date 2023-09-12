import ProgressBar from "@components/progressbar";
import Button from "@components/ui/button/Button";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import {
  queryAllDropsTransactionsFromSubgraph,
  queryDropDetailsFromSubgraph,
} from "utils/dropsSubgraphHelper";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { useAccount, useNetwork } from "wagmi";
import classes from "./NewClaim.module.scss";
import { MetaMaskAvatar } from "react-metamask-avatar";
import useDropsContractMethods from "hooks/useDropsContracMethods";
import { Skeleton } from "@mui/material";
import useClaimSmartContracts from "hooks/useClaimSmartContracts";
import { getUserProofAndBalance } from "api/claims";

const NewClaim = ({ claimAddress }) => {
  const [claimsData, setClaimsData] = useState();
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({
    tokenDecimal: 0,
    tokenSymbol: "",
    tokenAddress: "",
    whitelistTokenSymbol: "",
    whitelistTokenDecimal: 1,
  });
  const [activityDetails, setActivityDetails] = useState({
    claimedAmt: "",
    address: "",
  });
  const [isClaimActive, setIsClaimActive] = useState(false);
  const [hasDropStarted, setHasDropStarted] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [isEligibleForTokenGated, setIsEligibleForTokenGated] = useState(false);
  const [dropsData, setDropsData] = useState();
  const [claimedPercentage, setClaimedPercentage] = useState(0);
  const [maxClaimableAmount, setMaxClaimableAmount] = useState(0);

  const currentTime = Date.now() / 1000;
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const { getDecimals, getTokenSymbol, approveDeposit, getBalance } =
    useCommonContractMethods();

  const { claimSettings, claimBalance, claimAmount, claim } =
    useDropsContractMethods();

  useClaimSmartContracts(claimAddress);

  const fetchClaimDetails = async () => {
    setLoading(true);
    try {
      const { claims } = await queryDropDetailsFromSubgraph(
        claimAddress,
        networkId,
      );

      if (claims.length) setClaimsData(claims[0]);

      const tokenDecimal = await getDecimals(claims[0].airdropToken);
      const tokenSymbol = await getTokenSymbol(claims[0].airdropToken);

      let whitelistTokenSymbol;
      let whitelistTokenDecimal = 1;
      try {
        if (
          claims[0].whitelistToken !==
          "0x0000000000000000000000000000000000000000"
        )
          whitelistTokenSymbol = await getTokenSymbol(claims[0].whitelistToken);
        whitelistTokenDecimal = await getDecimals(claims[0].whitelistToken);
      } catch (error) {
        console.log(error);
      }

      setTokenDetails({
        tokenDecimal: tokenDecimal,
        tokenSymbol,
        tokenAddress: claims[0].airdropToken,
        whitelistTokenSymbol: whitelistTokenSymbol,
        whitelistTokenDecimal,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchTransactionActivity = async () => {
    try {
      const { airdrops } = await queryAllDropsTransactionsFromSubgraph(
        claimAddress,
        networkId,
      );
      setActivityDetails(airdrops);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContractData = async () => {
    try {
      const data = await claimSettings();
      setDropsData(data);

      // remaining in contract
      const remainingBalanceInContract = await claimBalance();
      const totalAmountClaimed =
        Number(
          convertFromWeiGovernance(
            data?.claimAmountDetails?.totalClaimAmount,
            tokenDetails?.tokenDecimal,
          ),
        ) -
        Number(
          convertFromWeiGovernance(
            remainingBalanceInContract,
            tokenDetails?.tokenDecimal,
          ),
        );

      const percentageClaimed =
        (totalAmountClaimed /
          Number(
            convertFromWeiGovernance(
              data?.claimAmountDetails?.totalClaimAmount,
              tokenDetails?.tokenDecimal,
            ),
          )) *
        100;
      setClaimedPercentage(percentageClaimed);

      // claimed by user
      const claimedAmt = await claimAmount(walletAddress);
      const isClaimed = claimedAmt > 0;
      setAlreadyClaimed(isClaimed);
    } catch (error) {
      console.log(error);
    }
  };

  const checkDropIsActive = () => {
    if (Number(dropsData?.startTime) > currentTime) {
      setIsClaimActive(false);
      setHasDropStarted(false);
    } else if (Number(dropsData?.endTime) < currentTime) {
      setIsClaimActive(false);
      setHasDropStarted(true);
    } else {
      setIsClaimActive(true);
      setHasDropStarted(true);
    }
  };

  const setClaimAmountByType = async (permission) => {
    try {
      switch (permission) {
        case "0": {
          const whitelistTokenBalance = await getBalance(dropsData?.daoToken);
          if (Number(whitelistTokenBalance) > dropsData?.tokenGatingValue) {
            setIsEligibleForTokenGated(true);
          } else {
            setIsEligibleForTokenGated(false);
          }
          setMaxClaimableAmount(dropsData?.claimAmountDetails[0]);
        }

        case "1": {
          const { amount } = await getUserProofAndBalance(
            dropsData?.merkleRoot,
            walletAddress.toLowerCase(),
          );
          setMaxClaimableAmount(amount);
        }

        case "2": {
          setMaxClaimableAmount(dropsData?.claimAmountDetails[0]);
        }

        case "3": {
          const whitelistTokenBalance = await getBalance(dropsData?.daoToken);
          setIsEligibleForTokenGated(Number(whitelistTokenBalance > 0));
          const { amount } = await getUserProofAndBalance(
            dropsData?.merkleRoot,
            walletAddress.toLowerCase(),
          );
          setMaxClaimableAmount(amount);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkDropIsActive();
  }, [dropsData?.endTime, dropsData?.startTime, currentTime]);

  useEffect(() => {
    if (claimAddress && networkId) {
      fetchClaimDetails();
      fetchTransactionActivity();
      fetchContractData();
    }
  }, [claimAddress, networkId, tokenDetails?.tokenDecimal]);

  useEffect(() => {
    if (dropsData?.permission) {
      setClaimAmountByType(dropsData.permission);
    }
  }, [dropsData?.permission]);

  return (
    <main className={classes.main}>
      <section className={classes.leftContainer}>
        <div>
          <p
            className={`${
              isClaimActive && dropsData?.isEnabled
                ? classes.active
                : classes.inactive
            }`}>
            {isClaimActive && hasDropStarted && dropsData?.isEnabled
              ? "Active"
              : (!isClaimActive && hasDropStarted) || !dropsData?.isEnabled
              ? "Inactive"
              : !isClaimActive && !hasDropStarted && "Not started yet"}
          </p>

          {tokenDetails?.tokenSymbol ? (
            <h1>{tokenDetails?.tokenSymbol}</h1>
          ) : (
            <Skeleton height={70} width={100} />
          )}

          {dropsData ? (
            <p>
              This drop closes on{" "}
              {new Date(+dropsData?.endTime * 1000).toUTCString()}
            </p>
          ) : (
            <Skeleton />
          )}

          <div className={classes.progress}>
            <p>{claimedPercentage}% claimed</p>
            <ProgressBar value={claimedPercentage} />
          </div>

          <div className={classes.inputContainer}>
            <div>
              <input
                name="tokenInput"
                id="tokenInput"
                // onChange={formik.handleChange}
                onWheel={(event) => event.target.blur()}
                autoFocus
                type={"number"}
                placeholder="0"
              />
              <p className={classes.smallFont}>$1322.70</p>
            </div>

            <div className={classes.tokenContainer}>
              {tokenDetails?.tokenSymbol ? (
                <p className={classes.token}>{tokenDetails?.tokenSymbol}</p>
              ) : (
                <Skeleton width={120} height={60} />
              )}

              {maxClaimableAmount && tokenDetails?.tokenDecimal ? (
                <p className={classes.smallFont}>
                  Available:{" "}
                  {convertFromWeiGovernance(
                    maxClaimableAmount,
                    tokenDetails?.tokenDecimal,
                  )}{" "}
                  <span>Max</span>
                </p>
              ) : (
                <Skeleton height={40} width={150} />
              )}
            </div>
          </div>

          <Button className={classes.claim} variant="normal">
            Claim now
          </Button>
        </div>

        <div>
          <div className={classes.socials}>
            <BsTwitter />
            <IoLogoDiscord />
            <BiLogoTelegram />
          </div>
        </div>
      </section>
      <section className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          <Image
            src="/assets/images/newBanner.png"
            height={150}
            width={640}
            alt="Banner Image"
          />

          {claimsData ? (
            <h1>{claimsData?.description}</h1>
          ) : (
            <Skeleton height={60} />
          )}
        </div>

        <div>
          <h3 className={classes.header}>About</h3>
          <p>
            Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of “de Finibus
            Bonorum et Malorum” The standard chunk of Lorem Ipsum used since the
            1500s is reproduced below for those interested. Sections 1.10.32 and
            1.10.33 from “de Finibus Bonorum et Malorum” by Cicero are also
            reproduced in their exact original form, accompanied by English
            versions from the 1914 translation by H. Rackham.
          </p>
        </div>

        <div className={classes.whoCanClaimContainer}>
          <h3 className={classes.header}>Who can claim?</h3>

          <div>
            {claimsData ? (
              <h4>
                {claimsData?.claimType === "0"
                  ? `${convertFromWeiGovernance(
                      claimsData?.minWhitelistTokenValue,
                      tokenDetails.whitelistTokenDecimal,
                    )} ${tokenDetails.whitelistToken}`
                  : claimsData?.claimType === "1"
                  ? "Allowlisted users only"
                  : claimsData?.claimType === "2"
                  ? "Everyone"
                  : "Pro-rata"}
              </h4>
            ) : (
              <Skeleton height={40} width={140} />
            )}

            {claimsData ? (
              <p>
                {claimsData?.claimType === "2"
                  ? `Upto ${Number(
                      convertFromWeiGovernance(
                        claimsData?.maxClaimableAmount,
                        tokenDetails?.tokenDecimal,
                      ),
                    )} ${
                      tokenDetails.tokenSymbol
                    } on first-come first serve basis.`
                  : claimsData?.claimType === "1"
                  ? "Only allowlisted users by the creator can claim from this drop."
                  : claimsData?.claimType === "0"
                  ? "Hold these token(s) to participate in this drop."
                  : "This drop is pro-rata gated"}
              </p>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>

        <div>
          <h3 className={classes.header}>Activity</h3>

          <div className={classes.activities}>
            {activityDetails.length ? (
              activityDetails?.map((activity, index) => (
                <div className={classes.activity} key={index}>
                  <div>
                    {/* <Image
                    src={`/assets/NFT_IMAGES/${Math.floor(
                      Math.random() * 11,
                    )}.png`}
                    height={25}
                    width={25}
                    alt="icon"
                  /> */}
                    <MetaMaskAvatar address={activity?.claimerAddress} />
                    <p>{`${activity?.claimerAddress.slice(
                      0,
                      7,
                    )}....${activity?.claimerAddress.slice(-7)}`}</p>
                  </div>
                  <p>
                    {convertFromWeiGovernance(
                      activity?.amountClaimed,
                      tokenDetails.tokenDecimal,
                    )}{" "}
                    <span>{tokenDetails?.tokenSymbol}</span>
                  </p>
                </div>
              ))
            ) : (
              <p>No activities as of now!</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewClaim;
