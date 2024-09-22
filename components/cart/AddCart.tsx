"use client";

import { useCartStore } from "@/lib/store";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { redirect, useSearchParams } from "next/navigation";

export default function AddCart() {
  const addToCart = useCartStore((s) => s.addToCart);
  const [quantity, setQuantity] = useState<number>(1);
  const params = useSearchParams();
  const id = Number(params.get("id"));
  const productID = Number(params.get("productID"));
  const title = params.get("title");
  const type = params.get("type");
  const price = Number(params.get("price"));
  const image = params.get("image");

  if (!id || !productID || !title || !type || !price || !image) {
    toast.error("Product not found");
    return redirect("/");
  }

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          disabled={quantity <= 1}
          variant={"secondary"}
          className="text-primary"
          onClick={() => {
            if (quantity > 1) setQuantity(quantity - 1);
          }}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added ${title + " " + type} to your cart!`);
          addToCart({
            id: productID,
            variant: { variantID: id, quantity },
            image,
            name: title + type,
            price,
          });
        }}
      >
        Add to Cart
      </Button>
    </>
  );
}
