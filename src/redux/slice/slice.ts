import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  currUser: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  users: [
    { id: '1', name: 'Admin', email: 'admin@gmail.com', password: '12345678' },
    { id: '2', name: 'Kumar', email: 'kumar@gmail.com', password: '12345678' },
    { id: '3', name: 'ABC', email: 'abc@gmail.com', password: '12345678' },
  ],
  currUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    register: (
      state,
      action: PayloadAction<Omit<User, 'id'>>
    ) => {
      const newUser: User = {
        id: nanoid(),
        ...action.payload,
      };

      state.users.push(newUser);
      state.currUser = newUser;
      state.isAuthenticated = true;
    },

    login: (state, action: PayloadAction<AuthUser>) => {
      state.currUser = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.currUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { register, login, logout } = userSlice.actions;
export default userSlice.reducer;
