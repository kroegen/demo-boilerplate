<template>
  <router-view v-slot="{ Component }">
    <MainLayout>
      <template #sidebar>
        <FancySideBar :menu-items="menuItems" />
      </template>
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="routeName" />
        </keep-alive>
      </transition>
    </MainLayout>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";

import MainLayout from "@/components/layouts/MainLayout.vue";
import FancySideBar from "@/components/common/FancySideBar.vue";

import DashboardIcon from "@/assets/icons/dashboard-line.svg";
import ProductsIcon from "@/assets/icons/store-line.svg";
import UsersIcon from "@/assets/icons/group-line.svg";
import LogoutIcon from "@/assets/icons/logout-line.svg";
import { useI18n } from "vue-i18n";

const icons = {
  dashboard: DashboardIcon,
  products: ProductsIcon,
  users: UsersIcon,
  logout: LogoutIcon,
};

const { t } = useI18n();
const route = useRoute();
const routeName = computed(() => {
  return route?.name ? route.name : "";
});

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
      label: "Products",
      name: "products",
    },
    {
      icon: icons.users,
      label: "Users",
      name: "users",
    },
  ];
});
</script>

<style scoped></style>
