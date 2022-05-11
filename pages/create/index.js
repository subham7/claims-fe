import React from "react"
import { makeStyles } from "@mui/styles"

import { Grid, Typography, TextField } from "@mui/material"
import Layout2 from "../../src/components/layouts/layout2"
import Stepper from "../../src/components/stepper"

const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
  },
  image: {
    width: "100%",
  },
})

export default function Create(props) {
  const classes = useStyles()

  const steps = ["Add basic info", "Set club rules", "Final step"]

  const step1 = () => {
    return (
      <>
        <Grid container spacing={4}>
          <Grid item md={6}>
            <img className={classes.image} src="/assets/images/hands.png" />
          </Grid>
          <Grid item md={6}>
            <Typography variant="p">What should we call your club?</Typography>
            <br />
            <TextField
              className={classes.textField}
              label="Club name"
              variant="outlined"
            />
            <Typography variant="p">Enter club token symbol</Typography>
            <br />
            <TextField
              className={classes.textField}
              label="Club symbol"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </>
    )
  }

  const step2 = () => {
    return <>Hello2</>
  }

  const step3 = () => {
    return <>Hello3</>
  }

  return (
    <Layout2>
      <Stepper steps={steps} components={[step1(), step2(), step3()]} />
    </Layout2>
  )
}
