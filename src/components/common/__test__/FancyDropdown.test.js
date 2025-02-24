import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyDropdown from "../FancyDropdown.vue";

describe("FancyDropdown component", () => {
  test("mount component with default slot", async () => {
    const wrapper = mount(FancyDropdown, {
      slots: {
        default: "<div>Dropdown Content</div>",
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".f-dropdown__wrapper").text()).toContain("Dropdown Content");
  });
});
