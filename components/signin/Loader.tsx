import { ImSpinner8 } from "react-icons/im";

export const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return <ImSpinner8 className={`${sizes[size]} animate-spin text-blue-600`} />;
};
