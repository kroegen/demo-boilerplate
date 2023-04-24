import type ClientAPI from "./main";

export default class Base {
  public api: ClientAPI;

  constructor(clientAPI: ClientAPI) {
    if (!clientAPI) throw new Error("[clientAPI] required");

    this.api = clientAPI;
  }
}
