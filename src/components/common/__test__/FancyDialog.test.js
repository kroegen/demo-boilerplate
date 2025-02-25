import { test, expect, describe } from "vitest";
import { mount } from "@vue/test-utils";
import FancyDialog from "../FancyDialog.vue";
import CloseIcon from "@/assets/icons/close-line.svg";

describe("FancyDialog component", () => {
  test("mount component with default props", async () => {
    const wrapper = mount(FancyDialog, {
      props: {
        opened: true,
        closable: true,
        closeByClickOutside: true,
      },
      slots: {
        header: "<h3>Dialog Header</h3>",
        default: "<p>This is the content of the dialog.</p>",
        "actions-left": '<button class="cancel-button">Cancel</button>',
        "actions-right": '<button class="confirm-button">Confirm</button>',
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".f-dialog").exists()).toBe(true);
    expect(wrapper.find(".f-dialog__header").text()).toContain("Dialog Header");
    expect(wrapper.find(".f-dialog__content-wrapper").text()).toContain("This is the content of the dialog.");
    expect(wrapper.find(".cancel-button").exists()).toBe(true);
    expect(wrapper.find(".confirm-button").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "SvgIcon" }).props("src")).toBe(CloseIcon);
  });

  test("close dialog on close icon click", async () => {
    const wrapper = mount(FancyDialog, {
      props: {
        opened: true,
        closable: true,
      },
    });

    await wrapper.find(".f-dialog__close-icon").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });

  test("close dialog on outside click", async () => {
    const wrapper = mount(FancyDialog, {
      props: {
        opened: true,
        closeByClickOutside: true,
      },
    });

    await wrapper.find(".f-dialog").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });
});
