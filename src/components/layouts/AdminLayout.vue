<template>
  <router-view v-slot="{ Component }">
    <main class="layout">
      <aside v-if="showSidebar">
        <slot name="sidebar"></slot>
        <FancySideBar :menu-items="menuItems" />
      </aside>
      <article>
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="routeName" />
          </keep-alive>
        </transition>
      </article>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, RouterView } from "vue-router";

import FancySideBar from "@/components/common/FancySideBar.vue";

import DashboardIcon from "@/assets/icons/dashboard-line.svg";
import ProductsIcon from "@/assets/icons/store-line.svg";
import UsersIcon from "@/assets/icons/group-line.svg";
import LogoutIcon from "@/assets/icons/logout-line.svg";
import GithubIcon from "@/assets/icons/github-fill.svg";

const icons = {
  dashboard: DashboardIcon,
  products: ProductsIcon,
  users: UsersIcon,
  logout: LogoutIcon,
  github: GithubIcon,
};

const { t } = useI18n();
const route = useRoute();
const menuItems = computed(() => {
  return [
    {
      icon: icons.logout,
      label: t("sidebar.logout"),
      name: "logout",
    },
    // {
    //   icon: icons.dashboard,
    //   label: "Dashboard",
    //   name: "dashboard",
    // },
    {
      icon: icons.products,
      label: t("sidebar.products"),
      name: "products",
    },
    {
      icon: icons.users,
      label: t("sidebar.users"),
      name: "users",
    },
    {
      icon: icons.github,
      label: t("sidebar.github"),
      name: "github",
      link: "https://github.com/kroegen/demo-boilerplate",
    },
  ];
});

const showSidebar = computed(() => {
  return route?.meta.showSidebar;
});

const routeName = computed(() => {
  return route?.name ? route.name : "";
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
}

aside {
  background: var(--beige-color);
  z-index: 2;
}

article {
  background: var(--white-color);
  z-index: 1;
  width: 100%;
}
</style>
