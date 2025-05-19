"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiUserPlus,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { signUpSchema, TSignUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { Toast } from "@/components/Toast";
import { authClient } from "@/lib/auth-client";

type FormFieldProps = {
  id: keyof TSignUpSchema;
  label: string;
  type: string;
  icon: React.ReactNode;
  error?: FieldError;
  register: UseFormRegister<TSignUpSchema>;
  placeholder: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  autoComplete?: string;
};

const FormField = ({
  id,
  label,
  type,
  icon,
  error,
  register,
  placeholder,
  showPasswordToggle,
  onTogglePassword,
  autoComplete,
}: FormFieldProps) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        {...register(id)}
        className={`block w-full pl-10 pr-3 py-2 border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={`${id}-error`}
        autoComplete={autoComplete}
      />
      {showPasswordToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          onClick={onTogglePassword}
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          {type === "password" ? (
            <FiEye className="h-5 w-5" />
          ) : (
            <FiEyeOff className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
        {error.message}
      </p>
    )}
  </div>
);

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit = useCallback(
    (formData: TSignUpSchema) => {
      // 🔍 Логируем данные из формы перед отправкой
      console.log("Form data submitted:", formData);
      const { confirmPassword, rememberMe, ...signUpData } = formData;

      authClient.signUp.email(
        {
          email: signUpData.email.toLowerCase().trim(),
          password: signUpData.password,
          name: signUpData.name.trim(),
          callbackURL: `${window.location.origin}/dashboard`,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setToast({
              message: "Verification email sent! Check your inbox.",
              type: "success",
              show: true,
            });
            reset();
            router.push("/verify-email");
            setIsLoading(false);
          },
          onError: (ctx) => {
            const message =
              ctx.error instanceof Error
                ? ctx.error.message.includes("P2002")
                  ? "Email already registered"
                  : ctx.error.message
                : "An unexpected error occurred";

            setToast({
              message,
              type: "error",
              show: true,
            });
            setIsLoading(false);
          },
        }
      );
    },
    [reset, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      {toast?.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-100 mt-1">Join our community today</p>
        </div>
        <div className="p-6 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
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
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus className="-ml-1 mr-2 h-5 w-5" />
                  Create Account
                </>
              )}
            </button>
          </form>
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
        </div>
      </div>
    </div>
  );
}
