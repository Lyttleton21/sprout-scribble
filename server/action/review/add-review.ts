'use server'

import { db } from '@/server';
import { auth } from '@/server/auth';
import { reviews } from '@/server/schema';
import { reviewSchema } from '@/types/reviews-schema';
import { and, eq } from 'drizzle-orm';
import {createSafeActionClient} from 'next-safe-action'
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const AddReview = action(reviewSchema, async({rating, comment, productID}) => {
    try {
        const session = await auth();
        if(!session) return { error: "Please sign in" };

        const reviewExists = await db.query.reviews.findFirst({
            where: and(
                eq(reviews.productID, productID),
                eq(reviews.userID, session.user.id)
            )
        });
        if(reviewExists) return {error: "You have already review this product."};

        const newReview = await db.insert(reviews).values({
            productID,
            comment,
            rating,
            userID: session.user.id
        }).returning();
        revalidatePath(`/products/${productID}`);
        return {success: newReview[0]}
    } catch (error) {
        return {error: JSON.stringify(error)};
    }
});