import { create } from "zustand";
import { IProduct } from "@/services";

export interface IProductCart extends IProduct {
  count: number;
}

const initialCart: IProductCart[] = [];

export const useCartStore = create<State>((set) => ({
  cart: initialCart,
  addCart: (newProduct) => {
    set(({ cart }) => {
      const isCart = cart.some((cart) => cart.id === newProduct.id && cart?.price === newProduct?.price);
      if (!isCart) {
        localStorage.setItem("CART", JSON.stringify([...cart, { ...newProduct, count: 1 }]));
        return { cart: [...cart, { ...newProduct, count: newProduct?.count || 1 }] };
      }
      localStorage.setItem("CART", JSON.stringify(cart?.map((product) => ({ ...product, count: (product?.count || 0) + 1 }))));
      return {
        cart: cart?.map((product) => {
          if (product?.id === newProduct?.id && product?.price === newProduct?.price) return { ...product, count: (product?.count || 0) + newProduct?.count || 1 };
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
  changeProduct: (productUpdate) => {
    set(({ cart }) => {
      const productsUpdate = cart?.map((product) => {
        if (product?.id === productUpdate?.id) return { ...productUpdate };
        return product;
      });
      localStorage.setItem("CART", JSON.stringify(productsUpdate));
      return {
        cart: productsUpdate,
      };
    });
  },
  deleteProduct: (productDelete) => {
    set(({ cart }) => {
      const productsDelete = cart?.filter((product) => {
        if (product?.id === productDelete?.id && product?.price === productDelete?.price) return;
        return product;
      });
      localStorage.setItem("CART", JSON.stringify(productsDelete));
      return {
        cart: productsDelete,
      };
    });
  },
}));

interface State {
  cart: IProductCart[];
  addCart: (newProduct: IProductCart) => void;
  loadStore: () => void;
  clearStorage: () => void;
  changeProduct: (productUpdate: IProductCart) => void;
  deleteProduct: (productDelee: IProductCart) => void;
}
