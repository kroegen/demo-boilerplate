import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import { afterEach, describe, expect, it, vi } from "vitest";
import api from "@/api";
import type { ProductsResponse } from "@/api/services/interfaces";
import en from "@/locales/en.json";
import ProductsView from "../../ProductsView.vue";

afterEach(() => vi.restoreAllMocks());

describe("ProductsView", () => {
  it("shows loading feedback until the product page resolves", async () => {
    let resolveProducts: (value: ProductsResponse) => void = () => undefined;
    const pending = new Promise<ProductsResponse>((resolve) => {
      resolveProducts = resolve;
    });
    vi.spyOn(api.products, "fetchProducts").mockReturnValue(pending);
    vi.spyOn(api.products, "fetchProductsCategories").mockResolvedValue([]);
    const i18n = createI18n({ legacy: false, locale: "en", messages: { en } });
    const wrapper = mount(ProductsView, {
      global: {
        plugins: [createPinia(), i18n],
        stubs: {
          "f-view": { template: "<div><slot /></div>" },
          ProductsTable: { template: "<div><slot /></div>" },
          ProductsTableItem: true,
          ProductsCreateModal: true,
          ConfirmModal: true,
          FancyPagination: true,
          Loader: { template: "<div class='loader' />" },
          teleport: true,
        },
      },
    });

    expect(wrapper.find('[role="status"]').text()).toContain(
      "Loading products",
    );
    expect(wrapper.find(".loader").exists()).toBe(true);
    expect(wrapper.find("select").attributes("disabled")).toBeDefined();

    resolveProducts({ products: [], total: 0, limit: 25, skip: 0 });
    await flushPromises();

    expect(wrapper.find('[role="status"]').text()).toBe("No products found");
    expect(wrapper.find(".loader").exists()).toBe(false);
  });
});
