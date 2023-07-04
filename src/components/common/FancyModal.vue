<template>
  <transition name="fade">
    <div class="f-modal" @click.stop="handleClickOutside">
      <div class="f-modal__wrapper" @click.stop>
        <div class="f-modal__container">
          <div class="f-modal__header">
            <slot name="header"></slot>
          </div>
          <div class="f-modal__content">
            <slot></slot>
          </div>
          <div class="f-modal__actions">
            <div class="f-modal__actions-left">
              <slot name="actions-left"></slot>
            </div>
            <div class="f-modal__actions-right">
              <slot name="actions-right"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "f-modal",
  emits: ["close"],
  props: {
    closeByClickOutside: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    handleClickOutside() {
      if (this.closeByClickOutside) this.$emit("close");
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";

.f-modal {
  --modal-height: auto;
  --modal-width: 560px;
  --modal-border-radious: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  background: var(--black-dialog);

  &__wrapper {
    overflow: hidden;
    background: var(--beige-color);
    box-shadow: var(--shadow-xl);
    border-radius: var(--modal-border-radious);
    width: var(--modal-width);
    height: var(--modal-height);
    white-space: break-spaces;
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  &__header {
    display: inline-flex;
    justify-content: space-between;
    padding: 25px 40px;
    align-items: center;
  }

  &__content {
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0px 40px 40px 40px;
  }

  &__actions {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    align-items: flex-end;
    padding: 0 40px 40px 40px;
  }

  @include mobile {
    --modal-width: auto;
    --modal-height: 100dvh;
    --modal-border-radious: 0px;

    justify-content: flex-start;
  }
}
</style>
