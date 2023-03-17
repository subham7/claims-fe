import { configureStore } from "@reduxjs/toolkit";
import createReducer from "./reducers/create";
import gnosisReducer from "./reducers/gnosis";
import userReducer from "./reducers/user";
import legalReducer from "./reducers/legal";

export default configureStore({
  reducer: {
    create: createReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
    user: userReducer,
  },
});
