import type { Product } from "@/api/services/interfaces";
import { defineStore } from "pinia";

interface FavoritesState {
  favorites: Product[];
}

export const FavoritesStore = defineStore("FavoritesStore", {
  state: (): FavoritesState => ({
    favorites: [],
  }),
  getters: {
    getFavoritesIds: (state): number[] =>
      state.favorites.map((product) => product.id),
    counter: (state): number => state.favorites.length,
  },
  actions: {
    addProductIdToFavoritesIds(product: Product) {
      this.favorites.push(product);
    },
    removeProductIdFromFavoritesIds(productId: number) {
      const index = this.favorites.findIndex(
        (product) => product.id === productId
      );

      if (index >= 0) {
        this.favorites.splice(index, 1);
      }
    },
  },
});
