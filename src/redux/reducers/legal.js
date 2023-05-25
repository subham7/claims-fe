import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "legal",
  initialState: {
    membersData: null,
    encryptedLink: null,
    adminFormData: null,
    legalDocLink: null,
    documentList: null,
  },
  reducers: {
    addMembersData: (state, action) => {
      state.membersData = action.payload;
    },
    addEncryptedLink: (state, action) => {
      state.encryptedLink = action.payload;
    },
    addAdminFormData: (state, action) => {
      state.adminFormData = action.payload;
    },
    addLegalDocLink: (state, action) => {
      state.legalDocLink = action.payload;
    },
    addDocumentList: (state, action) => {
      state.documentList = action.payload;
    },
  },
});

export const {
  addMembersData,
  addEncryptedLink,
  addAdminFormData,
  addLegalDocLink,
  addDocumentList,
} = slice.actions;

export default slice.reducer;
