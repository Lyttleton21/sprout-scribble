import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";
import ProductForm from "../add-product/ProductForm";

export default async function page() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/dashboard/settings");

  return <ProductForm />;
}
