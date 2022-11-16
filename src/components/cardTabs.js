import React, { useState } from "react";
import { Tabs, Tab, Typography, Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const tabs = [
	{ label: "Sale" },
	{ label: "Description" },
	{ label: "Tokenomics" },
];

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.mode == "dark" ? "#242424" : "#F4F4F5",
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		"id": `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function SimpleTab(props) {
	const classes = useStyles();
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<>
			<Tabs
				variant="fullWidth"
				centered={true}
				value={value}
				onChange={handleChange}
				aria-label="basic tabs"
				className={classes.root}
			>
				{tabs.map((item, index) => (
					<Tab key={index} label={item.label} {...a11yProps(index)} />
				))}
			</Tabs>

			<>
				<TabPanel value={value} index={0}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Typography variant="subtitle2">Soft Cap/ Hard Cap</Typography>
							<Typography variant="subtitle1">30BNB/50BNB</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="subtitle2">Min/Max Allocation</Typography>
							<Typography variant="subtitle1">0.1/0.5 BNB</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="subtitle2">Liquidity</Typography>
							<Typography variant="subtitle1">60%</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="subtitle2">Lock up</Typography>
							<Typography variant="subtitle1">30 Days</Typography>
						</Grid>
					</Grid>
				</TabPanel>
				<TabPanel value={value} index={1}>
					Item Two
				</TabPanel>
				<TabPanel value={value} index={2}>
					Item Three
				</TabPanel>
			</>
		</>
	);
}
