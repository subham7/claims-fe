import { React, useEffect, useState } from "react";
import { Card, Grid, CardContent, CardMedia, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  netamount: {
    fontSize: "20px",
    color: "#0ABB92",
  },
});

export default function CollectionCard(props) {
  const classes = useStyles();
  const { metadata, tokenName, tokenSymbol, nftData } = props;
  const [imageUrl, setImageUrl] = useState();
  // const json_metadata = JSON.parse(props.token_uri);
  const tokenData = JSON.parse(metadata);

  let jsonData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (props.nftData.token_uri.startsWith("https://ipfs")) {
          const jsonString = nftData.metadata;
          const jsonObject = JSON.parse(jsonString);
          const tokenURI = jsonObject.image;
          let modifiedTokenURI;
          if (
            tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))
          ) {
            let imgUrl = tokenURI?.split("//");
            modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;

            setImageUrl(modifiedTokenURI);
          } else {
            let imgUrl = tokenURI?.split("/");
            if (imgUrl[3] === undefined) {
              modifiedTokenURI = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/",
              );
              setImageUrl(modifiedTokenURI);
            } else {
              modifiedTokenURI = `https://ipfs.io/ipfs/${imgUrl[2]}/${imgUrl[3]}`;
              setImageUrl(modifiedTokenURI);
            }
          }
        } else {
          const response = await fetch(props.nftData.token_uri);
          const data = await response.json();
          const fetchedImageUrl = data.image;
          setImageUrl(fetchedImageUrl);
        }
      } catch (error) {
        // Handle any errors that occurred during the fetch request
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Card sx={{ maxWidth: "350px", maxHeight: "519px", padding: 0 }}>
        {imageUrl?.substring(imageUrl?.lastIndexOf(".")) === ".mp4" ? (
          <video controls src={imageUrl} width="340" height="320" />
        ) : (
          <CardMedia
            variant="collectionImage"
            component="img"
            alt="green iguana"
            sx={{ width: "340px", height: "320px" }}
            image={imageUrl ? imageUrl : "/assets/NFT_IMAGES/0.png"}
          />
        )}

        <CardContent>
          <Typography
            fontSize={28}
            gutterBottom
            component="div"
            variant="cardFont1">
            {nftData.name}
          </Typography>
          <Grid container spacing={4}></Grid>
        </CardContent>
      </Card>
    </>
  );
}
