import Image from "next/image";
import Link from "next/link";
import React from "react";
import classes from "./Spaces.module.scss";

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
          <Link
            href="https://warpcast.com/stationxnetwork"
            className={classes.social}
            target="_blank"
            passHref>
            <Image
              src="/assets/socials/warpcast.svg"
              alt="farcaster"
              width={15}
              height={15}
            />
          </Link>
          <Link
            href="https://t.me/StationXnetwork"
            className={classes.social}
            target="_blank"
            passHref>
            <Image
              src="/assets/socials/telegram.svg"
              alt="telegram"
              width={15}
              height={15}
            />
          </Link>
          <Link
            href="https://x.com/stationxnetwork"
            className={classes.social}
            target="_blank"
            passHref>
            <Image src="/assets/socials/x.svg" alt="x" width={15} height={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
