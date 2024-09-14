'use server'

import { SendPasswordResetEmailTemplate } from "@/components/email/SendPasswordResetEmailTemplate";
import { VerificationTokenEmailTemplate } from "@/components/email/VerificatioTokenEmailTemplate";
import getBaseURL from "@/lib/base-url"
import {Resend} from "resend";

const domain = getBaseURL();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email:string, token:string, name:string | null) => {
    try {
        const confirmLink = `${domain}/auth/new-verification?token=${token}`;
        const {data, error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Confirmation Email",
            react: VerificationTokenEmailTemplate({name, confirmLink})
          });
          if(data) return data;
          if(error) return error;
    } catch (error) {
        console.log(error);
    }
}

export const SendPasswordResetEmail = async (email:string, token:string, name:string | null) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;
    const {data, error} = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Password Reset Email",
      react: SendPasswordResetEmailTemplate({name, confirmLink})
    });
    if(data) return data;
    if(error) return error;
}   