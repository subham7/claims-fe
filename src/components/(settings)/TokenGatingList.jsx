import React, { useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import TokenGatingInput from "./TokenGatingInput";
import { RxCross2 } from "react-icons/rx";

const dummyArr = [""];

const TokenGatingList = () => {
  const [newArr, setNewArr] = useState(dummyArr);

  return (
    <div className={classes.treasurySignerContainer}>
      {newArr.map((item, index) => (
        <div key={index} className={classes.copyTextContainer}>
          <TokenGatingInput
            setAddressArray={setNewArr}
            key={index}
            addresses={newArr}
            index={index}
          />
          <RxCross2
            onClick={() => {
              const list = [...newArr];
              list.splice(index, 1);
              setNewArr([...list]);
            }}
            className={classes.icon}
          />
        </div>
      ))}

      <button
        onClick={() => {
          setNewArr([...newArr, ""]);
        }}>
        Add +
      </button>
    </div>
  );
};

export default TokenGatingList;
