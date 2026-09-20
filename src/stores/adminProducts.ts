import { defineStore } from "pinia";
import type { Product } from "@/api/services/interfaces";

export const useAdminProductsStore = defineStore("AdminProductsStore", {
  state: () => ({
    created: [] as Product[],
    edited: {} as Record<number, Product>,
    deletedIds: [] as number[],
  }),
  actions: {
    mergePage(products: Product[], page: number, category = "") {
      const visible = products
        .filter((product) => !this.deletedIds.includes(product.id))
        .map((product) => this.edited[product.id] ?? product);
      if (page !== 1) return visible;
      const created = this.created.filter(
        (product) => !category || product.category === category,
      );
      return [...created, ...visible];
    },
    addCreated(product: Product) {
      const id = this.created.some((item) => item.id === product.id)
        ? -Date.now()
        : product.id;
      const created = { ...product, id };
      this.created.unshift(created);
      return created;
    },
    saveEdited(product: Product) {
      const createdIndex = this.created.findIndex(
        (item) => item.id === product.id,
      );
      if (createdIndex >= 0) {
        this.created[createdIndex] = product;
      } else {
        this.edited[product.id] = product;
      }
    },
    removeProduct(id: number) {
      this.created = this.created.filter((product) => product.id !== id);
      delete this.edited[id];
      if (!this.deletedIds.includes(id)) this.deletedIds.push(id);
    },
  },
});
