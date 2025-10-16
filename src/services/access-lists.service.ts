import api from './api';

export interface AccessListAuthUser {
  id?: string;
  username: string;
  password?: string;
  passwordHash?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccessListDomain {
  id: string;
  domainId: string;
  enabled: boolean;
  domain: {
    id: string;
    name: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AccessList {
  id: string;
  name: string;
  description?: string;
  type: 'ip_whitelist' | 'http_basic_auth' | 'combined';
  enabled: boolean;
  allowedIps: string[];
  authUsers?: AccessListAuthUser[];
  domains?: AccessListDomain[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccessListInput {
  name: string;
  description?: string;
  type: 'ip_whitelist' | 'http_basic_auth' | 'combined';
  enabled?: boolean;
  allowedIps?: string[];
  authUsers?: {
    username: string;
    password: string;
    description?: string;
  }[];
  domainIds?: string[];
}

export interface UpdateAccessListInput {
  name?: string;
  description?: string;
  type?: 'ip_whitelist' | 'http_basic_auth' | 'combined';
  enabled?: boolean;
  allowedIps?: string[];
  authUsers?: {
    username: string;
    password: string;
    description?: string;
  }[];
  domainIds?: string[];
}

export interface AccessListsResponse {
  success: boolean;
  data: AccessList[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AccessListResponse {
  success: boolean;
  data: AccessList;
  message?: string;
}

export interface AccessListStats {
  totalAccessLists: number;
  enabledAccessLists: number;
  totalAuthUsers: number;
  totalAssignedDomains: number;
}

export interface AccessListStatsResponse {
  success: boolean;
  data: AccessListStats;
}

export interface ApplyToDomainInput {
  accessListId: string;
  domainId: string;
  enabled?: boolean;
}

/**
 * Get all access lists
 */
export const getAccessLists = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  enabled?: boolean;
}): Promise<AccessListsResponse> => {
  const response = await api.get('/access-lists', { params });
  return response.data;
};

/**
 * Get single access list by ID
 */
export const getAccessList = async (id: string): Promise<AccessListResponse> => {
  const response = await api.get(`/access-lists/${id}`);
  return response.data;
};

/**
 * Create new access list
 */
export const createAccessList = async (data: CreateAccessListInput): Promise<AccessListResponse> => {
  const response = await api.post('/access-lists', data);
  return response.data;
};

/**
 * Update access list
 */
export const updateAccessList = async (
  id: string,
  data: UpdateAccessListInput
): Promise<AccessListResponse> => {
  const response = await api.put(`/access-lists/${id}`, data);
  return response.data;
};

/**
 * Delete access list
 */
export const deleteAccessList = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/access-lists/${id}`);
  return response.data;
};

/**
 * Toggle access list enabled status
 */
export const toggleAccessList = async (
  id: string,
  enabled: boolean
): Promise<AccessListResponse> => {
  const response = await api.patch(`/access-lists/${id}/toggle`, { enabled });
  return response.data;
};

/**
 * Apply access list to domain
 */
export const applyToDomain = async (
  data: ApplyToDomainInput
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/access-lists/apply', data);
  return response.data;
};

/**
 * Remove access list from domain
 */
export const removeFromDomain = async (
  accessListId: string,
  domainId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/access-lists/${accessListId}/domains/${domainId}`);
  return response.data;
};

/**
 * Get access lists by domain
 */
export const getAccessListsByDomain = async (domainId: string): Promise<AccessListsResponse> => {
  const response = await api.get(`/access-lists/domains/${domainId}`);
  return response.data;
};

/**
 * Get access lists statistics
 */
export const getAccessListsStats = async (): Promise<AccessListStatsResponse> => {
  const response = await api.get('/access-lists/stats');
  return response.data;
};
