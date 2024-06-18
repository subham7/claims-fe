import Image from "next/image";
import Link from "next/link";
import React from "react";
import classes from "./Spaces.module.scss";
import { Typography } from "@mui/material";
import { FaArrowTrendUp } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.topContainer}>
        <div className={classes.linksContainer}>
          <Image
            src="/assets/images/monogram.png"
            height="28"
            width="28"
            alt="monogram"
            onClick={() => {
              router.push("/");
            }}
            style={{ cursor: "pointer" }}
          />

          <Link href={"/"}>What&apos;s New</Link>
          <Link href={"/"}>About</Link>
          <Link href={"/"}>Help</Link>
        </div>

        <div className={classes.socials}>
          <Image
            src={"/assets/socials/warpcast_dark.png"}
            height={25}
            width={25}
            alt="Warpcast"
          />

          <Image
            src={"/assets/socials/telegram_dark.png"}
            height={25}
            width={25}
            alt="telegram"
          />

          <Image
            src={"/assets/socials/x_dark.png"}
            height={25}
            width={25}
            alt="x"
          />
        </div>
      </div>

      <div className={classes.createSpaceContainer}>
        <Typography
          fontSize={16}
          variant="inherit"
          className={classes.createStationText}>
          Create a space with StationX
        </Typography>
        <FaArrowTrendUp color="#2E55FF" />
      </div>
    </footer>
  );
};

export default Footer;
