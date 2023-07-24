import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  // Typography,
} from "@mui/material";
import { TextField, Typography } from "@components/ui";
import { Step1Styles } from "./CreateClubStyles";

export default function Step1(props) {
  const classes = Step1Styles();
  return (
    <>
      <Grid container>
        <Grid item md={12} mt={4}>
          <Typography variant="input_heading">Basic info</Typography>
          <Typography variant="input_desc">
            Give a name & token symbol for your station that best describes the
            purpose or matches your tribe.
          </Typography>
          <br />
          <Typography variant="input_heading">Name *</Typography>
          <TextField
            name="clubName"
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
          <Typography
            variant="input_heading"
            // className={classes.wrapTextIcon}
          >
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
          <Typography
            variant="input_desc"
            // className={classes.smallText}
          >
            You can choose to make your token public or private along with other
            rules in the next steps.
          </Typography>
          <br />

          <Typography className={classes.largeText} mb={2}>
            Set token type
          </Typography>
          <Typography className={classes.smallText} mb={2}>
            Choose a Token type that best suits your objective. (For example:
            ERC721 for NFT collectives or non-transferrable ERC20 for investment
            clubs)
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

          <Typography className={classes.largeText} mb={2} mt={3}>
            What will you use the Station for? *
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <Select
              value={props.formik.values.useStationFor}
              onChange={props.formik.handleChange}
              inputProps={{ "aria-label": "Without label" }}
              name="useStationFor"
              id="useStationFor">
              <MenuItem value={"Investment Club/Syndicate"}>
                Investment club/Syndicate
              </MenuItem>
              <MenuItem value={"Fund management"}>Fund management</MenuItem>
              <MenuItem value={"Nft memberships"}>NFT memberships</MenuItem>
              <MenuItem value={"Charity/Impact funding"}>
                Charity/Impact funding
              </MenuItem>
              <MenuItem value={"Manage grants"}>Manage grants</MenuItem>
              <MenuItem value={"Others"}>Others</MenuItem>
            </Select>
          </FormControl>

          <br />

          <Typography mt={3} className={classes.wrapTextIcon}>
            Email
            <Box
              sx={{ color: "#6475A3", ml: 1 }}
              fontWeight="Normal"
              display="inline">
              (Optional)
            </Box>
          </Typography>
          <TextField
            name="email"
            variant="outlined"
            onChange={props.formik.handleChange}
            placeholder="johndoe@email.com"
            onBlur={props.formik.handleBlur}
            value={props.formik.values.email}
            error={
              props.formik.touched.email && Boolean(props.formik.errors.email)
            }
            helperText={props.formik.touched.email && props.formik.errors.email}
          />
        </Grid>
      </Grid>
    </>
  );
}
