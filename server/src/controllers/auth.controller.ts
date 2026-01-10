import { Request, Response } from "express";
import { supabase } from "../db/supabase";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  const { data: user } = await supabase
    .from("users")
    .select()
    .eq("id", data.user.id);

  const token = data.session?.access_token;

  res.json({ token, user });
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return res.status(400).json({ error: error.message });

  // Créer l'utilisateur dans ta table users
  await supabase.from("users").insert({
    id: data.user?.id,
    username,
    premium: false,
  });

  res.json({ message: "Check your email to confirm!" });
};

export const loginWithGoogle = async (req: Request, res: Response) => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${process.env.CLIENT_URL}/app` },
  });

  res.json({ url: data.url });
};

export const logout = async (req: Request, res: Response) => {
  const { error } = await supabase.auth.signOut();

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Logged out successfully" });
};
