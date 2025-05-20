import { z } from "zod";

// Общие константы для повторного использования
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Общие сообщения об ошибках
const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  NAME_TOO_SHORT: "Name must be at least 2 characters",
  EMAIL_INVALID: "Invalid email format",
  PASSWORD_TOO_WEAK:
    "Password must contain: minimum 8 characters, one uppercase letter and one number",
  PASSWORDS_MISMATCH: "Passwords don't match",
  NO_LEADING_TRAILING_SPACES:
    "Name must not contain leading or trailing spaces",
};

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, ERROR_MESSAGES.REQUIRED)
      .min(2, ERROR_MESSAGES.NAME_TOO_SHORT)
      .regex(/^[^\s]+(\s+[^\s]+)*$/, ERROR_MESSAGES.NO_LEADING_TRAILING_SPACES)
      .transform((name) => name.trim()),

    email: z
      .string()
      .min(1, ERROR_MESSAGES.REQUIRED)
      .email(ERROR_MESSAGES.EMAIL_INVALID)
      .transform((email) => email.toLowerCase().trim()),

    password: z
      .string()
      .min(1, ERROR_MESSAGES.REQUIRED)
      .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} characters`)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.PASSWORD_TOO_WEAK),

    confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED),

    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .transform((email) => email.toLowerCase().trim()),

  password: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .min(PASSWORD_MIN_LENGTH, `Minimum ${PASSWORD_MIN_LENGTH} characters`),

  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .transform((email) => email.toLowerCase().trim()),
});

// Типы
export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TSignInSchema = z.infer<typeof signInSchema>;
export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
