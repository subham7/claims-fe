import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import classes from "./ERC721.module.scss";
import { TbWorld } from "react-icons/tb";

const ERC721Icons = ({ clubInfo }) => {
  return (
    <>
      <TbWorld size={30} className={classes.icons} />

      {clubInfo?.telegram && (
        <BiLogoTelegram
          size={30}
          className={classes.icons}
          onClick={() => {
            window.open(clubInfo?.telegram, "_blank");
          }}
        />
      )}

      {clubInfo?.discord ? (
        <FaDiscord
          size={30}
          className={classes.icons}
          onClick={() => {
            window.open(clubInfo?.discord, "_blank");
          }}
        />
      ) : null}

      {clubInfo?.twitter && (
        <FaTwitter
          size={30}
          className={classes.icons}
          onClick={() => {
            window.open(clubInfo?.twitter, "_blank");
          }}
        />
      )}
    </>
  );
};

export default ERC721Icons;
