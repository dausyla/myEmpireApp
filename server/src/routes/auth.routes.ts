import { Router } from "express";
import { login, signup, loginWithGoogle } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/google", loginWithGoogle);

export default router;
