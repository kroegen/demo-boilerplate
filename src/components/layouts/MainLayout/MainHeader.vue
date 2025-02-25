<template>
  <div class="header">
    <f-container>
      <div class="header__actions-left">
        <svg-icon
          class="header__menu-icon"
          :src="HEADER_ICONS.menu"
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
          <svg-icon :src="HEADER_ICONS.github" />
        </a>
        <IconCounter
          class="header__heart-icon"
          :counter="favoritesStore.counter"
          :icon="HEADER_ICONS.filled"
          @click="handleOpenDropdown('favorites')"
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
                  :style="{ 'margin-bottom: 10px': favoritesStore.counter > 1 }"
                  @remove="handleRemoveProduct(favorite.id, 'favorites')"
                />
              </transition-group>
            </f-dropdown>
          </f-popper>
        </IconCounter>
        <IconCounter
          class="header__cart-icon"
          :counter="cartsStore.counter"
          :icon="HEADER_ICONS.cart"
          @click="handleOpenDropdown('cart')"
        >
          <f-popper
            :visible="isCartOpen"
            placement="bottom-start"
            :offset="[0, 15]"
          >
            <f-dropdown class="header__icon-dropdown">
              <transition-group name="fade">
                <ProductListItem
                  v-for="product in cartsStore.products"
                  :key="product.id"
                  :product="product"
                  :style="{ 'margin-bottom: 10px': cartsStore.counter > 1 }"
                  @remove="handleRemoveProduct(product.id, 'cart')"
                />
              </transition-group>
            </f-dropdown>
          </f-popper>
        </IconCounter>
        <svg-icon
          class="header__login-icon"
          :src="HEADER_ICONS.login"
          @click="handleLogin"
        />
      </div>
    </f-container>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import SvgIcon from "@/components/common/SvgIcon.vue";
import IconCounter from "@/components/common/IconCounter.vue";
import ProductListItem from "@/components/views/LandingView/ProductListItem.vue";
import SelectLocale from "./SelectLocale.vue";
import { HEADER_ICONS } from "@/constants/icons";
import { useMainHeader } from "@/composables/useMainHeader";

const route = useRoute();
const router = useRouter();
const emit = defineEmits(["click-menu"]);

const {
  isCartOpen,
  isFavoritesOpen,
  cartsStore,
  favoritesStore,
  handleRemoveProduct,
  handleOpenDropdown,
  handleCloseAll,
} = useMainHeader();

const routeName = computed(() => route?.name ?? "");
const routeCategory = computed(() =>
  route.params.category ? `< ${route.params.category}` : routeName.value
);

const handleLogin = () => router.push({ name: "login" });
const handleHome = () => router.push({ name: "landing" });
const handleOpenMenu = () => {
  handleCloseAll();
  emit("click-menu");
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

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

    @include mixins.mobile {
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

    @include mixins.mobile {
      padding: 0px;
    }
  }

  &__icon-dropdown {
    --dropdown-max-height: 400px;
    --dropdown-width: 400px;
    --dropdown-padding: 10px;

    @include mixins.mobile {
      --dropdown-width: 100vw;
    }
  }

  &__actions-left {
    margin-right: auto;
    display: none;

    @include mixins.mobile {
      display: inline-flex;
    }
  }

  &__select-locale {
    @include mixins.mobile {
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

    @include mixins.mobile {
      display: inline-flex;
      align-items: center;
    }
  }

  &__name h2 {
    @include mixins.mobile {
      font-size: 1.25rem;
    }
  }
}
</style>
