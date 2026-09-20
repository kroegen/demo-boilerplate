import { describe, expect, it, vi } from "vitest";
import type ClientAPI from "../main";
import ProductsService from "../services/products";

describe("ProductsService mutations", () => {
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
