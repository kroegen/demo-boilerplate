<template>
  <div class="product-item">
    <img
      class="product-item__image"
      :src="(productThumbnail as unknown as string)"
      alt="thumbnail"
    />
    <div class="product-item__body">
      <span class="product-item__name">{{ title }}</span>
      <span class="product-item__price">{{ price }}</span>
    </div>
    <svg-icon
      class="product-item__remove-icon"
      :src="RemoveIcon"
      @click="emit('remove')"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Product } from "@/api/services/interfaces";
import { computed } from "vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import RemoveIcon from "@/assets/icons/close-line.svg";

interface Props {
  product: Product;
}
const emit = defineEmits(["remove"]);
const props = defineProps<Props>();

const product = computed(() => {
  return props.product;
});
const title = computed(() => {
  return props.product.title;
});
const price = computed(() => {
  const discount =
    (product.value.price * product.value.discountPercentage) / 100;

  return (product.value.price - discount).toFixed(2);
});
const productThumbnail = computed(() => {
  return product.value.thumbnail;
});
</script>

<style lang="scss" scoped>
.product-item {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: var(--white-color);
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  transition: all 0.3s;
  flex-shrink: 0;

  &__image {
    width: 20%;
    min-width: 20px;
    height: 100%;
    min-height: 100%;
    margin-right: 20px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 0.875rem;
  }

  &__remove-icon {
    --icon-color: var(--black-color);
    --icon-size: 24px;

    width: var(--icon-size);
    height: var(--icon-size);

    margin-left: 20px;
    margin-right: 10px;

    &:hover {
      --icon-color: var(--blue-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &:hover {
    cursor: pointer;
    border-color: var(--blue-color);
    background: var(--beige-color);
  }
}
</style>
