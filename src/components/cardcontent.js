import { React, useEffect, useState } from "react";
import {
  Card,
  Grid,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Stack,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  netamount: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#0ABB92",
  },
});

export default function CollectionCard(props) {
  const classes = useStyles();
  const { metadata, tokenName, tokenSymbol, nftData } = props;

  const jsonString = nftData.metadata;
  const jsonObject = JSON.parse(jsonString);

  const imgUrl = jsonObject.image;

  return (
    <>
      <Card sx={{ maxWidth: "350px", maxHeight: "519px", padding: 0 }}>
        <CardMedia
          variant="collectionImage"
          component="img"
          alt="green iguana"
          sx={{ width: "340px", height: "320px" }}
          image={imgUrl}
        />

        <CardContent>
          <Typography
            fontSize={28}
            gutterBottom
            component="div"
            variant="cardFont1"
          >
            {tokenName}
          </Typography>
          <Grid container spacing={4}></Grid>
        </CardContent>
      </Card>
    </>
  );
}
