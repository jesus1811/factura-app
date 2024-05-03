import { ReactNode } from "react";

export type TypeButton = "Alert" | "Normal";
export interface IButtonProps {
  children: ReactNode | ReactNode[];
  full?: boolean;
  onClick?: () => void;
  variant?: TypeButton;
}
