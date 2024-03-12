import classNames from "classnames";
import { IButtonProps } from "./types";

export function Button(props: IButtonProps) {
  const { children, full } = props;
  return (
    <button
      className={classNames(
        "w-full max-w-fit px-3 text-base text-white flex items-center gap-1 justify-center min-h-[2.5rem] bg-dark-500 border-[0.0625rem] border-gray-500 hover:bg-dark-100 rounded-lg transition-all duration-500",
        {
          "max-w-full": full,
        }
      )}
    >
      {children}
    </button>
  );
}

export default Button;
