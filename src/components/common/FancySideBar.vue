<template>
  <nav class="f-sidebar">
    <div v-if="isItems" class="f-sidebar__menu">
      <div v-for="menuItem in props.menuItems" :key="menuItem.label">
        <router-link
          class="f-sidebar__menu-item"
          :class="{
            'f-sidebar__menu-item--active': activeName === menuItem.name,
          }"
          v-if="!menuItem.link"
          :to="{ name: menuItem.name }"
        >
          <svg-icon
            v-if="menuItem.icon"
            class="f-sidebar__menu-icon"
            :src="menuItem.icon"
          />
          <span class="f-sidebar__menu-label">{{ menuItem.label }}</span>
        </router-link>
        <a
          v-else
          :href="menuItem.link"
          target="_blank"
          rel="noopener noreferrer"
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
          <span class="f-sidebar__menu-label">{{ menuItem.label }}</span>
        </a>
      </div>
    </div>
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

interface Props {
  menuItems: MenuItem[];
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [],
});
const isItems = computed(() => {
  return props.menuItems.length > 0;
});
const activeName = computed(() => {
  return useRouteData().name;
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.f-sidebar {
  $this: &;

  --sidebar-width: 60px;

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: width 900ms;
  width: var(--sidebar-width);

  &:hover {
    --sidebar-width: 350px;

    @include mixins.mobile {
      --sidebar-width: 100dvw;
    }

    #{$this}__menu-label {
      visibility: visible;
      opacity: 1;
    }
  }

  &__menu {
    padding: 0;

    @include mixins.mobile {
      display: flex;
      flex-direction: row;
      height: 100%;
      justify-content: space-between;
    }
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
    border-radius: 0 5px 5px 0;

    @include mixins.mobile {
      border-radius: 5px 5px 0 0;
      height: 100%;
      justify-content: center;
      padding: 0 0.5rem;
    }

    &:not(:first-child) {
      margin-top: 10px;

      @include mixins.mobile {
        margin-top: 0px;
      }
    }

    &:hover,
    &--active {
      background: var(--blue-color);
      color: var(--beige-color);
      fill: var(--beige-color);
      transform: scale(0.95);
      transform-origin: center left;

      @include mixins.mobile {
        transform: none;
      }

      #{$this}__menu-label {
        @include mixins.mobile {
          display: inline-flex;
        }
      }
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
    opacity: 0;
    transition: opacity, visibility 700ms;
    color: inherit;
    font-weight: 600;
    font-size: 1rem;

    @include mixins.mobile {
      visibility: visible;
      opacity: 1;
      margin-left: 5px;
      transition: none;
      font-size: 0.825rem;
    }
  }

  @include mixins.mobile {
    --sidebar-width: 100dvw;
    transition: none;
  }
}
</style>
