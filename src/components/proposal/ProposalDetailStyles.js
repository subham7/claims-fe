import { makeStyles } from "@mui/styles";

export const ProposalDetailStyles = makeStyles((theme) => ({
  clubAssets: {
    fontSize: "42px",
    color: "#FFFFFF",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: "15px",
  },
  passedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
    marginRight: "15px",
  },
  executedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#F75F71",
    borderRadius: "50%",
    marginRight: "15px",
  },
  failedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#D55438",
    borderRadius: "50%",
    marginRight: "15px",
  },
  listFont: {
    fontSize: "20px",
    color: "#dcdcdc",
  },
  listFont2: {
    fontSize: "18px",
    color: "#dcdcdc",
  },
  cardFont1: {
    fontSize: "18px",
    color: "#EFEFEF",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  successfulMessageText: {
    fontSize: "28px",
    color: "#EFEFEF",
  },
  mainCard: {
    borderRadius: "38px",
    border: "1px solid #dcdcdc40;",
    backgroundColor: "#151515",
  },
  mainCardSelected: {
    borderRadius: "38px",
    border: "1px solid #FFFFFF;",
    backgroundColor: "#151515",
  },
  mainCardButton: {
    borderRadius: "38px",
    border: "1px solid #dcdcdc40;",
    backgroundColor: "#2D55FF",
    "&:hover": {
      cursor: "pointer",
    },
  },
  mainCardButtonSuccess: {
    borderRadius: "38px",
    fontSize: "50px",
    color: "#0ABB92",
  },
  mainCardButtonError: {
    fontSize: "50px",
    color: "#D55438",
  },
  actionChip: {
    border: "1px solid #0ABB92",
    background: "transparent",
    textTransform: "capitalize",
  },
  surveyChip: {
    border: "1px solid #6C63FF",
    background: "transparent",
    textTransform: "capitalize",
  },
  timeLeftChip: {
    background: theme.palette.background.default,
    borderRadius: "5px",
  },
  cardFontActive: {
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "5px 5px 5px 5px",
  },
  cardFontExecuted: {
    fontSize: "16px",
    backgroundColor: "#F75F71",
    padding: "5px 5px 5px 5px",
  },
  cardFontPassed: {
    fontSize: "16px",
    backgroundColor: "#FFB74D",
    padding: "5px 5px 5px 5px",
  },
  cardFontFailed: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "5px 5px 5px 5px",
  },
  shareOnLens: {
    fontSize: "16px",
    color: "#FFFFFF",
    background: "#8B5BF9",
    cursor: "pointer",
  },
  verticalScroll: {
    overflowY: "scroll",
    maxHeight: "200px",
  },
}));
