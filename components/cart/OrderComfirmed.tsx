"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/store";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import OrderConfirmed from "../../public/order-confirmed.json";

export default function OrderComfirmed() {
  const setCheckoutProgress = useCartStore((s) => s.setCheckoutProgress);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie animationData={OrderConfirmed} className="h-56 my-4" />
      </motion.div>
      <h2 className="font-medium text-2xl">Thank you for your purchase!</h2>
      <Link href={"/dashboard/orders"}>
        <Button
          variant={"secondary"}
          onClick={() => {
            setCartOpen(false);
            setCheckoutProgress("cart-page");
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
}
