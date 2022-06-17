import { React } from "react"
import { Card, Grid, CardActions, CardContent, CardMedia, Typography, Stack } from "@mui/material"
import { makeStyles } from "@mui/styles"
import StarIcon from '@mui/icons-material/Star';

const useStyles = makeStyles({
  image: {
    width: "332px",
    height: "206px",
  },
  linearGradientBackground: {
    width: "529px",
    height: "70%",
    background: "transparent linear-gradient(120deg, #17326A 0%, #19274B 51%, #3D2652 100%) 0% 0% no-repeat padding-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: "21px",
    color: "#F5F5F5",
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  subheading: {
    fontSize: "22px",
    color: "#C1D3FF",
    fontWeight: "normal",
  },
  contractCards: {
    borderRadius: "10px 10px 0px 0px",
    padding: 0,
    width: "529px",
    height: "466px",
    "&:hover": {
      cursor: "pointer",
    },
  }
});

export default function ContractCard(props) {
  const { contractHeading, contractSubHeading, contractImage, star } = props
  const classes = useStyles()
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
        <Typography gutterBottom variant="h6" component="div" className={classes.heading}>
          {contractHeading}{star ? <StarIcon sx={{ color: "#FFB74D" }} /> : <></>}
        </Typography>
        <Typography gutterBottom component="div" className={classes.subheading}>
          {contractSubHeading}
        </Typography>
      </CardContent>
    </Card>
  );
}