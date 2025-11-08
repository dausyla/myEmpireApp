import { Request, Response } from "express";
import { supabase } from "../db/supabase";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  const token = data.session?.access_token;
  const user = data.user;

  res.json({ token, user: { id: user.id, email: user.email } });
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
