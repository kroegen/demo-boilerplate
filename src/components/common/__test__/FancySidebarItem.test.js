import { test, expect, describe, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import FancySidebarItem from "../FancySidebarItem.vue";

const routerPushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock
  })
}));

describe("FancySidebarItem component", () => {
  beforeEach(() => {
    routerPushMock.mockClear();
    vi.spyOn(window, 'open').mockImplementation(() => {});
  });

  const menuItem = {
    icon: "icon-dashboard",
    label: "Dashboard",
    name: "dashboard",
    active: false,
    expended: true,
  };

  test("mount component with default props", async () => {
    const wrapper = mount(FancySidebarItem, {
      props: menuItem,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".f-sidebar-menu-item").exists()).toBe(true);
    expect(wrapper.find(".f-sidebar-menu-item__label").text()).toBe(menuItem.label);
  });

  test("click event triggers navigation", async () => {
    const wrapper = mount(FancySidebarItem, {
      props: menuItem,
    });

    await wrapper.trigger("click");
    expect(routerPushMock).toHaveBeenCalledWith({ name: menuItem.name });
  });

  test("renders link correctly", async () => {
    const linkItem = {
      ...menuItem,
      name: undefined, // Remove name to ensure link is used
      link: "https://example.com",
    };

    const wrapper = mount(FancySidebarItem, {
      props: linkItem,
    });

    await wrapper.trigger("click");
    expect(window.open).toHaveBeenCalledWith(linkItem.link, "_blank", "noopener,noreferrer");
  });
});
