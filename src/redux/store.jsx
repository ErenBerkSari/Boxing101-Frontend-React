import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import movementReducer from "./slices/movementSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movement: movementReducer,
  },
});
