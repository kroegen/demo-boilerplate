<template>
  <router-view v-slot="{ Component }">
    <header class="header">
      <f-container>
        <div class="header__name">
          <h2>{{ routeName }}</h2>
        </div>
        <div class="header__actions">
          <svg-icon
            v-if="icons.login"
            class="header__login-icon"
            :src="icons.login"
            @click="handleLogin"
          />
        </div>
      </f-container>
    </header>
    <main class="layout">
      <f-container>
        <aside v-if="showSidebar">
          <slot name="sidebar"></slot>
        </aside>
        <article>
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="routeName" />
            </keep-alive>
          </transition>
        </article>
      </f-container>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from "vue";
// import { useI18n } from "vue-i18n";
import { useRoute, useRouter, RouterView } from "vue-router";
import SvgIcon from "@/components/common/SvgIcon.vue";

import LoginIcon from "@/assets/icons/login-line.svg";

const icons = {
  login: LoginIcon,
};

// const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const showSidebar = computed(() => {
  return route?.meta.showSidebar;
});

const routeName = computed(() => {
  return route?.name ? route.name : "";
});

function handleLogin() {
  router.push({ name: "login" });
}
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

  &__login-icon {
    --icon-color: var(--beige-color);

    display: inline-flex;
    flex-shrink: 0;
    width: 36px;
    height: 36px;

    &:hover {
      --icon-color: var(--white-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(1.1);
    }
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

main {
  display: flex;
  width: 100%;
  height: calc(100% - var(--header-height));
  flex-direction: row;
  justify-content: center;
}

aside {
  background: var(--beige-color);
  z-index: 2;
}

article {
  background: var(--white-color);
  z-index: 1;
  width: 100%;
}
</style>
