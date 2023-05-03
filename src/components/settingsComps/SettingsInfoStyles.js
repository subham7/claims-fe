import { makeStyles } from "@mui/styles";

export const SettingsInfoStlyes = makeStyles({
    valuesStyle: {
      fontSize: "21px",
      fontWeight: "normal",
      fontFamily: "Whyte",
    },
    valuesDimStyle: {
      fontSize: "21px",
      color: "#C1D3FF",
      fontFamily: "Whyte",
    },
    cardRegular: {
      borderRadius: "10px",
      opacity: 1,
    },
    dimColor: {
      color: "#C1D3FF",
    },
    connectWalletButton: {
      backgroundColor: "#3B7AFD",
      fontSize: "21px",
      fontFamily: "Whyte",
    },
    depositButton: {
      backgroundColor: "#3B7AFD",
      width: "208px",
      height: "60px",
      fontSize: "21px",
      fontFamily: "Whyte",
    },
    cardSmall: {
      backgroundColor: "#111D38",
      borderRadius: "20px",
      opacity: 1,
    },
    cardSmallFont: {
      fontFamily: "Whyte",
      fontSize: "18px",
      color: "#C1D3FF",
    },
    cardLargeFont: {
      "width": "150px",
      "fontSize": "38px",
      "fontWeight": "bold",
      "fontFamily": "Whyte",
      "color": "#F5F5F5",
      "borderColor": "#142243",
      "borderRadius": "0px",
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
      "& input[type=number]::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        "margin": 0,
      },
      "& input[type=number]::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        "margin": 0,
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
      fontFamily: "Whyte",
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
      backgroundColor: " #3B7AFD",
      fontSize: "20px",
      fontFamily: "Whyte",
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
      fontFamily: "Whyte",
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
      "color": "#3B7AFD",
      "textDecoration": "none",
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
      backgroundColor: "#111D38",
      width: "95%",
    },
  });