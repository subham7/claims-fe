import React from "react"

import Navbar3 from "../navbar3"

export default function Layout3(props) {
  return (
    <>
      <Navbar3 />
      <>{props.children}</>
    </>
  )
}
