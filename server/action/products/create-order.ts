"use server"

import { createOrderSchema } from "@/types/order-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from "@/server"
import { auth } from "@/server/auth"
import { orderProduct, orders } from "@/server/schema"

interface product{
  quantity:number, 
  productID:number, 
  variantID: number
}[]

const action = createSafeActionClient()

export const createOrder = action(createOrderSchema, async ({  status, total, products, paymentIntentID}) => {
    // console.log(products);
    
    const user = await auth()
    if (!user) return { error: "user not found" }

    const order = await db
      .insert(orders)
      .values({
        status,
        paymentIntentID,
        total,
        userID: user.user.id,
    }).returning();

    const orderProducts = products.map(async (quantity:number, productID:number, variantID:number) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantsID: variantID,
        })
    });
    return { success: "Order has been added" }
  }
)