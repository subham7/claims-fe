import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "space",
  initialState: {
    spaceBasicData: {
      name: null,
      description: null,
      logo: null,
      coverPic: null,
    },
    spaceSocialData: {
      warpcast: "",
      twitter: "",
      telegram: "",
      website: "",
      discord: "",
      instagram: "",
      reddit: "",
    },
    creator: null,
    managers: [],
    selectedStations: null,
  },
  reducers: {
    addSpaceBasicData: (state, action) => {
      state.spaceBasicData.name = action.payload.name;
      state.spaceBasicData.description = action.payload.description;
      state.spaceBasicData.logo = action.payload.logo;
      state.spaceBasicData.coverPic = action.payload.coverPic;
    },
    addSpaceSocialData: (state, action) => {
      state.spaceSocialData.warpcast = action.payload.warpcast;
      state.spaceSocialData.twitter = action.payload.twitter;
      state.spaceSocialData.telegram = action.payload.telegram;
      state.spaceSocialData.website = action.payload.website;
      state.spaceSocialData.discord = action.payload.discord;
      state.spaceSocialData.instagram = action.payload.instagram;
      state.spaceSocialData.reddit = action.payload.reddit;
    },
    addCreator: (state, action) => {
      state.creator = action.payload;
    },
    addManagers: (state, action) => {
      state.managers = action.payload;
    },
    addSelectedStations: (state, action) => {
      state.selectedStations = action.payload;
    },
  },
});

export const {
  addSpaceBasicData,
  addSpaceSocialData,
  addCreator,
  addManagers,
  addSelectedStations,
} = slice.actions;

export default slice.reducer;
