import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import classes from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div
        onClick={() => {
          window.open("https://stationx.network", "_blank");
        }}
        className={classes.logoContainer}>
        {/* <Typography className={classes.powered}>Powered by</Typography> */}
        {/* <Image
          src={"/assets/images/logo.png"}
          height={15}
          width={75}
          alt="StationX"
        /> */}
      </div>
      <div className={classes.linksContainer}>
        <Link target="_blank" href={"https://stationx.network"}>
          About
        </Link>
        <Link target="_blank" href={"https://stationxnetwork.gitbook.io/docs"}>
          Help
        </Link>

        <div className={classes.socialsContainer}>
          <Image
            onClick={() => {
              window.open("https://warpcast.com/~/channel/stationx", "_blank");
            }}
            src={"/assets/icons/warpcastFooter.png"}
            height={25}
            width={25}
            alt="StationX"
          />
          <Image
            onClick={() => {
              window.open("https://twitter.com/stationxnetwork", "_blank");
            }}
            src={"/assets/icons/xFooter.png"}
            height={25}
            width={25}
            alt="StationX"
          />
          <Image
            onClick={() => {
              window.open("https://t.me/StationXnetwork", "_blank");
            }}
            src={"/assets/icons/telegramFooter.png"}
            height={25}
            width={25}
            alt="StationX"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
