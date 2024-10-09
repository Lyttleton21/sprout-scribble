"use cilent";

import { useCartStore } from "@/lib/store";
import { createOrder } from "@/server/action/products/create-order";
import { CreatePaymentIntent } from "@/server/action/products/create-payment-intent";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useAction } from "next-safe-action/hooks";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
  totalPrice: number;
}

export default function PaymentForm({ totalPrice }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const setCheckoutProgress = useCartStore((s) => s.setCheckoutProgress);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { execute } = useAction(createOrder, {
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        setIsLoading(false);
        toast.success(data.success);
        setCheckoutProgress("confirmation-page");
        clearCart();
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }
    const { data } = await CreatePaymentIntent({
      amount: totalPrice * 100,
      currency: "usd",
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });
    if (data?.error) {
      setErrorMessage(data.error);
      setIsLoading(false);
      // router.push("/auth/login")
      // setCartOpen(false)
      return;
    }
    if (data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.success.clientSecretID!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: data.success.user as string,
        },
      });
      if (error) {
        setErrorMessage(error.message!);
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        execute({
          status: "pending",
          paymentIntentID: data.success.paymentIntentID,
          total: totalPrice,
          products: cart.map((item) => ({
            productID: item.id,
            variantID: item.variant.variantID,
            quantity: item.variant.quantity,
          })),
        });
      }
    }
  };

  console.log(errorMessage);

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        className="my-4 w-full"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}
