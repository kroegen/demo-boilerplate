import { defineStore } from "pinia";
import type {
  Category,
  Product,
  ProductsResponse,
} from "@/api/services/interfaces";
import api from "@/api";

const PAGE_LIMIT = 30;

export interface ProductsState {
  products: Product[];
  categories: Category[];
  categoryProducts: Product[];
  pages: number;
}

export const ProductsStore = defineStore("ProductsStore", {
  state: (): ProductsState => ({
    products: [],
    categories: [],
    categoryProducts: [],
    pages: 0,
  }),
  actions: {
    async fetchProducts(page = 1) {
      const productsResponse: ProductsResponse =
        await api.products.fetchProducts(page, PAGE_LIMIT);

      if (productsResponse.products) {
        this.products = [...productsResponse.products];

        if (!this.pages) {
          this.pages = Math.floor(productsResponse.total / PAGE_LIMIT) + 1;
        }

        return this.products;
      }
    },

    async fetchProductsCategories() {
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
