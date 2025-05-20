"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordSchema } from "@/lib/zod";
import { Toast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";
import { FormField } from "@/components/signup/FormField";
import { AuthFormWrapper } from "@/components/signup/AuthFormWrapper";
import { SubmitButton } from "@/components/signup/SubmitButton";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (data: { email: string }) => {
    try {
      await authClient.resetPassword(
        { email: data.email },
        {
          onRequest: () => setToast(null),
          onSuccess: () => {
            setToast({
              message: "Password reset link sent to your email!",
              type: "success",
              show: true,
            });
            setIsSubmitted(true);
          },
          onError: (error) => {
            setToast({
              message: error.message || "Failed to send reset email",
              type: "error",
              show: true,
            });
          },
        }
      );
    } catch (error) {
      setToast({
        message: "An unexpected error occurred",
        type: "error",
        show: true,
      });
    }
  }, []);

  return (
    <>
      {toast?.show && (
        <Toast {...toast} onClose={() => setToast(null)} duration={5000} />
      )}

      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="email"
            label="Email Address"
            type="email"
            icon={<FiMail className="h-5 w-5 text-gray-400" />}
            error={errors.email}
            register={register}
            placeholder="your@example.com"
            autoComplete="email"
          />

          <SubmitButton icon={<FiCheckCircle className="-ml-1 mr-2 h-5 w-5" />}>
            Send Reset Link
          </SubmitButton>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="text-lg font-medium">Check your email</h3>
          <p className="text-gray-600">
            We've sent instructions to reset your password to your email
            address.
          </p>
        </div>
      )}

      <div className="mt-6 text-center text-sm">
        <Link
          href="/sign-in"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Return to sign in
        </Link>
      </div>
    </>
  );
};

export default function ForgotPasswordPage() {
  return (
    <AuthFormWrapper
      header={{
        title: "Forgot Password",
        subtitle: "Enter your email to reset password",
        gradientColors: "from-blue-600 to-blue-500",
      }}
    >
      <ForgotPasswordForm />
    </AuthFormWrapper>
  );
}
