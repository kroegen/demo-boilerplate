import { flushPromises, mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { afterEach, describe, expect, it, vi } from "vitest";
import api from "@/api";
import type { Product } from "@/api/services/interfaces";
import en from "@/locales/en.json";
import ProductsEditorPanel from "../ProductsEditorPanel.vue";

const product: Product = {
  id: 1,
  title: "Original product",
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

function mountPanel(locallyCreated = false) {
  const i18n = createI18n({ legacy: false, locale: "en", messages: { en } });
  return mount(ProductsEditorPanel, {
    props: {
      product,
      locallyCreated,
      categories: [
        {
          name: "Test",
          slug: "test",
          url: new URL("https://example.com/test"),
        },
      ],
    },
    global: { plugins: [i18n] },
  });
}

afterEach(() => vi.restoreAllMocks());

describe("ProductsEditorPanel", () => {
  it("stacks fields and saves a valid draft", async () => {
    const saved = { ...product, title: "Updated product" };
    const updateProduct = vi
      .spyOn(api.products, "updateProduct")
      .mockResolvedValue(saved);
    const wrapper = mountPanel();

    expect(wrapper.findAll(".f-input")).toHaveLength(4);
    await wrapper.find('input[type="text"]').setValue("Updated product");
    expect(wrapper.emitted("dirty")?.at(-1)).toEqual([true]);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(updateProduct).toHaveBeenCalledWith(product.id, {
      title: "Updated product",
      category: "test",
      price: 10,
      stock: 2,
    });
    expect(wrapper.emitted("saved")?.[0]).toEqual([saved]);
  });
});
