import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { createMemoryHistory, createRouter } from "vue-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import api from "@/api";
import type { Product } from "@/api/services/interfaces";
import en from "@/locales/en.json";
import ProductDetailView from "../ProductDetailView.vue";

afterEach(() => vi.restoreAllMocks());

describe("ProductDetailView", () => {
  it("loads a product by the admin route ID", async () => {
    const product: Product = {
      id: 7,
      title: "Detail product",
      brand: "Brand",
      category: "test",
      description: "Description",
      discountPercentage: 0,
      images: [],
      price: 10,
      rating: 4,
      stock: 2,
      thumbnail: new URL("https://example.com/image.png"),
    };
    const fetchProductById = vi
      .spyOn(api.products, "fetchProductById")
      .mockResolvedValue(product);
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/admin/products",
          name: "products",
          component: ProductDetailView,
        },
        {
          path: "/admin/products/:id",
          name: "product-detail",
          component: ProductDetailView,
        },
      ],
    });
    await router.push("/admin/products/7");
    await router.isReady();
    const i18n = createI18n({ legacy: false, locale: "en", messages: { en } });
    const wrapper = mount(ProductDetailView, {
      global: {
        plugins: [createPinia(), i18n, router],
        stubs: { "f-view": { template: "<div><slot /></div>" } },
      },
    });
    await flushPromises();

    expect(fetchProductById).toHaveBeenCalledWith("7");
    expect(wrapper.find("h1").text()).toBe("Detail product");
    expect(wrapper.text()).toContain("Description");
  });
});
