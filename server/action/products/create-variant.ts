'use server'
import { db } from '@/server';
import { products, productVariants, variantImages, variantTags } from '@/server/schema';
import { ProductSchema } from '@/types/product-schema';
import VariantSchema from '@/types/variant-schema';
import { eq } from 'drizzle-orm';
import {createSafeActionClient} from 'next-safe-action'
import { revalidatePath } from 'next/cache';


const action = createSafeActionClient();

export const createVariant = action(
  VariantSchema,
  async ({
    color,
    editMode,
    id,
    productID,
    productType,
    tags,
    variantImages: newImgs,
  }) => {
    try {
      if (editMode && id) {
        const editVariant = await db
          .update(productVariants)
          .set({ color, productType, updated: new Date() })
          .where(eq(productVariants.id, id))
          .returning()
        await db
          .delete(variantTags)
          .where(eq(variantTags.variantID, editVariant[0].id))
        await db.insert(variantTags).values(
          tags.map((tag:any) => ({
            tag,
            variantID: editVariant[0].id,
          }))
        )
        await db
          .delete(variantImages)
          .where(eq(variantImages.variantID, editVariant[0].id))
        await db.insert(variantImages).values(
          newImgs.map((img: { name: string; size: number; url: string; }, idx: any) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: editVariant[0].id,
            order: idx,
          }))
        )
        // algoliaIndex.partialUpdateObject({
        //   objectID: editVariant[0].id.toString(),
        //   id: editVariant[0].productID,
        //   productType: editVariant[0].productType,
        //   variantImages: newImgs[0].url,
        // })
        revalidatePath("/dashboard/products");
        revalidatePath("/");
        return { success: `Edited ${productType}` }
      }
      if (!editMode) {
        const newVariant = await db
          .insert(productVariants)
          .values({
            color,
            productType,
            productID,
          })
          .returning()
        const product = await db.query.products.findFirst({
          where: eq(products.id, productID),
        })
        await db.insert(variantTags).values(
          tags.map((tag: any) => ({
            tag,
            variantID: newVariant[0].id,
          }))
        )
        await db.insert(variantImages).values(
          newImgs.map((img: { name: any; size: any; url: any; }, idx: any) => ({
            name: img.name,
            size: img.size,
            url: img.url,
            variantID: newVariant[0].id,
            order: idx,
          }))
        )
        // if (product) {
        //   algoliaIndex.saveObject({
        //     objectID: newVariant[0].id.toString(),
        //     id: newVariant[0].productID,
        //     title: product.title,
        //     price: product.price,
        //     productType: newVariant[0].productType,
        //     variantImages: newImgs[0].url,
        //   })
        // }
        revalidatePath("/dashboard/products")
        revalidatePath("/");
        return { success: `Added ${productType}` }
      }
    } catch (error) {
      return { error: "Failed to create variant" }
    }
  }
)