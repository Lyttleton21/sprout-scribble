"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatPrice from "@/lib/format-price";
import { useCartStore } from "@/lib/store";
import emptyBox from "@/public/empty-box.json";
import { createId } from "@paralleldrive/cuid2";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "../ui/button";

export default function CartItems() {
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const setCheckoutProgress = useCartStore((s) => s.setCheckoutProgress);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 && (
        <div className="flex-col w-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your Cart is Empty
            </h2>
            <Lottie className="h-64" animationData={emptyBox} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="max-h-80 w-full overflow-y-auto">
          <Table className="text-black max-w-2xl mx-auto">
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
                <TableRow key={(item.id + item.variant.variantID).toString()}>
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
      <motion.div className="flex items-center justify-center relative my-4 overflow-hidden text-black">
        <span className="text-md">Total: $</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, i) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="text-md inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {cart.length > 0 && (
        <Button
          onClick={() => setCheckoutProgress("payment-page")}
          className="max-w-md w-full"
        >
          Checkout
        </Button>
      )}
    </motion.div>
  );
}
