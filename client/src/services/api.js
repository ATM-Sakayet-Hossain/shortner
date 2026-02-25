import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Environment-based API base URL
// In dev we call the Vite dev server at /api (which is proxied to the
// deployed API) to avoid browser CORS issues. In production, we call
// the deployed API directly.
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "https://shortner-azure.vercel.app/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include", // keep cookies support for existing backend
    prepareHeaders: (headers, { getState }) => {
      // Prefer Redux auth slice token, fallback to localStorage
      const token =
        getState()?.auth?.token || localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["User", "ShortUrl"],
  endpoints: (builder) => ({
    // AUTH ENDPOINTS
    getProfile: builder.query({
      query: () => "/auth/getProfile",
      providesTags: ["User"],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/registration",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // SHORT URL ENDPOINTS (CRUD)
    getShortUrls: builder.query({
      query: () => "/shorturl/getall",
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map((item) => ({ type: "ShortUrl", id: item._id })),
              { type: "ShortUrl", id: "LIST" },
            ]
          : [{ type: "ShortUrl", id: "LIST" }],
    }),
    createShortUrl: builder.mutation({
      query: (urlLong) => ({
        url: "/shorturl/create",
        method: "POST",
        body: { urlLong },
      }),
      invalidatesTags: [{ type: "ShortUrl", id: "LIST" }],
    }),
    updateShortUrl: builder.mutation({
      // Example PUT endpoint for future use
      query: ({ id, ...patch }) => ({
        url: `/shorturl/update/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ShortUrl", id },
        { type: "ShortUrl", id: "LIST" },
      ],
    }),
    deleteShortUrl: builder.mutation({
      query: (id) => ({
        url: `/shorturl/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ShortUrl", id },
        { type: "ShortUrl", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useGetShortUrlsQuery,
  useCreateShortUrlMutation,
  useUpdateShortUrlMutation,
  useDeleteShortUrlMutation,
} = api;
