"use client";

import { useCartStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./CartItems";
import CartMessage from "./CartMessage";
import Payment from "./Payment";
import OrderComfirmed from "./OrderComfirmed";

export default function CartDrawer() {
  const cart = useCartStore((s) => s.cart);
  const checkoutProgress = useCartStore((s) => s.checkoutProgress);
  const setCheckoutProgress = useCartStore((s) => s.setCheckoutProgress);

  return (
    <Drawer>
      <DrawerTrigger>
        <section className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </section>
      </DrawerTrigger>
      <DrawerContent className="bg-white min-h-50vh">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderComfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
