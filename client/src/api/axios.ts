const baseURL = import.meta.env.VITE_BACKEND_URL;

type ReqOptions = { params?: Record<string, any> } | undefined;

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
    data?: any;
    params?: Record<string, any>;
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

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(
        payload?.message || res.statusText || "Request failed",
      );
      (err as any).response = { data: payload, status: res.status };
      throw err;
    }

    return { data: payload };
  },

  get(url: string, options?: ReqOptions) {
    return api.request({ url, method: "GET", params: options?.params });
  },

  post(url: string, data?: any) {
    return api.request({ url, method: "POST", data });
  },

  put(url: string, data?: any) {
    return api.request({ url, method: "PUT", data });
  },

  delete(url: string, data?: any) {
    return api.request({ url, method: "DELETE", data });
  },
};

export default api;
