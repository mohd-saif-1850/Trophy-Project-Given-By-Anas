import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    _id?: string;
    name?: string;
    email?: string;
    mobileNumber?: string;
    verified?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      name?: string;
      email?: string;
      mobileNumber?: string;
      verified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    name?: string;
    email?: string;
    mobileNumber?: string;
    verified?: boolean;
  }
}
