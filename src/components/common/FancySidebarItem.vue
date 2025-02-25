<template>
  <div
    :class="['f-sidebar-menu-item', { 'f-sidebar-menu-item--active': active }]"
    @click="handleClick"
  >
    <svg-icon v-if="icon" class="f-sidebar-menu-item__icon" :src="icon" />
    <span class="f-sidebar-menu-item__label" v-if="expended">{{ label }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import SvgIcon from "@/components/common/SvgIcon.vue";
import type { RouteRecordName } from "vue-router";

export interface MenuItem {
  icon: string;
  label: string;
  name: RouteRecordName;
  link?: string;
  active?: boolean;
  expended?: boolean;
}

const props = defineProps<MenuItem>();
const router = useRouter();

function handleClick() {
  if (props.link) {
    window.open(props.link, '_blank', 'noopener,noreferrer');
  } else if (props.name) {
    router.push({ name: props.name });
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.f-sidebar-menu-item {
  $this: &;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  fill: var(--grey-color);
  line-height: 3rem;
  height: 3rem;
  width: 100%;
  padding: 0 1rem;
  border-radius: 0 5px 5px 0;

  &__label {
    margin-left: 1rem;
    font-weight: 600;
    font-size: 1rem;
    color: var(--grey-color);


    @include mixins.mobile {
      visibility: visible;
      opacity: 1;
      margin-left: 5px;
      transition: none;
      font-size: 0.825rem;
    }
  }

  &__icon {
    display: inline-flex;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    --icon-color: inherit;
  }

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
    fill: var(--beige-color);
    transform: scale(0.95);
    transform-origin: center left;

    @include mixins.mobile {
      transform: none;
    }

    #{$this}__label {
      color: var(--beige-color);

      @include mixins.mobile {
        display: inline-flex;
      }
    }
  }
}
</style>
