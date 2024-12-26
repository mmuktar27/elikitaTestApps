import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: {},
  currentUser: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setIsLoggedIn, setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
