import api from './api';
import type { NotificationChannel, AlertRule } from '../types';

/**
 * Notification Channels Service
 */
export const notificationChannelService = {
  /**
   * Get all notification channels
   */
  getAll: async (): Promise<NotificationChannel[]> => {
    const response = await api.get('/alerts/channels');
    return response.data.data;
  },

  /**
   * Get single notification channel
   */
  getById: async (id: string): Promise<NotificationChannel> => {
    const response = await api.get(`/alerts/channels/${id}`);
    return response.data.data;
  },

  /**
   * Create notification channel
   */
  create: async (data: Omit<NotificationChannel, 'id'>): Promise<NotificationChannel> => {
    const response = await api.post('/alerts/channels', data);
    return response.data.data;
  },

  /**
   * Update notification channel
   */
  update: async (id: string, data: Partial<NotificationChannel>): Promise<NotificationChannel> => {
    const response = await api.put(`/alerts/channels/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete notification channel
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/alerts/channels/${id}`);
  },

  /**
   * Test notification channel
   */
  test: async (id: string): Promise<{ message: string }> => {
    const response = await api.post(`/alerts/channels/${id}/test`);
    return response.data;
  },
};

/**
 * Alert Rules Service
 */
export const alertRuleService = {
  /**
   * Get all alert rules
   */
  getAll: async (): Promise<AlertRule[]> => {
    const response = await api.get('/alerts/rules');
    return response.data.data;
  },

  /**
   * Get single alert rule
   */
  getById: async (id: string): Promise<AlertRule> => {
    const response = await api.get(`/alerts/rules/${id}`);
    return response.data.data;
  },

  /**
   * Create alert rule
   */
  create: async (data: Omit<AlertRule, 'id'>): Promise<AlertRule> => {
    const response = await api.post('/alerts/rules', data);
    return response.data.data;
  },

  /**
   * Update alert rule
   */
  update: async (id: string, data: Partial<AlertRule>): Promise<AlertRule> => {
    const response = await api.put(`/alerts/rules/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete alert rule
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/alerts/rules/${id}`);
  },
};
