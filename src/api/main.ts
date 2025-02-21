interface APIError extends Error {
  response?: Response;
}

interface RequestParams {
  [key: string]: string | number | boolean;
}

export default class ClientAPI {
  private authToken: string = "";
  private backendApiUrl: string;

  constructor(backendApiUrl: string) {
    this.backendApiUrl = backendApiUrl;
  }

  public async get(url: string, params?: RequestParams) {
    const query = params ? `?${JSON.stringify(params)}` : "";
    const data = await this.request(url, "GET", query);
    return data;
  }

  public async post<T>(url: string, payload?: T) {
    const data = await this.request(url, "POST", payload);
    return data;
  }

  public async put<T>(url: string, payload: T) {
    const data = await this.request(url, "PUT", payload);
    return data;
  }

  public async delete(url: string) {
    const data = await this.request(url, "DELETE");
    return data;
  }

  private async request<T>(
    url?: string,
    method?: string,
    payload?: T | string | FormData
  ) {
    const authToken = this.authToken ?? localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: authToken && authToken.length ? `Bearer ${authToken}` : "",
    };
    const query = method === "GET" ? (payload as string) : null;
    const fetchUrl = method === "GET"
      ? `${this.backendApiUrl}/${url}${query ?? ""}`
      : `${this.backendApiUrl}/${url}`;
    const body = method === "GET"
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

      if (resp.status === 200) {
        console.debug(`${fetchUrl}: ${JSON.stringify(json)}`);
        return json;
      }
      // const error = {
      //   status: resp.status,
      //   statusText: resp.statusText,
      //   ...json,
      // };
      throw new Error(json.message);
    } catch (error) {
      console.debug(`${fetchUrl}: ${error}`);
      console.error(error);

      const apiError = error as APIError;
      if (apiError.response) {
        throw await apiError.response.text();
      }

      throw apiError;
    }
  }

  private async parse(resp: Response) {
    const text = await resp.text();
    return text === "" ? {} : JSON.parse(text);
  }

  public setAuthorization(authToken: string): void {
    this.authToken = authToken;
  }
}
