import Image from "next/image";
import classes from "./Spaces.module.scss";
import Link from "next/link";

const Socials = ({ spaceData }) => {
  return (
    <div className={classes.socials}>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#8B5CF6",
        }}
        href={spaceData?.links?.warpcast ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/warpcast.svg"
          alt="farcaster"
          width={20}
          height={20}
        />
      </Link>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#24A1DE",
        }}
        href={spaceData?.links?.telegram ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/telegram.svg"
          alt="telegram"
          width={20}
          height={20}
        />
      </Link>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#000",
        }}
        href={spaceData?.links?.twitter ?? ""}
        target="_blank"
        passHref>
        <Image src="/assets/socials/x.svg" alt="x" width={20} height={20} />
      </Link>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#5865F2",
        }}
        href={spaceData?.links?.discord ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/discord.svg"
          alt="x"
          width={20}
          height={20}
        />
      </Link>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          background:
            "linear-gradient(120deg, #f9ce34 0%, #ee2a7b 75%, #6228d7 100%)",
        }}
        href={spaceData?.links?.instagram ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/instagram.svg"
          alt="x"
          width={20}
          height={20}
        />
      </Link>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#FF6101",
        }}
        href={spaceData?.links?.reddit ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/reddit.svg"
          alt="x"
          width={20}
          height={20}
        />
      </Link>
      <Link
        style={{
          width: 40,
          height: 40,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: "#1e1e1e",
        }}
        href={spaceData?.links?.website ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/website.svg"
          alt="website"
          width={20}
          height={20}
        />
      </Link>
    </div>
  );
};

export default Socials;
