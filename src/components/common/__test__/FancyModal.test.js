import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyModal from "../FancyModal.vue";

describe("FancyModal component", () => {
  test("mount component with default props", async () => {
    const wrapper = mount(FancyModal, {
      props: {
        opened: true,
        closeByClickOutside: true,
      },
      slots: {
        header: "<h3>Modal Header</h3>",
        default: "<p>This is the content of the modal.</p>",
        "actions-left": '<button class="cancel-button">Cancel</button>',
        "actions-right": '<button class="confirm-button">Confirm</button>',
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".f-modal").exists()).toBe(true);
    expect(wrapper.find(".f-modal__header").text()).toContain("Modal Header");
    expect(wrapper.find(".f-modal__content").text()).toContain("This is the content of the modal.");
    expect(wrapper.find(".cancel-button").exists()).toBe(true);
    expect(wrapper.find(".confirm-button").exists()).toBe(true);
  });

  test("close modal on outside click", async () => {
    const wrapper = mount(FancyModal, {
      props: {
        opened: true,
        closeByClickOutside: true,
      },
    });

    await wrapper.find(".f-modal").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });
});
