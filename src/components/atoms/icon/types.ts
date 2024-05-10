export type TypeVariant = "edit" | "close" | "add" | "view" | "delete" | "next" | "prev";
export interface IconProps {
  variant: TypeVariant;
  className?: string;
}
