"use client";

import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const { signIn, signUp, useSession, signOut } = createAuthClient();

const Navbar = () => {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Логирование для отладки
  useEffect(() => {
    setIsMounted(true);
    console.log("Navbar mounted. Session:", session);
  }, [session]);

  const handleSignOut = async () => {
    try {
      await signOut();
      await fetch("/api/auth/sign-out", { method: "POST" });
      router.refresh(); // Форсируем обновление страницы
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Показываем заглушку, пока не завершится гидратация или загрузка сессии
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

  // Основной рендер после гидратации
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">Logo</Link>
      </div>

      <div className="flex items-center space-x-4">
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hello, {session.user.name || session.user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200 hover:cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
