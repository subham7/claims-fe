import { makeStyles } from "@mui/styles";

export const DashboardStyles = makeStyles({
  media: {
    position: "absolute",
    bottom: 0,
  },
  statsDiv: {
    display: "flex",
    flexDirection: "column",
    margin: "0px",
    height: "100%",
    justifyContent: "center",
    marginLeft: "32px",
  },
  firstCard: {
    position: "relative",
    width: "Infinity",
    height: "164px",
    padding: "0px",
    background: "#6A66FF no-repeat",
    variant: "outlined",
  },
  secondCard: {
    position: "relative",
    width: "Infinityvw",
    height: "164px",
    padding: "0px",
    // marginTop: "20px",
    background: "#0ABB92 no-repeat padding-box",
  },
  thirdCard: {
    // width: "22vw",
    // height: "351px",
    background: "#121D38",
    border: ".5px solid #6475A3",
  },
  fifthCard: {
    // width: "22vw",
    // height: "370px",
    background: "#121D38",
    border: ".5px solid #6475A3",
    color: "white",
    position: "relative",
  },
  cardSharp1: {
    backgroundColor: "#121D38",
    borderRadius: "10px",
    opacity: 1,
    width: "100%",
    // height: "370px",
    border: ".5px solid #6475A3",
  },
  cardSharp2: {
    backgroundColor: "#151515",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    opacity: 1,
  },
  card1text1: {
    fontSize: "3.4vh",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text2: {
    fontSize: "2.2vh",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
    paddingLeft: "10px",
  },
  card1text3: {
    fontSize: "14px",
    color: "#C1D3FF",

    opacity: "1",
  },
  card1text4: {
    fontWeight: "bold",
    fontSize: "50px",
    color: "#EFEFEF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card1text5: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card2text1: {
    fontSize: "20px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text2: {
    fontSize: "20px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text3: {
    fontSize: "22px",
    color: "#0ABB92",
    opacity: "1",
  },
  card2text4: {
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text5: {
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text6: {
    fontSize: "18px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card2text7: {
    fontSize: "22px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text8: {
    fontSize: "18px",
    color: "#EFEFEF",
    opacity: "1",
  },
  card2text9: {
    fontSize: "22px",
    color: "#C1D3FF",
    textTransform: "uppercase",
    opacity: "1",
  },
  card3text1: {
    fontSize: "18px",
  },
  card3text2: {
    fontSize: "18px",
    color: "#0ABB92",
  },
  card3text3: {
    width: "354px",
    color: "#C1D3FF",
  },
  card3text4: {
    textAlign: "left",
    fontSize: "6px",
    letteSpacing: "0.2px",
    color: "#C1D3FF",
    opacity: "1",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
  },
  inactiveIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#D55438",
    borderRadius: "50%",
  },
  copyButton: {
    width: "68px",
    height: "30px",
    background: "#2D55FF 0% 0% no-repeat padding-box",
    borderRadius: "15px",
  },
  linkInput: {
    width: "100%",
    color: "#C1D3FF",
    background: "#0F0F0F 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  divider: {
    paddingLeft: "20%",
  },
  clubAssets: {
    fontSize: "42px",
    fontWeight: "400",
    color: "#FFFFFF",
  },
  fourthCard: {
    // width: "22vw",
    background: "#121D38",
    borderRadius: "10px",
    border: ".5px solid #6475A3",
    paddingBottom: "25px",
  },
  pendingIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
  },
  card5text1: {
    fontSize: "16px",
    color: "#C1D3FF",
    opacity: "1",
  },
  card5text2: {
    fontSize: "20px",
    fontWeight: "400",
    color: "#EFEFEF",
  },
  searchField: {
    width: "28.5vw",
    height: "auto",
    color: "#C1D3FF",
    background: "#0F0F0F 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  iconMetroCoin: {
    width: "70%",
  },
  tableheading: {
    color: "#C1D3FF",
    fontSize: "22px",
  },
  tablecontent: {
    fontSize: "22px",
    color: "#F5F5F5",
  },
  tablecontent2: {
    fontSize: "22px",
  },
  membersTitleSmall: {
    fontSize: "24px",
    color: "#FFFFFF",
    backgroundColor: "#19274B",
  },
  banner: {
    width: "100%",
  },
  treasury: {
    width: "100%",
  },
  docimg: {
    marginLeft: "52%",
    width: "80%",
    marginTop: "-9%",
  },
  valueDetailStyle: {
    color: "#81F5FF",
  },
  docs: {
    color: "white",
    textDecoration: "underline",
    fontSize: "18px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  profilePic: {
    marginLeft: "16px",
    borderRadius: "50%",
    textAlign: "center",
  },

  legalEntityDiv: {
    padding: "10px 30px",
    marginTop: "20px",
    borderRadius: "12px",
    background:
      "transparent linear-gradient(108deg, #6C63FF 0%, #0ABB92 100%) 0% 0% no-repeat padding-box",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  legalEntityText: {
    fontSize: "20px",
  },
});
