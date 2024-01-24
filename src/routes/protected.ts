import { Router } from 'express';
import * as middleWares from '../middlewares';

const router = Router({ strict: true });

router.get('/', middleWares.isAuthenticated, (_req, res) => {
  res.status(200).json({ message: 'Hello World from protection!' });
});

export default router;
