export const lightComponents = {
	MuiButton: {
		styleOverrides: {
			root: {
				"maxHeight": "44px",
				"background": "#fff",
				"borderRadius": "100px",
				"opacity": 1,
				"boxShadow":
					"inset 0rem 0.3rem 0.5rem #fff, inset 0rem -0.2rem 0.2rem rgba(0, 0, 0, 0.3), 0rem 0.1rem 0.5rem rgba(255, 255, 255, 0.5), 0rem -0.2rem 0.3rem #fff, 0rem 0.2rem 0.2rem rgba(0,0,0,0.2)",
				"padding": "10px 20px",
				"color": "#484848",
				"textTransform": "none",
				"padding": "10px 30px",
				"marginRight": "10px",
				"&:hover": {
					background: "#fff",
					boxShadow:
						"inset 0rem 0.2rem 0.5rem rgba(195, 193, 198, 0.9), inset 0rem -0.2rem 0.3rem #fff",
				},
			},
		},
		variants: [
			{
				props: { variant: "dark" },
				style: {
					"background": "#2A2A2A",
					"&:hover": {
						boxShadow: "0px -3px 6px rgba(255, 255, 255, 0.1)",
						background: "#2A2A2A",
					},
					"boxShadow":
						"inset 0rem 0.2rem 0.2rem rgba(255,255,255,0.2), inset 0rem -0.2rem 0.2rem rgba(0, 0, 0, 0.3), 0rem 0.1rem 0.5rem rgba(0, 0, 0, 0.4), 0rem -0.2rem 0.3rem rgba(255,255,255,0.3), 0rem 0.2rem 0.2rem rgba(0,0,0,0.2)",
					"borderRadius": "20px",
					"opacity": 1,
					"padding": "10px 30px",
					"color": "#fff",
				},
			},
		],
	},
	MuiDrawer: {
		styleOverrides: {
			root: {
				boxShadow: "none",
				backgroundColor: "#000",
			},
		},
	},
	MuiCard: {
		styleOverrides: {
			root: {
				color: "#484848",
				borderRadius: "10px",
				boxShadow:
					"0.3rem 0.3rem 0.5rem rgba(195, 193, 198, 0.9), -0.2rem -0.2rem 0.4rem #fff",
				padding: "10px",
			},
		},
	},
	MuiAppBar: {
		styleOverrides: {
			root: { backgroundColor: "#191919" },
		},
	},
	MuiTabs: {
		styleOverrides: {
			root: {
				backgroundColor: "#EFEFEF",
			},
		},
	},
};
