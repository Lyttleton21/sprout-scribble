import Products from "@/components/products/products";
import { db } from "@/server";

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (!data) return "No Product Found";

  return (
    <main>
      <div>
        <Products variants={data} />
      </div>
    </main>
  );
}
