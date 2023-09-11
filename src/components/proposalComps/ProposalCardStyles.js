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
    background: "#0F0F0F",
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
    background: "#0F0F0F 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#151515",
  },
  proposalCard: {
    backgroundColor: "#151515",
    padding: 0,
    margin: 0,
  },
  mainCard: {
    borderRadius: "10px",
    backgroundColor: "#151515",
  },
  daysFont: {
    fontSize: "20px",
    color: "#FFFFFF",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#0F0F0F",
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
