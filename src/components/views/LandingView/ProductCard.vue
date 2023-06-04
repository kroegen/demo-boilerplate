<template>
  <li class="product">
    <div class="product__wrapper" :title="product.description">
      <div class="product__image-wrapper">
        <span class="product__discount">
          -{{ product.discountPercentage }}%
        </span>
        <img
          class="product__image"
          :src="productThumbnail.toString()"
          alt="thumbnail"
        />
        <FavoriteButton :productId="product.id" class="product__favorite" />
      </div>
      <div class="product__body">
        <div class="product__prices">
          <span class="product__price bold">
            {{ price }}
          </span>
          <span class="product__old-price">{{ product.price }}</span>
        </div>
        <RatingStars class="product__rating-stars" :rating="product.rating" />
        <span class="product__title">
          {{ product.title }}
        </span>
      </div>
      <div class="product__actions">
        <f-button @click="handleAddToCart">
          {{ $t("actions.addToCart") }}
          <template #after>
            <svg-icon class="header__login-icon" :src="icons.cart" />
          </template>
        </f-button>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Product } from "@/api/services/interfaces";
import { CartsStore } from "@/stores/cart";

import FavoriteButton from "./FavoriteButton.vue";
import RatingStars from "./RatingStars.vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import CartIcon from "@/assets/icons/cart-fill.svg";

const icons = {
  cart: CartIcon,
};
const store = CartsStore();

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

function handleAddToCart(product: Product) {
  store.addProductToCart(product);
}
</script>

<style lang="scss" scoped>
.product {
  $this: &;
  position: relative;
  height: 349px;
  width: 240px;

  &:hover {
    #{$this}__wrapper {
      position: absolute;
      z-index: 2;
      height: 409px;
      border-color: var(--blue-color);
      border-radius: 5px;
    }

    #{$this}__image-wrapper {
      opacity: 0.8;
    }

    #{$this}__actions {
      display: inline-flex;
    }
  }
  &__wrapper.f-card {
    --card-padding: 0px;

    height: 100%;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    transition: all 400ms;
    border: 1px solid transparent;
    overflow: hidden;
    height: 100%;
    width: 100%;
    background: var(--white-color);
    padding: 20px;
    z-index: 1;
    cursor: pointer;
  }

  &__image {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
  }

  &__favorite {
    position: absolute;
    right: 0px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  &__prices {
    display: inline-flex;
    justify-content: center;
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

  &__rating-stars {
    padding: 5px 0;
  }

  &__title {
    text-align: center;
    font-size: 0.875rem;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__discount {
    position: absolute;
    z-index: 2;
    background: var(--blue-color);
    padding: 0 20px;
    color: var(--white-color);
    width: 70px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  &__actions {
    margin-top: 10px;
    margin-bottom: 10px;
    display: none;
    justify-content: center;
    align-items: center;
  }
}
</style>
