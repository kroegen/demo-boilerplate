import { test, expect, describe } from "vitest";
//import mount
import { mount } from "@vue/test-utils";

//import your component
import FancyContainer from "../FancyContainer.vue";

describe("FancyContainer component", () => {
  test("mount component default", async () => {
    const textLabel = "Label";

    expect(FancyContainer).toBeTruthy();

    const wrapper = mount(FancyContainer, {
      slots: {
        default: textLabel,
      },
    });

    expect(wrapper.classes()).toEqual(["container"]);
    expect(wrapper.text()).toEqual(textLabel);
  });
});
