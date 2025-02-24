import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyPagination from "../FancyPagination.vue";

describe("FancyPagination component", () => {
  test("mount component with pages", async () => {
    const wrapper = mount(FancyPagination, {
      props: {
        pages: 5,
        currentPage: 1,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll(".f-button").length).toBe(5);
    expect(wrapper.find(".f-button--filled").text()).toBe("1");
  });

  test("emit select event on page click", async () => {
    const wrapper = mount(FancyPagination, {
      props: {
        pages: 5,
        currentPage: 1,
      },
    });

    await wrapper.findAll(".f-button")[2].trigger("click");
    expect(wrapper.emitted()).toHaveProperty("select");
    expect(wrapper.emitted().select[0]).toEqual([3]);
  });
});
