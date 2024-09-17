import { db } from "@/server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./column";

export default async function page() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/dashboard/settings");

  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error("Product not found");

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      variants: [],
      image: placeholder.src,
    };
  });
  if (!dataTable) throw new Error("No data table");

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
