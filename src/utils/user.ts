import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db, { User } from '../lib/db';

export function findUserByEmail(email: string) {
  return db.users.find(user => user.email === email);
}

export function createUserByEmailAndPassword(email: string, password: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: User = {
    id: uuid(),
    email,
    password: hashedPassword,
    session: {
      sessionId: uuid(),
      activeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      idleExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
    },
  };
  db.users.push(newUser);
}

export function findUserById(id: string) {
  return db.users.find(user => user.id === id);
}

export function loginExistingUser(email: string) {
  const updatedSession = {
    sessionId: uuid(),
    activeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    idleExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
  };
  const updatedUsers = db.users.map(user => {
    if (user.email !== email) {
      return user;
    }
    return {
      ...user,
      session: updatedSession,
    };
  });
  db.users = updatedUsers;
  return updatedSession;
}

export function findUserBySessionId(sessionId?: string) {
  return db.users.find(user => user.session?.sessionId === sessionId)?.session;
}

export function removeSessionForUser(sessionId: string) {
  const updatedUsers = db.users.map(user => {
    if (user.session?.sessionId !== sessionId) {
      return user;
    }
    return {
      ...user,
      session: null,
    };
  });
  db.users = updatedUsers;
}

export function updateSessionForUser(sessionId: string) {
  const updatedUsers = db.users.map(user => {
    if (user.session?.sessionId !== sessionId) {
      return user;
    }
    return {
      ...user,
      session: {
        sessionId,
        activeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        idleExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      },
    };
  });
  db.users = updatedUsers;
}
