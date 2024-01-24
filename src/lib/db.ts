// this file will later be replaced by a schema and an actual database

type Session = {
  sessionId: string;
  idleExpiresAt: Date;
  activeExpiresAt: Date;
};

export type User = {
  id: string;
  email: string;
  password: string;
  session: Session | null;
};

const db: { users: Array<User> } = { users: [] };

export default db;
