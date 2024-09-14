"use client";

import { newVerification } from "@/server/action/tokens";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./AuthCard";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export const EmailVerificationForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = useSearchParams().get("token");
  const router = useRouter();

  const handleVerification = useCallback(() => {
    console.log(token);

    if (success || error) return;
    if (!token) {
      setError("Token not Found");
      return;
    }
    newVerification(token).then((data) => {
      if (data?.error) {
        setError(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <div>
      <AuthCard
        cardTitle={"Verify Your Account..."}
        backButtonhref={"/auth/login"}
        backButtonLabel={"back to login"}
      >
        <div className="flex items-center flex-col justify-center w-full">
          <p>{!success && !error ? "Verifing Email..." : null}</p>
          <FormSuccess message={success} />
          <FormError message={error} />
        </div>
      </AuthCard>
    </div>
  );
};
