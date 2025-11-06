import { Router } from 'express';
import { batchUpdate } from '../controllers/wallet.controller';

const router = Router();

router.post('/:walletId/batch', batchUpdate);

export default router;