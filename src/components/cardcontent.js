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
  const [image, setImage] = useState("");

  const tokenURI = nftData?.token_uri;

  const fetchData = async () => {
    if (tokenURI.length)
      if (
        tokenURI?.startsWith("ipfs") ||
        tokenURI?.startsWith("data") ||
        tokenURI?.startsWith("Qm")
      ) {
        const res = await fetch(`https://ipfs.io/ipfs/${tokenURI}`);
        const data = await res.json();
        setImage(data?.image);
      } else if (tokenURI?.startsWith("https")) {
        const res = await fetch(tokenURI);
        const data = await res.json();
        setImage(data?.image);
      }
  };

  useEffect(() => {
    fetchData();
  }, [tokenURI]);

  return (
    <>
      {/* {image.length ? ( */}
      <Card sx={{ maxWidth: "350px", maxHeight: "519px", padding: 0 }}>
        <CardMedia
          variant="collectionImage"
          component="img"
          alt="green iguana"
          sx={{ width: "340px", height: "320px" }}
          image={
            image?.startsWith("https") || image?.startsWith("data")
              ? image
              : image?.startsWith("Qm")
              ? image?.replace("Qm", "https://ipfs.io/ipfs/Qm")
              : image?.replace("ipfs://", "https://ipfs.io/ipfs/")
          }
        />

        {/* <MediaRenderer src={tokenURI?} alt="A mp4 video" /> */}
        {/* <IpfsImage hash={tokenURI?}></IpfsImage> */}
        <CardContent>
          <Typography
            fontSize={28}
            gutterBottom
            component="div"
            variant="cardFont1"
          >
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
      {/* ) : null} */}
    </>
  );
}
