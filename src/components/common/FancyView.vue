<template>
  <section class="f-view">
    <div class="f-view__header" v-if="slots.header || title">
      <slot v-if="slots.header" name="header"></slot>
      <h2 v-else>
        {{ title }}
      </h2>
    </div>
    <div class="f-view__body">
      <slot></slot>
    </div>
    <div class="f-view__bottom-spacer" v-if="slots.header || title"></div>
  </section>
</template>

<script lang="ts" setup>
import { computed, useSlots } from "vue";
import type { Slots } from 'vue';
import { useRouteData } from "@/composables/useRouteData";

const slots: Slots = useSlots();
const { meta } = useRouteData();
const title = computed(() => {
  return meta?.value?.title ?? "";
});
</script>

<style lang="scss" scope>
@use "@/assets/styles/mixins" as mixins;

.f-view {
  --header-height: 110px;
  --spacer-height: 50px;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__header {
    padding: 50px 50px 0 50px;
    height: var(--header-height);

    @include mixins.mobile {
      display: none;
    }
  }

  &__body {
    height: calc(100% - var(--header-height) - var(--spacer-height));
    overflow-y: hidden;
    flex: 1;
  }

  &__bottom-spacer {
    height: var(--spacer-height);
  }

  @include mixins.mobile {
    --header-height: 0px;
    --spacer-height: 10px;
  }
}
</style>
