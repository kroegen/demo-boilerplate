import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import type { Product } from "@/api/services/interfaces";
import { useAdminProductsStore } from "../adminProducts";

const product: Product = {
  id: 195,
  title: "Created product",
  brand: "",
  category: "test",
  description: "",
  discountPercentage: 0,
  images: [],
  price: 2,
  rating: 0,
  stock: 1,
  thumbnail: new URL("about:blank"),
};

describe("AdminProductsStore", () => {
  it("keeps created products unique and does not tombstone a removed local product", () => {
    setActivePinia(createPinia());
    const store = useAdminProductsStore();
    const first = store.addCreated(product);
    const second = store.addCreated(product);

    expect(first.id).toBe(195);
    expect(second.id).toBe(-1);
    store.removeProduct(first.id);
    expect(store.deletedIds).toEqual([]);
    expect(store.mergePage([], 1).map((item) => item.id)).toEqual([-1]);
  });
});
