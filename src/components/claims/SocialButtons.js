import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import classes from "./Claim.module.scss";

const SocialButtons = ({ data, isDeposit }) => {
  console.log("DATA", data);
  return (
    <div>
      <div className={classes.socials}>
        {!isDeposit
          ? data?.socialLinks?.twitter
          : data?.twitter && (
              <BsTwitter
                onClick={() => {
                  window.open(
                    isDeposit ? data?.socialLinks?.twitter : data?.twitter,
                    "_blank",
                  );
                }}
              />
            )}

        {!isDeposit
          ? data?.socialLinks?.discord
          : data?.discord && (
              <IoLogoDiscord
                onClick={() => {
                  window.open(
                    !isDeposit ? data?.socialLinks?.discord : data?.discord,
                    "_blank",
                  );
                }}
              />
            )}

        {!isDeposit
          ? data?.socialLinks?.telegram
          : data?.telegram && (
              <BiLogoTelegram
                onClick={() => {
                  window.open(
                    !isDeposit ? data?.socialLinks?.telegram : data?.telegram,
                    "_blank",
                  );
                }}
              />
            )}
      </div>
    </div>
  );
};

export default SocialButtons;
