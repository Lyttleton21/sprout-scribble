'use server'

import { db } from '@/server';
import { products } from '@/server/schema';
import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { z } from "zod";


const action = createSafeActionClient();

export const deleteProduct = action(z.object({ id: z.number() }), async ({ id }) => {
    try {
        const data = await db.delete(products).where(eq(products.id, id)).returning();
        if(data) {
         revalidatePath('/dashboard/products');
         return {success: `Product ${data[0].title} Deleted successfully`}
        }
     } catch (error) {
        console.log(error);
         return {error: "Failed to delete product"}
     }
});