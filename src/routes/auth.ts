import { Router } from 'express';
import bcrypt from 'bcrypt';
import { user } from '../utils';

const router = Router({ strict: true });

router.post('/register', (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }
    const existingUser = user.findUserByEmail(email);
    if (existingUser) {
      res.status(403);
      throw new Error('User with this email already exists');
    }
    user.createUserByEmailAndPassword(email, password);
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }
    const existingUser = user.findUserByEmail(email);
    if (!existingUser) {
      res.status(403);
      throw new Error(
        'User with this email does not exist, please register first.'
      );
    }
    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      res.status(403);
      throw new Error('Invalid password');
    }
    const session = user.loginExistingUser(email);
    res.cookie('session', session.sessionId, {
      httpOnly: true,
      expires: session.activeExpiresAt,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
