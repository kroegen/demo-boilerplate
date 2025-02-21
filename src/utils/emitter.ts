import mitt, { type Emitter } from "mitt";
import type { SnackConfig } from "@/components/common/FancySnack.vue";

type Events = {
  showSnack: SnackConfig;
};

export const emitter: Emitter<Events> = mitt<Events>();
