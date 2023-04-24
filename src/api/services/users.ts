import Base from "../base";
import type { UserResponse, UsersResponse } from "./interfaces";

export default class UsersService extends Base {
  public async fetchUsers(): Promise<UsersResponse> {
    return this.api.get("users");
  }

  public async fetchUserById(userId: string): Promise<UserResponse> {
    return this.api.get(`users/${userId}`);
  }

  public async removeUser(userId: number): Promise<UserResponse> {
    return this.api.delete(`users/${userId}`);
  }
}
