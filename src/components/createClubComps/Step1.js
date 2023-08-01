import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { TextField, Typography } from "@components/ui";

export default function Step1(props) {
  return (
    <div className="f-d f-vt f-v-s t-pad-d">
      <Typography variant="body" className="text-blue">
        Basic info
      </Typography>
      <Typography variant="info" className="text-darkblue">
        Give a name & token symbol for your station that best describes the
        purpose or matches your tribe.
      </Typography>

      <br />

      <Typography variant="body" className="text-blue">
        Name *
      </Typography>
      <TextField
        name="clubName"
        label="Eg: Degen Collective / PurpleDAO / Phoenix club"
        variant="outlined"
        onChange={props.formik.handleChange}
        onBlur={props.formik.handleBlur}
        value={props.formik.values.clubName}
        error={
          props.formik.touched.clubName && Boolean(props.formik.errors.clubName)
        }
        helperText={
          props.formik.touched.clubName && props.formik.errors.clubName
        }
      />

      <br />

      <Typography variant="body" className="text-blue">
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
      <Typography variant="info" className="text-darkblue">
        You can choose to make your token public or private along with other
        rules in the next steps.
      </Typography>

      <br />

      <Typography variant="body" className="text-blue">
        Set token type
      </Typography>
      <Typography variant="info" className="text-darkblue">
        Choose a Token type that best suits your objective. (For example: ERC721
        for NFT collectives or non-transferrable ERC20 for investment clubs)
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

      <Typography variant="body" className="text-blue">
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

      <Typography variant="body" className="text-blue">
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
        error={props.formik.touched.email && Boolean(props.formik.errors.email)}
        helperText={props.formik.touched.email && props.formik.errors.email}
      />
    </div>
  );
}
