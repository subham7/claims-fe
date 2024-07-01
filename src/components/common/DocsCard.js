import { Typography } from "@mui/material";
import { shortAddress } from "utils/helper";
import classes from "../common/Common.module.scss";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";
import { isLoading } from "../../redux/loader/selectors";
import { useSelector } from "react-redux";
const DocsCard = ({ data = [], heading, isGovernance = true }) => {
  const signatorIsLoading = useSelector((state) =>
    isLoading(state, "signators"),
  );

  return (
    <div className={classes.tableListContainer}>
      <Typography className={classes.title} variant="inherit">
        {heading}
      </Typography>

      <div className={classes.list}>
        {signatorIsLoading && (
          <CustomSkeleton
            marginTop={"20px"}
            width={"95%"}
            height={40}
            length={7}
          />
        )}
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
