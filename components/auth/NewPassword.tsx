"use client";

import { cn } from "@/lib/utils";
import NewPasswordSchema from "@/types/new-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import AuthCard from "./AuthCard";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { NewPassword } from "@/server/action/auth/new-password";

export const NewPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const token = useSearchParams().get("token");

  const { execute, status } = useAction(NewPassword, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    },
  });

  const onSubmitForm = (value: z.infer<typeof NewPasswordSchema>) => {
    // console.log(value);
    execute({ password: value.password, token });
  };
  return (
    <div>
      <AuthCard
        cardTitle={"Enter New Password 🎉"}
        backButtonhref={"/auth/login"}
        backButtonLabel={"Back to Login"}
      >
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)}>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="*****"
                          disabled={status === "executing"}
                          type="password"
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormSuccess message={success} />
                <FormError message={error} />
                <Button
                  className={cn(
                    "w-full my-2",
                    status === "executing" ? "animate-pulse" : ""
                  )}
                  type="submit"
                >
                  Reset-Password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AuthCard>
    </div>
  );
};
