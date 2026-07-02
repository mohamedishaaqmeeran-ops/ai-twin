import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import socialReducer from "../features/social/socialSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    social: socialReducer,
    ui: uiReducer,
  },
});