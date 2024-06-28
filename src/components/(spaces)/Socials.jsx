import Image from "next/image";
import classes from "./Spaces.module.scss";
import Link from "next/link";

const Socials = ({ spaceData }) => {
  const socialPlatforms = [
    {
      key: "warpcast",
      backgroundColor: "#8B5CF6",
      imageSrc: "/assets/socials/warpcast.svg",
      alt: "farcaster",
    },
    {
      key: "telegram",
      backgroundColor: "#24A1DE",
      imageSrc: "/assets/socials/telegram.svg",
      alt: "telegram",
    },
    {
      key: "twitter",
      backgroundColor: "#000",
      imageSrc: "/assets/socials/x.svg",
      alt: "x",
    },
    {
      key: "discord",
      backgroundColor: "#5865F2",
      imageSrc: "/assets/socials/discord.svg",
      alt: "discord",
    },
    {
      key: "instagram",
      background:
        "linear-gradient(120deg, #f9ce34 0%, #ee2a7b 75%, #6228d7 100%)",
      imageSrc: "/assets/socials/instagram.svg",
      alt: "instagram",
    },
    {
      key: "reddit",
      backgroundColor: "#FF6101",
      imageSrc: "/assets/socials/reddit.svg",
      alt: "reddit",
    },
    {
      key: "website",
      backgroundColor: "#1e1e1e",
      imageSrc: "/assets/socials/website.svg",
      alt: "website",
    },
  ];
  return (
    <div className={classes.socials}>
      {socialPlatforms.map((platform) => {
        const link = spaceData?.links?.[platform.key];
        if (!link) return null;

        const style = {
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          ...(platform.backgroundColor
            ? { backgroundColor: platform.backgroundColor }
            : {}),
          ...(platform.background ? { background: platform.background } : {}),
        };

        return (
          <Link
            key={platform.key}
            style={style}
            href={link}
            target="_blank"
            passHref>
            <Image
              src={platform.imageSrc}
              alt={platform.alt}
              width={20}
              height={20}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;
