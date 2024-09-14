'use server'

import LoginSchema from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action'
import { db } from '../..';
import { eq } from 'drizzle-orm';
import { users } from '../../schema';
import { generateEmailVerificationToken } from '../tokens';
import { sendVerificationEmail } from '../email';
import { signIn } from '../../auth';
import { AuthError } from 'next-auth';

const action = createSafeActionClient();

export const EmailSignIn = action(LoginSchema, async ({email, password, code}) => {
    try {
        // console.log(email, password, code);
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser?.email !== email) {
            return { error: "Email not found" }
          }

        // if user as not yet verify his/her email addresss!!!
        if(existingUser?.emailVerified === null){
            const verificationToken = await generateEmailVerificationToken(email);
            await sendVerificationEmail(
                verificationToken![0].email,
                verificationToken![0].token,
                existingUser.name
            )
            return {success: "Email Comfirmation Resent 🎉"}
        }

        await signIn('credentials', {
            email,
            password,
            redirectTo: "/"
        });

        return {Success :'User Sign in 🎉'};
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case 'CredentialsSignin':
                return {error: "Email or Password is Incorrect"};
                case 'AccessDenied':
                    return {error: error.message};
                case 'OAuthSignInError':
                    return {error: error.message};    
                default: 
                    return {error: "Some thing went wrong"};    
            }
        }
        throw error;
    }
});