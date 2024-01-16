import { makeStyles } from "@mui/styles";

export const SettingsInfoStlyes = makeStyles((theme) => ({
  heading: {
    fontSize: "28px !important",
    fontWeight: "600 !important",
  },
  subHeading: {
    fontSize: "20px !important",
    fontWeight: "400 !important",
    color: "#d3d3d3",
  },
  icon: {
    marginRight: "0.5rem",
  },
  valuesStyle: {
    fontSize: "20px",
    fontWeight: "normal",
  },
  valuesDimStyle: {
    fontSize: "16px",
    color: "#dcdcdc",
    fontWeight: "500",
  },
  cardRegular: {
    borderRadius: "10px",
    opacity: 1,
  },
  dimColor: {
    color: "#dcdcdc",
  },
  connectWalletButton: {
    backgroundColor: "#2D55FF",
    fontSize: "20px",
  },
  depositButton: {
    backgroundColor: "#2D55FF",
    width: "208px",
    height: "60px",
    fontSize: "20px",
  },
  cardSmall: {
    backgroundColor: theme.palette.background.default,
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontSize: "18px",
    color: "#dcdcdc",
  },
  cardLargeFont: {
    width: "150px",
    fontSize: "38px",
    fontWeight: "bold",

    color: "#F5F5F5",
    borderColor: "#151515",
    borderRadius: "0px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontSize: "14px",
  },
  maxTag: {
    borderRadius: "17px",
    width: "98px",
    height: "34px",
    opacity: "1",
    padding: "10px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: " #2D55FF",
    fontSize: "20px",
  },
  openTag: {
    width: "60px",
    height: "20px",
    borderRadius: "11px",
    opacity: "1",
    padding: "10px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0ABB9233",
  },
  openTagFont: {
    padding: "5px 0",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#0ABB92",
    opacity: "1",
  },
  closeTag: {
    width: "60px",
    height: "20px",
    borderRadius: "11px",
    opacity: "1",
    padding: "10px",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFB74D0D",
  },
  closeTagFont: {
    padding: "1px",
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#FFB74D",
    opacity: "1",
  },
  iconColor: {
    color: "#dcdcdc",
  },
  activityLink: {
    color: "#2D55FF",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
      cursor: "pointer",
    },
  },
  dialogBox: {
    fontSize: "26px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#151515",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: theme.palette.background.default,
    width: "95%",
  },
}));
