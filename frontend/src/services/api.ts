import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string; phone?: string }) =>
    api.post('/users/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/users/login', data),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

export const jobAPI = {
  getJobs: (params?: { skills?: string; salaryMin?: number; salaryMax?: number; location?: string; page?: number; limit?: number }) =>
    api.get('/jobs', { params }),

  postJob: (data: { title: string; description: string; skills: string[]; salary: number; location: string }) =>
    api.post('/jobs', data),

  updateJob: (id: string, data: Partial<{ title: string; description: string; skills: string[]; salary: number; location: string }>) =>
    api.put(`/jobs/${id}`, data),

  deleteJob: (id: string) =>
    api.delete(`/jobs/${id}`),

  applyForJob: (id: string, data: { coverLetter?: string }) =>
    api.post(`/jobs/${id}/apply`, data),

  getMyJobs: () =>
    api.get('/jobs/my-jobs'),

  getAppliedJobs: () =>
    api.get('/jobs/applied'),

  getApplicants: (id: string) =>
    api.get(`/jobs/${id}/applicants`),
};

export default api;
