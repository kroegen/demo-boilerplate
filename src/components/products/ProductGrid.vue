<template>
  <transition-group
    name="list"
    tag="ul"
    class="product-grid"
    @dragover="handleDragover"
    @dragleave="handleDragleave"
    @drop="handleDrop"
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      :draggable="reorderable"
    />
  </transition-group>
</template>

<script setup lang="ts">
import type { Product } from "@/api/services/interfaces";
import ProductCard from "./ProductCard.vue";

const props = withDefaults(
  defineProps<{ products: Product[]; reorderable?: boolean }>(),
  {
    reorderable: false,
  },
);
const emit = defineEmits<{ reorder: [products: Product[]] }>();

function productElement(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>("li.product")
    : null;
}

function clearActive() {
  document.querySelectorAll("li.product--active").forEach((node) => {
    node.classList.remove("product--active");
  });
}

function handleDragover(event: DragEvent) {
  if (!props.reorderable) return;
  event.preventDefault();
  const target = productElement(event.target);
  clearActive();
  target?.classList.add("product--active");
}

function handleDragleave() {
  if (props.reorderable) clearActive();
}

function handleDrop(event: DragEvent) {
  if (!props.reorderable) return;
  event.preventDefault();
  const sourceId = Number(event.dataTransfer?.getData("text/plain"));
  const targetId = Number(productElement(event.target)?.dataset.productId);
  const sourceIndex = props.products.findIndex(
    (product) => product.id === sourceId,
  );
  const targetIndex = props.products.findIndex(
    (product) => product.id === targetId,
  );

  if (sourceIndex >= 0 && targetIndex >= 0 && sourceIndex !== targetIndex) {
    const reordered = [...props.products];
    [reordered[targetIndex], reordered[sourceIndex]] = [
      reordered[sourceIndex],
      reordered[targetIndex],
    ];
    emit("reorder", reordered);
  }
  clearActive();
}
</script>

<style lang="scss" scoped>
.product-grid {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  padding-top: 50px;
}
</style>
