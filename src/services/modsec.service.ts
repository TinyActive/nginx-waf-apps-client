import api from './api';
import { ModSecurityCRSRule, ModSecurityCustomRule } from '@/types';

export interface CreateModSecRuleRequest {
  name: string;
  category: string;
  ruleContent: string;
  description?: string;
  domainId?: string;
  enabled?: boolean;
}

export interface UpdateModSecRuleRequest {
  name?: string;
  category?: string;
  ruleContent?: string;
  description?: string;
  enabled?: boolean;
}

export interface GlobalModSecSettings {
  enabled: boolean;
  config: any;
}

/**
 * Get all CRS (OWASP Core Rule Set) rules
 */
export const getCRSRules = async (domainId?: string): Promise<ModSecurityCRSRule[]> => {
  const params = domainId ? { domainId } : {};
  const response = await api.get('/modsec/crs/rules', { params });
  return response.data.data;
};

/**
 * Toggle CRS rule enabled/disabled
 */
export const toggleCRSRule = async (ruleFile: string, domainId?: string): Promise<ModSecurityCRSRule> => {
  const response = await api.patch(`/modsec/crs/rules/${ruleFile}/toggle`, { domainId });
  return response.data.data;
};

/**
 * Get all Custom ModSecurity rules
 */
export const getModSecRules = async (domainId?: string): Promise<ModSecurityCustomRule[]> => {
  const params = domainId ? { domainId } : {};
  const response = await api.get('/modsec/rules', { params });
  return response.data.data;
};

/**
 * Get ModSecurity custom rule by ID
 */
export const getModSecRule = async (id: string): Promise<ModSecurityCustomRule> => {
  const response = await api.get(`/modsec/rules/${id}`);
  return response.data.data;
};

/**
 * Toggle ModSecurity custom rule enabled/disabled
 */
export const toggleModSecRule = async (id: string): Promise<ModSecurityCustomRule> => {
  const response = await api.patch(`/modsec/rules/${id}/toggle`);
  return response.data.data;
};

/**
 * Add custom ModSecurity rule
 */
export const addCustomRule = async (data: CreateModSecRuleRequest): Promise<ModSecurityCustomRule> => {
  const response = await api.post('/modsec/rules', data);
  return response.data.data;
};

/**
 * Update ModSecurity custom rule
 */
export const updateModSecRule = async (id: string, data: UpdateModSecRuleRequest): Promise<ModSecurityCustomRule> => {
  const response = await api.put(`/modsec/rules/${id}`, data);
  return response.data.data;
};

/**
 * Delete ModSecurity rule
 */
export const deleteModSecRule = async (id: string): Promise<void> => {
  await api.delete(`/modsec/rules/${id}`);
};

/**
 * Get global ModSecurity settings
 */
export const getGlobalModSecSettings = async (): Promise<GlobalModSecSettings> => {
  const response = await api.get('/modsec/global');
  return response.data.data;
};

/**
 * Set global ModSecurity enabled/disabled
 */
export const setGlobalModSec = async (enabled: boolean): Promise<void> => {
  await api.post('/modsec/global', { enabled });
};
