import React from "react"

import Navbar2 from "../navbar2"

export default function Layout3(props) {
  return (
    <>
      <Navbar2 />
      <>{props.children}</>
    </>
  )
}
