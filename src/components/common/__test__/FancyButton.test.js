import { test, expect, describe } from "vitest";
//import mount
import { mount } from "@vue/test-utils";

//import your component
import FancyButton from "../FancyButton.vue";

describe("FancyButton component", () => {
  test("mount component default", async () => {
    const textLabel = "Label";

    expect(FancyButton).toBeTruthy();

    const wrapper = mount(FancyButton, {
      slots: {
        default: textLabel,
      },
    });

    expect(wrapper.classes()).toEqual([
      "f-button",
      "f-button--filled",
      "f-button--medium",
    ]);
    expect(wrapper.text()).toEqual(textLabel);
  });

  describe("mount component variants", () => {
    test("variant outlined", async () => {
      const textLabel = "Label";

      expect(FancyButton).toBeTruthy();

      const wrapper = mount(FancyButton, {
        props: {
          variant: "outlined",
        },
        slots: {
          default: textLabel,
        },
      });

      expect(wrapper.classes()).toEqual([
        "f-button",
        "f-button--outlined",
        "f-button--medium",
      ]);
      expect(wrapper.text()).toEqual(textLabel);
    });

    test("variant text", async () => {
      expect(FancyButton).toBeTruthy();

      const wrapper = mount(FancyButton, {
        props: {
          variant: "text",
        },
      });

      expect(wrapper.classes()).toEqual([
        "f-button",
        "f-button--text",
        "f-button--medium",
      ]);
    });
  });

  describe("mount component sizes", () => {
    test("size tiny", async () => {
      expect(FancyButton).toBeTruthy();

      const wrapper = mount(FancyButton, {
        props: {
          size: "tiny",
        },
      });

      expect(wrapper.classes()).toEqual([
        "f-button",
        "f-button--filled",
        "f-button--tiny",
      ]);
    });

    test("size small", async () => {
      expect(FancyButton).toBeTruthy();

      const wrapper = mount(FancyButton, {
        props: {
          size: "small",
        },
      });

      expect(wrapper.classes()).toEqual([
        "f-button",
        "f-button--filled",
        "f-button--small",
      ]);
    });

    test("size large", async () => {
      expect(FancyButton).toBeTruthy();

      const wrapper = mount(FancyButton, {
        props: {
          size: "large",
        },
      });

      expect(wrapper.classes()).toEqual([
        "f-button",
        "f-button--filled",
        "f-button--large",
      ]);
    });
  });
});
