import { Typography } from "@mui/material";
import Image from "next/image";
import classes from "./Dashboard.module.scss";
import { addTokenToWallet } from "utils/walletHelper";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";

const TreasuryItem = ({
  containerClass,
  iconSrc,
  altText,
  title,
  value,
  isOwnership = false,
  loading,
}) => {
  const router = useRouter();
  const params = router.asPath.split("/");

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });
  return (
    <>
      {loading ? (
        <CustomSkeleton
          marginTop={"20px"}
          width={"100%"}
          height={105}
          length={1}
        />
      ) : (
        <div className={containerClass}>
          <div className={classes.treasury}>
            <div>
              <Typography className={classes.title} variant="inherit">
                {title}
                {isOwnership && clubData.tokenType === "erc20" ? (
                  <Image
                    onClick={() =>
                      addTokenToWallet(
                        params[2],
                        clubData.symbol,
                        clubData.imgUrl,
                      )
                    }
                    alt="metamask logo"
                    src={"/assets/icons/metamask.png"}
                    height={24}
                    width={24}
                    title={`Add $${clubData?.symbol} token to your wallet`}
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
      )}
    </>
  );
};

export default TreasuryItem;
