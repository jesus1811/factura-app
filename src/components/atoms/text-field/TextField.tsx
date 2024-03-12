import classNames from "classnames";
import { ITextFieldProps } from "./types";

export function TextField(props: ITextFieldProps) {
  const { error, className } = props;
  return (
    <div className="w-fit">
      <input
        type="text"
        className={classNames("bg-dark-50 px-3 h-[2.5rem] border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#2D788B] outline-none", className)}
        {...props}
      />
      <span className="text-sm text-[#ff6166] leading-5">{error}</span>
    </div>
  );
}

export default TextField;
