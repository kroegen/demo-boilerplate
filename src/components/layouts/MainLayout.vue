<template>
  <router-view v-slot="{ Component }">
    <header>
      <MainHeader />
    </header>
    <main class="layout">
      <f-container>
        <aside>
          <MainSidebar />
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
import { useRoute, RouterView } from "vue-router";
import MainHeader from "./MainLayout/MainHeader.vue";
import MainSidebar from "./MainLayout/MainSidebar.vue";
const route = useRoute();

const routeName = computed(() => {
  return route?.name ? route.name : "";
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  width: 100%;
  height: calc(100% - var(--header-height));
  flex-direction: row;
  justify-content: center;
}

article {
  background: var(--white-color);
  z-index: 1;
  width: 100%;
}
</style>
