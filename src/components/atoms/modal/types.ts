import { ReactNode } from "react";

export interface IModalProps {
  isModal?: boolean;
  children?: ReactNode | ReactNode[];
  className?: string;
  closeModal?: () => void;
}
