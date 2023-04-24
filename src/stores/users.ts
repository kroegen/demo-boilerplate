import { defineStore } from "pinia";
import type { User, UserCreds, UsersResponse } from "@/api/services/interfaces";
import api from "@/api";
import { getRandomUserCreds } from "@/utils/helpers";

interface usersState {
  users: User[];
  randomUsersCreds: UserCreds;
}

export const usersStore = defineStore("usersStore", {
  state: (): usersState => ({
    users: [],
    randomUsersCreds: {
      username: "",
      password: "",
    } as UserCreds,
  }),
  actions: {
    async fetchUsers() {
      const usersResponse: UsersResponse = await api.users.fetchUsers();

      if (usersResponse.users) {
        this.users = [...usersResponse.users];

        return this.users;
      }
    },
    async removeUser(userId: number) {
      const result = await api.users.removeUser(userId);

      if (result) {
        const updatedUser = this.users.find((user) => user.id === result.id);

        if (updatedUser) {
          updatedUser.isDeleted = result.isDeleted;
        }
      }
    },
    fetchRandomUserCreds(): UserCreds {
      const randomUserCreds = {
        ...getRandomUserCreds(this.users),
      };

      this.randomUsersCreds = { ...randomUserCreds };

      return randomUserCreds;
    },
    clearUsers() {
      this.$reset();
    },
  },
});
