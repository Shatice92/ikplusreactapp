// API URL'lerini merkezi olarak yönetmek için config dosyası
export const API_BASE_URL = 'http://localhost:9090/v1/dev';

export const API_ENDPOINTS = {
  EMPLOYEES: `${API_BASE_URL}/employee`,
  DOCUMENTS: `${API_BASE_URL}/documents`,
  LEAVE_REQUESTS: `${API_BASE_URL}/leave-requests`,
  ASSETS: `${API_BASE_URL}/assets`,
  BONUSES: `${API_BASE_URL}/bonuses`,
  USER: `${API_BASE_URL}/user`
}; 