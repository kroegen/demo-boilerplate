import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ClientAPI from "../main";

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
});
