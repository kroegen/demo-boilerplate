import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyTabs from "../FancyTabs.vue";

describe("FancyTabs component", () => {
  test("renders tabs with default props", () => {
    const wrapper = mount(FancyTabs, {
      props: {
        modelValue: "Tab1",
        tabs: ["Tab1", "Tab2", "Tab3"],
      },
    });

    expect(wrapper.findAll(".f-tabs__item").length).toBe(3);
    expect(wrapper.find(".f-tabs__item.active").text()).toBe("Tab1");
  });

  test("emits update:modelValue on tab click", async () => {
    const wrapper = mount(FancyTabs, {
      props: {
        modelValue: "Tab1",
        tabs: ["Tab1", "Tab2", "Tab3"],
      },
    });

    const tab = wrapper.findAll(".f-tabs__item")[1];
    await tab.trigger("click");

    expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual(["Tab2"]);
  });
});
