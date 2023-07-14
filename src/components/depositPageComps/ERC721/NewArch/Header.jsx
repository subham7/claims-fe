import React, { useEffect, useState } from "react";
import classes from "./ERC721.module.scss";
import ERC721Icons from "./ERC721Icons";

const Header = ({ clubData, clubInfo, active, isErc20 = true, deadline }) => {
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

      console.log(+timeDifference);

      if (timeDifference < 0) {
        // Timer has reached or passed the deadline
        timeDifference = 0;
      }

      const seconds = Math.floor(timeDifference % 60);
      const minutes = Math.floor((timeDifference / 60) % 60);
      const hours = Math.floor((timeDifference / (60 * 60)) % 24);
      const days = Math.floor(timeDifference / (24 * 60 * 60));

      setTimer({ days, hours, minutes, seconds });

      console.log(days, hours, minutes);
    };

    // Update the timer every second
    const timerInterval = setInterval(updateTimer, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerInterval);
  }, [deadline]);

  return (
    <>
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
        <p className={classes.createdBy}>
          {`${clubData?.ownerAddress?.slice(
            0,
            5,
          )}...${clubData?.ownerAddress?.slice(-5)}`}
        </p>

        <ERC721Icons clubInfo={clubInfo} />
      </div>
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
  );
};

export default Header;
