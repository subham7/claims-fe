import Image from "next/image";
import React from "react";
import classes from "./Spaces.module.scss";

const socialData = [
  {
    name: "Warpcast",
    imageUrl: "/assets/socials/warpcast.png",
    redirectUrl: "https://warpcast.com/todd",
  },
  {
    name: "X",
    imageUrl: "/assets/socials/x.png",
    redirectUrl: "https://warpcast.com/todd",
  },
  {
    name: "Telegram",
    imageUrl: "/assets/socials/telegram.png",
    redirectUrl: "https://warpcast.com/todd",
  },
  {
    name: "Share",
    imageUrl: "/assets/socials/share.png",
    redirectUrl: "https://warpcast.com/todd",
  },
];

const Socials = () => {
  return (
    <div className={classes.socials}>
      {socialData.map((item) => (
        <Image
          key={item.name}
          src={item.imageUrl}
          alt={item.name}
          height={30}
          width={30}
          style={{
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
};

export default Socials;
