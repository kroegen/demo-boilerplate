import { test, expect, describe } from "vitest";
//import mount
import { mount } from "@vue/test-utils";

//import your component
import FancyCard from "../FancyCard.vue";

describe("FancyCard component", () => {
  test("mount component default", async () => {
    const textLabel = "Label";

    expect(FancyCard).toBeTruthy();

    const wrapper = mount(FancyCard, {
      slots: {
        default: textLabel,
      },
    });

    expect(wrapper.classes()).toEqual(["f-card"]);
    expect(wrapper.text()).toEqual(textLabel);
  });
});
