import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import movementReducer from "./slices/movementSlice";
import programReducer from "./slices/programSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movement: movementReducer,
    program: programReducer,
    user: userReducer,
  },
});
