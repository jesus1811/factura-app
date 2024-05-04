import { create } from "zustand";
import { IProduct } from "@/services";

export interface IProductCart extends IProduct {
  count: number;
}

const initialCart: IProductCart[] = [];

export const useCartStore = create<State>((set) => ({
  cart: initialCart,
  isCart: false,
  addCart: (newProduct) => {
    set(({ cart }) => {
      const isCart = cart.some((cart) => cart.id === newProduct.id);
      if (!isCart) {
        localStorage.setItem("CART", JSON.stringify([...cart, { ...newProduct, count: 1 }]));
        return { cart: [...cart, { ...newProduct, count: newProduct?.count || 1 }] };
      }
      localStorage.setItem("CART", JSON.stringify(cart?.map((product) => ({ ...product, count: (product?.count || 0) + 1 }))));
      return {
        cart: cart?.map((product) => {
          if (product?.id === newProduct?.id) return { ...product, count: (product?.count || 0) + newProduct?.count || 1 };
          return product;
        }),
      };
    });
  },
  clearStorage: () => {
    set(() => {
      localStorage.setItem("CART", JSON.stringify([]));
      return { cart: [] };
    });
  },
  loadStore: () => {
    set(() => {
      return { cart: JSON.parse(localStorage.getItem("CART") || "[]") };
    });
  },
  changeCountProduct: (idProduct, count) => {
    set(({ cart }) => {
      return {
        cart: cart?.map((product) => {
          if (product?.id === idProduct) return { ...product, count: count };
          return product;
        }),
      };
    });
  },
}));

interface State {
  cart: IProductCart[];
  addCart: (newProduct: IProductCart) => void;
  loadStore: () => void;
  clearStorage: () => void;
  changeCountProduct: (idProduct: string, count: number) => void;
}
