import { React } from "react";
import {
  Card,
  Grid,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  emphasize,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import StarIcon from "@mui/icons-material/Star";

const useStyles = makeStyles({
  image: {
    width: "70%",
  },
  linearGradientBackground: {
    width: "100%",
    height: "60%",
    background:
      "transparent linear-gradient(120deg, #17326A 0%, #19274B 51%, #3D2652 100%) 0% 0% no-repeat padding-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: "1.2vw",
    fontFamily: "Whyte",
    color: "#F5F5F5",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  subheading: {
    fontSize: "1.0vw",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    fontWeight: "normal",
  },
  contractCards: {
    "borderRadius": "10px 10px 0px 0px",
    "padding": 0,
    "width": "25vw",
    "height": "45vh",
    "&:hover": {
      cursor: "pointer",
      background:
        "transparent linear-gradient(133deg, #0ABB92 0%, #3B7AFD 100%) 0% 0% no-repeat padding-box",
    },
  },
  contractCardsInactive: {
    "borderRadius": "10px 10px 0px 0px",
    "padding": 0,
    "width": "25vw",
    "height": "45vh",
    "&:hover, &:focus": {
      cursor: "pointer",
    },
  },
  linearGradientBackgroundInactive: {
    "width": "100%",
    "height": "60%",
    "background":
      "transparent linear-gradient(120deg, #17326A 0%, #19274B 51%, #3D2652 100%) 0% 0% no-repeat padding-box",
    "display": "flex",
    "justifyContent": "center",
    "alignItems": "center",
    "&:hover, &:focus": {
      cursor: "pointer",
    },
  },
});

export default function ContractCard(props) {
  const { contractHeading, contractSubHeading, contractImage, star, inactive } =
    props;
  const classes = useStyles();
  if (!inactive) {
    return (
      <Card className={classes.contractCards}>
        <div className={classes.linearGradientBackground}>
          <CardMedia
            className={classes.image}
            component="img"
            alt="contract-image"
            image={contractImage}
          />
        </div>

        <CardContent>
          <Typography gutterBottom component="div" className={classes.heading}>
            {contractHeading}
            {star ? <StarIcon sx={{ color: "#FFB74D" }} /> : <></>}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            className={classes.subheading}
          >
            {contractSubHeading}
          </Typography>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className={classes.contractCardsInactive}>
        <div className={classes.linearGradientBackgroundInactive}>
          <CardMedia
            className={classes.image}
            component="img"
            alt="contract-image"
            image={contractImage}
          />
        </div>

        <CardContent>
          <Typography gutterBottom component="div" className={classes.heading}>
            {contractHeading}
            {star ? <StarIcon sx={{ color: "#FFB74D" }} /> : <></>}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            className={classes.subheading}
          >
            {contractSubHeading}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}
