import { defineStore } from "pinia";
import type { Product } from "@/api/services/interfaces";
import type { ProductId } from "@/types/store";

interface CartsStore {
  products: Product[];
}

export const CartsStore = defineStore("CartsStore", {
  state: (): CartsStore => ({
    products: [],
  }),
  getters: {
    counter: (state): number => state.products.length,
    getCartProductIds: (state): ProductId[] =>
      state.products.map((product) => product.id),
  },
  actions: {
    addProductToCart(product: Product) {
      this.products.push(product);
    },
    removeProductFromCart(productId: ProductId) {
      const index = this.products.findIndex(
        (product) => product.id === productId
      );

      if (index >= 0) {
        this.products.splice(index, 1);
      }
    },
  },
});
