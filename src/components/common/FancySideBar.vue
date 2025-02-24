<template>
  <nav
    class="f-sidebar"
    :class="{ 'f-sidebar--expanded': isHovered }"
    @mouseenter="togglHoveredState"
    @mouseleave="togglHoveredState"
  >
    <div v-if="isItems" class="f-sidebar__menu">
      <div v-for="menuItem in props.menuItems" :key="menuItem.label">
        <FancySidebarItem
          :name="menuItem.name"
          :icon="menuItem.icon"
          :label="menuItem.label"
          :active="name === menuItem.name"
          :link="menuItem.link"
          :expended="isHovered"
        />
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import FancySidebarItem, { type MenuItem } from "@/components/common/FancySidebarItem.vue";
import { useRouteData } from "@/composables/useRouteData";

interface Props {
  menuItems: MenuItem[];
}
const isHovered = ref(false);
const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [],
});

const { name } = useRouteData();

const isItems = computed(() => {
  return props.menuItems.length > 0;
});

const togglHoveredState = () => {
  isHovered.value = !isHovered.value;
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.f-sidebar {
  --sidebar-width: 60px;

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: width 900ms;
  width: var(--sidebar-width);

  &--expanded {
    --sidebar-width: 350px;

    @include mixins.mobile {
      --sidebar-width: 100dvw;
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

  @include mixins.mobile {
    --sidebar-width: 100dvw;
    transition: none;
  }
}
</style>
