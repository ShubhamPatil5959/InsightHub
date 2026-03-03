import { supabase } from "../lib";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  // Sign up new user
  signUp: async (data: SignUpData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) throw new Error(error.message);

    return {
      user: authData.user
        ? {
            id: authData.user.id,
            email: authData.user.email || "",
            name: data.name,
          }
        : null,
      session: authData.session,
    };
  },

  // Sign in existing user
  signIn: async (data: SignInData) => {
    const { data: authData, error } =
      await supabase.auth.signInWithPassword(data);

    if (error) throw new Error(error.message);

    const userName =
      authData.user?.user_metadata?.name ||
      authData.user?.email?.split("@")[0] ||
      "User";

    return {
      user: authData.user
        ? {
            id: authData.user.id,
            email: authData.user.email || "",
            name: userName,
          }
        : null,
      session: authData.session,
    };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  },

  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    };
  },
};

