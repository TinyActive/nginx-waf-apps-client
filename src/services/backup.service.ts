import api from './api';

export interface BackupSchedule {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  size?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackupFile {
  id: string;
  scheduleId?: string;
  filename: string;
  filepath: string;
  size: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  type: string;
  metadata?: any;
  createdAt: string;
  schedule?: BackupSchedule;
}

export interface CreateBackupScheduleRequest {
  name: string;
  schedule: string;
  enabled?: boolean;
}

export interface UpdateBackupScheduleRequest {
  name?: string;
  schedule?: string;
  enabled?: boolean;
}

export interface ImportResult {
  domains: number;
  vhostConfigs: number;
  upstreams: number;
  loadBalancers: number;
  ssl: number;
  sslFiles: number;
  modsecCRS: number;
  modsecCustom: number;
  acl: number;
  alertChannels: number;
  alertRules: number;
  users: number;
  nginxConfigs: number;
}

export const backupService = {
  /**
   * Get all backup schedules
   */
  async getSchedules(): Promise<BackupSchedule[]> {
    const response = await api.get('/backup/schedules');
    return response.data.data;
  },

  /**
   * Get single backup schedule
   */
  async getSchedule(id: string): Promise<BackupSchedule> {
    const response = await api.get(`/backup/schedules/${id}`);
    return response.data.data;
  },

  /**
   * Create backup schedule
   */
  async createSchedule(data: CreateBackupScheduleRequest): Promise<BackupSchedule> {
    const response = await api.post('/backup/schedules', data);
    return response.data.data;
  },

  /**
   * Update backup schedule
   */
  async updateSchedule(id: string, data: UpdateBackupScheduleRequest): Promise<BackupSchedule> {
    const response = await api.put(`/backup/schedules/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete backup schedule
   */
  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/backup/schedules/${id}`);
  },

  /**
   * Toggle backup schedule enabled status
   */
  async toggleSchedule(id: string): Promise<BackupSchedule> {
    const response = await api.patch(`/backup/schedules/${id}/toggle`);
    return response.data.data;
  },

  /**
   * Run backup now (manual backup)
   */
  async runNow(id: string): Promise<{ filename: string; size: string }> {
    const response = await api.post(`/backup/schedules/${id}/run`);
    return response.data.data;
  },

  /**
   * Export configuration
   */
  async exportConfig(): Promise<Blob> {
    const response = await api.get('/backup/export', {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Import configuration
   */
  async importConfig(data: any): Promise<ImportResult> {
    const response = await api.post('/backup/import', data);
    return response.data.data;
  },

  /**
   * Get all backup files
   */
  async getFiles(scheduleId?: string): Promise<BackupFile[]> {
    const response = await api.get('/backup/files', {
      params: { scheduleId }
    });
    return response.data.data;
  },

  /**
   * Download backup file
   */
  async downloadFile(id: string): Promise<Blob> {
    const response = await api.get(`/backup/files/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  /**
   * Delete backup file
   */
  async deleteFile(id: string): Promise<void> {
    await api.delete(`/backup/files/${id}`);
  }
};
