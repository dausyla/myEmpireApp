import { Router } from "express";
import { batchUpdate } from "../controllers/wallet.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/:walletId/batch", batchUpdate);

export default router;
