import { ref } from 'vue';
import type { StoreType, ProductId } from '@/types/store';
import { CartsStore } from '@/stores/cart';
import { FavoritesStore } from '@/stores/favorites';

export function useMainHeader() {
  const isCartOpen = ref(false);
  const isFavoritesOpen = ref(false);
  const cartsStore = CartsStore();
  const favoritesStore = FavoritesStore();

  const toggleDropdown = (type: StoreType) => {
    if (type === 'cart') {
      isCartOpen.value = !isCartOpen.value;

      if (isFavoritesOpen.value) {
        isFavoritesOpen.value = false;
      }
    } else {
      isFavoritesOpen.value = !isFavoritesOpen.value;

      if (isCartOpen.value) {
        isCartOpen.value = false;
      }
    }
  };

  const handleRemoveProduct = (productId: ProductId, type: StoreType) => {
    if (type === 'cart') {
      // Call the store action directly
      cartsStore.removeProductFromCart(productId);
      if (cartsStore.counter === 0) {
        toggleDropdown('cart');
      }
    } else {
      // Call the store action directly
      favoritesStore.removeProductFromFavorites(productId);
      if (favoritesStore.counter === 0) {
        toggleDropdown('favorites');
      }
    }
  };

  const handleOpenDropdown = (type: StoreType) => {
    const store = type === 'cart' ? cartsStore : favoritesStore;
    if (store.counter > 0) {
      toggleDropdown(type);
    }
  };

  const handleCloseAll = () => {
    isCartOpen.value = false;
    isFavoritesOpen.value = false;
  }

  return {
    isCartOpen,
    isFavoritesOpen,
    cartsStore,
    favoritesStore,
    handleRemoveProduct,
    handleOpenDropdown,
    handleCloseAll
  };
}
