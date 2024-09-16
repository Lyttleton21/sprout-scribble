'use server'

import { db } from '@/server';
import { products } from '@/server/schema';
import { ProductSchema } from '@/types/product-schema';
import { eq } from 'drizzle-orm';
import {createSafeActionClient} from 'next-safe-action'
import { revalidatePath } from 'next/cache';


const action = createSafeActionClient();

export const CreateProduct = action(ProductSchema, async ({description, price,title, id}) => {
    try {
        if(id){
            const currentProduct = await db.query.products.findFirst({
                where: eq(products.id, id)
            });
            if(!currentProduct) return {error: "Product not found"};

            const editedProduct = await db.update(products).set({
                description, price,title
            }).where(eq(products.id, id)).returning();

            revalidatePath('/dashboard/products');
            return {success: `Product ${editedProduct[0].title} updated successfully`}
        }
        if(!id){
            const newProduct = await db
                .insert(products)
                .values({ description, price, title })
                .returning();
            revalidatePath('/dashboard/products');
            return {success: `Product ${newProduct[0].title} Created successfully`}
        }
    } catch (error) {
        return {error: JSON.stringify(error)};
    }
});