<template>
  <div
    class="svg-icon"
    :class="{ 'svg-icon--disabled': disabled }"
    @click.stop="$emit('click', $event)"
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

  &:deep(svg) {
    fill: var(--icon-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }

  &--disabled:deep(svg):hover {
    pointer-events: none;
    --icon-color: var(--black-color);
  }
}
</style>
