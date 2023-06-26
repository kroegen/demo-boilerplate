<template>
  <section class="not-found">
    <h1 class="not-found__404">404</h1>
    <span class="not-found__message">
      {{ $t("views.notFound.message") }}
    </span>
    <f-button size="large" variant="outlined" @click="handleGoToMain">
      {{ $t("actions.goToMain") }}
    </f-button>
  </section>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

function handleGoToMain() {
  router.push({ name: "landing" });
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 100px;

  &__404 {
    font-size: 10rem;
    line-height: 100%;
  }

  &__title {
    font-size: 3rem;
    color: var(--blue-color);
  }

  &__message {
    font-size: 1.25rem;
    color: var(--grey-color);
    margin-bottom: 20px;
  }
}
</style>
