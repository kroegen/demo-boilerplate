<template>
  <div class="sidebar">
    <ul v-if="categories.length" class="sidebar__list">
      <li
        v-for="category in categories"
        :key="category.slug"
        class="sidebar__list-item"
        :class="{
          'sidebar__list-item--active': currentCategory === category.slug,
        }"
        @click="moveToCategory(category.slug)"
      >
        {{ category.name }}
      </li>
    </ul>
    <SelectLocale class="sidebar__select-locale" />
  </div>
</template>

<script lang="ts" setup>
import { ProductsStore } from "@/stores/products";
import { onMounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import SelectLocale from "./SelectLocale.vue";
import type { Category } from "@/api/services/interfaces";

const emit = defineEmits(["click-sidebar"]);
const categories: Ref<Category[]> = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();
const productsStore = ProductsStore();
const currentCategory = ref("");

watch(
  () => route.params.category,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      currentCategory.value = newValue as string;
    }
  },
  { deep: true }
);

onMounted(async () => {
  loading.value = true;

  try {
    const response = await productsStore.fetchProductsCategories();
    const category = route.params.category;

    if (response) {
      categories.value = [...response];
    }
    if (category) {
      currentCategory.value = category as string;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

function moveToCategory(slug: string) {
  router.push({ name: "category", params: { category: slug } });
  emit("click-sidebar");
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

.sidebar {
  width: 200px;
  padding-top: 50px;

  &__list {
    list-style: none;
    padding: 0px;
    height: auto;

    @include mixins.mobile {
      width: 100%;
    }
  }

  &__list-item {
    --border-color: transparent;

    text-transform: capitalize;
    font-size: 0.875rem;
    color: var(--grey-color);
    border-left: 3px solid var(--border-color);
    transition: all 300ms;

    height: 30px;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 0px 20px;

    &:hover,
    &--active {
      --border-color: var(--blue-color);

      cursor: pointer;
      color: var(--blue-color);
    }

    @include mixins.mobile {
      font-size: 1.5rem;
      border-right: 3px solid var(--border-color);
    }
  }

  &__select-locale {
    display: none;

    @include mixins.mobile {
      display: flex;
      margin-top: 20px;
      margin-left: 20px;
    }
  }

  @include mixins.mobile {
    width: 100%;
    padding-top: 20px;
    overflow-y: scroll;
    padding-bottom: 50px;
  }
}
</style>
