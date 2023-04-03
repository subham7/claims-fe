import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { BsLink45Deg, BsFillSendFill } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";
import { AiFillCalendar } from "react-icons/ai";
import { FaCoins } from "react-icons/fa";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addClaimContractData } from "../../src/redux/reducers/createClaim";

const useStyles = makeStyles({
  container: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    border: "1px solid #FFFFFF1A",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
    color: "white",
    cursor: "pointer",
  },
  topLine: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
    alignItems: "center",
    // fontWeight: '400'
  },

  createdBy: {
    fontWeight: "300",
    margin: 0,
    fontSize: "15px",
    color: "#6475A3",
    // letterSpacing: '0.5px'
  },
  span: {
    color: "#C1D3FF",
    // textDecoration: 'underline'
  },
  icons: {
    padding: 4,
    border: "1px solid #FFFFFF1A",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  title: {
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: "400",
    textAlign: "left",
  },
  para: {
    margin: 0,
    fontSize: "12px",
  },
  active: {
    padding: "4px 10px",
    background: "#17454E",
    color: "#0ABB91",
    border: "none",
    borderRadius: "5px",
  },
  inactive: {
    padding: "4px 10px",
    background: "#F75F71",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
});

const ClaimsCard = ({
  description,
  i,
  airdropTokenSymbol,
  totalAmount,
  updatedDate,
  startDate,
  endDate,
  claimContract,
  createdBy,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(false);

  const convertedStartDay = new Date(startDate * 1000).getDate();
  const convertedStartMonth = new Date(startDate * 1000).toLocaleString(
    "default",
    { month: "short" },
  );
  const convertedEndDate = new Date(endDate * 1000).getDate();
  const convertedEndMonth = new Date(endDate * 1000).toLocaleString("default", {
    month: "short",
  });

  const convertedDate = new Date(updatedDate).toLocaleDateString();
  const currentTime = Date.now() / 1000;

  useEffect(() => {
    if (+startDate > currentTime || +endDate < currentTime) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  }, [currentTime]);

  const claimContractData = {
    description,
    airdropTokenSymbol,
    totalAmount,
    claimContract,
    createdBy,
    endDate,
  };

  console.log(claimContractData);

  dispatch(addClaimContractData(claimContractData));

  const claimHandler = () => {
    router.push(`/claims/${claimContract}`);
  };

  return (
    <div onClick={claimHandler} className={classes.container}>
      <div className={classes.topLine}>
        <h4 className={classes.createdBy}>
          Created by <span className={classes.span}>me</span> on{" "}
          <span className={classes.span}>{convertedDate}</span>
        </h4>
        <div className={classes.iconContainer}>
          {/* <div className={classes.active}>Active</div> */}
          <BsLink45Deg
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/claims/${claimContract}`,
              );
            }}
            size={25}
            className={classes.icons}
          />
          <BiPencil size={25} className={classes.icons} />
        </div>
      </div>

      <h2 className={classes.title}>
        <span className={classes.span}>#{i + 1} </span>
        {description}
      </h2>

      <div className={classes.iconContainer}>
        {/* Token */}
        <div className={classes.icons}>
          <BsFillSendFill color="#6475A3" size={12} />
          <p className={classes.para}>{airdropTokenSymbol}</p>
        </div>

        {/* No. of Tokens */}
        <div className={classes.icons}>
          <FaCoins color="#6475A3" size={12} />
          <p className={classes.para}>{totalAmount}</p>
        </div>

        {/* Date */}
        <div className={classes.icons}>
          <AiFillCalendar color="#6475A3" size={12} />
          <p className={classes.para}>
            {`${convertedStartDay} ${convertedStartMonth} - ${convertedEndDate} ${convertedEndMonth}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimsCard;
