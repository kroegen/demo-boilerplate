import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { Product } from "@/api/services/interfaces";
import { FavoritesStore } from "@/stores/favorites";
import FavoritesView from "../FavoritesView.vue";

const product: Product = {
  id: 1,
  title: "Favorite product",
  brand: "Brand",
  category: "test",
  description: "Description",
  discountPercentage: 0,
  images: [],
  price: 10,
  rating: 4,
  stock: 1,
  thumbnail: new URL("https://example.com/image.png"),
};

describe("FavoritesView", () => {
  it("reacts to store changes and shows the empty state", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = FavoritesStore();
    const wrapper = mount(FavoritesView, {
      global: {
        plugins: [pinia],
        stubs: {
          "f-view": { template: "<div><slot /></div>" },
          ProductGrid: {
            props: ["products", "reorderable"],
            template: '<div class="grid">{{ products.map(product => product.title).join(", ") }}</div>',
          },
        },
        mocks: { $t: (key: string) => key },
      },
    });

    expect(wrapper.text()).toContain("views.favorites.empty");
    store.addProductToFavorites(product);
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".grid").text()).toBe("Favorite product");
    expect(store.counter).toBe(1);

    store.removeProductFromFavorites(product.id);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("views.favorites.empty");
    expect(store.counter).toBe(0);
  });
});
