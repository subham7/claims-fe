import { configureStore } from "@reduxjs/toolkit";
import clubReducer from "./reducers/club";
import gnosisReducer from "./reducers/gnosis";
import userReducer from "./reducers/user";
import legalReducer from "./reducers/legal";
import createClaimReducer from "./reducers/createClaim";
import proposalReducer from "./reducers/proposal";
import contractInstanceReducer from "./reducers/contractInstances";

export default configureStore({
  reducer: {
    contractInstances: contractInstanceReducer,
    club: clubReducer,
    gnosis: gnosisReducer,
    legal: legalReducer,
    user: userReducer,
    createClaim: createClaimReducer,
    proposal: proposalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
