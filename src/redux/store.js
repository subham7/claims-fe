import { configureStore } from "@reduxjs/toolkit";
import createReducer from "./reducers/create";
import gnosisReducer from "./reducers/gnosis";
import legalReducer from "./reducers/legal";

export default configureStore({
  reducer: {
    create: createReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
  },
});
