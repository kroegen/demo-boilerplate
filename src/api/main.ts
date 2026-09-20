export class ClientAPIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ClientAPIError";
  }
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

  public async get<TResponse = unknown>(
    url: string,
    params?: RequestParams,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const searchParams = new URLSearchParams(
      Object.entries(params ?? {}).map(([key, value]) => [key, String(value)]),
    );
    const query = searchParams.size ? `?${searchParams}` : "";
    const data = await this.request<TResponse>(url, "GET", query, signal);
    return data;
  }

  public async post<TPayload, TResponse = unknown>(
    url: string,
    payload?: TPayload,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const data = await this.request<TResponse>(url, "POST", payload, signal);
    return data;
  }

  public async put<TPayload, TResponse = unknown>(
    url: string,
    payload: TPayload,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const data = await this.request<TResponse>(url, "PUT", payload, signal);
    return data;
  }

  public async patch<TPayload, TResponse = unknown>(
    url: string,
    payload: TPayload,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const data = await this.request<TResponse>(url, "PATCH", payload, signal);
    return data;
  }

  public async delete<TResponse = unknown>(
    url: string,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const data = await this.request<TResponse>(
      url,
      "DELETE",
      undefined,
      signal,
    );
    return data;
  }

  private async request<TResponse>(
    url?: string,
    method?: string,
    payload?: unknown,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    const authToken = this.authToken || localStorage.getItem("token");
    const headers: HeadersInit = {
      Authorization: authToken && authToken.length ? `Bearer ${authToken}` : "",
    };
    if (!(payload instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    const query = method === "GET" ? (payload as string) : null;
    const fetchUrl =
      method === "GET"
        ? `${this.backendApiUrl}/${url}${query ?? ""}`
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
      signal,
    };

    let resp: Response;
    try {
      resp = await fetch(fetchUrl, options);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "AbortError"
      ) {
        throw error;
      }
      throw new ClientAPIError(
        0,
        error instanceof Error ? error.message : "Network request failed",
        error,
      );
    }

    let data: unknown;
    try {
      data = await this.parse(resp);
    } catch (error) {
      throw new ClientAPIError(
        resp.status,
        "Could not read API response",
        error,
      );
    }

    if (resp.ok) {
      return data as TResponse;
    }

    const errorBody =
      data && typeof data === "object"
        ? (data as Record<string, unknown>)
        : null;
    const message =
      typeof errorBody?.message === "string"
        ? errorBody.message
        : typeof data === "string" && data
          ? data
          : resp.statusText || `HTTP ${resp.status}`;
    throw new ClientAPIError(resp.status, message, errorBody?.details ?? data);
  }

  private async parse(resp: Response) {
    const text = await resp.text();
    if (text === "") return {};
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  public setAuthorization(authToken: string): void {
    this.authToken = authToken;
  }
}
