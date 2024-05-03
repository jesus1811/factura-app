import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface ITextFieldProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  error?: string;
  isFull?: boolean;
}
