import classNames from "classnames";
import { IconProps } from "./types";

export function Icon(props: IconProps): JSX.Element | null {
  const { variant, className } = props;
  if (variant === "edit")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
      </svg>
    );
  if (variant === "close")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    );
  if (variant === "add")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
      </svg>
    );
  if (variant === "view")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
      </svg>
    );
  if (variant === "delete")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
        />
      </svg>
    );
  if (variant === "next")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
      </svg>
    );
  if (variant === "prev")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -960 960 960" className={classNames("w-5 aspect-square", className)}>
        <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
      </svg>
    );
  if (variant === "config")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={classNames("w-5 aspect-square", className)}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  return null;
}

export default Icon;
