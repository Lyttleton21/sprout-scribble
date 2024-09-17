'use server'

import { db } from '@/server';
import { products } from '@/server/schema';
import { eq } from 'drizzle-orm';


export async function GetProduct(id:number){
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, id),
        })
        if(!product) throw new Error(`Product not found`);
        return {success: product};
    } catch (error) {
        return {error: "Failed to get product"};
    }
}

