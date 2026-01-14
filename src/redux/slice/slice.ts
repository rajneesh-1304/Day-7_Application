import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
};

type AuthState = {
  currUser: AuthUser | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  currUser: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    handleCurrentUser(state, action: PayloadAction<AuthUser>) {
      state.currUser = action.payload;
      state.isAuthenticated = true;
    },

    handleLogout(state) {
      state.currUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { handleCurrentUser, handleLogout } = authSlice.actions;
export default authSlice.reducer;
