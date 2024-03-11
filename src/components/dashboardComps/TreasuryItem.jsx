import { Typography } from "@mui/material";
import Image from "next/image";
import classes from "./Dashboard.module.scss";
import { addTokenToWallet } from "utils/walletHelper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const TreasuryItem = ({
  containerClass,
  iconSrc,
  altText,
  title,
  value,
  isOwnership = false,
}) => {
  const router = useRouter();
  const params = router.asPath.split("/");

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  return (
    <div className={containerClass}>
      <div className={classes.treasury}>
        <div className={classes.imgContainer}>
          <Image src={iconSrc} height={22} width={25} alt={altText} />
        </div>
        <div>
          <Typography className={classes.title} variant="inherit">
            {title}
            {isOwnership && clubData.tokenType === "erc20" ? (
              <Image
                onClick={() =>
                  addTokenToWallet(params[2], clubData.symbol, clubData.imgUrl)
                }
                alt="metamask logo"
                src={"/assets/icons/metamask.png"}
                height={24}
                width={24}
                title="Add governance token to your wallet"
              />
            ) : (
              ""
            )}
          </Typography>
          <Typography className={classes.value} variant="inherit">
            {value} {!isOwnership ? "" : "%"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TreasuryItem;
