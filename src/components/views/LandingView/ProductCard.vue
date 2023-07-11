<template>
  <li draggable="true" class="product" @dragstart="handleDragstart" ref="image">
    <div class="product__wrapper" :title="product.description">
      <div class="product__image-wrapper">
        <span class="product__discount">
          -{{ product.discountPercentage }}%
        </span>
        <img
          class="product__image"
          :src="(imageSrc as string)"
          alt="thumbnail"
        />
        <FavoriteButton
          :productId="product.id"
          class="product__favorite"
          @remove="handleRemoveFavorite"
          @add="handleAddFavorite"
        />
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
          {{ title }}
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
import { computed, onMounted, onUnmounted, reactive, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";

import type { Product } from "@/api/services/interfaces";
import { CartsStore } from "@/stores/cart";
import { emitter } from "@/utils/emitter";

import {
  type SnackConfig,
  SnackType,
} from "@/components/common/FancySnack.vue";
import FavoriteButton from "./FavoriteButton.vue";
import RatingStars from "./RatingStars.vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import CartIcon from "@/assets/icons/cart-fill.svg";

interface State {
  observer: IntersectionObserver | null;
  intersected: boolean;
}

const icons = {
  cart: CartIcon,
};
const store = CartsStore();
const { t } = useI18n();

const props = defineProps<{
  product: Product;
  transferData: DataTransfer;
}>();

const image: Ref<HTMLDivElement | null> = ref(null);

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
const imageSrc = computed(() =>
  state.intersected ? productThumbnail.value : ""
);

const state: State = reactive({
  observer: null,
  intersected: false,
});

onMounted(() => {
  state.observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      const image = entries[0];

      if (image.isIntersecting && state.observer) {
        state.intersected = true;
        state.observer.disconnect();
      }
    }
  );

  if (image.value) {
    state.observer.observe(image.value);
  }
});

onUnmounted(() => {
  state.observer?.disconnect();
});

function handleAddToCart(product: Product) {
  store.addProductToCart(product);
  handleShowSuccessMessage();
}

function handleShowSuccessMessage() {
  const message = t("notifications.product.cartAdded", { item: title.value });
  const snackConfig: SnackConfig = {
    text: message,
    type: SnackType.success,
    icon: true,
    closable: true,
  };

  emitter.emit("showSnack", snackConfig);
}

function handleAddFavorite() {
  const message = t("notifications.product.favoritesAdded", {
    item: title.value,
  });
  const snackConfig: SnackConfig = {
    text: message,
    type: SnackType.info,
    icon: true,
    closable: true,
  };

  emitter.emit("showSnack", snackConfig);
}

function handleRemoveFavorite() {
  const message = t("notifications.product.favoritesRemoved", {
    item: title.value,
  });
  const snackConfig: SnackConfig = {
    text: message,
    type: SnackType.info,
    icon: true,
    closable: true,
  };

  emitter.emit("showSnack", snackConfig);
}

function handleDragstart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData("value", JSON.stringify(props.transferData));
  }
}
</script>

<style lang="scss" scoped>
.product {
  $this: &;
  --bg-color: var(--white-color);

  position: relative;
  height: 349px;
  width: 240px;
  cursor: pointer;

  &--active {
    --bg-color: var(--beige-color);
  }

  &--active,
  &:hover {
    #{$this}__wrapper {
      position: absolute;
      z-index: 2;
      height: 409px;
      border-color: var(--blue-color);
      border-radius: 5px;
    }

    #{$this}__image-wrapper {
      opacity: 1;
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
    background: var(--bg-color);
    padding: 20px;
    z-index: 1;
    cursor: pointer;
  }

  &__image {
    min-width: 100%;
    width: 100%;
    min-height: 200px;
    height: 200px;
    object-fit: contain;
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    opacity: 0.85;
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
