import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { IoLogoDiscord } from "react-icons/io5";
import { IoShareOutline } from "react-icons/io5";
import { TbSquareLetterW } from "react-icons/tb";
import classes from "../claims/Claim.module.scss";

const SocialButtons = ({ data, shareLink }) => {
  const warpcast = data?.socialLinks?.warpcast ?? data?.warpcast;
  const twitterLink = data?.socialLinks?.twitter ?? data?.twitter;
  const telegramLink = data?.socialLinks?.telegram ?? data?.telegram;
  const discordLink = data?.socialLinks?.discord ?? data?.discord;

  const copyHandler = () => {
    navigator.clipboard.writeText(`${window.location.origin}${shareLink}`);
    alert("Copied to clipboard!");
  };

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

        {warpcast && (
          <TbSquareLetterW
            onClick={() => {
              window.open(warpcast, "_blank");
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

        {shareLink && <IoShareOutline onClick={copyHandler} />}
      </div>
    </div>
  );
};

export default SocialButtons;
