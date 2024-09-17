"use client";

import { ProductSchema } from "@/types/product-schema";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { CreateProduct } from "@/server/action/products/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GetProduct } from "@/server/action/products/get-product";

export default function ProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await GetProduct(id);
      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/products");
        return;
      }
      if (data.success) {
        const id = editMode;
        const { title, price, description } = data.success;
        form.setValue("title", title);
        form.setValue("price", price);
        form.setValue("description", description);
        form.setValue("id", id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onBlur",
  });

  const { execute, status } = useAction(CreateProduct, {
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        router.push("/dashboard/products");
        toast.success(data.success);
      }
    },
    onExecute: (data) => {
      const promise = () =>
        new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
      if (editMode) {
        toast.promise(promise, {
          loading: "Editing Product...",
        });
      }
      if (!editMode) {
        toast.promise(promise, {
          loading: "Creating Product...",
        });
      }
    },
  });

  async function onSubmit(value: z.infer<typeof ProductSchema>) {
    execute(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit Mode" : "Create Mode"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Saekdong Stripe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step="0.1"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={status === "executing" || !form.formState.isValid}
              type="submit"
            >
              {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
