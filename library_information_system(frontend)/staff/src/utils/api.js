import Cookies from 'js-cookie';
export const fetchData = async (url, options = {}) => {
  const token = Cookies.get('access_token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : '',
    ...options.headers,
  };

  // Jangan set Content-Type kalau pakai FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const defaultOptions = {
    headers,
    method: options.method || 'GET',
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  return response.json();
};
