import { configureStore } from "@reduxjs/toolkit";
import createReducer from "./reducers/create";
import clubReducer from "./reducers/club";
import gnosisReducer from "./reducers/gnosis";
import userReducer from "./reducers/user";
import legalReducer from "./reducers/legal";
import createClaimReducer from "./reducers/createClaim";

export default configureStore({
  reducer: {
    create: createReducer,
    club: clubReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
    user: userReducer,
    createClaim: createClaimReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["your/action/type"],
      },
    }),
});
