"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signInSchema, TSignInSchema } from "@/lib/zod";
import { authClient } from "@/lib/auth-client";
import { FormField } from "@/components/signup/FormField";
import { AuthFormWrapper } from "@/components/signup/AuthFormWrapper";
import { SocialButton } from "@/components/signup/SocialButton";
import { DividerWithText } from "@/components/signup/DividerWithText";
import { SubmitButton } from "@/components/signup/SubmitButton";
import { ImSpinner8 } from "react-icons/im";

const SignInForm = () => {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleAuthSuccess = useCallback(() => {
    window.location.href = "/dashboard";
  }, []);

  const onSubmit = useCallback(
    async (data: TSignInSchema) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        await authClient.signIn.email(
          {
            email: data.email,
            password: data.password,
            rememberMe: data.rememberMe,
          },
          {
            onSuccess: handleAuthSuccess,
            onError: (ctx) => {
              setErrorMessage(
                ctx.error?.message || "Sign in error. Please try again."
              );
              setIsSubmitting(false);
            },
          }
        );
      } catch (error) {
        setErrorMessage("Network error. Please check your connection.");
        setIsSubmitting(false);
      }
    },
    [handleAuthSuccess]
  );

  const handleGoogleSignIn = useCallback(() => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    authClient.signIn.google({
      callbackURL: `${window.location.origin}/dashboard`,
      onError: (ctx) => {
        setErrorMessage(ctx.error?.message || "Failed to sign in with Google");
        setIsGoogleLoading(false);
      },
      onSuccess: handleAuthSuccess,
    });
  }, [handleAuthSuccess]);

  return (
    <>
      {errorMessage && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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

        <FormField
          id="password"
          label="Password"
          type="password"
          icon={<FiLock className="h-5 w-5 text-gray-400" />}
          error={errors.password}
          register={register}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton
          loading={isSubmitting}
          icon={
            isSubmitting ? (
              <ImSpinner8 className="-ml-1 mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FiLogIn className="-ml-1 mr-2 h-5 w-5" />
            )
          }
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </SubmitButton>
      </form>

      <DividerWithText text="Or continue with" />

      <SocialButton
        provider="google"
        loading={isGoogleLoading}
        onClick={handleGoogleSignIn}
        icon={
          isGoogleLoading ? (
            <ImSpinner8 className="-ml-1 mr-2 h-5 w-5 animate-spin" />
          ) : (
            <FcGoogle className="-ml-1 mr-2 h-5 w-5" />
          )
        }
      >
        {isGoogleLoading ? "Signing in..." : "Continue with Google"}
      </SocialButton>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default function SignInPage() {
  return (
    <AuthFormWrapper
      header={{
        title: "Welcome Back",
        subtitle: "Sign in to your account",
        gradientColors: "from-blue-600 to-blue-500",
      }}
    >
      <SignInForm />
    </AuthFormWrapper>
  );
}
