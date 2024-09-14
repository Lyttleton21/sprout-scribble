"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AuthCard from "./AuthCard";
import * as z from "zod";
import LoginSchema from "@/types/login-schema";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EmailSignIn } from "@/server/action/auth/EmailSignIn";
import { useAction } from "next-safe-action/hooks";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status } = useAction(EmailSignIn, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.Success) setSuccess(data.Success);
      // if (data.twoFactor) setShowTwoFactor(true);
    },
  });

  const onSubmitForm = (value: z.infer<typeof LoginSchema>) => {
    // console.log(value);
    execute(value);
  };
  return (
    <AuthCard
      cardTitle={"Welcome Back 🎉"}
      backButtonhref={"/auth/register"}
      backButtonLabel={"Create a New Account"}
      showSocial
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)}>
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="abc@email.com"
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="*****" type="password" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button asChild variant={"link"} size={"sm"}>
              <Link href={"/auth/reset"}>Forget Password?</Link>
            </Button>
            <Button
              className={cn(
                "w-full my-2",
                status === "executing" ? "animate-pulse" : ""
              )}
              type="submit"
            >
              {/* {showTwoFactor ? "Verify" : "Sign In"} */}
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
