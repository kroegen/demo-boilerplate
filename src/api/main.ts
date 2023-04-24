export default class ClientAPI {
  private authToken: string = "";
  private backendApiUrl: string;

  constructor(backendApiUrl: string) {
    this.backendApiUrl = backendApiUrl;
  }

  public async get(url: string, params?: any) {
    const query = params ? `?${JSON.stringify(params)}` : "";
    const data = await this.request(url, "GET", query);

    return data;
  }

  public async post(url: string, payload?: any) {
    const data = await this.request(url, "POST", payload);

    return data;
  }

  public async put(url: string, payload: any) {
    const data = await this.request(url, "PUT", payload);

    return data;
  }

  public async delete(url: string) {
    const data = await this.request(url, "DELETE");

    return data;
  }

  private async request(url?: string, method?: any, payload?: any) {
    const authToken = this.authToken ?? localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: authToken && authToken.length ? `Bearer ${authToken}` : "",
    };
    const query = method === "GET" ? payload : null;
    const fetchUrl =
      method === "GET"
        ? `${this.backendApiUrl}/${url}${query ? query : ""}`
        : `${this.backendApiUrl}/${url}`;
    const body =
      method === "GET"
        ? null
        : payload instanceof FormData
        ? payload
        : JSON.stringify(payload);
    const options: RequestInit = {
      method,
      headers,
      body,
    };

    try {
      const resp = await fetch(fetchUrl, options);
      const json = await this.parse(resp);

      if (resp.status && resp.status === 200) {
        console.debug(`${fetchUrl}: ${json}`);

        return json;
      } else {
        // const error = {
        //   status: resp.status,
        //   statusText: resp.statusText,
        //   ...json,
        // };

        throw new Error(json.message);
      }
    } catch (error: any) {
      console.debug(`${fetchUrl}: ${error}`);
      console.error(error);

      if (error.response) throw error.response.text();

      throw error;
    }
  }

  private async parse(resp: Response) {
    const string = await resp.text();
    const json = string === "" ? {} : JSON.parse(string);

    return json;
  }

  public setAuthorization(authToken: string) {
    this.authToken = authToken;
  }
}
