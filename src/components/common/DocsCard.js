import { Typography } from "@mui/material";
import { shortAddress } from "utils/helper";
import classes from "../common/Common.module.scss";

const DocsCard = ({ data = [], heading, isGovernance = true }) => {
  return (
    <div className={classes.tableListContainer}>
      <Typography className={classes.title} variant="inherit">
        {heading}
      </Typography>

      <div className={classes.list}>
        {data?.length ? (
          data.map((item, index) => (
            <div key={index} className={classes.item}>
              <Typography className={classes.itemTitle} variant="inherit">
                {!isGovernance ? shortAddress(item.title) : item.title}
              </Typography>
              <Typography className={classes.itemValue} variant="inherit">
                {!isGovernance ? `Signer ${index + 1}` : `${item.value}%`}
              </Typography>
            </div>
          ))
        ) : (
          <Typography className={classes.noActivity} variant="inherit">
            No {isGovernance ? "Governance" : "Signers"} yet!
          </Typography>
        )}
      </div>
    </div>
  );
};

export default DocsCard;
