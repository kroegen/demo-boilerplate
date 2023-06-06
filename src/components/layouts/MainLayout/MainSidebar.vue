<template>
  <div class="sidebar">
    <ul v-if="categories.length" class="sidebar__list">
      <li
        v-for="catergory in categories"
        :key="catergory"
        class="sidebar__list-item"
        :class="{ 'sidebar__list-item--active': currentCategory === catergory }"
        @click="moveToCategory(catergory)"
      >
        {{ catergory }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ProductsStore } from "@/stores/products";
import { onMounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const categories: Ref<string[]> = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();
const productsStore = ProductsStore();
const currentCategory = ref("");

watch(
  () => route.params.category,
  async (newValue, oldValue) => {
    if (oldValue !== newValue) {
      currentCategory.value = newValue as string;
    }
  }
);

onMounted(async () => {
  loading.value = true;

  try {
    const response = await productsStore.fetchProductsCatgories();

    if (response) {
      categories.value = [...response];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

function moveToCategory(category: string) {
  router.push({ name: "category", params: { category } });
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  padding-top: 50px;

  &__list {
    list-style: none;
    padding: 0px;
  }

  &__list-item {
    --border-color: transparent;

    text-transform: capitalize;
    font-size: 0.875rem;
    color: var(--grey-color);
    border-left: 3px solid var(--border-color);
    // border-right: 3px solid var(--border-color);
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
  }
}
</style>
