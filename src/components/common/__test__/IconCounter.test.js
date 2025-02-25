import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import IconCounter from "../IconCounter.vue";
import SvgIcon from "../SvgIcon.vue";
import HeartIcon from "@/assets/icons/heart-fill.svg";

describe("IconCounter component", () => {
  test("mount component with default props", async () => {
    const wrapper = mount(IconCounter, {
      global: {
        components: {
          'svg-icon': SvgIcon
        }
      },
      props: {
        counter: 5,
        icon: HeartIcon,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".icon-counter__label").text()).toBe("5");
    expect(wrapper.findComponent({ name: 'svg-icon' }).exists()).toBe(true);
  });

  test("emits click event when clicked", async () => {
    const wrapper = mount(IconCounter, {
      global: {
        components: {
          'svg-icon': SvgIcon
        }
      },
      props: {
        counter: 5,
        icon: HeartIcon,
      },
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("click");
  });

  test("does not emit click event when counter is zero", async () => {
    const wrapper = mount(IconCounter, {
      global: {
        components: {
          'svg-icon': SvgIcon
        }
      },
      props: {
        counter: 0,
        icon: HeartIcon,
      },
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted()).not.toHaveProperty("click");
  });
});
