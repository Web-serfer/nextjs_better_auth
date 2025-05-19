"use client";

import { useEffect, useState } from "react";

export type ToastState = {
  message: string;
  type: "success" | "error" | "info";
  show: boolean;
};

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose?: () => void;
  duration?: number;
};

export const Toast = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${bgColor} border px-4 py-3 rounded-lg shadow-lg flex items-center justify-between`}
      >
        <span className="block sm:inline">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 text-lg font-semibold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
