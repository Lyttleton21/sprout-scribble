"use client";

import { useCartStore } from "@/lib/store";
import { motion } from "framer-motion";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowLeft } from "lucide-react";

export default function CartMessage() {
  const checkoutProgress = useCartStore((s) => s.checkoutProgress);
  const setCheckoutProgress = useCartStore((s) => s.setCheckoutProgress);
  return (
    <motion.div
      className="text-center"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle className=" text-black">
        {checkoutProgress === "cart-page" && "Your Cart Items"}
        {checkoutProgress === "payment-page" && "Choose a Payment Method"}
        {checkoutProgress === "confirmation-page" && "Order Confirmation"}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkoutProgress === "cart-page" && "View and Edit Your Bag."}
        {checkoutProgress === "payment-page" && (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
          >
            <ArrowLeft size={14} /> Head back to cart
          </span>
        )}
        {checkoutProgress === "confirmation-page" && "Order Confirmation"}
      </DrawerDescription>
    </motion.div>
  );
}
