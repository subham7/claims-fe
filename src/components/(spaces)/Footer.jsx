import Image from "next/image";
import Link from "next/link";
import React from "react";
import classes from "./Spaces.module.scss";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className={classes.footer}>
      <div className={classes.topContainer}>
        <div className={classes.linksContainer}>
          <img
            src="/assets/images/logo.png"
            height={20}
            width={120}
            alt="monogram"
            onClick={() => {
              router.push("/");
            }}
            style={{ cursor: "pointer" }}
          />
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
