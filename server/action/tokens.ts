'use server'

import crypto from 'crypto'
import { db } from '..';
import { eq } from 'drizzle-orm';
import { emailTokens, passwordResetTokens, twoFactorTokens, users } from '../schema';

// Reading from the email_token model if the provide email exists
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    })
    return verificationToken
  } catch (error) {
    return null
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
        });
    
        return checkToken;
    } catch (error) {
        console.log(error);
    }
}

export const newEmailVerification = async (token: string) => {
    try {
        console.log("TOKEN!!!!!!!!!",token);
        
        const existingToken = await getVerificationTokenByEmail(token)
        if (!existingToken) return { error: "Token not found" }

        const hasExpired = new Date(existingToken.expires) < new Date()
        if (hasExpired) return { error: "Token has expired" }
      
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, existingToken.email),
        })
        if (!existingUser) return { error: "Email does not exist" }
      
        await db
          .update(users)
          .set({
            emailVerified: new Date(),
            email: existingToken.email,
          })
          .where(eq(users.id, existingUser.id))
      
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
        return { success: "Email Verified" }

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

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
      const twoFactorToken = await db.query.twoFactorTokens.findFirst({
        where: eq(twoFactorTokens.email, email),
      })
      return twoFactorToken
    } catch {
      return null
    }
  }
  
  export const getTwoFactorTokenByToken = async (token: string) => {
    try {
      const twoFactorToken = await db.query.twoFactorTokens.findFirst({
        where: eq(twoFactorTokens.token, token),
      })
      return twoFactorToken
    } catch {
      return null
    }
}

export const generateTwoFactorToken = async (email: string) => {
    try {
      const token = crypto.randomInt(100_000, 1_000_000).toString()
      //Hour Expiry
      const expires = new Date(new Date().getTime() + 3600 * 1000)
  
      const existingToken = await getTwoFactorTokenByEmail(email)
      if (existingToken) {
        await db
          .delete(twoFactorTokens)
          .where(eq(twoFactorTokens.id, existingToken.id))
      }
      const twoFactorToken = await db
        .insert(twoFactorTokens)
        .values({
          email,
          token,
          expires,
        })
        .returning()
      return twoFactorToken
    } catch (e) {
      return null
    }
  }