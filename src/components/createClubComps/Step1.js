import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Step1Styles } from "./CreateClubStyles";

export default function Step1(props) {
  const classes = Step1Styles();
  return (
    <>
      <Grid container>
        <Grid item md={12} mt={4}>
          <Typography className={classes.wrapTextIcon}>Station info</Typography>
          <Typography className={classes.smallText}>
            Name & token symbol of your station are publicly visible on-chain &
            can’t be changed after it is created. This can be your brand name or
            something your community identifies with.
          </Typography>
          <br />
          <Typography className={classes.wrapTextIcon}>Name *</Typography>
          <TextField
            name="clubName"
            className={classes.textField}
            label="Eg: Degen Collective / PurpleDAO / Phoenix club"
            variant="outlined"
            onChange={props.formik.handleChange}
            onBlur={props.formik.handleBlur}
            value={props.formik.values.clubName}
            error={
              props.formik.touched.clubName &&
              Boolean(props.formik.errors.clubName)
            }
            helperText={
              props.formik.touched.clubName && props.formik.errors.clubName
            }
          />
          <br />
          <Typography className={classes.wrapTextIcon}>
            Symbol *{" "}
            <Box
              sx={{ color: "#6475A3", ml: 1 }}
              fontWeight="Normal"
              display="inline">
              (Ticker)
            </Box>
          </Typography>
          <TextField
            name="clubSymbol"
            className={classes.textField}
            label="Eg: DGC / PDAO / PXC"
            variant="outlined"
            onChange={props.formik.handleChange}
            onBlur={props.formik.handleBlur}
            value={props.formik.values.clubSymbol}
            error={
              props.formik.touched.clubSymbol &&
              Boolean(props.formik.errors.clubSymbol)
            }
            helperText={
              props.formik.touched.clubSymbol && props.formik.errors.clubSymbol
            }
          />
          <br />
          <Typography className={classes.smallText}>
            You can choose to make your token public or private along with other
            rules in the next steps.
          </Typography>
          <br />

          <Typography className={classes.largeText} mb={2}>
            Set token type
          </Typography>
          <Typography className={classes.smallText} mb={2}>
            Token type that best suits your objective. For example: ERC721 for
            membership based communities, Non-transferrable ERC20 for a
            syndicate cap-table, transferrable ERC20 for a public DAO, etc.
            Transferability allows trading of tokens in public markets.
          </Typography>

          <FormControl sx={{ width: "100%" }}>
            <Select
              value={props.formik.values.clubTokenType}
              onChange={props.formik.handleChange}
              inputProps={{ "aria-label": "Without label" }}
              name="clubTokenType"
              id="clubTokenType">
              <MenuItem value={"Non Transferable ERC20 Token"}>
                Non-Transferabe Token [ERC20]
              </MenuItem>
              <MenuItem value={"NFT"}>NFT [ERC721]</MenuItem>
            </Select>
          </FormControl>
          <br />
        </Grid>
      </Grid>
    </>
  );
}
