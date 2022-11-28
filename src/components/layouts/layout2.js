import React from "react";

import Navbar from "../navbar";

export default function Layout2(props) {
  return (
    <>
      <Navbar />
      <>{props.children}</>
    </>
  );
}
