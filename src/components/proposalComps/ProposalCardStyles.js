import { makeStyles } from "@mui/styles";

export const ProposalCardStyles = makeStyles({
  proposalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  clubAssets: {
    fontSize: "48px",
    color: "#FFFFFF",
  },
  addButton: {
    width: "11vw",
    height: "60px",
    background: "#2D55FF 0% 0% no-repeat padding-box",
    borderRadius: "10px",
  },
  addButton2: {
    width: "242px",
    height: "60px",
    background: "#2D55FF 0% 0% no-repeat padding-box",
    borderRadius: "10px",
    fontSize: "22px",
  },
  searchField: {
    width: "28.5vw",
    height: "55px",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  allIllustration: {
    width: "12px",
    height: "12px",
    marginRight: "15px",
    backgroundColor: "#2D55FF",
    borderRadius: "50%",
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
    fontSize: "22px",
    color: "#C1D3FF",
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
  },
  cardFont1: {
    fontSize: "24px",
    color: "#EFEFEF",
  },
  actionChip: {
    border: "1px solid #0ABB92",
    background: "transparent",
    textTransform: "capitalize",
    paddingLeft: "8px",
  },
  surveyChip: {
    border: "1px solid #6C63FF",
    background: "transparent",
    textTransform: "capitalize",
    paddingLeft: "8px",
  },
  timeLeftChip: {
    background: "#111D38",
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
  dialogBox: {
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  cardDropDown: {
    width: "340px",
  },
  cardTextBox: {
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  proposalCard: {
    backgroundColor: "#142243",
    padding: 0,
    margin: 0,
  },
  mainCard: {
    borderRadius: "10px",
    border: "1px solid #C1D3FF40",
    backgroundColor: "#142243",
  },
  daysFont: {
    fontSize: "20px",
    color: "#FFFFFF",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#111D38",
    width: "90%",
  },
  banner: {
    width: "100%",
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
