'use server'

import crypto from 'crypto'
import { db } from '..';
import { eq } from 'drizzle-orm';
import { emailTokens, passwordResetTokens, users } from '../schema';

// Reading from the email_token model if the provide email exists
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, email),
        })
        return verificationToken;
    } catch (error) {
        console.log(error);
        return;
    }
}

// creating a verification token
export const generateEmailVerificationToken =  async (email:string) => {
    try {
        const token = crypto.randomUUID();
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        const existingToken = await getVerificationTokenByEmail(email);

        if(existingToken){
            await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
        }

        const verificationToken = await db.insert(emailTokens).values({
            email,
            token,
            expires
        }).returning();

        return verificationToken;
    } catch (error) {
        console.log(error);
    }
}

// Reading from the email_token table if the provide token exists
export const checkEmailToken = async (token: string) => {
    try {
        const checkToken = await db.query.emailTokens.findFirst({
            where : eq(emailTokens.token, token)
        })
        return checkToken;
    } catch (error) {
        console.log(error);
        
    }
}

export const newVerification = async (token: string) => {
    try {
        console.log("TOKEN!!!!!!!!!",token);
        
        // check if token is valid
        const existingToken = await checkEmailToken(token);
        if(!existingToken) return {error: "Token does not Exist"};

        // check if token has expired 
        const hasExpires = new Date(existingToken.expires) < new Date();
        if(hasExpires) return {error: "Token has Expires"};

        // checking if Email exist
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email)
        });
        if(!existingUser) return {error: "Email does not exist"};

        // Verify the Email address
        await db.update(users).set({
            emailVerified: new Date(),
            email: existingToken.email
        });

        // Delete the existing token
        await db.delete(emailTokens).where(
            eq(emailTokens.id, existingToken.id)
        );

        return {success: "Email is Verified"};

    } catch (error) {
        console.log(error);
    }
}

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
      const passwordResetToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.token, token)
      })
      return passwordResetToken;
    } catch (err) {
        console.log(err);
      return null
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
      const passwordResetToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.email, email),
      })
      return passwordResetToken
    } catch {
      return null
    }
  }

export const generatePasswordResetToken = async (email:string) => {
    try {
        const token = crypto.randomUUID();
        //Hour Expiry
        const expires = new Date(new Date().getTime() + 3600 * 1000);

        const existingToken = await getPasswordResetTokenByEmail(email)
        if (existingToken) {
        await db.delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id))
        }
        const passwordResetToken = await db
        .insert(passwordResetTokens)
        .values({
            email,
            token,
            expires,
        })
        .returning();
        return passwordResetToken;
    } catch (error) {
        return;
    }
}