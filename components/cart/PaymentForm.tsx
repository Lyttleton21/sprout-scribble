"use cilent";

import { useCartStore } from "@/lib/store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CreatePaymentIntent } from "@/server/action/products/create-payment-intent";

interface Props {
  totalPrice: number;
}

export default function PaymentForm({ totalPrice }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore((s) => s.cart);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        console.log("Order Save!!!");

        // execute({
        //   status: "pending",
        //   paymentIntentID: data.success.paymentIntentID,
        //   total: totalPrice,
        //   products: cart.map((item) => ({
        //     productID: item.id,
        //     variantID: item.variant.variantID,
        //     quantity: item.variant.quantity,
        //   })),
        // })
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button disabled={!stripe || !elements}>
        <span>Pay Now</span>
      </Button>
    </form>
  );
}
