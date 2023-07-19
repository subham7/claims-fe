import React, { useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import HeaderIcons from "./HeaderIcons";
import { RiShareBoxLine } from "react-icons/ri";

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
      <p className={classes.heading}>{clubData?.name}</p>
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

        <HeaderIcons clubInfo={clubInfo} />
      </div>

      {isErc20 ? (
        <>
          <p className={classes.smallText}>
            {isErc20 ? "Deposit Closes in" : "Minting closes in"}
          </p>

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
