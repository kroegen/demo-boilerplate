import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyInput from "../FancyInput.vue";

describe("FancyInput component", () => {
  test("renders input with default props", () => {
    const wrapper = mount(FancyInput, {
      props: {
        modelValue: "",
      },
    });

    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("input").element.value).toBe("");
  });

  test("renders input with label", () => {
    const wrapper = mount(FancyInput, {
      props: {
        modelValue: "",
        label: "Username",
      },
    });

    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("label").text()).toBe("Username");
  });

  test("emits update:modelValue on input", async () => {
    const wrapper = mount(FancyInput, {
      props: {
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("test");

    expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual(["test"]);
  });

  test("clears input when clear icon is clicked", async () => {
    const wrapper = mount(FancyInput, {
      props: {
        modelValue: "test",
        clearable: true,
      },
    });

    const clearIcon = wrapper.find(".f-input__clear-icon");
    await clearIcon.trigger("click");

    expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual([""]);
  });

  test("displays error message", () => {
    const wrapper = mount(FancyInput, {
      props: {
        modelValue: "",
        error: "This field is required",
      },
    });

    expect(wrapper.find(".f-input__error-message").exists()).toBe(true);
    expect(wrapper.find(".f-input__error-message").text()).toBe("This field is required");
  });
});
