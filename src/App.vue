<template>
  <router-view v-slot="{ Component }">
    <component :is="Component">
      <template #footer>
        <transition name="slide">
          <FancySnack
            v-if="state.showSnack && state.snackConfig"
            :snack="state.snackConfig"
            @close="handleCloseSnack"
          />
        </transition>
      </template>
    </component>
  </router-view>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { RouterView } from "vue-router";
import { emitter } from "@/utils/emitter";

import FancySnack, {
  type SnackConfig,
} from "@/components/common/FancySnack.vue";

interface State {
  showSnack: boolean;
  snackConfig: SnackConfig | null;
}

emitter.on("showSnack", (config: SnackConfig) => {
  handleShowSnack(config);
});

const state: State = reactive({
  showSnack: false,
  snackConfig: null,
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

<style scoped></style>
