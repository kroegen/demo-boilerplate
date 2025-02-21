<template>
  <section
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragleave"
    @drop.prevent="onDrop"
  >
    <Loader v-if="loading" />
    <transition-group name="list" tag="ul" v-else>
      <ProductCard
        v-for="(product, index) in products"
        :key="product.id"
        :product="product"
        :transferData="(({ ...product, index }) as unknown as DataTransfer)"
      />
    </transition-group>
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

interface DragHandler {
  (e: DragEvent): void;
}
interface LeaveHandler {
  (): void;
}

import Loader from "@/components/common/SpinnerLoader.vue";
import ProductCard from "./LandingView/ProductCard.vue";
import FancyPagination from "@/components/common/FancyPagination.vue";

import { ProductsStore } from "@/stores/products";
import { useRoute, useRouter } from "vue-router";
import { findParentElementByClassName, debounce } from "@/utils/helpers";

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

function handleDragover(e: DragEvent) {
  const debouncedDragover = debounce<DragHandler>(onDragover, 600);
  debouncedDragover(e);
}

function handleDragleave() {
  const debouncedDragleave = debounce<LeaveHandler>(onDragleave, 200);
  debouncedDragleave();
}

function onDragover(e: DragEvent): void {
  const target = findParentElementByClassName(e.target as Element, "product");

  target?.classList.add("product--active");
}

function onDragleave(): void {
  const activeNodes = document.querySelectorAll("li.product--active");

  for (const activeNode of activeNodes) {
    activeNode.classList.remove("product--active");
  }
}

function onDrop(e: DragEvent) {
  const product = e.dataTransfer && JSON.parse(e.dataTransfer.getData("value"));

  if (product) {
    const sourceIndex = product.index;
    const target = findParentElementByClassName(e.target as Element, "product");
    const targetIndex =
      target && target.parentNode
        ? [...target.parentNode.children].indexOf(target)
        : null;

    if (targetIndex !== null && targetIndex !== undefined && sourceIndex >= 0) {
      [products.value[targetIndex], products.value[sourceIndex]] = [
        products.value[sourceIndex],
        products.value[targetIndex],
      ];
    }

    target?.classList.remove("product--active");
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
