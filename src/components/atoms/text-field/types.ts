import { ChangeEventHandler, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  isFull?: boolean;
  className?: string;
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: HTMLInputTypeAttribute;
  list?: string;
  placeholder?: string;
  name?: string;
}
