import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { TextField } from "@components/ui";

export default function Step1(props) {
  return (
    <div className="f-d f-vt f-v-s t-pad-d w-100">
      <Typography
        fontSize={24}
        fontWeight={600}
        variant="inherit"
        className="text-blue">
        Add basic info
      </Typography>
      <Typography
        fontSize={16}
        color={"#a0a0a0"}
        variant="info"
        className="text-light-gray">
        {`Add the name of your station and select a ticker for its token. Membership or share % of your members is represented by the station’s token.`}
      </Typography>

      <br />

      <Typography
        fontWeight={600}
        variant="body"
        className="text-blue b-pad-min">
        Title
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

      <Typography
        fontWeight={600}
        variant="body"
        className="text-blue b-pad-min">
        Set token ticker
      </Typography>
      <div className="b-pad-min w-100">
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
      </div>

      <br />

      <Typography fontWeight={600} mb={1} variant="body" className="text-blue">
        Token Type (Recommended ERC20 for member shares and NFTs for
        memberships)
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

      <Typography mb={1} fontWeight={600} variant="body" className="text-blue">
        What will you use the Station for?
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

      <Typography fontWeight={600} variant="body" className="text-blue">
        Email
        <Box sx={{ ml: 1 }} fontWeight="Normal" display="inline">
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
