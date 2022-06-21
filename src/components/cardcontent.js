import { React } from "react"
import { Card, Grid, CardActions, CardContent, CardMedia, Typography, Stack } from "@mui/material"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles({
  image: {
    width:"100%"
  },
  heading: {
    fontSize: "21px",
    color: "#F5F5F5",
  },
  subheading: {
    fontSize: "15px",
    color: "#767676",
  },
  netamount: {
    fontSize: "21px",
    color: "#0ABB92",
  }
});

export default function CollectionCard() {
  const classes = useStyles()
  return (
    <Card sx={{ maxWidth: "17.968vw" }}>
      <CardMedia
        className={classes.image}
        component="img"
        alt="green iguana"
        image="/assets/images/ape.png"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" className={classes.heading}>
          Cryptopunk #8651
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm container>
            <Stack>
                <Typography className={classes.subheading}>Floor Price</Typography>
                <Typography className={classes.heading}>2.5 ETH</Typography>
                <Typography className={classes.subheading}>(5993.2 USD)</Typography>
            </Stack>
          </Grid>
            <Grid item xs={12} sm container>
              <Stack>
                <Typography className={classes.subheading}>Net returns</Typography>
                <Typography className={classes.netamount}>+ $1272</Typography>
              </Stack>
            </Grid>

        </Grid>
    </CardContent>
    </Card>
  );
}