import { configureStore } from "@reduxjs/toolkit";
import createReducer from "./reducers/create";
import gnosisReducer from "./reducers/gnosis";
import userReducer from "./reducers/user";

export default configureStore({
  reducer: {
    create: createReducer,
    gnosis: gnosisReducer,
    user: userReducer,
  },
});
