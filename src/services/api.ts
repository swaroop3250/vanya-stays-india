import type { Booking, Destination, Resort, Review } from "@/types";

const API_BASE = "/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || "Request failed", response.status);
  }

  return response.json();
};

export const api = {
  destinations: {
    list: () => request<Destination[]>("/destinations"),
    getById: (id: string) =>
      request<Destination & { hotels: Resort[] }>(`/destinations/${id}`),
    hotels: (id: string) => request<Resort[]>(`/destinations/${id}/hotels`),
  },
  hotels: {
    list: () => request<Resort[]>("/hotels"),
    getById: (id: string) => request<Resort>(`/hotels/${id}`),
    search: (location: string) =>
      request<Resort[]>(`/hotels/search?location=${encodeURIComponent(location)}`),
    reviews: (id: string) => request<Review[]>(`/hotels/${id}/reviews`),
  },
  bookings: {
    create: (payload: Partial<Booking>, token: string) =>
      request<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    list: (token: string) =>
      request<Booking[]>("/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    getById: (id: string, token: string) =>
      request<Booking>(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    cancel: (id: string, token: string) =>
      request<{ id: string; status: string }>(`/bookings/${id}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  },
  auth: {
    signup: (payload: { name: string; email: string; password: string; role?: string }) =>
      request<{ user: { id: string; name: string; email: string; role: string }; accessToken: string; refreshToken: string }>(
        "/auth/signup",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      ),
    login: (payload: { email: string; password: string }) =>
      request<{ user: { id: string; name: string; email: string; role: string }; accessToken: string; refreshToken: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      ),
    me: (token: string) =>
      request<{ user: { id: string; name: string; email: string; role: string } }>("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    refresh: (refreshToken: string) =>
      request<{ accessToken: string; refreshToken: string }>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),
    logout: (token: string) =>
      request<{ message: string }>("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  },
};
