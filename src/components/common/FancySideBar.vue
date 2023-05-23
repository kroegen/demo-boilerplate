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
        <router-link
          v-if="!menuItem.link"
          :to="{ name: menuItem.name }"
          class="f-sidebar__menu-label"
        >
          {{ menuItem.label }}
        </router-link>
        <a
          v-else
          :href="menuItem.link"
          target="_blank"
          rel="noopener noreferrer"
          class="f-sidebar__menu-label"
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
  $this: &;

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: width 900ms;
  width: 60px;

  &:hover {
    width: var(--sidebar-width);

    #{$this}__menu-label {
      visibility: visible;
    }
  }

  &__menu {
    list-style: none;
    padding: 0;
  }

  &__menu-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    font-size: 0.875rem;
    font-weight: 600;
    color: var(--grey-color);
    fill: var(--grey-color);
    line-height: 3rem;
    height: 3rem;
    width: 100%;
    padding: 0 1rem;

    &:not(:first-child) {
      margin-top: 10px;
    }

    &:hover,
    &--active {
      background: var(--blue-color);
      color: var(--beige-color);
      fill: var(--beige-color);
      transform: scale(1.1);
      transform-origin: center left;
    }
  }

  &__menu-icon {
    display: inline-flex;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    --icon-color: inherit;
  }

  &__menu-label {
    margin-left: 1rem;
    visibility: hidden;
    transition: visibility 400ms;
  }
}
</style>
