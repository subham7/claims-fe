import React, { useState } from "react";
import classes from "./Spaces.module.scss";
import Tabs from "./Tabs/Tabs";
import SpacesHeader from "./SpacesHeader";
import { Typography } from "@mui/material";
import Socials from "./Socials";
import Erc20Card from "./Cards/Erc20Card";
import Erc721Card from "./Cards/Erc721Card";

const dummyData = [
  {
    depositToken: "USDC",
    imageUrl: "/assets/spaces/stationXBanner.png",
    raiseAmount: "200,000",
    stationName: "StationX",
  },
  {
    depositToken: "USDC",
    imageUrl: "/assets/spaces/memefiBanner.png",
    raiseAmount: "100,000",
    stationName: "MemeFi",
  },
  {
    depositToken: "USDC",
    imageUrl: "/assets/spaces/zerolendBanner.png",
    raiseAmount: "200,000",
    stationName: "ZeroLend",
  },
  {
    depositToken: "USDC",
    imageUrl: "/assets/spaces/logxBanner.png",
    raiseAmount: "50,000",
    stationName: "LogX",
  },
];

const dummyDataErc721 = [
  {
    depositToken: "USDC",
    imageUrl: "/assets/images/NFT1.png",
    minted: "89,123",
    stationName: "DeFi Explorer #1",
    price: "32",
  },
  {
    depositToken: "ETH",
    imageUrl: "/assets/images/NFT2.png",
    minted: "89,123",
    stationName: "DeFi Explorer #2",
    price: "0.4",
  },
  {
    depositToken: "ETH",
    imageUrl: "/assets/images/NFT2.png",
    minted: "89,123",
    stationName: "DeFi Explorer #3",
    price: "0.5",
  },
];

const Spaces = () => {
  const [activeTab, setActiveTab] = useState("ERC20");

  return (
    <div className={classes.spacesContainer}>
      <SpacesHeader />
      <div className={classes.stationsContainer}>
        <div className={classes.header}>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <Socials />
        </div>

        <Typography
          variant="inherit"
          color={"white"}
          fontSize={20}
          fontWeight={700}
          my={4}>
          Featured Stations
        </Typography>

        <div className={classes.erc20List}>
          {activeTab === "ERC20" ? (
            <>
              {dummyData.map((item) => (
                <Erc20Card
                  depositToken={item.depositToken}
                  imageUrl={item.imageUrl}
                  raiseAmount={item.raiseAmount}
                  stationName={item.stationName}
                  key={item.stationName}
                />
              ))}
            </>
          ) : (
            <>
              {dummyDataErc721.map((item) => (
                <Erc721Card
                  depositToken={item.depositToken}
                  imageUrl={item.imageUrl}
                  stationName={item.stationName}
                  key={item.stationName}
                  mintedAmount={item.minted}
                  price={item.price}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spaces;
