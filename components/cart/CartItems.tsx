"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatPrice from "@/lib/format-price";
import { useCartStore } from "@/lib/store";
import { MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

export default function CartItems() {
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);
  return (
    <div>
      {cart.length === 0 && (
        <div>
          <h1>Cart is empty...</h1>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table className="text-black">
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <MinusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              variantID: item.variant.variantID,
                              quantity: 1,
                            },
                          });
                        }}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
