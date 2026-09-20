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
});
