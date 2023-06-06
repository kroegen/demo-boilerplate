<template>
  <div class="header">
    <f-container>
      <div class="header__name" @click="handleHome">
        <h2>{{ routeName }}</h2>
      </div>
      <div class="header__actions">
        <a
          href="https://github.com/kroegen/demo-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
          class="header__github-icon"
        >
          <svg-icon :src="icons.github" />
        </a>
        <div class="header__heart-icon" @click="handleOpenFavorites">
          <span class="header__heart-icon-counter">{{
            favoritesStore.counter
          }}</span>
          <svg-icon :src="icons.filled" />
        </div>
        <div class="header__cart-icon" @click="handleOpenCart">
          <span class="header__cart-icon-counter">{{
            cartsStore.counter
          }}</span>
          <svg-icon :src="icons.cart" />
        </div>
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

import LoginIcon from "@/assets/icons/login-line.svg";
import GithubIcon from "@/assets/icons/github-fill.svg";
import CartIcon from "@/assets/icons/cart-fill.svg";
import FilledIcon from "@/assets/icons/heart-fill.svg";

import { CartsStore } from "@/stores/cart";
import { FavoritesStore } from "@/stores/favorites";
import { computed } from "vue";

const icons = {
  login: LoginIcon,
  github: GithubIcon,
  cart: CartIcon,
  filled: FilledIcon,
};
const route = useRoute();

const routeName = computed(() => {
  return route?.name ? route.name : "";
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

function handleOpenFavorites() {}
</script>

<style lang="scss" scoped>
.header {
  height: var(--header-height);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: var(--black-color);

  &__heart-icon,
  &__login-icon,
  &__github-icon,
  &__cart-icon {
    --icon-color: var(--beige-color);

    display: inline-flex;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    margin-left: 20px;
    position: relative;

    &:hover {
      --icon-color: var(--white-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(1.1);
    }
  }

  &__cart-icon-counter,
  &__heart-icon-counter {
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

  &__actions {
    margin-left: auto;
    padding: 0 20px;
    display: inline-flex;
    align-items: center;
  }

  &__name {
    color: var(--beige-color);
    text-transform: capitalize;

    &:hover {
      color: var(--white-color);
      transform: scale(1.05);
      cursor: pointer;
    }
  }
}
</style>