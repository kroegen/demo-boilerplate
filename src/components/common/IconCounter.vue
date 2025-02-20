<template>
  <div class="icon-counter" @click="handleClick">
    <span class="icon-counter__label">
      {{ props.counter }}
    </span>
    <svg-icon :src="props.icon" />
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from "@/components/common/SvgIcon.vue";

interface Props {
  counter: number;
  icon: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["click"]);

function handleClick() {
  if (props.counter > 0) emit("click");
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.icon-counter {
  --icon-size: 36px;
  --icon-color: var(--beige-color);

  display: inline-flex;
  flex-shrink: 0;
  width: var(--icon-size);
  height: var(--icon-size);
  position: relative;

  &:hover {
    --icon-color: var(--white-color);
    cursor: pointer;
  }

  &:active {
    transform: scale(0.95);
  }

  @include mixins.mobile {
    --icon-size: 28px;
  }

  &__label {
    position: absolute;
    padding: 5px;
    color: var(--white-color);
    background: var(--blue-color);
    border-radius: 50%;
    z-index: 2;
    height: 20px;
    width: 20px;
    font-size: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -5px;
    right: -10px;
  }
}
</style>
