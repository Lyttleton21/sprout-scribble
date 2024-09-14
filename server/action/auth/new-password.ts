'use server'

import {createSafeActionClient} from 'next-safe-action'
import bcrypt from 'bcrypt'

import NewPasswordSchema from '@/types/new-password-schema'
import { getPasswordResetTokenByToken } from '../tokens';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { passwordResetTokens, users } from '@/server/schema';
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

const action = createSafeActionClient();

export const NewPassword = action(NewPasswordSchema, async ({password, token}) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL })
    const dbPool = drizzle(pool)

    if(!token) return {error: "Token is Required"};

    const existingToken = await getPasswordResetTokenByToken(token);
    if(!existingToken) return {error: "Token not Found"};

    const hasExpired  = new Date(existingToken.expires) < new Date();
    if(hasExpired) return {error: "Token has expired"};

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email)
    })
    if(!existingUser) return {error: "User not found"};

    const hashpassword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            password: hashpassword,
          })
          .where(eq(users.id, existingUser.id))
        await tx
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.id, existingToken.id))
    });

    return {success: "Password Updated"};
});