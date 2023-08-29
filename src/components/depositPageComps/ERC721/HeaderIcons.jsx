import React from "react";
import { BiLogoTelegram } from "react-icons/bi";
import styles from "./ERC721.module.scss";
import { FaDiscord, FaTwitter } from "react-icons/fa";
// import { TbWorld } from "react-icons/tb";

const HeaderIcons = ({ clubInfo }) => {
  return (
    <>
      {/* <TbWorld size={32} className={styles.icons} /> */}

      {clubInfo?.telegram && (
        <BiLogoTelegram
          size={32}
          className={styles.icons}
          onClick={() => {
            window.open(clubInfo?.telegram, "_blank");
          }}
        />
      )}

      {clubInfo?.discord && (
        <FaDiscord
          size={32}
          className={styles.icons}
          onClick={() => {
            window.open(clubInfo?.discord, "_blank");
          }}
        />
      )}

      {clubInfo?.twitter && (
        <FaTwitter
          size={32}
          className={styles.icons}
          onClick={() => {
            window.open(clubInfo?.twitter, "_blank");
          }}
        />
      )}
    </>
  );
};

export default HeaderIcons;
