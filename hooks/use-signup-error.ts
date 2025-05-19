import type { ToastState } from "@/components/Toast";
import type { TSignUpSchema } from "@/lib/zod";
import type { UseFormGetValues, UseFormReset } from "react-hook-form";

const ERROR_MESSAGES = {
  EMAIL_EXISTS: "Этот email уже зарегистрирован. Введите другой адрес.",
  DEFAULT: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
};

type HandleSignUpError = (
  error: unknown,
  getValues: UseFormGetValues<TSignUpSchema>,
  reset: UseFormReset<TSignUpSchema>,
  setToast: (toast: ToastState) => void
) => void;

export const useSignUpError = (): HandleSignUpError => {
  return (error, getValues, reset, setToast) => {
    // Определение сообщения об ошибке
    const errorMessage = getErrorMessage(error);

    // Логирование ошибки
    console.error("Registration Error:", error);

    // Показать сообщение пользователю
    setToast({
      message: errorMessage,
      type: "error",
      show: true,
    });

    // Сброс полей формы
    resetFormFields(getValues(), reset);
  };
};

// Вспомогательные функции
const getErrorMessage = (error: unknown): string => {
  if (isEmailExistsError(error)) {
    return ERROR_MESSAGES.EMAIL_EXISTS;
  }
  return ERROR_MESSAGES.DEFAULT;
};

const isEmailExistsError = (error: unknown): boolean => {
  const serverError = error as { code?: string; message?: string };
  return (
    serverError?.code === "USER_ALREADY_EXISTS" ||
    serverError?.message?.includes("P2002") ||
    serverError?.message?.includes("already exists")
  );
};

const resetFormFields = (
  currentValues: TSignUpSchema,
  reset: UseFormReset<TSignUpSchema>
) => {
  reset({
    ...currentValues,
    email: "",
    password: "",
    confirmPassword: "",
  });
};
