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

router.use(requireAuth);

router.get("/me", me);

router.post("/createWallet", getWallets);
router.get("/getWallets", createWallet);
router.get("/:walletId", getWallet);
router.post("/:walletId/batch", batchUpdate);

export default router;
