import Base from "../base";
import type { Auth, AuthPayload } from "./interfaces";

export default class AuthService extends Base {
  async login(payload: AuthPayload): Promise<Auth> {
    return this.api.post("auth/login", payload);
  }

  setAuthorization(token: string) {
    this.api.setAuthorization(token);
  }
}
