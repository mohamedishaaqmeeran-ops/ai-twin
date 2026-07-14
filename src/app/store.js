import { configureStore } from "@reduxjs/toolkit";
import twinReducer from "../features/twin/twinSlice";
import authReducer from "../features/auth/authSlice";
import socialReducer from "../features/social/socialSlice";
import uiReducer from "../features/ui/uiSlice";
import realtimeReducer from "../features/realtime/realtimeSlice";
import productReducer from "../features/products/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    social: socialReducer,
    ui: uiReducer,
    twin: twinReducer,
    realtime:
      realtimeReducer,
      product:
        productReducer,
  },
});