import { Typography } from "@mui/material";
import Image from "next/image";
import classes from "./Dashboard.module.scss";

const TreasuryItem = ({
  containerClass,
  iconSrc,
  altText,
  title,
  value,
  tokenName = "",
  tokenType,
  isOwnership = false,
}) => (
  <div className={containerClass}>
    <div className={classes.treasury}>
      <div className={classes.imgContainer}>
        <Image src={iconSrc} height={22} width={25} alt={altText} />
      </div>
      <div>
        <Typography className={classes.title} variant="inherit">
          {title}
        </Typography>
        <Typography className={classes.value} variant="inherit">
          {value} {tokenType === "erc721" || !isOwnership ? "" : "%"}
          {tokenName && tokenType === "erc721" && (
            <span className={classes.title}>${tokenName}</span>
          )}
        </Typography>
      </div>
    </div>
  </div>
);

export default TreasuryItem;
