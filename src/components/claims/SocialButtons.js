import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import classes from "./Claim.module.scss";

const SocialButtons = ({ data }) => {
  return (
    <div>
      <div className={classes.socials}>
        {data?.socialLinks?.twitter && (
          <BsTwitter
            onClick={() => {
              window.open(data?.socialLinks?.twitter, "_blank");
            }}
          />
        )}

        {data?.socialLinks?.discord && (
          <IoLogoDiscord
            onClick={() => {
              window.open(data?.socialLinks?.discord, "_blank");
            }}
          />
        )}

        {data?.socialLinks?.telegram && (
          <BiLogoTelegram
            onClick={() => {
              window.open(data?.socialLinks?.telegram, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SocialButtons;
