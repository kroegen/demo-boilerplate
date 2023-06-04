<template>
  <section>
    <Loader v-if="loading" />
    <transition-group name="list" tag="ul" v-else>
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </transition-group>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import type { Product } from "@/api/services/interfaces";

import Loader from "@/components/common/SpinnerLoader.vue";
import ProductCard from "./LandingView/ProductCard.vue";

import api from "@/api";

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
  padding-top: 50px;
}
</style>
