import React, { useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import HeaderIcons from "./HeaderIcons";
import { RiShareBoxLine } from "react-icons/ri";
import { MdIosShare } from "react-icons/md";
import { Menu, MenuItem } from "@mui/material";
import LensterShareButton from "@components/LensterShareButton";
import { Typography } from "@components/ui";
import { TwitterShareButton } from "react-twitter-embed";

const Header = ({
  clubData,
  clubInfo,
  active,
  isErc20 = true,
  deadline,
  daoAddress,
}) => {
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const updateTimer = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      let timeDifference = +deadline - currentTime;

      if (timeDifference < 0) {
        // Timer has reached or passed the deadline
        timeDifference = 0;
      }

      const seconds = Math.floor(timeDifference % 60);
      const minutes = Math.floor((timeDifference / 60) % 60);
      const hours = Math.floor((timeDifference / (60 * 60)) % 24);
      const days = Math.floor(timeDifference / (24 * 60 * 60));

      setTimer({ days, hours, minutes, seconds });
    };

    // Update the timer every second
    const timerInterval = setInterval(updateTimer, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerInterval);
  }, [deadline]);

  return (
    <div>
      <Typography variant="heading">{clubData?.name}</Typography>
      <div className={classes.flexContainer}>
        {active ? (
          <p className={classes.isActive}>
            <span className={classes.activeIllustration}></span>
            Active
          </p>
        ) : (
          <p className={classes.isInactive}>
            <span className={classes.executedIllustration}></span>
            Finished
          </p>
        )}
        <div
          onClick={() => {
            window.open(
              `https://polygonscan.com/address/${daoAddress}`,
              "_blank",
            );
          }}
          className={classes.createdBy}>
          <p>{`${daoAddress?.slice(0, 5)}...${daoAddress?.slice(-5)}`}</p>
          <RiShareBoxLine size={16} />
        </div>

        <div>
          <MdIosShare
            size={35}
            className={classes.icons}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem>
              <LensterShareButton
                daoAddress={daoAddress}
                daoName={clubData?.name}
              />
            </MenuItem>
            <MenuItem>
              {" "}
              <TwitterShareButton
                onLoad={function noRefCheck() {}}
                options={{
                  size: "large",
                  text: `Just joined ${clubData?.name} Station on `,
                  via: "stationxnetwork",
                }}
                url={`${window.location.origin}/join/${daoAddress}`}
              />
            </MenuItem>
          </Menu>
        </div>

        <HeaderIcons clubInfo={clubInfo} />
      </div>

      {isErc20 ? (
        <>
          <Typography variant="info">
            {isErc20 ? "Deposit Closes in" : "Minting closes in"}
          </Typography>

          <div className={classes.timer}>
            <p>{timer.days}</p>
            <p>{timer.hours}</p>
            <p>{timer.minutes}</p>
            <p>{timer.seconds}</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Header;
