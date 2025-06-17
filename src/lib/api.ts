/**
 * API utility functions for interacting with the backend
 */

// Base API URL
const API_BASE = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred while fetching data');
  }
  
  return response.json();
}

// Client API functions
export const clientsAPI = {
  getAll: () => fetchAPI<any[]>('/clients'),
  getById: (id: string) => fetchAPI<any>(`/clients/${id}`),
  create: (data: any) => fetchAPI<any>('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<any>(`/clients/${id}`, {
    method: 'DELETE',
  }),
};

// Project API functions
export const projectsAPI = {
  getAll: () => fetchAPI<any[]>('/projects'),
  getById: (id: string) => fetchAPI<any>(`/projects/${id}`),
  create: (data: any) => fetchAPI<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<any>(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Quote API functions
export const quotesAPI = {
  getAll: () => fetchAPI<any[]>('/quotes'),
  getById: (id: string) => fetchAPI<any>(`/quotes/${id}`),
  create: (data: any) => fetchAPI<any>('/quotes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/quotes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<any>(`/quotes/${id}`, {
    method: 'DELETE',
  }),
};

// Employee API functions
export const employeesAPI = {
  getAll: () => fetchAPI<any[]>('/employees'),
  getById: (id: string) => fetchAPI<any>(`/employees/${id}`),
  create: (data: any) => fetchAPI<any>('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<any>(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// Activity API functions
export const activitiesAPI = {
  getAll: () => fetchAPI<any[]>('/activities'),
  getByClientId: (clientId: string) => fetchAPI<any[]>(`/activities/${clientId}`),
  getById: (id: string) => fetchAPI<any>(`/activities/activity/${id}`),
  create: (data: any) => fetchAPI<any>('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/activities/activity/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<any>(`/activities/activity/${id}`, {
    method: 'DELETE',
  }),
};

// Activity Comments API functions (for notes on system messages)
export const activityCommentsAPI = {
  getByActivityId: (activityId: string) => fetchAPI<any[]>(`/activity-comments/by-activity-id?activityId=${activityId}`),
  create: (data: any) => fetchAPI<any>('/activity-comments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/activity-comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => fetchAPI<any>(`/activity-comments/${id}`, {
    method: 'DELETE',
  }),
};

// Export all APIs
export const api = {
  clients: clientsAPI,
  projects: projectsAPI,
  quotes: quotesAPI,
  employees: employeesAPI,
  activities: activitiesAPI,
  activityComments: activityCommentsAPI, // Add activity comments API to the main export
};

// Helper functions for direct use in components
export const createClient = (data: any) => clientsAPI.create(data);
export const updateClient = (id: string, data: any) => clientsAPI.update(id, data);
export const getClientById = (id: string) => clientsAPI.getById(id);
export const createEmployee = (data: any) => employeesAPI.create(data);
export const createProject = (data: any) => projectsAPI.create(data);
export const createQuote = (data: any) => quotesAPI.create(data);
