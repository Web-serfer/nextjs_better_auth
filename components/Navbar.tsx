"use client";

import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Инициализация клиента аутентификации
const { signIn, signUp, useSession, signOut } = createAuthClient();

const Navbar = () => {
  // Состояние аутентификации
  const { data: session, isPending, refetch } = useSession();
  console.log("Session object:", session);
  const router = useRouter();

  // Состояния компонента
  const [isMounted, setIsMounted] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Установка флага монтирования после рендера
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Обработчик выхода из системы
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Рендер состояния загрузки
  if (!isMounted || isPending) {
    return (
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="text-xl font-bold text-gray-800">
          <Link href="/">Logo</Link>
        </div>
        <div>Loading auth state...</div>
      </nav>
    );
  }

  // Рендер основной навигации
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">Logo</Link>
      </div>

      <div className="flex items-center space-x-4">
        {session?.user ? (
          // Отображение для авторизованного пользователя
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hello, {session.user.name || session.user.email}
            </span>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 hover:cursor-pointer flex items-center gap-2"
            >
              {isSigningOut ? (
                // Индикатор загрузки при выходе
                <Spinner label="Signing Out..." />
              ) : (
                // Кнопка выхода
                <>
                  <LogoutIcon />
                  Sign Out
                </>
              )}
            </button>
          </div>
        ) : (
          // Отображение для гостя
          <>
            <AuthLink href="/sign-in">Sign In</AuthLink>
            <AuthLink href="/sign-up" primary>
              Sign Up
            </AuthLink>
          </>
        )}
      </div>
    </nav>
  );
};

// Компонент иконки выхода
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
const Spinner = ({ label }) => (
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

// Компонент ссылки аутентификации
const AuthLink = ({ href, children, primary = false }) => (
  <Link
    href={href}
    className={`px-4 py-2 ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "text-gray-700 hover:text-gray-900"
    } rounded-md transition-colors duration-200 font-medium`}
  >
    {children}
  </Link>
);

export default Navbar;
