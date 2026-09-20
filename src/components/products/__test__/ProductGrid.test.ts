import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { Product } from "@/api/services/interfaces";
import ProductGrid from "../ProductGrid.vue";

function product(id: number): Product {
  return {
    id,
    title: `Product ${id}`,
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
}

const ProductCardStub = {
  props: ["product", "draggable"],
  template:
    '<li class="product" :data-product-id="product.id" :draggable="draggable">{{ product.title }}</li>',
};

describe("ProductGrid", () => {
  it("renders one card for each supplied product", () => {
    const wrapper = mount(ProductGrid, {
      props: { products: [product(1), product(2)] },
      global: { stubs: { ProductCard: ProductCardStub } },
    });

    expect(wrapper.findAll("li.product").map((card) => card.text())).toEqual([
      "Product 1",
      "Product 2",
    ]);
  });

  it("emits reordered products after a drop without mutating its input", async () => {
    const products = [product(1), product(2)];
    const wrapper = mount(ProductGrid, {
      props: { products, reorderable: true },
      global: { stubs: { ProductCard: ProductCardStub } },
    });

    await wrapper.findAll("li.product")[1].trigger("drop", {
      dataTransfer: { getData: () => "1" },
    });

    const reordered = wrapper.emitted("reorder")?.[0][0] as
      | Product[]
      | undefined;
    expect(reordered?.map((item) => item.id)).toEqual([2, 1]);
    expect(products.map((item) => item.id)).toEqual([1, 2]);
  });

  it("disables card dragging and ignores drops when reordering is off", async () => {
    const wrapper = mount(ProductGrid, {
      props: { products: [product(1), product(2)], reorderable: false },
      global: { stubs: { ProductCard: ProductCardStub } },
    });

    expect(
      wrapper
        .findAll("li.product")
        .every((card) => card.attributes("draggable") === "false"),
    ).toBe(true);
    await wrapper.findAll("li.product")[1].trigger("drop", {
      dataTransfer: { getData: () => "1" },
    });
    expect(wrapper.emitted("reorder")).toBeUndefined();
  });
});
