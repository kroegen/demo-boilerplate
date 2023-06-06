import { defineStore } from "pinia";
import type { Product, ProductsResponse } from "@/api/services/interfaces";
import api from "@/api";

interface ProductsState {
  products: Product[];
  categories: string[];
  categoryProducts: Product[];
}

export const ProductsStore = defineStore("ProductsStore", {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    categoryProducts: [],
  }),
  actions: {
    async fetchProducts() {
      const productsResponse: ProductsResponse =
        await api.products.fetchProducts();

      if (productsResponse.products) {
        this.products = [...productsResponse.products];

        return this.products;
      }
    },
    async fetchProductsCatgories() {
      const response = await api.products.fetchProductsCategories();

      if (response.length) {
        this.categories = response;
      }

      return this.categories;
    },
    async fetchProductsByCategory(category: string) {
      const productsResponse: ProductsResponse =
        await api.products.fetchProductsByCategory(category);

      if (productsResponse.products) {
        this.categoryProducts = [...productsResponse.products];

        return this.categoryProducts;
      }
    },
  },
});
