import { computed, type ComputedRef } from "vue";
import { useRoute, type RouteMeta } from "vue-router";

export function useRouteData() {
  const route = useRoute();
  const meta: ComputedRef<RouteMeta> = computed(() => {
    return route?.meta ?? null;
  });
  const name = route.name;

  return { meta, name };
}
