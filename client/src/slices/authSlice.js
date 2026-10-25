import { createSlice } from '@reduxjs/toolkit';

// Auth state is managed by Firebase on the frontend.
// This slice holds only app-specific data synced from the backend (role, MongoDB _id, etc.)
const initialState = {
  userInfo: localStorage.getItem('dbUser')
    ? JSON.parse(localStorage.getItem('dbUser'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setDbUser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('dbUser', JSON.stringify(action.payload));
    },
    clearDbUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem('dbUser');
    },
  },
});

export const { setDbUser, clearDbUser } = authSlice.actions;
export default authSlice.reducer;
