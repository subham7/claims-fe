import { makeStyles } from "@mui/styles";

export const AdditionalSettingsStyles = makeStyles({
  container: {
    background: "#142243",
    marginLeft: "130px",
    width: "65%",
    borderRadius: "12px",
    padding: "50px 30px",
    display: "flex",
    flexDirection: "column",
    marginBottom: "40px",
  },
  heading: {
    fontSize: "30px",
    marginBottom: "30px",
    marginLeft: "20px",
  },
  iconColor: {
    fontSize: "18px",
    color: "#C1D3FF",
  },

  valuesStyle: {
    fontSize: "21px",
    fontWeight: "normal",
    fontFamily: "Whyte",
  },
  link: {
    "color": "#3B7AFD",
    "textDecoration": "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
  },
  text: {
    fontSize: "21px",
    fontWeight: "normal",
    fontFamily: "Whyte",
  },
});
