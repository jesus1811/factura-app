import { ChangeEventHandler, DetailedHTMLProps, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export interface ITextFieldProps {
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
