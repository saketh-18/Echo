"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Check if response has JSON content
  const contentType = res.headers.get("content-type");
  let data = null;

  if (contentType?.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      // JSON parse failed, but we still have the status code
      data = null;
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    ...(data && { data }),
    ...(data && { error: data }),
  };
};
