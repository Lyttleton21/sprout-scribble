import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import google from "next-auth/providers/google";
import github from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { accounts, users } from "./schema";
import LoginSchema from "@/types/login-schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
 
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts
      }),
    secret: process.env.AUTH_SECRET,
    session: {strategy:"jwt"},
    providers: [
        google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        github({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true
        }),
        Credentials({
            authorize: async (credentials) => {
                const validateFields = LoginSchema.safeParse(credentials);
        
                if (validateFields.success) {
                  const { email, password } = validateFields.data;
        
                  const user = await db.query.users.findFirst({
                    where: eq(users.email, email)
                  })
                  if (!user || !user.password) return null;
        
                  const passwordMatch = await bcrypt.compare(password, user.password!);
                  if (passwordMatch) return user;
                }
                return null;
              }
        })
    ]
});