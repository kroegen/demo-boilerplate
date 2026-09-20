import { describe, expect, it, vi } from "vitest";
import type ClientAPI from "../main";
import ProductsService from "../services/products";

describe("ProductsService mutations", () => {
  it("requests a 25 item product page with the correct skip", async () => {
    const response = { products: [], total: 100, limit: 25, skip: 25 };
    const get = vi.fn().mockResolvedValue(response);
    const service = new ProductsService({ get } as unknown as ClientAPI);

    await expect(service.fetchProducts(2, 25)).resolves.toEqual(response);
    expect(get).toHaveBeenCalledWith("products", { limit: 25, skip: 25 });
  });

  it("passes sorting to the server", async () => {
    const get = vi
      .fn()
      .mockResolvedValue({ products: [], total: 0, skip: 0, limit: 25 });
    const service = new ProductsService({ get } as unknown as ClientAPI);

    await service.fetchProducts(1, 25, { sortBy: "price", order: "desc" });

    expect(get).toHaveBeenCalledWith("products", {
      limit: 25,
      skip: 0,
      sortBy: "price",
      order: "desc",
    });
  });

  it("requests a category page from the category endpoint", async () => {
    const get = vi
      .fn()
      .mockResolvedValue({ products: [], total: 0, skip: 25, limit: 25 });
    const service = new ProductsService({ get } as unknown as ClientAPI);

    await service.fetchProducts(2, 25, {
      category: "skin-care",
      sortBy: "price",
      order: "asc",
    });

    expect(get).toHaveBeenCalledWith("products/category/skin-care", {
      limit: 25,
      skip: 25,
      sortBy: "price",
      order: "asc",
    });
  });

  it("creates a product through the DummyJSON add endpoint", async () => {
    const post = vi.fn().mockResolvedValue({ id: 195, title: "Pencil" });
    const service = new ProductsService({ post } as unknown as ClientAPI);
    const payload = { title: "Pencil", price: 2 };

    await expect(service.createProduct(payload)).resolves.toMatchObject({
      id: 195,
      title: "Pencil",
    });
    expect(post).toHaveBeenCalledExactlyOnceWith("products/add", payload);
  });

  it("patches only the supplied product fields", async () => {
    const patch = vi.fn().mockResolvedValue({ id: 7, title: "Updated" });
    const service = new ProductsService({ patch } as unknown as ClientAPI);
    const payload = { title: "Updated", stock: 3 };

    await expect(service.updateProduct(7, payload)).resolves.toMatchObject({
      id: 7,
      title: "Updated",
    });
    expect(patch).toHaveBeenCalledExactlyOnceWith("products/7", payload);
  });

  it("returns DummyJSON's simulated deletion result", async () => {
    const deleted = {
      id: 7,
      isDeleted: true,
      deletedOn: "2026-09-20T00:00:00Z",
    };
    const remove = vi.fn().mockResolvedValue(deleted);
    const service = new ProductsService({
      delete: remove,
    } as unknown as ClientAPI);

    await expect(service.deleteProduct(7)).resolves.toEqual(deleted);
    expect(remove).toHaveBeenCalledExactlyOnceWith("products/7");
  });
});
