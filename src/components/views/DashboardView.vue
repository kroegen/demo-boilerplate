<template>
  <section>
    <h2>{{ title }}</h2>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouteData } from "@/composables/useRouteData";

const { meta } = useRouteData();
const title = computed(() => {
  return meta?.value?.title ?? "";
});
</script>
