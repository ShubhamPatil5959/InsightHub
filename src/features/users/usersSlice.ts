import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  userService,
  type User,
  type CreateUserDto,
  type UpdateUserDto,
} from "../../services";

// State interface
interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  modalMode: "create" | "edit";
}

// Initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  modalOpen: false,
  modalMode: "create",
};

// Async thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await userService.getUsers();
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data: CreateUserDto) => {
    return await userService.createUser(data);
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data: UpdateUserDto) => {
    return await userService.updateUser(data);
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => {
    await userService.deleteUser(id);
    return id;
  }
);

// Users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.modalOpen = true;
      state.modalMode = "create";
      state.selectedUser = null;
    },
    openEditModal: (state, action) => {
      state.modalOpen = true;
      state.modalMode = "edit";
      state.selectedUser = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.modalOpen = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        state.modalOpen = false;
        state.selectedUser = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export const { openCreateModal, openEditModal, closeModal, clearError } = usersSlice.actions;
export default usersSlice.reducer;

