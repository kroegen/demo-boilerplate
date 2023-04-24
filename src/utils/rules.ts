import { defineRule } from "vee-validate";

defineRule("required", (value: string) => {
  if (!value || !value.length) {
    return "This field is required";
  }

  return true;
});
