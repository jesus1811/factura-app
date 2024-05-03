import classNames from "classnames";
import { IButtonProps } from "./types";

export function Button(props: IButtonProps) {
  const { children, full, onClick, variant = "Normal" } = props;
  return (
    <button
      onClick={onClick}
      className={classNames(
        "w-full max-w-fit px-3 text-base text-white flex items-center gap-1 justify-center min-h-[2.5rem]  border-[0.0625rem] border-gray-500  rounded-lg transition-all duration-500",
        {
          "max-w-full": full,
          "hover:bg-alertError bg-[#2a1314]": variant === "Alert",
          "hover:bg-green-500 bg-[#328651]": variant === "Shop",
          "bg-dark-500 hover:bg-dark-100": variant === "Normal",
        }
      )}
    >
      {children}
    </button>
  );
}

export default Button;
