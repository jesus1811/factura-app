import { useTokenStore } from "@/store";
import classNames from "classnames";
import Link from "next/link";
import { ReactNode, useState } from "react";

export function SideBar(props: SideBarProps) {
  const { routes, pathname } = props;
  const { deleteToken } = useTokenStore();
  const [isSidebar, setIsSidebar] = useState<boolean>(true);
  const changeNavbar = () => {
    setIsSidebar(!isSidebar);
  };
  return (
    <aside
      className={classNames("relative right-0 border border-gray-500 text-white bg-dark-500  h-screen xl:flex xl:flex-col  duration-300     z-20", {
        "w-[145px]": !isSidebar,
        "w-72": isSidebar,
      })}
    >
      <div className={classNames("flex items-center py-4 px-7  font-bold border-b border-black ", { "justify-center": !isSidebar, "justify-between": isSidebar })}>
        <div className={classNames("w-full flex items-center pb-5 gap-2 border-gray-500 border-b-[1px]  ", { "justify-center": !isSidebar })}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-primary-500">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span
            className={classNames("block text-primary-500 text-xl", {
              hidden: !isSidebar,
            })}
          >
            Factura Pro
          </span>
        </div>

        <button
          className={classNames("hover:bg-dark-100 border border-gray-500 bg-dark-500  p-2 rounded-full transition-colors absolute top-[50%] right-0 translate-x-[1.25rem]", {
            "rotate-180": !isSidebar,
          })}
          onClick={changeNavbar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <div className="h-full flex flex-col justify-between">
        <ul className="px-5 flex flex-col gap-2">
          {routes?.map((route) => (
            <li key={route?.label}>
              <Link
                href={route?.href || "#"}
                className={classNames("flex  hover:bg-dark-100  rounded-md p-2 transition-colors", {
                  "text-[12px] flex-col items-center gap-1": !isSidebar,
                  "gap-4": isSidebar,
                  "bg-dark-100": pathname === route?.href,
                })}
              >
                {route?.icon}
                {route?.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="p-5">
          <li>
            <button
              className={classNames("flex w-full  hover:bg-white hover:bg-opacity-10  rounded-md p-2 transition-colors", {
                "text-[12px] flex-col items-center gap-1": !isSidebar,
                "gap-4": isSidebar,
              })}
              onClick={deleteToken}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>
              Salir
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;

interface SideBarProps {
  routes: {
    label: string;
    icon?: ReactNode;
    href?: string;
  }[];
  pathname: string;
}
