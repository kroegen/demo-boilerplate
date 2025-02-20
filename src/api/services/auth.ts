import Base from "../base";
import type { Auth, AuthPayload } from "./interfaces";

export default class AuthService extends Base {
  async login(payload: AuthPayload): Promise<Auth> {
    return this.api.post("auth/login", payload);
  }

  setAuthorization(token: string): void {
    try {
      this.api.setAuthorization(token);
      console.debug("Authorization token set successfully");
    } catch (error) {
      console.error("Failed to set authorization token:", error);
      throw new Error("Failed to set authorization token");
    }
  }
}
