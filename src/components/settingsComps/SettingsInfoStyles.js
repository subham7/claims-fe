import { makeStyles } from "@mui/styles";

export const SettingsInfoStlyes = makeStyles({
  icon: {
    marginRight: "0.5rem",
  },
  valuesStyle: {
    fontSize: "20px",
    fontWeight: "normal",
  },
  valuesDimStyle: {
    fontSize: "22px",
    color: "#C1D3FF",
  },
  cardRegular: {
    borderRadius: "10px",
    opacity: 1,
  },
  dimColor: {
    color: "#C1D3FF",
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
    backgroundColor: "#0F0F0F",
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontSize: "18px",
    color: "#C1D3FF",
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
    paddingTop: "5px",
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
    color: "#C1D3FF",
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
    backgroundColor: "#19274B",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#0F0F0F",
    width: "95%",
  },
});
