"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth/auth-client";

// Иконка выхода
const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

// Компонент индикатора загрузки
const Spinner = ({ label }: { label: string }) => (
  <>
    <svg
      className="animate-spin h-5 w-5 text-white"
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
    {label}
  </>
);

const SignOutButton = () => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSignOutError(null);
    setIsSigningOut(true);
    try {
      await signOut();
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      setSignOutError("Не удалось выйти. Пожалуйста, попробуйте снова.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 hover:cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigningOut ? (
          <Spinner label="Выход..." />
        ) : (
          <>
            <LogoutIcon />
            Выйти
          </>
        )}
      </button>
      {signOutError && (
        <p className="text-red-500 text-sm mt-1">{signOutError}</p>
      )}
    </>
  );
};

export default SignOutButton;
