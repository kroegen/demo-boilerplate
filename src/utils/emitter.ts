import mitt, { type Emitter } from "mitt";

type Events = {
  showSnack: any;
};

export const emitter: Emitter<Events> = mitt<Events>();
