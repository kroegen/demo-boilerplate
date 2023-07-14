<template>
  <f-view>
    <Loader v-if="loading" />
  </f-view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Loader from "@/components/common/SpinnerLoader.vue";
// import api from "@/api";

const loading = ref(true);
// const products: Ref<Product[]> = ref([]);

onMounted(async () => {
  loading.value = true;

  try {
    // await api.indexedDB();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
