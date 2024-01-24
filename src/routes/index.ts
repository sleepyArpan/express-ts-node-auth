import { Router } from 'express';
import auth from './auth';

const router = Router({ strict: true });

router.use('/auth', auth);

export default router;
