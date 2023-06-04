import { defineStore } from "pinia";

interface FavoritesState {
  favoritesIds: number[];
}

export const FavoritesStore = defineStore("FavoritesStore", {
  state: (): FavoritesState => ({
    favoritesIds: [],
  }),
  getters: {
    getFavoritesIds: (state): number[] => state.favoritesIds,
    counter: (state): number => state.favoritesIds.length,
  },
  actions: {
    addProductIdToFavoritesIds(productId: number) {
      this.favoritesIds.push(productId);
    },
    removeProductIdFromFavoritesIds(productId: number) {
      this.favoritesIds = this.favoritesIds.filter(
        (id: number) => id !== productId
      );
    },
  },
});
