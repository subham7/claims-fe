import { makeStyles } from "@mui/styles";

export const AdditionalSettingsStyles = makeStyles({
  container: {
    background: "#151515",
    width: "70%",
    borderRadius: "12px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    marginBottom: "40px",
  },
  heading: {
    fontSize: "24px !important",
    marginBottom: "30px  !important",
    fontFamily: "inherit  !important",
    fontWeight: "500  !important",
  },
  iconColor: {
    fontSize: "18px !important",
    color: "#dcdcdc",
  },
  valuesStyle: {
    fontSize: "20px",
    fontWeight: "normal",
  },
  link: {
    color: "#2D55FF",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
  },
  text: {
    fontSize: "20px",
    fontWeight: "normal",
  },
  valuesDimStyle: {
    fontSize: "20px",
    color: "#dcdcdc",
    fontWeight: "500",
  },
});
