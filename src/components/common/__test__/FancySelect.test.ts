import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import FancySelect from "../FancySelect.vue";

const options = [
  { value: "", label: "All categories" },
  { value: "beauty", label: "Beauty" },
];

describe("FancySelect", () => {
  it("shows the selected label and emits the option value", async () => {
    const wrapper = mount(FancySelect, {
      props: { name: "category", modelValue: "", options, label: "Category" },
      global: {
        stubs: {
          FancyPopper: {
            props: ["visible"],
            template: '<div v-if="visible"><slot /></div>',
          },
        },
      },
    });

    expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
      "All categories",
    );
    await wrapper.find(".f-select__trigger").trigger("click");
    await wrapper.findAll('[role="option"]')[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["beauty"]);
  });

  it("navigates options by keyboard and exposes combobox state", async () => {
    const wrapper = mount(FancySelect, {
      props: { name: "category", modelValue: "", options, label: "Category" },
      global: {
        stubs: {
          FancyPopper: {
            props: ["visible"],
            template: '<div v-if="visible"><slot /></div>',
          },
        },
      },
    });
    const input = wrapper.find("input");

    expect(input.attributes("role")).toBe("combobox");
    expect(input.attributes("aria-expanded")).toBe("false");
    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(input.attributes("aria-activedescendant")).toBe(
      "category-options-option-1",
    );
    await input.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["beauty"]);
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("closes on Escape, Tab, or an outside pointer event", async () => {
    const wrapper = mount(FancySelect, {
      props: { name: "category", modelValue: "", options, label: "Category" },
      global: {
        stubs: {
          FancyPopper: {
            props: ["visible"],
            template: '<div v-if="visible"><slot /></div>',
          },
        },
      },
    });
    const input = wrapper.find("input");

    await input.trigger("keydown", { key: "Enter" });
    expect(input.attributes("aria-expanded")).toBe("true");
    await input.trigger("keydown", { key: "Escape" });
    expect(input.attributes("aria-expanded")).toBe("false");
    await input.trigger("keydown", { key: "Enter" });
    await input.trigger("keydown", { key: "Tab" });
    expect(input.attributes("aria-expanded")).toBe("false");
    await input.trigger("keydown", { key: "Enter" });
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("renders the real dropdown and keeps disabled options unavailable", async () => {
    const wrapper = mount(FancySelect, {
      props: {
        name: "category",
        modelValue: "",
        options: [
          { value: "", label: "All categories" },
          { value: "disabled", label: "Disabled", disabled: true },
          { value: "beauty", label: "Beauty" },
        ],
        label: "Category",
        error: "Choose a category",
      },
      attachTo: document.body,
    });
    const input = wrapper.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(wrapper.find('[role="alert"]').text()).toBe("Choose a category");

    await input.trigger("click");
    expect(wrapper.findAll('[role="option"]')).toHaveLength(3);
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(input.attributes("aria-activedescendant")).toBe(
      "category-options-option-2",
    );
    await wrapper.findAll('[role="option"]')[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    await wrapper.findAll('[role="option"]')[2].trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["beauty"]);
    wrapper.unmount();
  });

  it("does not open when disabled", async () => {
    const wrapper = mount(FancySelect, {
      props: { name: "category", modelValue: "", options, disabled: true },
      global: {
        stubs: {
          FancyPopper: {
            props: ["visible"],
            template: '<div v-if="visible"><slot /></div>',
          },
        },
      },
    });

    await wrapper.find("input").trigger("keydown", { key: "Enter" });
    expect(wrapper.find("input").attributes("aria-expanded")).toBe("false");
    expect(wrapper.find('[role="option"]').exists()).toBe(false);
  });
});
