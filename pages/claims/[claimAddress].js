import { makeStyles } from "@mui/styles";
import { fontWeight } from "@mui/system";
import React from "react";
import Navbar2 from "../../src/components/navbar2";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "90vh",
    color: "white",
    // width: "1300px",
    margin: "0 auto",
    // gap: "50px",
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
  },

  active: {
    background: "#0ABB9240",
    padding: "10px 20px",
    borderRadius: "10px",
    color: "#0ABB92",
  },

  airdropContainer: {
    display: "flex",
    gap: "50px",
  },

  createdBy: {
    background: "#142243",
    padding: "0px 10px",
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
    margin: 0,
    marginBottom: "10px",
  },
  para: {
    color: "#C1D3FF",
    fontSize: "16px",
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
    padding: "8px 20px",
    border: "0.5px solid #6475A3",
    borderRadius: "12px",
  },
  amount: {
    fontSize: "24px",
    fontWeight: "400",
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
    marginTop: '20px'
  },
});

const ClaimAddress = () => {
  const classes = useStyles();

  return (
    <>
      <Navbar2 />
      <div className={classes.container}>
        {/* left */}
        <div className={classes.lefContainer}>
          <h2 className={classes.heading}>
            Monthly STX rewards to AAB holders
          </h2>

          <div className={classes.addressLine}>
            <div className={classes.activeContainer}>
              <p className={classes.active}>Active</p>

              <div className={classes.createdBy}>
                <p>Created By</p>
                <p className={classes.address}>0x1232...9900</p>
              </div>
            </div>

            <p className={classes.claimCloses}>
              Claim closes on{" "}
              <span className={classes.time}>
                27 November 2022 at 1:57 pm GMT+5:30
              </span>
            </p>
          </div>

          <div className={classes.airdropContainer}>
            <div>
              <h3>STX</h3>
              <p className={classes.para}>Airdrop</p>
            </div>

            <div>
              <h3>1000000</h3>
              <p className={classes.para}>Size</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={classes.rightContainer}>
          <p className={classes.myClaim}>My Claim</p>

          <div className={classes.claimContainer}>
            <p className={classes.amount}>100</p>
            <p className={classes.amount}>STX</p>
          </div>

          <button className={classes.btn}>Claim</button>
        </div>
      </div>
    </>
  );
};

export default ClaimAddress;
