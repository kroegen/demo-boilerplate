import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancySnack, { SnackType } from "../FancySnack.vue";

describe("FancySnack component", () => {
  test("mount component with default props", async () => {
    const wrapper = mount(FancySnack, {
      props: {
        snack: {
          text: "This is a snack message",
          type: SnackType.info,
          icon: true,
          closable: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".f-snack").exists()).toBe(true);
    expect(wrapper.find(".f-snack__body").text()).toContain("This is a snack message");
    expect(wrapper.find(".f-snack__close-icon").exists()).toBe(true);
  });

  test("closes snack on close icon click", async () => {
    const wrapper = mount(FancySnack, {
      props: {
        snack: {
          text: "This is a snack message",
          type: SnackType.info,
          icon: true,
          closable: true,
        },
      },
    });

    const closeIcon = wrapper.find(".f-snack__close-icon");
    await closeIcon.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("close");
  });
});
