import { flushPromises, mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Category, Product } from "@/api/services/interfaces";
import api from "@/api";
import { emitter } from "@/utils/emitter";
import en from "@/locales/en.json";
import ProductsTableItem from "../ProductsTableItem.vue";

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
const categories: Category[] = [
  { name: "Test", slug: "test", url: new URL("https://example.com/test") },
];

function mountRow() {
  const i18n = createI18n({ legacy: false, locale: "en", messages: { en } });
  return mount(ProductsTableItem, {
    props: { product, categories, active: false },
    global: { plugins: [i18n] },
  });
}

afterEach(() => vi.restoreAllMocks());

describe("ProductsTableItem", () => {
  it("opens edit mode and cancels without saving the draft", async () => {
    const updateProduct = vi.spyOn(api.products, "updateProduct");
    const wrapper = mountRow();

    await wrapper.find("button").trigger("click");
    expect(wrapper.classes()).toContain("table-item--editing");
    await wrapper.find('input[type="text"]').setValue("Draft product");
    await wrapper.findAll("button")[0].trigger("click");

    expect(wrapper.classes()).not.toContain("table-item--editing");
    expect(wrapper.find(".table-item__title").text()).toBe("Original product");
    expect(updateProduct).not.toHaveBeenCalled();

    await wrapper.find("button").trigger("click");
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe(
      "Original product",
    );
  });

  it("saves a valid draft and emits the updated product", async () => {
    const saved: Product = { ...product, title: "Updated product" };
    const updateProduct = vi
      .spyOn(api.products, "updateProduct")
      .mockResolvedValue(saved);
    const showSnack = vi.spyOn(emitter, "emit");
    const wrapper = mountRow();

    await wrapper.find("button").trigger("click");
    await wrapper.find('input[type="text"]').setValue("Updated product");
    await wrapper.findAll("button")[1].trigger("click");
    await flushPromises();

    expect(updateProduct).toHaveBeenCalledWith(product.id, {
      title: "Updated product",
      category: "test",
      price: 10,
      stock: 2,
    });
    expect(wrapper.emitted("saved")?.[0]).toEqual([saved]);
    expect(wrapper.classes()).not.toContain("table-item--editing");
    expect(showSnack).toHaveBeenCalledWith(
      "showSnack",
      expect.objectContaining({ text: "Product saved successfully", type: "success" }),
    );
  });
});
