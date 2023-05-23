<template>
  <main class="layout">
    <aside v-if="showSidebar">
      <slot name="sidebar"></slot>
    </aside>
    <article>
      <slot></slot>
    </article>
    <footer>
      <slot name="footer"></slot>
      <transition name="slide">
        <FancySnack
          v-if="state.showSnack && state.snackConfig"
          :snack="state.snackConfig"
          @close="handleCloseSnack"
        />
      </transition>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import FancySnack, {
  type SnackConfig,
} from "@/components/common/FancySnack.vue";

import { emitter } from "@/utils/emitter";

emitter.on("showSnack", (config: SnackConfig) => {
  handleShowSnack(config);
});

interface MainLayout {
  showSnack: boolean;
  snackConfig: SnackConfig | null;
}

const state: MainLayout = reactive({
  showSnack: false,
  snackConfig: null,
});
const route = useRoute();
const showSidebar = computed(() => {
  return route?.meta.showSidebar;
});

function handleShowSnack(config: SnackConfig) {
  state.snackConfig = config;
  state.showSnack = true;
}

function handleCloseSnack() {
  state.snackConfig = null;
  state.showSnack = false;
}
</script>

<style scoped>
main {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
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
