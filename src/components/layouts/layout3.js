import React from "react";

import Navbar3 from "../navbar3";

export default function Layout3(props) {
  return (
    <>
      <Navbar3 faucet={props.faucet} />
      <>{props.children}</>
    </>
  );
}
