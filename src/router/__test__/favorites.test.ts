import { describe, expect, it } from "vitest";
import router from "../index";

describe("Favorites route", () => {
  it("resolves /favorites inside the main layout", () => {
    const resolved = router.resolve("/favorites");

    expect(resolved.name).toBe("favorites");
    expect(resolved.matched.map((record) => record.name)).toEqual(["main", "favorites"]);
  });
});
