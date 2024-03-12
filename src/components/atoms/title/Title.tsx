import { ITitleProps } from "./types";

export function Title(props: ITitleProps) {
  const { children } = props;
  return <h2 className="text-3xl font-bold text-white">{children}</h2>;
}

export default Title;
