import classNames from "classnames";
import { IButtonProps } from "./types";

export function Button(props: IButtonProps) {
  const { children, isFull, onClick, variant = "normal" } = props;

  return (
    <button
      onClick={onClick}
      className={classNames("w-full max-w-fit px-3 text-base  flex items-center  gap-1 justify-center min-h-[40px]    rounded-lg transition-all duration-500", {
        "max-w-full": isFull,
        "bg-primary-500 hover:bg-primary-600 border-[1px] border-transparent": variant === "normal",
        "border-[1px] border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white": variant === "outline",
        "border-[1px] border-alertError bg-transparent text-alertError hover:bg-alertError hover:text-white": variant === "Alert",
        "hover:bg-green-500 bg-[#328651]": variant === "Shop",
      })}
    >
      {children}
    </button>
  );
}

export default Button;
