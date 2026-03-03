import { supabase } from "../lib";
import type { UserRow } from "../lib/database.types";

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  avatar?: string;
  createdAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: string;
}

// Helper to map Supabase row to User
const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  status: row.status,
  avatar: row.avatar_url || undefined,
  createdAt: new Date(row.created_at).toLocaleDateString(),
});

// Supabase API service
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return ((data as UserRow[]) || []).map(mapRowToUser);
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return undefined;

    return mapRowToUser(data as UserRow);
  },

  createUser: async (dto: CreateUserDto): Promise<User> => {
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        status: dto.status,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mapRowToUser(data as UserRow);
  },

  updateUser: async (dto: UpdateUserDto): Promise<User> => {
    const { data, error } = await supabase
      .from("users")
      .update({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        status: dto.status,
      })
      .eq("id", dto.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return mapRowToUser(data as UserRow);
  },

  deleteUser: async (id: string): Promise<void> => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw new Error(error.message);
  },
};
