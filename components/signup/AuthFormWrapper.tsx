import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
  header: {
    title: string;
    subtitle: string;
    gradientColors: string;
  };
}

export const AuthFormWrapper = ({ children, header }: AuthFormWrapperProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <div
        className={`bg-gradient-to-r ${header.gradientColors} p-6 text-center`}
      >
        <h1 className="text-2xl font-bold text-white">{header.title}</h1>
        <p className="text-blue-100 mt-1">{header.subtitle}</p>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  </div>
);
