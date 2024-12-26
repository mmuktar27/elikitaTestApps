import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    tokenSub: string;
    accessToken: string;
    idToken: string;
    user: {
      id: string;
      roles: [string];
      microsoftId: string;
      workEmail: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    roles: [string];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    roles: [string];
  }
}
