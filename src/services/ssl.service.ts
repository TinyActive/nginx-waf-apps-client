import api from './api';
import { SSLCertificate } from '@/types';

export interface IssueAutoSSLRequest {
  domainId: string;
  email?: string;
  autoRenew?: boolean;
}

export interface UploadManualSSLRequest {
  domainId: string;
  certificate: string;
  privateKey: string;
  chain?: string;
  issuer?: string;
}

export interface UpdateSSLRequest {
  certificate?: string;
  privateKey?: string;
  chain?: string;
  autoRenew?: boolean;
}

export const sslService = {
  /**
   * Get all SSL certificates
   */
  async getAll(): Promise<SSLCertificate[]> {
    const response = await api.get('/ssl');
    return response.data.data;
  },

  /**
   * Get single SSL certificate by ID
   */
  async getById(id: string): Promise<SSLCertificate> {
    const response = await api.get(`/ssl/${id}`);
    return response.data.data;
  },

  /**
   * Issue Let's Encrypt certificate (auto)
   */
  async issueAuto(data: IssueAutoSSLRequest): Promise<SSLCertificate> {
    const response = await api.post('/ssl/auto', data);
    return response.data.data;
  },

  /**
   * Upload manual SSL certificate
   */
  async uploadManual(data: UploadManualSSLRequest): Promise<SSLCertificate> {
    const response = await api.post('/ssl/manual', data);
    return response.data.data;
  },

  /**
   * Update SSL certificate
   */
  async update(id: string, data: UpdateSSLRequest): Promise<SSLCertificate> {
    const response = await api.put(`/ssl/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete SSL certificate
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/ssl/${id}`);
  },

  /**
   * Renew SSL certificate
   */
  async renew(id: string): Promise<SSLCertificate> {
    const response = await api.post(`/ssl/${id}/renew`);
    return response.data.data;
  },
};
