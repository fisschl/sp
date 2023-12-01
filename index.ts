import { Ref, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * 将数据同步到 URL 中
 * @param data 数据源
 * @param onPopState 返回时触发
 */
export const useSearchParam = <T extends Record<string, any>>(
  data: Ref<T>,
  onPopState?: (data: T) => void
) => {
  const route = useRoute();
  const router = useRouter();

  const up = () => {
    const param = JSON.stringify(data.value);
    router.replace({ path: route.path, query: { param } });
  };

  const down = (r = route) => {
    const { param } = r.query;
    if (!param || typeof param !== "string") return;
    data.value = JSON.parse(param);
  };

  route.query.param ? down() : up();

  watch(data, up, { deep: true });

  const handlePopState = () => {
    down();
    if (onPopState) onPopState(data.value);
  };

  onMounted(() => addEventListener("popstate", handlePopState));
  onBeforeUnmount(() => removeEventListener("popstate", handlePopState));
};
