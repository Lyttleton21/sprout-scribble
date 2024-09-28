'use server'

import { auth } from '@/server/auth';
import { paymentIntentSchema } from '@/types/payment-intent-schema';
import { createSafeActionClient } from 'next-safe-action';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET!);
const action = createSafeActionClient();

export const CreatePaymentIntent = action(paymentIntentSchema, async({amount, cart, currency}) => {
    try {
        const user = await auth();
        if(!user) return {error: 'Please Login to Continue'}
        if(!amount) return {error: 'No Product to Checkout'}

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods:{
                enabled: true
            },
            metadata: {
                cart: JSON.stringify(cart)
            }
        })
        return{
            success: {
                paymentIntentID: paymentIntent.id,
                clientSecretID: paymentIntent.client_secret,
                user: user.user.email
            }
        }
    } catch (error) {
        
    }
});