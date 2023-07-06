import { makeStyles } from "@mui/styles";

export const ClaimsStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "90vh",
    color: "white",
    margin: "0 auto",
  },

  lefContainer: {
    width: "630px",
    padding: "10px",
    flex: 0.4,
  },

  heading: {
    fontSize: "40px",
    fontWeight: "400",
    margin: 0,
  },

  activeContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    padding: "10px 0",
  },

  active: {
    background: "#0ABB9240",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "#0ABB92",
  },

  inactive: {
    background: "#F75F71",
    padding: "10px 20px",
    borderRadius: "10px",
    // color: "",
  },

  airdropContainer: {
    display: "flex",
    gap: "50px",
    marginTop: "10px",
  },

  createdBy: {
    background: "#142243",
    padding: "10px 10px",
    color: "#C1D3FF",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    margin: 0,
  },
  claimCloses: {
    color: "#C1D3FF",
    fontSize: "18px",
    fontWeight: "300",
    margin: "10px 0",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
  },
  para: {
    color: "#C1D3FF",
    fontSize: "16px",
    marginBottom: "8px",
    // padding: 0,
  },
  label: {
    margin: 0,
    padding: 0,
  },
  address: {
    color: "white",
  },

  rightContainer: {
    flex: 0.3,
    width: "600px",
    padding: "60px",
    borderRadius: "20px",
    color: "white",
    background: "#142243",
  },

  claimContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 20px",
    border: "0.5px solid #6475A3",
    borderRadius: "12px",
  },
  amount: {
    fontSize: "24px",
    fontWeight: "400",
    padding: 0,
    margin: 0,

    // margin:
  },

  btn: {
    width: "130px",
    fontFamily: "sans-serif",
    fontSize: "16px",
    border: "none",
    padding: "12px 24px",
    color: "white",
    background: "#3B7AFD",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
  claimAmt: {
    fontSize: "30px",
    margin: 0,
    padding: 0,
  },
  myClaim: {
    margin: 0,
    padding: 0,
    color: "#C1D3FF",
    fontSize: "14px",
  },
  claims: {
    display: "flex",
    marginTop: "10px",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    fontSize: "30px",
    outline: "none",
    background: "transparent",
    border: "none",
    color: "white",
  },
  max: {
    padding: "4px 12px",
    background: "#3B7AFD",
    borderRadius: "4px",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  remainingClaim: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  error: {
    color: "#FF033E",
    fontSize: "14px",
  },
  nav: {
    padding: "10px 20px",
  },
  countdown: {
    width: "fit-content",
    background: "#FEB803",
    padding: "10px 10px",
    fontSize: "20px",
    borderRadius: "5px",
    margin: 0,
  },
  closingIn: {
    padding: "30px 0px",
    borderRadius: "10px",
    color: "#F8F5E4",
    fontSize: "24px",
    width: "fit-content",
  },

  div: {
    display: "flex",
    flexDirection: "column",
    gap: "-3px",
  },
});
