"use client";

import { EmailRegister } from "@/server/action/auth/EmailRegister";
import RegisterSchema from "@/types/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthCard from "./AuthCard";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(EmailRegister, {
    onSuccess(data) {
      if (data?.error) return setError(data.error);
      if (data?.success) return setSuccess(data.success);
    },
  });

  const onSubmitForm = (value: z.infer<typeof RegisterSchema>) => {
    // console.log(value);
    execute(value);
  };

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <AuthCard
      showSocial
      cardTitle={"Create Account 🎉"}
      backButtonhref={"/auth/login"}
      backButtonLabel={"Already have an Account? Login here"}
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)}>
            {/* Inputs div */}
            <div>
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="abc" type="text" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email field */}
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

              {/* Password field */}
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

              {/* Message after submiting form*/}
              <FormSuccess message={success} />
              <FormError message={error} />
              {/* Message after submiting form */}

              <Button
                className={cn(
                  "w-full my-2",
                  status === "executing" ? "animate-pulse" : ""
                )}
                type="submit"
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
