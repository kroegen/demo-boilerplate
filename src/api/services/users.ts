import Base from "../base";
import type { UserResponse, UsersResponse } from "./interfaces";

export default class UsersService extends Base {
  public async fetchUsers(): Promise<UsersResponse> {
    return this.api.get<UsersResponse>("users");
  }

  public async fetchUserById(userId: string): Promise<UserResponse> {
    return this.api.get<UserResponse>(`users/${userId}`);
  }

  public async removeUser(userId: number): Promise<UserResponse> {
    return this.api.delete<UserResponse>(`users/${userId}`);
  }
}
