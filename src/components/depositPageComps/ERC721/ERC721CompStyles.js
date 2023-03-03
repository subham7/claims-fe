import { makeStyles } from "@mui/styles";

export const ERC721Styles = makeStyles({
  topGrid: {
    paddingLeft: "5em",
    paddingTop: "5em",
    paddingRight: "6em",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  nftImg: {
    height: "450px",
    width: "450px",
    borderRadius: "20px",
  },
  depositActive: {
    background: "#0ABB9240",
    color: "#0ABB92",
    padding: "0.3em 0.5em",
    borderRadius: "0.3em",
    display: "flex",
    alignItems: "center",
  },
  clubName: {
    color: "white",
    fontWeight: "bold",
    width: "100%",
  },
  createdBy: {
    background: "#142243",
    color: "white",
    padding: "0.3em 0.5em",
    borderRadius: "6px",
  },

  quoramTxt: {
    color: "#fff",
    fontWeight: "bold",
  },

  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: 3,
  },

  claimGrid: {
    display: "flex",
    justifyContent: "center",
    border: "1px solid #C1D3FF40",
    borderRadius: "8px",
    alignItems: "center",
    background: "#142243",
    padding: "3em",
  },

  maxTokensTxt: {
    color: "#6475A3",
    fontWeight: "light",
  },

  connectWalletTxtGrid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
