import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { TbSquareLetterW } from "react-icons/tb";
import { IoLogoDiscord } from "react-icons/io5";
import classes from "../claims/Claim.module.scss";
import { withHttps } from "utils/helper";

const SocialButtons = ({ data }) => {
  const twitterLink = data?.socialLinks?.twitter ?? data?.twitter;
  const telegramLink = data?.socialLinks?.telegram ?? data?.telegram;
  const discordLink = data?.socialLinks?.discord ?? data?.discord;
  const warpcastLink = data?.socialLinks?.warpcast ?? data?.warpcast;

  return (
    <div>
      <div className={classes.socials}>
        {twitterLink && (
          <BsTwitter
            onClick={() => {
              window.open(withHttps(twitterLink), "_blank");
            }}
          />
        )}

        {discordLink && (
          <IoLogoDiscord
            onClick={() => {
              window.open(withHttps(discordLink), "_blank");
            }}
          />
        )}

        {telegramLink && (
          <BiLogoTelegram
            onClick={() => {
              window.open(withHttps(telegramLink), "_blank");
            }}
          />
        )}

        {warpcast && (
          <TbSquareLetterW
            onClick={() => {
              window.open(withHttps(warpcastLink), "_blank");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SocialButtons;
