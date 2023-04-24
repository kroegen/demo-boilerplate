import api from "@/api";
import type { Auth, AuthPayload } from "@/api/services/interfaces";
import { defineStore } from "pinia";

interface authState {
  user: Auth | null;
}

export const authStore = defineStore("authStore", {
  state: (): authState => ({
    user: null,
  }),
  getters: {
    fullName: (state): string =>
      `${state.user?.firstName} ${state.user?.lastName}`,

    isLoggedIn: (state): boolean =>
      !!(
        (state.user?.id && state.user?.token) ||
        localStorage.getItem("token")
      ),
  },
  actions: {
    async login(payload: AuthPayload) {
      const user = await api.auth.login(payload);

      if (user) {
        this.updateUser(user);
      }
    },
    updateUser(response: Auth) {
      this.user = { ...response };
      localStorage.setItem("token", response.token);
      api.auth.setAuthorization(response.token);
    },
    clearUser() {
      this.$reset();
    },
    logout() {
      this.user = null;
      api.auth.setAuthorization("");
      localStorage.removeItem("token");
    },
  },
});
