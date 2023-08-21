import { makeStyles } from "@mui/styles";

export const NewArchERC20Styles = makeStyles({
  root: {
    "& .MuiFilledInput-root": {
      background: "rgb(232, 241, 250)",
    },
  },
  valuesStyle: {
    fontSize: "20px",
  },
  valuesDimStyle: {
    fontSize: "20px",
    color: "#C1D3FF",
  },
  cardRegular: {
    backgroundColor: "#19274B",
    borderRadius: "10px",
    opacity: 1,
  },
  cardJoin: {
    backgroundColor: "#19274A",
    borderRadius: "10px",
    opacity: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  dimColor: {
    color: "#C1D3FF",
  },
  cardSmall: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    opacity: 1,
  },
  cardSmallFont: {
    fontSize: "18px",
    color: "#111D38",
  },
  JoinText: {
    color: "#fff",

    fontSize: "20px",
    fontWeight: "bold",
  },
  textPara: {
    color: "#fff",

    fontSize: "16px",
    fontWeight: "lighter",
  },
  cardLargeFont: {
    width: "300px",
    fontSize: "2em",
    fontWeight: "bold",
    // "fontFamily": "Whyte",
    borderColor: "#142243",
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
    color: "#3B7AFD",
    background: "#fff",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    borderColor: "#111D38",
    opacity: 1,
    border: "1px solid #C1D3FF",
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
    paddingTop: "1px",
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
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  dialogBox: {
    fontSize: "28px",
  },
});
