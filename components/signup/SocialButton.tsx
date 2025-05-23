import { ReactNode } from "react";

type SocialButtonProps = {
  children: ReactNode;
  loading: boolean;
  onClick: () => void;
  icon: ReactNode;
  provider?: "google" | "github";
};

export const SocialButton = ({
  children,
  loading,
  onClick,
  icon,
  provider,
}: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed hover:cursor-pointer"
  >
    {loading ? (
      <svg
        className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600"
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
    ) : (
      icon
    )}
    {children}
  </button>
);
