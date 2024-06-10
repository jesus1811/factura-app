import classNames from "classnames";
import { ITitleProps } from "./types";

export function Title(props: ITitleProps) {
  const { children, className } = props;
  return <h2 className={classNames("text-lg xl:text-3xl font-bold text-white", className)}>{children}</h2>;
}

export default Title;
