import { Icon, Title } from "@/components/atoms";
import { INavBarProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import { getUser } from "@/services";
import { useState } from "react";
import { useSidebarStore } from "@/store";

export function NavBar(props: INavBarProps) {
  const { pathname } = props;
  const title = pathname?.split("/")?.[1];
  const cookies = new Cookies();
  const token = cookies.get("access_token");
  const { data: user } = useQuery({ queryKey: ["getUser"], queryFn: () => getUser({ token }) });

  const { changeSidebar } = useSidebarStore();
  return (
    <section className="w-full flex justify-between items-center sticky top-0 left-0 px-5  lg:px-16 lg:py-7 h-[4.375rem] border-b border-gray-500 bg-dark-500 text-white">
      <div className="flex items-center gap-1">
        <div onClick={changeSidebar}>
          <Icon variant="menu" className="sm:hidden" />
        </div>
        <div className="flex items-center gap-1">
          <Title> {title.charAt(0).toUpperCase() + title.slice(1) || "Inicio"}</Title>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <p className="">
          {user?.name} {user?.surname}
        </p>
        <Icon variant="user" />
      </div>
    </section>
  );
}

export default NavBar;
