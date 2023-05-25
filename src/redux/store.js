import { configureStore } from "@reduxjs/toolkit";
import clubReducer from "./reducers/club";
import gnosisReducer from "./reducers/gnosis";
import userReducer from "./reducers/user";
import legalReducer from "./reducers/legal";
import createClaimReducer from "./reducers/createClaim";
import proposalReducer from "./reducers/proposal";

export default configureStore({
  reducer: {
    club: clubReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
    user: userReducer,
    createClaim: createClaimReducer,
    proposal: proposalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["your/action/type"],
      },
    }),
});
