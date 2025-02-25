import type { Product } from "@/api/services/interfaces";
import type { ProductId } from "@/types/store";
import { defineStore } from "pinia";

interface FavoritesState {
  favorites: Product[];
}

export const FavoritesStore = defineStore("FavoritesStore", {
  state: (): FavoritesState => ({
    favorites: [],
  }),
  getters: {
    getFavoritesIds: (state): ProductId[] =>
      state.favorites.map((product) => product.id),
    counter: (state): number => state.favorites.length,
  },
  actions: {
    addProductToFavorites(product: Product) {
      this.favorites.push(product);
    },
    removeProductFromFavorites(productId: ProductId) {
      const index = this.favorites.findIndex(
        (product) => product.id === productId
      );

      if (index >= 0) {
        this.favorites.splice(index, 1);
      }
    },
  },
});
