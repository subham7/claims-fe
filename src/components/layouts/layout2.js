import React from "react"

import Navbar from "../navbar"

export default function Layout2(props) {
  return (
    <>
      <Navbar />
      <div style={{ padding: "100px 400px" }}>{props.children}</div>
    </>
  )
}
