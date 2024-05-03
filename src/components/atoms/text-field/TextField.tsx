import classNames from "classnames";
import { ITextFieldProps } from "./types";

export function TextField(props: ITextFieldProps) {
  const { error, className, isFull } = props;
  return (
    <div className={classNames({ "max-w-full w-full": isFull, "w-fit": !isFull })}>
      <input
        {...props}
        className={classNames("bg-dark-50 px-3 h-[2.5rem] w-full  border-[1px] text-white placeholder:text-[#8F8F8F] border-gray-500 rounded-md focus:border-[#8F8F8F] outline-none", className)}
      />
      <span className="text-sm text-[#ff6166] leading-5">{error}</span>
    </div>
  );
}

export default TextField;
