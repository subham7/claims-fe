import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "legal",
  initialState: {
    membersData: null,
    encryptedLink: null,
    adminFormData: null
  },
  reducers: {
    addMembersData: (state, action) => {
      state.membersData = action.payload;
    },
    addEncryptedLink: (state, action) => {
      state.encryptedLink = action.payload
    },
    addAdminFormData: (state, action) => {
      state.adminFormData = action.payload
    },
  },
});

export const { addMembersData, addEncryptedLink, addAdminFormData } = slice.actions;

export default slice.reducer;
