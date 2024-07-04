import DepositProgress from "@components/depositPageComps/ERC20/DepositProgress";
import Image from "next/image";
import React from "react";
import classes from "../claims/Claim.module.scss";
import About from "./About";
import Activity from "./Activity";
import BackdropLoader from "./BackdropLoader";
import Eligibility from "./Eligibility";
import Header from "./Header";
import SocialButtons from "./SocialButtons";
import { Typography } from "@mui/material";
import { FaLongArrowAltRight } from "react-icons/fa";

const PublicPageLayout = ({
  clubData,
  tokenDetails,
  headerProps,
  inputComponents,
  socialData,
  eligibilityProps,
  loading,
  isDeposit,
  bio,
  imgUrl,
  claimDescription,
  members,
  nftMinted,
  showRaiseBar,
}) => {
  return (
    <div className={classes.main}>
      <div className={classes.leftContainer}>
        <div>
          <Header {...headerProps} />
          <div className={classes.mainInputComponents}>{inputComponents}</div>
        </div>

        <div className={classes.mainSocials}>
          <SocialButtons data={socialData} />
        </div>

        {clubData && clubData.tokenType === "erc721" ? (
          <></>
        ) : (
          <div className={classes.secondaryInputComponents}>
            {inputComponents}
          </div>
        )}
      </div>

      <div className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          {isDeposit && clubData.tokenType === "erc721" ? (
            <div className={classes.nftContainer}>
              {(imgUrl && imgUrl?.includes(".mp4")) ||
              imgUrl?.includes(".MP4") ? (
                <video
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  loop
                  autoPlay
                  muted>
                  <source src={imgUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={imgUrl}
                  fill
                  alt="NFT Image"
                  className={classes.nftImage}
                />
              )}
            </div>
          ) : (
            imgUrl && (
              <div className={classes.imageContainer}>
                <Image src={imgUrl} fill alt="Banner Image" />
              </div>
            )
          )}

          {!isDeposit ? <h1>{claimDescription}</h1> : null}
        </div>
        {isDeposit && showRaiseBar !== false ? (
          <>
            {isDeposit ? (
              clubData?.tokenType === "erc721" &&
              clubData?.distributionAmountFormatted?.bigNumberValue.isEqualTo(
                0,
              ) ? null : (
                <DepositProgress
                  clubData={clubData}
                  tokenDetails={tokenDetails}
                  nftMinted={nftMinted}
                />
              )
            ) : null}
          </>
        ) : null}

        {clubData && clubData.tokenType === "erc721" && (
          <div className={classes.secondaryInputComponents}>
            {inputComponents}
          </div>
        )}

        {bio && <About bio={bio} />}

        {clubData && tokenDetails && <Eligibility {...eligibilityProps} />}

        <Activity
          isDeposit={isDeposit}
          activityDetails={members}
          tokenDetails={tokenDetails}
        />

        {isDeposit && (
          <div
            onClick={() => {
              window.open("https://app.stationx.network/stations", "_blank");
            }}
            className={classes.createStationDiv}>
            <Typography
              fontSize={20}
              variant="inherit"
              className={classes.createStationText}>
              Create your station
            </Typography>
            <FaLongArrowAltRight color="#2E55FF" />
          </div>
        )}

        {/* For mobile screen */}
        <div className={classes.secondarySocials}>
          <SocialButtons data={socialData} />
        </div>
      </div>

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default PublicPageLayout;
