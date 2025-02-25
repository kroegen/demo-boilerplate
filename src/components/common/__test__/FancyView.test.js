import { test, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FancyView from "../FancyView.vue";

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'mock-route-name',
    meta: {
      title: 'Test Title'
    }
  })
}));

describe("FancyView component", () => {
  test("renders view with meta title", () => {
    const wrapper = mount(FancyView);

    expect(wrapper.find(".f-view__header").exists()).toBe(true);
    expect(wrapper.find(".f-view__header h2").text()).toBe("Test Title");
  });

  test("renders view with slots", () => {
    const wrapper = mount(FancyView, {
      slots: {
        header: "<div class='custom-header'>Custom Header</div>",
        default: "<div class='custom-content'>Custom Content</div>",
      },
    });

    expect(wrapper.find(".custom-header").exists()).toBe(true);
    expect(wrapper.find(".custom-header").text()).toBe("Custom Header");
    expect(wrapper.find(".custom-content").exists()).toBe(true);
    expect(wrapper.find(".custom-content").text()).toBe("Custom Content");
  });
});
