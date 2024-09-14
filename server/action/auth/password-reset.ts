'use server'

import { db } from '@/server';
import { users } from '@/server/schema';
import ResetPasswordSchema from '@/types/reset-password-schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { SendPasswordResetEmail } from '../email';
import { generatePasswordResetToken } from '../tokens';

const action = createSafeActionClient();

export const PasswordReset = action(ResetPasswordSchema, async({email})  => {
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });
        if(!existingUser) return {error: "User not found"}

        const passwordResetToken = await generatePasswordResetToken(email);
        if(!passwordResetToken) return {error: "Token not found"}

        if(passwordResetToken) {
            await SendPasswordResetEmail(passwordResetToken![0].email, passwordResetToken![0].token, existingUser.name);
        }
        return {success: "Reset Password Email Sent"}
    } catch (error) {
        console.log(error);
        
    }
});