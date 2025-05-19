import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Логотип слева как ссылка */}
      <div className="text-xl font-bold text-gray-800">
        <Link
          href="/"
          className="no-underline hover:underline hover:cursor-pointer"
        >
          Logo
        </Link>
      </div>

      {/* Кнопки справа */}
      <div className="flex space-x-4">
        <Link
          href="/sign-in"
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
