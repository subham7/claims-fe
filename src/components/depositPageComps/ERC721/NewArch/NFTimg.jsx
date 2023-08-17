import React from "react";
import classes from "./ERC721.module.scss";

const NFTimg = ({ imgUrl }) => {
  return (
    <div className={classes.rightContainer}>
      {imgUrl && (
        <>
          {imgUrl.includes(".mp4") || imgUrl.includes(".MP4") ? (
            <video className={classes.nftImg} loop autoPlay muted>
              <source src={imgUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={imgUrl} alt="nft image" className={classes.nftImg} />
          )}
        </>
      )}
    </div>
  );
};

export default NFTimg;
