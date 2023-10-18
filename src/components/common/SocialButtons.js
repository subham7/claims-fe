import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import classes from "../claims/Claim.module.scss";

const SocialButtons = ({ data }) => {
  const twitterLink = data?.socialLinks?.twitter ?? data?.twitter;
  const telegramLink = data?.socialLinks?.telegram ?? data?.telegram;
  const discordLink = data?.socialLinks?.discord ?? data?.discord;

  return (
    <div>
      <div className={classes.socials}>
        {twitterLink && (
          <BsTwitter
            onClick={() => {
              window.open(twitterLink, "_blank");
            }}
          />
        )}

        {discordLink && (
          <IoLogoDiscord
            onClick={() => {
              window.open(discordLink, "_blank");
            }}
          />
        )}

        {telegramLink && (
          <BiLogoTelegram
            onClick={() => {
              window.open(telegramLink, "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SocialButtons;