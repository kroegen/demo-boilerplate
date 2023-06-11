<template>
  <router-view v-slot="{ Component }">
    <header>
      <MainHeader @click-menu="hanldeClickMenu" />
    </header>
    <main class="layout">
      <f-container>
        <aside :class="{ opened: openedSideBar }">
          <MainSidebar @click-sidebar="hanldeClickSidebar" />
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
import { computed, ref } from "vue";
import { useRoute, RouterView } from "vue-router";
import MainHeader from "./MainLayout/MainHeader.vue";
import MainSidebar from "./MainLayout/MainSidebar.vue";
const route = useRoute();

const routeName = computed(() => {
  return route?.name ? route.name : "";
});
const openedSideBar = ref(false);

function hanldeClickMenu() {
  openedSideBar.value = !openedSideBar.value;
}

function hanldeClickSidebar() {
  openedSideBar.value = false;
}
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

@media screen and (max-width: 992px) {
  aside {
    position: absolute;
    z-index: 2;
    background: var(--white-color);
    height: 100%;
    display: none;

    &.opened {
      display: inline-flex;
    }
  }
}
</style>
