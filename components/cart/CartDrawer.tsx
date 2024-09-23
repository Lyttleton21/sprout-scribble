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

export default function CartDrawer() {
  const cart = useCartStore((s) => s.cart);

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
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
        </div>
      </DrawerTrigger>
      <DrawerContent className="bg-white min-h-50vh">
        <DrawerHeader>
          <h2 className="text-center">Cart Progress</h2>
        </DrawerHeader>
        <div className="overflow-auto p-4">
          <CartItems />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
