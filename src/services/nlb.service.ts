import api from './api';
import {
  NetworkLoadBalancer,
  CreateNLBInput,
  UpdateNLBInput,
  NLBStats,
  HealthCheckResult,
  Pagination,
} from '@/types';

/**
 * Get all NLBs with search and pagination
 */
export const getNLBs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  protocol?: string;
  enabled?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ data: NetworkLoadBalancer[]; pagination: Pagination }> => {
  const response = await api.get<{
    success: boolean;
    data: NetworkLoadBalancer[];
    pagination: Pagination;
  }>('/nlb', { params });

  const { data, pagination } = response.data;

  return { data, pagination };
};

/**
 * Get NLB by ID
 */
export const getNLBById = async (id: string): Promise<NetworkLoadBalancer> => {
  const response = await api.get<{ success: boolean; data: NetworkLoadBalancer }>(`/nlb/${id}`);
  return response.data.data;
};

/**
 * Create new NLB
 */
export const createNLB = async (data: CreateNLBInput): Promise<NetworkLoadBalancer> => {
  const response = await api.post<{ success: boolean; data: NetworkLoadBalancer; message: string }>(
    '/nlb',
    data
  );
  return response.data.data;
};

/**
 * Update NLB
 */
export const updateNLB = async (id: string, data: UpdateNLBInput): Promise<NetworkLoadBalancer> => {
  const response = await api.put<{ success: boolean; data: NetworkLoadBalancer; message: string }>(
    `/nlb/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete NLB
 */
export const deleteNLB = async (id: string): Promise<void> => {
  await api.delete(`/nlb/${id}`);
};

/**
 * Toggle NLB enabled status
 */
export const toggleNLB = async (id: string, enabled: boolean): Promise<NetworkLoadBalancer> => {
  const response = await api.post<{ success: boolean; data: NetworkLoadBalancer; message: string }>(
    `/nlb/${id}/toggle`,
    { enabled }
  );
  return response.data.data;
};

/**
 * Perform health check on NLB upstreams
 */
export const performHealthCheck = async (id: string): Promise<HealthCheckResult[]> => {
  const response = await api.post<{ success: boolean; data: HealthCheckResult[] }>(
    `/nlb/${id}/health-check`
  );
  return response.data.data;
};

/**
 * Get NLB statistics
 */
export const getNLBStats = async (): Promise<NLBStats> => {
  const response = await api.get<{ success: boolean; data: NLBStats }>('/nlb/stats');
  return response.data.data;
};
