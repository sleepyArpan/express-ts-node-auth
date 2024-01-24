import { Router } from 'express';
import auth from './auth';
import protectedRoutes from './protected';

const router = Router({ strict: true });

router.use('/auth', auth);
router.use('/protected', protectedRoutes);

export default router;
