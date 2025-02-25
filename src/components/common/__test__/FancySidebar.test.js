import { test, expect, describe, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FancySidebar from "../FancySidebar.vue";
import FancySidebarItem from "../FancySidebarItem.vue";

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: 'mock-route-name'
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("FancySidebar component", () => {
  const menuItems = [
    { icon: "icon-dashboard", label: "Dashboard", name: "dashboard", active: false, expended: false },
    { icon: "icon-products", label: "Products", name: "products", active: false, expended: false },
    { icon: "icon-users", label: "Users", name: "users", active: false, expended: false },
  ];

  test("mount component with default props", async () => {
    const wrapper = mount(FancySidebar, {
      props: {
        menuItems,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".f-sidebar").exists()).toBe(true);
    expect(wrapper.findAllComponents(FancySidebarItem).length).toBe(menuItems.length);
  });

  test("hover state toggles expanded class", async () => {
    const wrapper = mount(FancySidebar, {
      props: {
        menuItems,
      },
    });

    expect(wrapper.classes()).not.toContain("f-sidebar--expanded");

    await wrapper.trigger("mouseenter");
    expect(wrapper.classes()).toContain("f-sidebar--expanded");

    await wrapper.trigger("mouseleave");
    expect(wrapper.classes()).not.toContain("f-sidebar--expanded");
  });
});
