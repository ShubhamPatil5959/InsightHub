import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store";
import { createUser, updateUser, closeModal } from "../features";
import type { CreateUserDto } from "../services";

const UserFormModal = () => {
  const dispatch = useAppDispatch();
  const { modalOpen, modalMode, selectedUser, loading } = useAppSelector(
    (state) => state.users
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserDto>({
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "active",
    },
  });

  // Reset form when modal opens/closes or selected user changes
  useEffect(() => {
    if (modalOpen && selectedUser && modalMode === "edit") {
      reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      });
    } else if (modalOpen && modalMode === "create") {
      reset({ name: "", email: "", role: "user", status: "active" });
    }
  }, [modalOpen, selectedUser, modalMode, reset]);

  const onSubmit = (data: CreateUserDto) => {
    if (modalMode === "edit" && selectedUser) {
      dispatch(updateUser({ ...data, id: selectedUser.id }));
    } else {
      dispatch(createUser(data));
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    reset();
  };

  return (
    <Dialog open={modalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{modalMode === "edit" ? "Edit User" : "Add New User"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <TextField
              label="Role"
              select
              fullWidth
              defaultValue="user"
              {...register("role")}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>
            <TextField
              label="Status"
              select
              fullWidth
              defaultValue="active"
              {...register("status")}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : modalMode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;

