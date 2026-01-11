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

  if(!res.ok) {
    return await res.json();
  }

  const data = await res.json();
  return data;
};
