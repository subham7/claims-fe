import classes from "@components/(settings)/Settings.module.scss";
import classNames from "classnames";

const TokenGatingInput = ({ index, addresses, setAddressArray }) => {
  return (
    <div
      style={{
        margin: "4px 0",
      }}
      className={classes.copyTextContainer}>
      <input
        value={addresses[index]}
        onChange={(e) => {
          const address = e.target.value;
          const list = [...addresses];
          list[index] = address;
          setAddressArray(list);
        }}
        placeholder="Contract address"
        className={classNames(classes.input, classes.address)}
      />
      <input
        placeholder="0"
        type="number"
        className={classNames(classes.input, classes.percentage)}
      />
    </div>
  );
};

export default TokenGatingInput;
