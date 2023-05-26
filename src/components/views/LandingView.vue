<template>
  <section>
    <ul>
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import { useRouteData } from "@/composables/useRouteData";
import type { Product } from "@/api/services/interfaces";
import ProductCard from "./LandingView/ProductCard.vue";

import api from "@/api";

const { meta } = useRouteData();
// const title = computed(() => {
//   return meta?.value?.title ?? "";
// });
const loading = ref(true);
const products: Ref<Product[]> = ref([]);
onMounted(async () => {
  loading.value = true;

  try {
    const data = await api.products.fetchProducts();

    if (data.products) {
      products.value = [...data.products];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
