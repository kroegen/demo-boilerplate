import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyPopper from "../FancyPopper.vue";

describe("FancyPopper component", () => {
  test("renders popper with default props", () => {
    const wrapper = mount(FancyPopper, {
      props: {
        visible: true,
      },
    });

    expect(wrapper.find(".f-popper").isVisible()).toBe(true);
  });

  test("hides popper when visible prop is false", async () => {
    const wrapper = mount(FancyPopper, {
      props: {
        visible: false,
      },
    });

    expect(wrapper.find(".f-popper").isVisible()).toBe(false);
  });

  // TODO: investigate and fix
  test.skip("applies autoWidth modifier when autoWidth prop is true", async () => {
    const referenceElement = document.createElement("div");
    referenceElement.style.width = "100px";
    document.body.appendChild(referenceElement);

    const wrapperElement = document.createElement("div");
    document.body.appendChild(wrapperElement);

    const wrapper = mount(FancyPopper, {
      props: {
        visible: true,
        autoWidth: true,
        appendToBody: true,
      },
      attachTo: wrapperElement,
    });

    wrapper.vm.reference = referenceElement;
    await wrapper.vm.createPopper();

    await new Promise(resolve => setTimeout(resolve, 0));

    const popperElement = document.querySelector(".f-popper");

    expect(popperElement?.style.width).toBe("100px");

    document.body.removeChild(referenceElement);
    document.body.removeChild(wrapperElement);
    wrapper.unmount();
  });
});
