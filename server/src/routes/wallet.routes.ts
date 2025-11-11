import { Router } from "express";
import {
  getWallets,
  getWallet,
  batchUpdate,
  createWallet,
  me,
} from "../controllers/wallet.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, me);

router.post("/createWallet", requireAuth, createWallet);
router.get("/getWallets", requireAuth, getWallets);
router.get("/:walletId", requireAuth, getWallet);
router.post("/:walletId/batch", requireAuth, batchUpdate);

export default router;
