import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {

interface User {
    name: string;
    role: string;
    accessToken: string;
    accessTokenExpires: any;
    }
  interface Session {
    name: string;
    role: string;
    token: string;
    user: User;
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
    exp: number;
    user: User;
  }
}