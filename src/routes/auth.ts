import { Router } from 'express';

const router = Router({ strict: true });

router.get('/login', (req, res) => {
  res.status(200).json({ hello: 'from login!' });
});

// catch every route under `/auth` that has not been defined here
router.all('/*', (_, res, next) => {
  try {
    res.status(404);
    throw new Error('not found');
  } catch (error) {
    next(error);
  }
});

export default router;
