import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import React from "react";
import classes from "./Navbar.module.scss";

const Navbar = () => {
  return (
    <nav className={classes.nav}>
      <div className={classes["wallet-div"]}>
        <Web3NetworkSwitch className={classes.switch} />
        <Web3Button />
      </div>
    </nav>
  );
};

export default Navbar;
