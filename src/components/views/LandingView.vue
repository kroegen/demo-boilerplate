<template>
  <section>
    <Loader v-if="loading" />
    <ProductGrid v-else :products="products" reorderable @reorder="handleReorder" />
    <FancyPagination
      v-if="!category"
      :pages="pages"
      :currentPage="currentPage"
      @select="handleChangePage"
    />
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref, computed } from "vue";

import type { Product } from "@/api/services/interfaces";

import Loader from "@/components/common/SpinnerLoader.vue";
import ProductGrid from "@/components/products/ProductGrid.vue";
import FancyPagination from "@/components/common/FancyPagination.vue";

import { ProductsStore } from "@/stores/products";
import { useRoute, useRouter } from "vue-router";

const productsStore = ProductsStore();
const loading = ref(true);
const products: Ref<Product[]> = ref([]);
const route = useRoute();
const router = useRouter();
const pages = computed(() => productsStore.pages);
const currentPage = ref(1);
const category = computed(() => route.params.category || false);
const query = computed(() => route.query);

watch(
  () => category.value,
  async (newValue, oldValue) => {
    if (oldValue !== newValue && newValue) {
      await fetchProducts(true);
    } else if (!newValue && !Object.keys(query.value).length) {
      currentPage.value = 1;

      await fetchProducts();
    }
  },
  { immediate: true }
);

watch(
  () => query.value,
  async (newValue) => {
    if (newValue && newValue.page) {
      const page = +newValue.page;

      currentPage.value = page;

      await fetchProducts();
    }
  },
  { immediate: true }
);

async function fetchProducts(forCategory = false) {
  loading.value = true;

  try {
    const response = forCategory
      ? await productsStore.fetchProductsByCategory(category.value as string)
      : await productsStore.fetchProducts(currentPage.value);

    if (response) {
      products.value = [...response];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleChangePage(page: number) {
  const query = { page };

  router.push({ query });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleReorder(reordered: Product[]) {
  products.value = reordered;
}
</script>
