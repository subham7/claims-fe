import { React } from "react";
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
  // console.log("tokenName", props);
  const classes = useStyles();
  const { metadata, tokenName, tokenSymbol } = props;
  const json_metadata = JSON.parse(metadata);
  console.log(json_metadata.image);
  const tokenURI = json_metadata.image;

  let modifiedTokenURI;
  if (tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))) {
    let imgUrl = tokenURI?.split("//");
    modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;
    // console.log("imgUrl, ", `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`);
  } else {
    let imgUrl = tokenURI?.split("/");
    if (imgUrl[3] === undefined) {
      modifiedTokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      console.log(modifiedTokenURI);
    } else {
      modifiedTokenURI = `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`;
      // console.log("imgUrl, ", `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`);
    }
  }

  return (
    <Card sx={{ maxWidth: "17.968vw", padding: 0 }}>
      <CardMedia
        variant="collectionImage"
        component="img"
        alt="green iguana"
        image={modifiedTokenURI}
      />
      {/* <MediaRenderer src={tokenURI} alt="A mp4 video" /> */}
      {/* <IpfsImage hash={tokenURI}></IpfsImage> */}
      <CardContent>
        <Typography gutterBottom component="div" variant="cardFont1">
          {tokenName}
        </Typography>
        <Grid container spacing={4}>
          {/* <Grid item xs={12} sm container>
            <Stack>
              <Typography variant="cardFont2">Floor Price</Typography>
              <Typography variant="cardFont1">2.5 {tokenSymbol}</Typography>
              <Typography variant="cardFont2">(5993.2 USD)</Typography>
            </Stack>
          </Grid> */}
          {/* <Grid item xs={12} sm container>
            <Stack>
              <Typography variant="cardFont2">Net returns</Typography>
              <Typography className={classes.netamount}>+ $1272</Typography>
            </Stack>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
}
