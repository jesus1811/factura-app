import { Title } from "@/components/atoms";
import { INavBarProps } from "./types";

export function NavBar(props: INavBarProps) {
  const { pathname } = props;
  const title = pathname?.split("/")?.[1];
  return (
    <section className="w-full  lg:px-16 lg:py-7 h-[4.375rem] border-b border-gray-500 bg-dark-500 text-white">
      <Title>{title.charAt(0).toUpperCase() + title.slice(1) || "Inicio"}</Title>
    </section>
  );
}

export default NavBar;
