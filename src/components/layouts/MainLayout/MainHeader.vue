<template>
  <div class="header">
    <f-container>
      <div class="header__actions-left">
        <svg-icon
          class="header__menu-icon"
          :src="icons.menu"
          @click="handleOpenMenu"
        />
      </div>
      <div class="header__name" @click="handleHome">
        <h2>{{ routeCategory }}</h2>
      </div>
      <div class="header__actions-right">
        <SelectLocale class="header__select-locale" inverted />
        <a
          href="https://github.com/kroegen/demo-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
          class="header__github-icon"
        >
          <svg-icon :src="icons.github" />
        </a>
        <IconCounter
          class="header__heart-icon"
          :counter="favoritesStore.counter"
          :icon="icons.filled"
          @click="handleOpenFavorites"
        >
          <f-popper
            :visible="isFavoritesOpen"
            placement="bottom-start"
            :offset="[0, 15]"
          >
            <f-dropdown class="header__icon-dropdown">
              <transition-group name="fade">
                <ProductListItem
                  v-for="favorite in favoritesStore.favorites"
                  :key="favorite.id"
                  :product="favorite"
                  style="margin-bottom: 10px"
                  @remove="handleRemoveProductFromFavorites(favorite.id)"
                />
              </transition-group>
            </f-dropdown>
          </f-popper>
        </IconCounter>
        <IconCounter
          class="header__cart-icon"
          :counter="cartsStore.counter"
          :icon="icons.cart"
          @click="handleOpenCart"
        />
        <svg-icon
          class="header__login-icon"
          :src="icons.login"
          @click="handleLogin"
        />
      </div>
    </f-container>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import SvgIcon from "@/components/common/SvgIcon.vue";
import IconCounter from "@/components/common/IconCounter.vue";
import ProductListItem from "@/components/views/LandingView/ProductListItem.vue";
import SelectLocale from "./SelectLocale.vue";

import LoginIcon from "@/assets/icons/login-line.svg";
import GithubIcon from "@/assets/icons/github-fill.svg";
import CartIcon from "@/assets/icons/cart-fill.svg";
import FilledIcon from "@/assets/icons/heart-fill.svg";
import MenuIcon from "@/assets/icons/menu-line.svg";

import { CartsStore } from "@/stores/cart";
import { FavoritesStore } from "@/stores/favorites";
import { computed, ref } from "vue";

const icons = {
  login: LoginIcon,
  github: GithubIcon,
  cart: CartIcon,
  filled: FilledIcon,
  menu: MenuIcon,
};
const route = useRoute();
const emit = defineEmits(["click-menu"]);

const isFavoritesOpen = ref(false);
const routeName = computed(() => {
  return route?.name ? route.name : "";
});
const routeCategory = computed(() => {
  return route.params.category ? `< ${route.params.category}` : routeName.value;
});
const router = useRouter();
const cartsStore = CartsStore();
const favoritesStore = FavoritesStore();

function handleLogin() {
  router.push({ name: "login" });
}

function handleHome() {
  router.push({ name: "landing" });
}

function handleOpenCart() {}

function handleOpenFavorites() {
  isFavoritesOpen.value = !isFavoritesOpen.value;
}

function handleRemoveProductFromFavorites(productId: number) {
  favoritesStore.removeProductIdFromFavoritesIds(productId);
}

function handleOpenMenu() {
  emit("click-menu");
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";

.header {
  --icon-size: 36px;

  height: var(--header-height);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: var(--black-color);
  position: fixed;
  z-index: 3;

  &__heart-icon,
  &__login-icon,
  &__github-icon,
  &__cart-icon,
  &__menu-icon {
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

    @include mobile {
      --icon-size: 28px;
    }
  }

  &__heart-icon,
  &__login-icon,
  &__github-icon,
  &__cart-icon {
    margin-left: 20px;
  }

  &__actions-right,
  &__actions-left {
    padding: 0 20px;
    align-items: center;
  }

  &__actions-right {
    margin-left: auto;
    display: inline-flex;
    position: relative;

    @include mobile {
      padding: 0px;
    }
  }

  &__icon-dropdown {
    --dropdown-max-height: 400px;
    --dropdown-width: 400px;
    --dropdown-padding: 10px;
  }

  &__actions-left {
    margin-right: auto;
    display: none;

    @include mobile {
      display: inline-flex;
    }
  }

  &__select-locale {
    @include mobile {
      display: none;
    }
  }

  &__name {
    color: var(--beige-color);
    text-transform: capitalize;

    &:hover {
      color: var(--white-color);
      transform: scale(0.95);
      cursor: pointer;
    }

    @include mobile {
      display: inline-flex;
      align-items: center;
    }
  }

  &__name h2 {
    @include mobile {
      font-size: 1.25rem;
    }
  }
}
</style>
