<template>
  <nav class="f-sidebar">
    <ul v-if="isItems" class="f-sidebar__menu">
      <li
        v-for="menuItem in props.menuItems"
        :key="menuItem.label"
        class="f-sidebar__menu-item"
        :class="{
          'f-sidebar__menu-item--active': activeName === menuItem.name,
        }"
      >
        <svg-icon
          v-if="menuItem.icon"
          class="f-sidebar__menu-icon"
          :src="menuItem.icon"
        />
        <router-link v-if="!menuItem.link" :to="{ name: menuItem.name }">
          {{ menuItem.label }}
        </router-link>
        <a
          v-else
          :href="menuItem.link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ menuItem.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink, type RouteRecordName } from "vue-router";
import SvgIcon from "@/components/common/SvgIcon.vue";
import { useRouteData } from "@/composables/useRouteData";

export interface MenuItem {
  icon?: string;
  label: string;
  name?: RouteRecordName;
  link?: string;
}

const props = withDefaults(
  defineProps<{
    menuItems: MenuItem[];
  }>(),
  {
    menuItems: () => [],
  }
);
const isItems = computed(() => {
  return props.menuItems.length > 0;
});
const activeName = computed(() => {
  return useRouteData().name;
});
</script>

<style lang="scss" scoped>
:where(a) {
  color: inherit;
  font-weight: 600;
  font-size: 1rem;
}

.f-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &__menu {
    list-style: none;
    margin-bottom: 85%;
  }

  &__menu-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    --icon-color: inherit;
  }

  &__menu-item {
    display: flex;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--grey-color);
    fill: var(--grey-color);
    line-height: 3rem;
    padding-left: 1rem;
    transition: all 300ms;
    align-items: center;
    width: 100%;
    margin-top: 10px;

    &:hover,
    &--active {
      background: var(--blue-color);
      color: var(--beige-color);
      fill: var(--beige-color);
      cursor: pointer;
      transform: scale(1.1);
    }
  }
}
</style>
