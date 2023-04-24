<template>
  <div class="f-tabs">
    <div class="f-tabs__header">
      <div
        class="f-tabs__item"
        v-for="tab in tabs"
        :key="`${tab}`"
        :class="{ active: tab === modelValue }"
        @click="$emit('update:modelValue', tab)"
      >
        <span class="bold">{{ tab }}</span>
      </div>
    </div>
    <div class="f-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "f-tabs",
  props: {
    modelValue: {
      type: String,
      default: () => "",
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
});
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  flex-direction: column;
  margin-top: 5px;

  &__header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: center;
    border-bottom: 2px solid var(--black-color);
  }

  &__item {
    padding: 10px 90px;
    font-size: 1rem;
    text-transform: capitalize;
    color: var(--beige-color);
    border-radius: 10px 10px 0px 0px;
    border: 2px solid var(--blue-color);
    border-bottom: 0px;
    background: var(--beige-color);
    margin-right: 20px;
    transition: all 0.5 ease-in-out;
  }

  &__item.active {
    border: 1px solid var(--blue-color);
    color: var(--beige-color);
    background: var(--blue-color);
  }

  &__item:hover {
    color: var(--beige-color);
    background: var(--blue-color);
    cursor: pointer;
  }

  &__content {
    padding-top: 25px;
  }
}
</style>
