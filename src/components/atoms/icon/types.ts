export type TypeVariant = "edit" | "close" | "add" | "view" | "delete" | "next" | "prev" | "config" | "user" | "menu";
export interface IconProps {
  variant: TypeVariant;
  className?: string;
}
