import DepositProgress from "@components/depositPageComps/ERC20/DepositProgress";
import Image from "next/image";
import React from "react";
import classes from "../claims/Claim.module.scss";
import About from "./About";
import Activity from "./Activity";
import BackdropLoader from "./BackdropLoader";
import CustomAlert from "./CustomAlert";
import Eligibility from "./Eligibility";
import Header from "./Header";
import SocialButtons from "./SocialButtons";

const PublicPageLayout = ({
  clubData,
  tokenDetails,
  headerProps,
  inputComponents,
  socialData,
  eligibilityProps,
  message,
  isSuccessfull,
  loading,
  isDeposit,
  showMessage,
  bio,
  imgUrl,
  claimDescription,
  members,
  nftMinted,
}) => {
  return (
    <div className={classes.main}>
      <div className={classes.leftContainer}>
        <div>
          <Header {...headerProps} />
          {inputComponents}
        </div>
        <SocialButtons data={socialData} />
      </div>

      <div className={classes.rightContainer}>
        <div className={classes.bannerContainer}>
          {isDeposit && clubData.tokenType === "erc721" ? (
            <div className={classes.nftContainer}>
              {(imgUrl && imgUrl.includes(".mp4")) ||
              imgUrl.includes(".MP4") ? (
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
                  alt="Banner Image"
                  className={classes.nftImage}
                />
              )}
            </div>
          ) : (
            <div className={classes.imageContainer}>
              <Image src={imgUrl} fill alt="Banner Image" />
            </div>
          )}

          {!isDeposit ? <h1>{claimDescription}</h1> : null}
        </div>

        {isDeposit ? (
          <DepositProgress
            clubData={clubData}
            tokenDetails={tokenDetails}
            nftMinted={nftMinted}
          />
        ) : null}

        {bio && <About bio={bio} />}

        {clubData && tokenDetails && <Eligibility {...eligibilityProps} />}

        <Activity
          isDeposit={isDeposit}
          activityDetails={members}
          tokenDetails={tokenDetails}
        />
      </div>

      {showMessage ? (
        <CustomAlert alertMessage={message} severity={isSuccessfull} />
      ) : null}

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default PublicPageLayout;
