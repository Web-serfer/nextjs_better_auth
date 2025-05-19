"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  // Можно добавить логику, например:
  // - проверять статус пользователя (если он уже верифицирован — редиректить)
  // или просто оставить как информационную страницу

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Иконка письма */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center relative">
          <svg
            className="w-16 h-16 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13 2 4" />
          </svg>
        </div>

        {/* Текстовый блок */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            Проверьте вашу почту
          </h1>
          <p className="text-gray-600 px-4">
            Мы отправили письмо с подтверждением на ваш email. Перейдите по
            ссылке в письме, чтобы завершить регистрацию.
          </p>
        </div>

        {/* Дополнительная подсказка */}
        <div className="text-sm text-gray-500 mt-2">
          <p>Если вы не видите письма, проверьте папку «Спам».</p>
        </div>

        {/* Кнопка повторной отправки (если реализовано) */}
        {/* <button
          type="button"
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm underline"
          onClick={() => resendVerification()}
        >
          Отправить письмо ещё раз
        </button> */}
      </div>
    </div>
  );
}
