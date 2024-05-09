export type TypeVariant = "edit" | "close" | "add" | "view" | "delete";
export interface IconProps {
  variant: TypeVariant;
  className?: string;
}
