"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUserPlus, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { signUpSchema, TSignUpSchema } from "@/lib/zod";
import { Toast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";
import { FormField } from "@/components/signup/FormField";
import { AuthFormWrapper } from "@/components/signup/AuthFormWrapper";
import { SocialButton } from "@/components/signup/SocialButton";
import { DividerWithText } from "@/components/signup/DividerWithText";
import { SubmitButton } from "@/components/signup/SubmitButton";
import { useSignUpError } from "@/hooks/use-signup-error";

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    show: boolean;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setFocus,
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  const handleSignUpError = useSignUpError();

  // Автофокус на email при ошибке существующего адреса
  useEffect(() => {
    if (toast?.type === "error") {
      setFocus("email");
    }
  }, [toast, setFocus]);

  const logFormData = useCallback((data: TSignUpSchema) => {
    console.log("🚀 User registration data:", {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      rememberMe: data.rememberMe,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const onSubmit = useCallback(
    (formData: TSignUpSchema) => {
      const { confirmPassword, rememberMe, ...signUpData } = formData;

      logFormData(formData);

      authClient.signUp.email(
        {
          email: signUpData.email.toLowerCase().trim(),
          password: signUpData.password,
          name: signUpData.name.trim(),
          callbackURL: `${window.location.origin}/dashboard`,
        },
        {
          onRequest: () => setIsLoading(true),
          onSuccess: () => {
            setToast({
              message: "Verification email sent! Check your inbox.",
              type: "success",
              show: true,
            });
            reset();

            //  Сообщение 3 sec
            setTimeout(() => {
              router.push("/verify-email");
            }, 3000);

            setIsLoading(false);
          },
          onError: (ctx) => {
            handleSignUpError(ctx.error, getValues, reset, setToast);
            setIsLoading(false);
          },
        }
      );
    },
    [reset, router, logFormData, handleSignUpError, getValues]
  );

  const signInWithGoogle = useCallback(() => {
    setIsGoogleLoading(true);
    authClient.signIn.google({
      callbackURL: `${window.location.origin}/dashboard`,
      onError: (ctx) => {
        console.error("❌ Google auth error:", {
          error: ctx.error,
          timestamp: new Date().toISOString(),
        });

        setToast({
          message: ctx.error?.message || "Failed to sign in with Google",
          type: "error",
          show: true,
        });
        setIsGoogleLoading(false);
      },
    });
  }, []);

  return (
    <>
      {toast?.show && (
        <Toast {...toast} onClose={() => setToast(null)} duration={5000} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="name"
          label="Full Name"
          type="text"
          icon={<FiUser className="h-5 w-5 text-gray-400" />}
          error={errors.name}
          register={register}
          placeholder="John Doe"
          autoComplete="name"
        />

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
          type={showPassword ? "text" : "password"}
          icon={<FiLock className="h-5 w-5 text-gray-400" />}
          error={errors.password}
          register={register}
          placeholder="••••••••"
          autoComplete="new-password"
          showPasswordToggle
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          icon={<FiLock className="h-5 w-5 text-gray-400" />}
          error={errors.confirmPassword}
          register={register}
          placeholder="••••••••"
          autoComplete="new-password"
          showPasswordToggle
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

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

        <SubmitButton
          loading={isLoading}
          icon={<FiUserPlus className="-ml-1 mr-2 h-5 w-5" />}
        >
          Create Account
        </SubmitButton>
      </form>

      <DividerWithText text="Or continue with" />

      <SocialButton
        provider="google"
        loading={isGoogleLoading}
        onClick={signInWithGoogle}
        icon={<FcGoogle className="-ml-1 mr-2 h-5 w-5" />}
      >
        Sign up with Google
      </SocialButton>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default function SignUpPage() {
  return (
    <AuthFormWrapper
      header={{
        title: "Create Account",
        subtitle: "Join our community today",
        gradientColors: "from-blue-600 to-blue-500",
      }}
    >
      <SignUpForm />
    </AuthFormWrapper>
  );
}
