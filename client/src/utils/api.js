
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://shortner-azure.vercel.app/';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    

    const text = await response.text();
    let data;
    

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = JSON.parse(text);
      } catch {
        // If JSON parsing fails, treat as text        data = { message: text };
      }
    } else {
      // Not JSON content-type, try to parse anyway in case backend sends JSON with wrong header
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || response.statusText || 'An error occurred' };
      }
    }

    if (!response.ok) {
      let errorMessage;
      if (data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string') {
        errorMessage = data;
      } else if (text) {
        errorMessage = text;
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return { data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
};


export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/registration', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/getProfile', {
      method: 'GET',
    });
  },
};

export const shortUrlAPI = {
  create: async (urlLong) => {
    return apiRequest('/shorturl/create', {
      method: 'POST',
      body: JSON.stringify({ urlLong }),
    });
  },
  getAll: async () => {
    return apiRequest('/shorturl/getall', {
      method: 'GET',
    });
  },
  delete: async (id) => {
    return apiRequest(`/shorturl/delete/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;
