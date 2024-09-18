import { db } from "@/server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./column";

export default async function page() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("Product not found");

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }
    const image = product.productVariants[0].variantImages[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });
  if (!dataTable) throw new Error("No data found");

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
