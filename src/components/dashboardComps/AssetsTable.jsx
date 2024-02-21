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
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./Dashboard.module.scss";
import { CHAIN_CONFIG } from "utils/constants";
import { customToFixedAutoPrecision } from "utils/helper";

export const tableHeader = ["Name", "Holding", "Network", "Value in USD"];

const AssetsTable = ({ tableData }) => {
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
