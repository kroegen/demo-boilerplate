<template>
  <f-view>
    <p v-if="!favoritesStore.favorites.length" class="favorites-empty">
      {{ $t("views.favorites.empty") }}
    </p>
    <ProductGrid v-else :products="favoritesStore.favorites" :reorderable="false" />
  </f-view>
</template>

<script lang="ts" setup>
import ProductGrid from "@/components/products/ProductGrid.vue";
import { FavoritesStore } from "@/stores/favorites";

const favoritesStore = FavoritesStore();
</script>

<style scoped>
.favorites-empty {
  padding: 50px 20px;
  text-align: center;
  color: var(--grey-color);
}
</style>
