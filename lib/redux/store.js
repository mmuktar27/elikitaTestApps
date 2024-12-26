import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};
