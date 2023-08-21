import { React } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import StarIcon from "@mui/icons-material/Star";

const useStyles = makeStyles({
  image: {
    width: "70%",
  },
  linearGradientBackground: {
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: "1.2vw",

    color: "#F5F5F5",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  subheading: {
    fontSize: "1.0vw",

    color: "#C1D3FF",
    fontWeight: "normal",
  },
  contractCards: {
    borderRadius: "10px 10px 0px 0px",
    padding: 0,
    width: "25vw",
    height: "45vh",
    "&:hover": {
      cursor: "pointer",
      background:
        "transparent linear-gradient(133deg, #0ABB92 0%, #3B7AFD 100%) 0% 0% no-repeat padding-box",
    },
  },
  contractCardsInactive: {
    borderRadius: "10px 10px 0px 0px",
    padding: 0,
    width: "25vw",
    height: "45vh",
    "&:hover, &:focus": {
      cursor: "pointer",
    },
  },
  linearGradientBackgroundInactive: {
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover, &:focus": {
      cursor: "pointer",
    },
  },
});

export default function ContractCard(props) {
  const {
    contractHeading,
    contractSubHeading,
    contractImage,
    star,
    inactive,
    backgroundColour,
    comingSoonEnabled,
  } = props;
  const classes = useStyles();
  if (!inactive) {
    return (
      <Card className={classes.contractCards}>
        <div
          className={classes.linearGradientBackground}
          style={{ backgroundColor: backgroundColour }}>
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
            className={classes.subheading}>
            {contractSubHeading}
          </Typography>
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card className={classes.contractCardsInactive}>
        <div
          className={classes.linearGradientBackgroundInactive}
          style={{ backgroundColor: backgroundColour }}>
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
            {comingSoonEnabled ? (
              <>
                {" "}
                <Box
                  sx={{ color: "#6475A3" }}
                  fontWeight="Normal"
                  display="inline">
                  (Coming soon)
                </Box>
              </>
            ) : null}
            {star ? <StarIcon sx={{ color: "#FFB74D" }} /> : <></>}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            className={classes.subheading}>
            {contractSubHeading}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}
