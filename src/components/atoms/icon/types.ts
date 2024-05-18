export type TypeVariant = "edit" | "close" | "add" | "view" | "delete" | "next" | "prev" | "config";
export interface IconProps {
  variant: TypeVariant;
  className?: string;
}
