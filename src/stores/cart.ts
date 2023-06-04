import { defineStore } from "pinia";
import type { Product } from "@/api/services/interfaces";

interface CartsStore {
  products: Product[];
}

export const CartsStore = defineStore("CartsStore", {
  state: (): CartsStore => ({
    products: [],
  }),
  getters: {
    counter: (state): number => state.products.length,
  },
  actions: {
    addProductToCart(product: Product) {
      this.products.push(product);
    },
  },
});
