import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import FancyOptionList from "../FancyOptionList.vue";

describe("FancyOptionList", () => {
  it("shows active and selected options and skips disabled clicks", async () => {
    const wrapper = mount(FancyOptionList, {
      props: {
        id: "test-options",
        label: "Category",
        modelValue: "a",
        activeIndex: 1,
        options: [
          { value: "a", label: "First" },
          { value: "b", label: "Second", disabled: true },
        ],
      },
    });

    const options = wrapper.findAll('[role="option"]');
    expect(options[0].attributes("aria-selected")).toBe("true");
    expect(options[1].classes()).toContain("f-option-item--active");
    await options[1].trigger("click");
    expect(wrapper.emitted("select")).toBeUndefined();
    await options[0].trigger("click");
    expect(wrapper.emitted("select")?.[0]).toEqual(["a"]);
  });
});
