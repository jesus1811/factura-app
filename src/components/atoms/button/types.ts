import { ReactNode } from "react";

export type TypeButton = "Alert" | "normal" | "Shop" | "outline";
export interface IButtonProps {
  children: ReactNode | ReactNode[];
  isFull?: boolean;
  onClick?: () => void;
  variant?: TypeButton;
}
