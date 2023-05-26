<template>
  <li class="product" :title="product.description">
    <!-- <f-card class="product__wrapper"> -->
    <div class="product__image-wrapper">
      <img
        class="product__image"
        :src="productThumbnail.toString()"
        alt="thumbnail"
      />
    </div>
    <div class="product__body">
      <div class="product__prices">
        <span class="product__price bold">
          {{ price }}
        </span>
        <span class="product__old-price">{{ product.price }}</span>
      </div>
      {{ product.title }}
    </div>
    <!-- </f-card> -->
  </li>
</template>

<script lang="ts" setup>
import type { Product } from "@/api/services/interfaces";
import { computed } from "vue";

const props = defineProps<{
  product: Product;
}>();

const product = computed(() => {
  return props.product;
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
.product {
  height: 340px;
  width: 15%;
  padding: 20px;
  display: flex;
  flex-direction: column;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &__wrapper.f-card {
    --card-padding: 0px;

    height: 100%;
  }

  &__image {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  &__prices {
    display: inline-flex;
  }

  &__price {
    font-weight: 600;
    font-size: 1.25rem;
    margin-right: 10px;
  }

  &__old-price {
    font-size: 1.125rem;
    text-decoration: line-through;
    color: var(--grey-color);
  }
}
</style>
