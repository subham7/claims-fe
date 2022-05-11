import React from "react"
import { Box } from "@mui/material"
import Layout from "../../src/components/layouts/layout1"
import Tabs from "../../src/components/linkedTabs"

export default function Contribution(props) {
  const data = [
    { href: "/launchpad", label: "Launchpad" },
    { href: "/launchpad/contribution", label: "Contributions" },
  ]

  return <Layout tab={data}>my contribution</Layout>
}
