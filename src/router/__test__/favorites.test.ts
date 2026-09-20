import { describe, expect, it } from "vitest";
import router from "../index";

describe("Favorites route", () => {
  it("resolves /favorites inside the main layout", () => {
    const resolved = router.resolve("/favorites");

    expect(resolved.name).toBe("favorites");
    expect(resolved.matched.map((record) => record.name)).toEqual([
      "main",
      "favorites",
    ]);
  });
});

describe("Admin product detail route", () => {
  it("resolves a product ID in the authenticated admin layout", () => {
    const resolved = router.resolve("/admin/products/7");

    expect(resolved.name).toBe("product-detail");
    expect(resolved.meta.requiresAuth).toBe(true);
  });
});
