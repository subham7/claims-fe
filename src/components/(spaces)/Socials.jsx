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
          backgroundColor: "#1e1e1e",
        }}
        href={spaceData?.links?.website ?? ""}
        target="_blank"
        passHref>
        <Image
          src="/assets/socials/share.svg"
          alt="website"
          width={20}
          height={20}
        />
      </Link>
    </div>
  );
};

export default Socials;
