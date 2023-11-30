import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { reactive, ref, watch } from "vue";

export const useSearchParam = <T extends Record<string, any>>(
  defaultParams: T
) => {
  const params = reactive(defaultParams);

  const route = useRoute();
  const router = useRouter();

  const text = ref("");

  const up = () => {
    const param = JSON.stringify(params);
    if (param === text.value) return;
    text.value = param;
    router.replace({
      path: route.path,
      query: { param: text.value },
    });
  };

  const down = (r = route) => {
    const { param } = r.query;
    if (param === text.value) return;
    if (!param || typeof param !== "string") return;
    text.value = param;
    Object.keys(params).forEach((key) => delete params[key]);
    Object.assign(params, JSON.parse(param));
  };

  route.query.param ? down() : up();

  onBeforeRouteUpdate((to) => down(to));

  watch(params, up, { deep: true });

  return params;
};
