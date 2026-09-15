const baseURL = import.meta.env.VITE_BACKEND_URL;

type ReqOptions =
  | { params?: Record<string, string | number | boolean> }
  | undefined;

interface ApiError extends Error {
  response?: { data: unknown; status: number };
}

const api = {
  defaults: {
    headers: { common: {} as Record<string, string> },
  },

  async request({
    url,
    method = "GET",
    data,
    params,
  }: {
    url: string;
    method?: string;
    data?: unknown;
    params?: Record<string, string | number | boolean>;
  }) {
    let full = `${baseURL}${url}`;
    if (params) {
      const qs = new URLSearchParams(
        params as Record<string, string>,
      ).toString();
      if (qs) full += `?${qs}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...api.defaults.headers.common,
    };

    const res = await fetch(full, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    const payload = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (!res.ok) {
      const err: ApiError = new Error(
        (payload?.message as string) || res.statusText || "Request failed",
      );
      err.response = { data: payload, status: res.status };
      throw err;
    }

    return { data: payload };
  },

  get(url: string, options?: ReqOptions) {
    return api.request({ url, method: "GET", params: options?.params });
  },

  post(url: string, data?: unknown) {
    return api.request({ url, method: "POST", data });
  },

  put(url: string, data?: unknown) {
    return api.request({ url, method: "PUT", data });
  },

  delete(url: string, data?: unknown) {
    return api.request({ url, method: "DELETE", data });
  },
};

export default api;
