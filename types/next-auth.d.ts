
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      name?: string;
      avatar?: string;
      numberphone?: string;
      address?: string;
      delivery?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string | null;
    name?: string;
    avatar?: string;
    numberphone?: string;
    address?: string;
    delivery?: string | null;
  }
}
