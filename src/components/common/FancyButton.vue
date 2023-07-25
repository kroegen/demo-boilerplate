<template>
  <button
    class="f-button"
    :disabled="disabled"
    :class="[
      `f-button--${variant}`,
      `f-button--${size}`,
      disabled && 'f-button--disabled',
    ]"
  >
    <span v-if="$slots.before" class="f-button__icon">
      <slot name="before"></slot>
    </span>
    <span class="f-button__label">
      <slot></slot>
    </span>
    <span v-if="$slots.after" class="f-button__icon">
      <slot name="after"></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export type ButtonVariant = "filled" | "outlined" | "text";
export type ButtonSize = "large" | "medium" | "small" | "tiny";

export default defineComponent({
  name: "f-button",
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: "filled",
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: "medium",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.f-button {
  $this: &;
  --main-color: var(--blue-color);
  --text-color: var(--beige-color);
  --border-color: var(--blue-color);

  --button-padding: 10px 16px;
  --button-icon-size: 22px;
  --button-text-size: 1rem;
  --button-shadow: var(--shadow-medium), var(--shadow-large);

  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: var(--button-padding);
  outline: none;
  font-size: var(--button-text-size);
  font-weight: 600;
  transition: all 0.2s ease-out;
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--border-color);
  background-color: var(--main-color);
  color: var(--text-color);
  opacity: 0.9;

  &__label {
    font-weight: inherit;
  }

  &__icon {
    width: var(--button-icon-size);
    height: var(--button-icon-size);
    fill: var(--text-color);
    margin: 0 10px;
  }

  &:hover,
  &:active {
    opacity: 1;
    box-shadow: var(--button-shadow);
  }

  &:active {
    transform: scale(0.95);
  }

  &--disabled:hover,
  &--disabled:active {
    opacity: 1;
    box-shadow: none;
  }

  &--disabled {
    pointer-events: none;

    &#{$this}--filled {
      --main-color: var(--grey-color);
      --border-color: var(--beige-color);
      --text-color: var(--beige-color);
    }

    &#{$this}--outlined {
      --border-color: var(--grey-color);
      --text-color: var(--grey-color);
    }

    &#{$this}--text {
      --text-color: var(--grey-color);
    }
  }

  &--filled {
    --main-color: var(--blue-color);
    --text-color: var(--beige-color);
    --border-color: var(--blue-color);
  }

  &--outlined {
    --main-color: transparent;
    --text-color: var(--blue-color);
    --border-color: var(--blue-color);
  }

  &--text {
    --main-color: transparent;
    --text-color: var(--blue-color);
    --border-color: transparent;
  }

  &--large {
    --button-padding: 12px 18px;
    --button-text-size: 1.5rem;

    #{$this}__icon {
      --button-icon-size: 26px;
    }
  }

  &--small {
    --button-padding: 9px 14px;
    --button-text-size: 1rem;

    #{$this}__icon {
      --button-icon-size: 18px;
    }
  }

  &--tiny {
    --button-padding: 8px 12px;
    --button-text-size: 0.75rem;

    #{$this}__icon {
      --button-icon-size: 14px;
    }
  }
}
</style>
