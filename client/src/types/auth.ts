interface DatabaseUserAttributes {
  name: string;
  email: string;
  bio: string;
  isOauth: boolean;
  image: string;
}

export interface Session {
  id: string;
  expiresAt: Date;
  fresh: boolean;
  userId: string;
}

export interface User extends DatabaseUserAttributes {
  id: string;
  username: string;
}

export type UserSession =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };
