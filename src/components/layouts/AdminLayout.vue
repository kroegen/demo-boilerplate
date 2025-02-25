<template>
  <router-view v-slot="{ Component }">
    <main class="layout">
      <SelectLocale class="layout__select-locale" />
      <aside v-if="showSidebar">
        <slot name="sidebar"></slot>
        <FancySidebar :menu-items="menuItems" />
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

import FancySidebar from "@/components/common/FancySidebar.vue";
import SelectLocale from "@/components/layouts/MainLayout/SelectLocale.vue";

import DashboardIcon from "@/assets/icons/dashboard-line.svg";
import ProductsIcon from "@/assets/icons/store-line.svg";
import UsersIcon from "@/assets/icons/group-line.svg";
import LogoutIcon from "@/assets/icons/logout-line.svg";
import GithubIcon from "@/assets/icons/github-fill.svg";
import type { MenuItem } from "../common/FancySidebarItem.vue";

const icons = {
  dashboard: DashboardIcon,
  products: ProductsIcon,
  users: UsersIcon,
  logout: LogoutIcon,
  github: GithubIcon,
};

const { t } = useI18n();
const route = useRoute();
const menuItems: MenuItem[] = [
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

const showSidebar = computed(() => {
  return route?.meta.showSidebar;
});

const routeName = computed(() => {
  return route?.name ? route.name : "";
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

main {
  --mobile-aside-height: 60px;

  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  position: relative;

  @include mixins.mobile {
    flex-direction: column;
    justify-content: flex-start;
  }

  aside {
    background: var(--beige-color);
    z-index: 2;

    @include mixins.mobile {
      order: 2;
      position: fixed;
      bottom: 0px;
      width: 100%;
      height: var(--mobile-aside-height);
    }
  }

  article {
    background: var(--white-color);
    z-index: 1;
    width: 100%;

    @include mixins.mobile {
      height: calc(100dvh - var(--mobile-aside-height));
    }
  }
}

.layout {
  &__select-locale {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 49;
  }
}
</style>
