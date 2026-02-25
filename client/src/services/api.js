import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use /api base URL in dev (proxied by Vite to backend)
// In production, use the full deployed URL
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL || "https://shortner-azure.vercel.app/api";

// Custom baseQuery to handle text error responses
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
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
});

// Wrapper to handle text error responses
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  // Handle PARSING_ERROR (when backend returns text instead of JSON)
  if (result.error && result.error.status === 'PARSING_ERROR') {
    // Extract the text error message from the error
    const textError = result.error.data || result.error.originalStatus;
    return {
      ...result,
      error: {
        status: result.error.originalStatus || 400,
        data: textError, // Preserve the text error message
      },
    };
  }
  
  // If there's an error and the data is a string (text response), preserve it
  if (result.error && typeof result.error.data === 'string') {
    return result;
  }
  
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User", "ShortUrl"],
  endpoints: (builder) => ({
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
