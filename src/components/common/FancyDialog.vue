<template>
  <transition name="fade">
    <div class="f-dialog" @click.stop="handleClickOutside">
      <div class="f-dialog__wrapper" @click.stop>
        <div class="f-dialog__container">
          <div class="f-dialog__header">
            <slot name="header"></slot>
            <svg-icon
              v-if="closable"
              class="f-dialog__close-icon"
              @click.stop="handleClose"
              :src="CloseIcon"
            />
          </div>
          <section class="f-dialog__content">
            <div class="f-dialog__content-fixed" v-if="$slots.fixed">
              <slot name="fixed"></slot>
            </div>
            <div class="f-dialog__content-wrapper">
              <slot></slot>
            </div>
            <div class="f-dialog__actions">
              <div class="f-dialog__actions-left">
                <slot name="actions-left"></slot>
              </div>
              <div class="f-dialog__actions-right">
                <slot name="actions-right"></slot>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import CloseIcon from "@/assets/icons/close-line.svg";

export default defineComponent({
  name: "f-dialog",
  components: {
    SvgIcon,
  },
  props: {
    opened: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    closable: {
      type: Boolean,
      default: () => false,
    },
    closeByClickOutside: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      CloseIcon,
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handleClickOutside() {
      if (this.closeByClickOutside) this.$emit("close");
    },
  },
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.f-dialog {
  --dialog-header-height: 100px;
  --dialog-min-conent-height: 500px;
  --dialog-min-conent-width: 800px;
  --dialog-border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 51;
  width: 100%;
  height: 100%;
  background: var(--black-dialog);

  &__wrapper {
    overflow: hidden;
    background: var(--beige-color);
    box-shadow: var(--shadow-xl);
    border-radius: var(--dialog-border-radius);
    min-width: var(--dialog-min-conent-width);
    min-height: var(--dialog-min-conent-height);
    border: 1px solid var(--blue-color);
  }

  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: var(--dialog-min-conent-height);
  }

  &__header {
    display: inline-flex;
    justify-content: space-between;
    padding: 25px 40px;
    align-items: center;
    height: var(--dialog-header-height);
    max-width: var(--dialog-min-conent-width);
  }

  &__close-icon {
    --icon-color: inherit;

    height: 32px;
    width: 32px;
    transition: all 0.2s;

    &:hover {
      --icon-color: var(--blue-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__content {
    border-top: 1px solid var(--grey-color);
    padding: 0px;
    height: calc(var(--dialog-min-conent-height) - var(--dialog-header-height));
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: var(--dialog-min-conent-width);
  }

  &__content-fixed {
    padding: 15px 40px 0px 40px;
  }

  &__content-wrapper {
    overflow-y: overlay;
    flex: 5;
    padding: 0px 40px;
  }

  &__actions {
    display: inline-flex;
    width: 100%;
    flex: 1;
    justify-content: space-between;
    align-items: flex-end;
    padding: 5px 40px 40px 40px;
  }

  @include mixins.mobile {
    --dialog-min-conent-width: auto;
    --dialog-min-conent-height: 100svh;
    --dialog-border-radius: 0px;

    justify-content: flex-start;
    position: fixed;
    overflow: hidden;
  }
}
</style>
