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
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, type Ref } from "vue";
import type { Product } from "@/api/services/interfaces";

import Loader from "@/components/common/SpinnerLoader.vue";
import ProductCard from "./LandingView/ProductCard.vue";

import { ProductsStore } from "@/stores/products";
import { useRoute } from "vue-router";
import { findParentElementByClassName, debounce } from "@/utils/helpers";

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

function handleDragover(e: DragEvent) {
  debounce(onDragover(e) as unknown as Function, 600);
}

function handleDragleave() {
  debounce(onDragleave() as unknown as Function, 200);
}

function onDragover(e: DragEvent) {
  const target = findParentElementByClassName(e.target as Element, "product");

  target?.classList.add("product--active");
}

function onDragleave() {
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
