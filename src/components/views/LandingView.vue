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
import { onMounted, ref, watch, type Ref } from "vue";
import type { Product } from "@/api/services/interfaces";

import Loader from "@/components/common/SpinnerLoader.vue";
import ProductCard from "./LandingView/ProductCard.vue";

import { ProductsStore } from "@/stores/products";
import { useRoute } from "vue-router";

const productsStore = ProductsStore();
const loading = ref(true);
const products: Ref<Product[]> = ref([]);
const route = useRoute();

watch(
  () => route.params.category,
  async (newValue, oldValue) => {
    if (oldValue !== newValue && newValue) {
      await fetchProducts(true);
    } else if (!newValue) {
      await fetchProducts();
    }
  }
);

onMounted(async () => {
  if (route.params.category) {
    await fetchProducts(true);
  } else {
    await fetchProducts();
  }
});

async function fetchProducts(forCategory = false) {
  loading.value = true;

  try {
    const category = route.params.category as string;
    const response = forCategory
      ? await productsStore.fetchProductsByCategory(category)
      : await productsStore.fetchProducts();

    if (response) {
      products.value = [...response];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0px;
  padding-top: 50px;
}
</style>
