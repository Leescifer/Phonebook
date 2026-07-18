/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatName = (first?: string, last?: string) => {
  return `${first ?? ""} ${last ?? ""}`.trim();
};

export const isValidEmail = (email: string) =>
  /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

import api from "../lib/apiClient";

export const apiRequest = async (
  endpoint: string,
  token?: string | null,
  payload?: any,
  method: string = "GET",
) => {
  // Support older code that prefixes routes with /api
  if (endpoint.startsWith("/api/")) {
    endpoint = endpoint.replace("/api", "");
  }

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  if (method === "GET") {
    const res = await api.get(endpoint, { params: payload });
    return res.data;
  }

  const res = await api.request({ url: endpoint, method, data: payload });
  return res.data;
};
