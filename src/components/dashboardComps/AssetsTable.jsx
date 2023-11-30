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

const AssetsTable = ({ tableHeader, tableData }) => {
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
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>
                  <div className={classes.token}>
                    {/* <Image
                      src={token.logo}
                      height={25}
                      width={35}
                      alt="token name"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/icons/usd.png";
                      }}
                    /> */}

                    <SafeImage
                      src={token.logo}
                      fallbackSrc="/assets/icons/testToken.png"
                      alt="token name"
                      height={25}
                      width={25}
                    />
                    <Typography className={classes.tokenName} variant="inherit">
                      {token.name}
                    </Typography>
                    <Typography
                      className={classes.tokenSymbol}
                      variant="inherit">
                      {token.symbol}
                    </Typography>
                  </div>
                </TableCell>
                {/* <TableCell className={classes.tableCell}>
                  {token.price}
                </TableCell> */}
                <TableCell className={classes.tableCell}>
                  {convertFromWeiGovernance(token.balance, token.decimals)}{" "}
                  {token.symbol}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  ${token?.usd?.usdValue ?? 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AssetsTable;
