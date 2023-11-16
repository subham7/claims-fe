import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "gnosis",
  initialState: {
    adminUser: false,
    memberUser: false,
    // setUploadNFTLoading: false,
    // setCreateSafeLoading: false,
    // setCreateSafeError: false,
    // setCreateSafeErrorCode: null,
    // createDaoAuthorized: false,
    wrongNetwork: false,
  },
  reducers: {
    setAdminUser: (state, action) => {
      state.adminUser = action.payload;
    },
    setMemberUser: (state, action) => {
      state.memberUser = action.payload;
    },
    // setUploadNFTLoading: (state, action) => {
    //   state.setUploadNFTLoading = action.payload;
    // },
    // setCreateSafeLoading: (state, action) => {
    //   state.setCreateSafeLoading = action.payload;
    // },
    // setCreateSafeError: (state, action) => {
    //   state.setCreateSafeError = action.payload;
    // },
    // setCreateSafeErrorCode: (state, action) => {
    //   state.setCreateSafeErrorCode = action.payload;
    // },
    // setCreateDaoAuthorized: (state, action) => {
    //   state.createDaoAuthorized = action.payload;
    // },
    setWrongNetwork: (state, action) => {
      state.wrongNetwork = action.payload;
    },
  },
});

export const {
  setAdminUser,
  setMemberUser,
  // setUploadNFTLoading,
  // setCreateSafeLoading,
  // setCreateSafeError,
  // setCreateSafeErrorCode,
  // setCreateDaoAuthorized,
  setWrongNetwork,
} = slice.actions;

export default slice.reducer;
