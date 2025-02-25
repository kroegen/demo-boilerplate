import { useRoute } from "vue-router";
import { ref, watch } from "vue";

export function useRouteData() {
  const route = useRoute();

  const name = ref(route.name);
  const meta = ref(route.meta);

  watch(
    () => route.name,
    (newName) => {
      name.value = newName;
    }
  );

  watch(
    () => route.meta,
    (newMeta) => {
      meta.value = newMeta;
    }
  );

  return { name, meta };
}
