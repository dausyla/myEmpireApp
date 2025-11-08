import { Router } from "express";
import { batchUpdate, me } from "../controllers/wallet.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/me", me);
router.post("/:walletId/batch", batchUpdate);

export default router;
