import { flushPromises, mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import { afterEach, describe, expect, it, vi } from "vitest";
import api from "@/api";
import en from "@/locales/en.json";
import ProductsCreateModal from "../ProductsCreateModal.vue";

afterEach(() => vi.restoreAllMocks());

describe("ProductsCreateModal", () => {
  it("validates the draft and creates a product", async () => {
    const createProduct = vi
      .spyOn(api.products, "createProduct")
      .mockResolvedValue({
        id: 195,
        title: "New product",
        category: "test",
        price: 5,
        stock: 2,
      });
    const i18n = createI18n({ legacy: false, locale: "en", messages: { en } });
    const wrapper = mount(ProductsCreateModal, {
      props: {
        opened: true,
        categories: [
          {
            name: "Test",
            slug: "test",
            url: new URL("https://example.com/test"),
          },
        ],
      },
      global: {
        plugins: [i18n],
        stubs: {
          "f-modal": { template: "<div><slot name='header' /><slot /></div>" },
        },
      },
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(createProduct).not.toHaveBeenCalled();
    expect(wrapper.find('input[type="text"]').attributes("aria-invalid")).toBe(
      "true",
    );
    expect(wrapper.find("select").attributes("aria-invalid")).toBe("true");

    await wrapper.find('input[type="text"]').setValue("New product");
    await wrapper.find("select").setValue("test");
    await wrapper.findAll('input[type="number"]')[0].setValue("-1");
    await wrapper.findAll('input[type="number"]')[1].setValue("1.5");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(createProduct).not.toHaveBeenCalled();
    expect(
      wrapper
        .findAll('input[type="number"]')
        .map((input) => input.attributes("aria-invalid")),
    ).toEqual(["true", "true"]);

    await wrapper.findAll('input[type="number"]')[0].setValue("5");
    await wrapper.findAll('input[type="number"]')[1].setValue("2");
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(createProduct).toHaveBeenCalledWith({
      title: "New product",
      category: "test",
      price: 5,
      stock: 2,
    });
    expect(wrapper.emitted("created")?.[0][0]).toMatchObject({
      id: 195,
      title: "New product",
    });
    expect(wrapper.emitted("close")).toHaveLength(1);
  });
});
