import ProductType from "@/components/products/ProductType";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import ProductPick from "@/components/products/ProductPick";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });

  if (!variant) return null;
  return (
    <main>
      <section>
        <div className="flex-1">
          <h2>image</h2>
        </div>
        <div className="flex gap-2 flex-col flex-1">
          <h2>{variant?.product.title}</h2>
          <div>
            <ProductType variants={variant?.product.productVariants} />
          </div>
          <Separator />
          <p className="text-2x1 font-medium">
            {formatPrice(variant.product.price)}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: variant.product.description }}
          ></div>
          <p className="text-secondary-foreground">Available Colors:</p>
          <div className="flex gap-2">
            {variant.product.productVariants.map((productVariant) => (
              <ProductPick
                key={productVariant.id}
                productID={variant.productID}
                productType={productVariant.productType}
                color={productVariant.color}
                id={productVariant.id}
                image={productVariant.variantImages[0].url}
                price={variant.product.price}
                title={variant.product.title}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
