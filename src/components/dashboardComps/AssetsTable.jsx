import SafeImage from "@components/common/SafeImage";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./Dashboard.module.scss";
import { CHAIN_CONFIG } from "utils/constants";
import { customToFixedAutoPrecision } from "utils/helper";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";
import { isLoading } from "redux/loader/selectors";
export const tableHeader = ["Name", "Holding", "Network", "Value in USD"];

const AssetsTable = ({ tableData }) => {
  const tokenDetailsIsloading = useSelector((state) =>
    isLoading(state, "token-details"),
  );
  // console.log(tokenDetailsIsloading)
  return (
    <div className={classes.tokensContainer}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeader.map((header, index) => (
                <TableCell className={classes.tableHeader} key={index}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tokenDetailsIsloading &&
              tableHeader.map((_, i) => {
                return (
                  <TableCell key={i} className={classes.tableCell}>
                    {
                      <CustomSkeleton
                        width={"100%"}
                        height={30}
                        length={10}
                        marginTop={"25px"}
                      />
                    }
                  </TableCell>
                );
              })}

            {tableData.map((token, index) => (
              <>
                {token.name && (
                  <TableRow key={index}>
                    <TableCell className={classes.tableCell}>
                      <div className={classes.token}>
                        <SafeImage
                          src={token.logo}
                          fallbackSrc="/assets/icons/testToken.png"
                          alt="token name"
                          height={25}
                          width={25}
                          style={{
                            borderRadius: "50%",
                          }}
                        />
                        <Typography
                          className={classes.tokenName}
                          variant="inherit">
                          {token.name}
                        </Typography>

                        <Typography
                          className={classes.tokenSymbol}
                          variant="inherit">
                          {token.symbol}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {customToFixedAutoPrecision(
                        Number(
                          convertFromWeiGovernance(
                            token.balance,
                            token.decimals,
                          ),
                        ),
                      )}{" "}
                      {token.symbol}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {CHAIN_CONFIG[token?.networkId]?.shortName ?? ""}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      $
                      {customToFixedAutoPrecision(
                        Number(token?.usd?.usdValue ?? 0),
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AssetsTable;
