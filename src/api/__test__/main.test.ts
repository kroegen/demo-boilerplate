import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ClientAPI from "../main";
import ProductsService from "../services/products";

describe("ClientAPI", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("restores the bearer token from localStorage after a reload", async () => {
    localStorage.setItem("token", "saved-token");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await new ClientAPI("https://dummyjson.com").get("users");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/users",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer saved-token" }),
      })
    );
  });

  it("serializes GET params and product pagination as URL query parameters", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const client = new ClientAPI("https://dummyjson.com");

    await client.get("products", { limit: 30, skip: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=30&skip=0",
      expect.any(Object)
    );

    await new ProductsService(client).fetchProducts(2, 30);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://dummyjson.com/products?limit=30&skip=30",
      expect.any(Object)
    );
  });

  it("returns successful 201 and 204 responses", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('{"id": 1}', { status: 201 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const client = new ClientAPI("https://dummyjson.com");

    await expect(client.post("products", { title: "Test" })).resolves.toEqual({ id: 1 });
    await expect(client.delete("products/1")).resolves.toEqual({});
  });

  it("sends PATCH requests with a JSON body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await new ClientAPI("https://dummyjson.com").patch("products/1", { title: "Updated" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products/1",
      expect.objectContaining({
        method: "PATCH",
        body: '{"title":"Updated"}',
      })
    );
  });

  it("leaves FormData content type to the browser", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const payload = new FormData();
    payload.append("image", "example");

    await new ClientAPI("https://dummyjson.com").post("products", payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://dummyjson.com/products",
      expect.objectContaining({
        body: payload,
        headers: expect.not.objectContaining({ "Content-Type": expect.anything() }),
      })
    );
  });
});
