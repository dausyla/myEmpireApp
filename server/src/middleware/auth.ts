import { Request, Response, NextFunction } from "express";
import { supabase } from "../db/supabase";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Récupérer le header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  // 2. Vérifier le token avec Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.getUser(token);

  if (authError || !authData?.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { user } = authData;

  // 3. S’assurer que l’utilisateur existe dans la table `users`
  const { data: getData, error: getError } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .single();

  // Si l'utilisateur n'existe pas (ex: OAuth sans signup manuel)
  if (!getData || getError?.code === "PGRST116") {
    // Créer l'entrée dans `users` (cas OAuth ou compte supprimé/recréé)
    const { error: putError, data: putData } = await supabase
      .from("users")
      .insert({
        id: user.id,
        username:
          user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "user",
        premium: false,
      })
      .select()
      .single();

    if (putError) {
      return res
        .status(500)
        .json({ error: "Failed to create user record: " + putError.message });
    }

    (req as any).user = putData;
  } else {
    (req as any).user = getData;
  }

  next();
};
