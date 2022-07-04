import { React } from "react"
import { Card, Grid, CardActions, CardContent, CardMedia, Typography, Stack } from "@mui/material"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles({
  netamount: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#0ABB92",
  }
});

export default function CollectionCard(props) {
  const classes = useStyles()
  const { imageURI, tokenName, tokenSymbol } = props
  return (
    <Card sx={{ maxWidth: "17.968vw", padding: 0, }}>
      <CardMedia
        variant="collectionImage"
        component="img"
        alt="green iguana"
        image={imageURI}
      />
      <CardContent>
        <Typography gutterBottom component="div" variant="cardFont1">
          {tokenName}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm container>
            <Stack>
                <Typography variant="cardFont2">Floor Price</Typography>
                <Typography variant="cardFont1">2.5 {tokenSymbol}</Typography>
                <Typography variant="cardFont2">(5993.2 USD)</Typography>
            </Stack>
          </Grid>
            <Grid item xs={12} sm container>
              <Stack>
                <Typography variant="cardFont2">Net returns</Typography>
                <Typography className={classes.netamount}>+ $1272</Typography>
              </Stack>
            </Grid>

        </Grid>
    </CardContent>
    </Card>
  );
}