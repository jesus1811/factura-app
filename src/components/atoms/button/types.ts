import { ReactNode } from "react";

export type TypeButton = "Alert" | "Normal" | "Shop";
export interface IButtonProps {
  children: ReactNode | ReactNode[];
  full?: boolean;
  onClick?: () => void;
  variant?: TypeButton;
}
