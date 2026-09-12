/**
 * A central API client using standard fetch.
 * All requests will use the base URL from the environment or default to proxy.
 */

// We use relative path '/api' which will be handled by Vite proxy in development,
// and in production it should point to the correct backend domain if hosted together.
// For now, this points to our Vite proxy.
const BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const isFormData = data instanceof FormData;

  const requestHeaders: any = { ...headers };
  if (data && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: requestHeaders,
    ...customConfig,
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Attempt to parse JSON response, even on error to get backend message
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.detail || responseData.message || 'API request failed');
    }

    return responseData as T;
  } catch (error) {
    // You can handle global errors here like token expiration (401)
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, customConfig: RequestInit = {}) => request<T>(endpoint, { ...customConfig, method: 'GET' }),
  post: <T>(endpoint: string, data: any, customConfig: RequestInit = {}) => request<T>(endpoint, { ...customConfig, data, method: 'POST' }),
  put: <T>(endpoint: string, data: any, customConfig: RequestInit = {}) => request<T>(endpoint, { ...customConfig, data, method: 'PUT' }),
  delete: <T>(endpoint: string, customConfig: RequestInit = {}) => request<T>(endpoint, { ...customConfig, method: 'DELETE' }),
};
