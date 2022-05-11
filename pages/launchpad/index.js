import React from "react"
import Layout from "../../src/components/layouts/layout1"
import Tabs from "../../src/components/linkedTabs"
import Card from "../../src/components/card"
import TextField from "../../src/components/textfield"
import { Grid, Button } from "@mui/material"

import Web3 from "web3"
import { Web3Adapter } from "@gnosis.pm/safe-core-sdk"

export default async function Launchpad(props) {
  const ethAdapterOwner1 = new Web3Adapter({
    Web3,
    signerAddress: await owner1.getAddress(),
  })

  const data = [
    { href: "/launchpad", label: "Launchpad" },
    { href: "/launchpad/contribution", label: "Contributions" },
  ]

  return (
    <Layout tab={data}>
      <div style={{ display: "inline-flex" }}>
        <TextField style={{ padding: "0" }} />
        <Button>Filter</Button>
        <Button>Sort by</Button>
      </div>

      <br />
      <br />

      <Button>Create Safe</Button>

      {/* <Grid container spacing={4}>
        <Grid item xs={4}>
          <Card />
        </Grid>
        <Grid item xs={4}>
          <Card />
        </Grid>
        <Grid item xs={4}>
          <Card />
        </Grid>
        <Grid item xs={4}>
          <Card />
        </Grid>
        <Grid item xs={4}>
          <Card />
        </Grid>
        <Grid item xs={4}>
          <Card />
        </Grid>
      </Grid> */}
    </Layout>
  )
}
