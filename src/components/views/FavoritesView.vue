<template>
  <f-view>
    <ProductGrid :products="favoritesStore.favorites" />
  </f-view>
</template>

<script lang="ts" setup>
import ProductGrid from "@/components/products/ProductGrid.vue";
import { FavoritesStore } from "@/stores/favorites";

const favoritesStore = FavoritesStore();
</script>
