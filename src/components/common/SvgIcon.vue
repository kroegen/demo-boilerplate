<template>
  <div
    class="svg-icon"
    :class="{ 'svg-icon--disabled': disabled }"
    @click="$emit('click', $event)"
    v-html="src"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "svg-icon",
  emits: ["click"],
  props: {
    src: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.svg-icon {
  --icon-color: inherit;

  position: relative;
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  &:deep(svg) {
    fill: var(--icon-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: 100%;
    height: 100%;
  }

  &--disabled:deep(svg):hover {
    pointer-events: none;
    --icon-color: var(--black-color);
  }
}
</style>
