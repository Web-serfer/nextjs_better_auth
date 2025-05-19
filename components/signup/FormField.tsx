import { FiEye, FiEyeOff } from "react-icons/fi";
import { UseFormRegister, FieldError } from "react-hook-form";
import { TSignUpSchema } from "@/lib/zod";

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

export const FormField = ({
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
