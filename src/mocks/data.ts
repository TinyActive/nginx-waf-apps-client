import { Domain, ModSecurityRule, SSLCertificate, Alert, User, ACLRule, LogEntry, NotificationChannel, AlertRule, BackupConfig, SlaveNode, PerformanceMetric, UserProfile, TwoFactorAuth, ActivityLog } from '@/types';

export const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'api.example.com',
    status: 'active',
    sslEnabled: true,
    sslExpiry: '2025-12-31',
    modsecEnabled: true,
    upstreams: [
      { id: 'u1', host: '10.0.1.10', port: 8080, weight: 1, maxFails: 3, failTimeout: 30, status: 'up' },
      { id: 'u2', host: '10.0.1.11', port: 8080, weight: 1, maxFails: 3, failTimeout: 30, status: 'up' }
    ],
    loadBalancer: {
      algorithm: 'least_conn',
      healthCheck: { enabled: true, interval: 10, timeout: 5, path: '/health' }
    },
    createdAt: '2024-01-15',
    lastModified: '2025-03-20'
  },
  {
    id: '2',
    name: 'app.production.com',
    status: 'active',
    sslEnabled: true,
    sslExpiry: '2025-11-15',
    modsecEnabled: true,
    upstreams: [
      { id: 'u3', host: '10.0.2.10', port: 3000, weight: 2, maxFails: 2, failTimeout: 20, status: 'up' },
      { id: 'u4', host: '10.0.2.11', port: 3000, weight: 1, maxFails: 2, failTimeout: 20, status: 'down' }
    ],
    loadBalancer: {
      algorithm: 'round_robin',
      healthCheck: { enabled: true, interval: 30, timeout: 5, path: '/health' }
    },
    createdAt: '2024-03-10',
    lastModified: '2025-03-25'
  },
  {
    id: '3',
    name: 'web.staging.com',
    status: 'active',
    sslEnabled: false,
    modsecEnabled: false,
    upstreams: [
      { id: 'u5', host: '10.0.3.10', port: 80, weight: 1, maxFails: 5, failTimeout: 60, status: 'up' }
    ],
    loadBalancer: {
      algorithm: 'ip_hash',
      healthCheck: { enabled: false, interval: 30, timeout: 5, path: '/' }
    },
    createdAt: '2024-06-01',
    lastModified: '2025-02-10'
  },
  {
    id: '4',
    name: 'cdn.assets.com',
    status: 'error',
    sslEnabled: true,
    sslExpiry: '2025-04-30',
    modsecEnabled: true,
    upstreams: [
      { id: 'u6', host: '10.0.4.10', port: 8000, weight: 1, maxFails: 3, failTimeout: 30, status: 'down' }
    ],
    loadBalancer: {
      algorithm: 'least_conn',
      healthCheck: { enabled: true, interval: 5, timeout: 3, path: '/status' }
    },
    createdAt: '2024-02-20',
    lastModified: '2025-03-28'
  }
];

export const mockModSecRules: ModSecurityRule[] = [
  { id: 'r1', name: 'SQL Injection Protection', category: 'SQLi', enabled: true, description: 'Detects SQL injection attempts' },
  { id: 'r2', name: 'XSS Attack Prevention', category: 'XSS', enabled: true, description: 'Blocks cross-site scripting attacks' },
  { id: 'r3', name: 'RCE Detection', category: 'RCE', enabled: true, description: 'Remote code execution prevention' },
  { id: 'r4', name: 'LFI Protection', category: 'LFI', enabled: false, description: 'Local file inclusion prevention' },
  { id: 'r5', name: 'Session Fixation', category: 'SESSION-FIXATION', enabled: true, description: 'Prevents session fixation attacks' },
  { id: 'r6', name: 'PHP Attacks', category: 'PHP', enabled: true, description: 'PHP-specific attack prevention' },
  { id: 'r7', name: 'Protocol Attacks', category: 'PROTOCOL-ATTACK', enabled: true, description: 'HTTP protocol attack prevention' },
  { id: 'r8', name: 'Data Leakage', category: 'DATA-LEAKAGES', enabled: false, description: 'Prevents sensitive data leakage' },
  { id: 'r9', name: 'SSRF Protection', category: 'SSRF', enabled: true, description: 'Server-side request forgery prevention' },
  { id: 'r10', name: 'Web Shell Detection', category: 'WEB-SHELL', enabled: true, description: 'Detects web shell uploads' }
];

export const mockSSLCerts: SSLCertificate[] = [
  {
    id: 'c1',
    domain: 'api.example.com',
    commonName: 'api.example.com',
    sans: ['api.example.com', 'www.api.example.com'],
    issuer: "Let's Encrypt",
    validFrom: '2024-10-01',
    validTo: '2025-12-31',
    autoRenew: true,
    status: 'valid'
  },
  {
    id: 'c2',
    domain: 'app.production.com',
    commonName: 'app.production.com',
    sans: ['app.production.com'],
    issuer: 'DigiCert',
    validFrom: '2024-08-15',
    validTo: '2025-11-15',
    autoRenew: false,
    status: 'valid'
  },
  {
    id: 'c3',
    domain: 'cdn.assets.com',
    commonName: 'cdn.assets.com',
    sans: ['cdn.assets.com', '*.cdn.assets.com'],
    issuer: "Let's Encrypt",
    validFrom: '2024-12-01',
    validTo: '2025-04-30',
    autoRenew: true,
    status: 'expiring'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    severity: 'critical',
    message: 'Backend server 10.0.4.10:8000 is down',
    source: 'cdn.assets.com',
    timestamp: '2025-03-29T14:35:00Z',
    acknowledged: false
  },
  {
    id: 'a2',
    severity: 'warning',
    message: 'SSL certificate expiring in 30 days',
    source: 'cdn.assets.com',
    timestamp: '2025-03-29T10:20:00Z',
    acknowledged: false
  },
  {
    id: 'a3',
    severity: 'warning',
    message: 'High CPU usage detected (85%)',
    source: 'System',
    timestamp: '2025-03-29T09:15:00Z',
    acknowledged: true
  },
  {
    id: 'a4',
    severity: 'info',
    message: 'ModSecurity blocked 15 requests in the last hour',
    source: 'api.example.com',
    timestamp: '2025-03-29T08:00:00Z',
    acknowledged: true
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-03-29T14:00:00Z'
  },
  {
    id: 'usr2',
    username: 'operator',
    email: 'operator@example.com',
    role: 'moderator',
    status: 'active',
    lastLogin: '2025-03-28T16:30:00Z'
  },
  {
    id: 'usr3',
    username: 'viewer',
    email: 'viewer@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-03-27T11:45:00Z'
  }
];

export const mockACLRules: ACLRule[] = [
  {
    id: 'acl1',
    name: 'Block Known Bot IPs',
    type: 'blacklist',
    condition: { field: 'ip', operator: 'equals', value: '192.168.1.100' },
    action: 'deny',
    enabled: true
  },
  {
    id: 'acl2',
    name: 'Allow Internal Network',
    type: 'whitelist',
    condition: { field: 'ip', operator: 'regex', value: '^10\\.0\\.' },
    action: 'allow',
    enabled: true
  },
  {
    id: 'acl3',
    name: 'Block Suspicious User Agents',
    type: 'blacklist',
    condition: { field: 'user-agent', operator: 'contains', value: 'bot' },
    action: 'challenge',
    enabled: true
  }
];

export const mockMetrics = {
  cpu: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.random() * 60 + 20
  })),
  memory: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.random() * 40 + 50
  })),
  bandwidth: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.random() * 1000 + 500
  })),
  requests: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    value: Math.floor(Math.random() * 5000 + 2000)
  }))
};

export const mockLogs: LogEntry[] = [
  {
    id: 'log1',
    timestamp: '2025-03-29T14:35:22Z',
    level: 'info',
    type: 'access',
    source: 'api.example.com',
    message: 'GET /api/users 200',
    ip: '192.168.1.50',
    method: 'GET',
    path: '/api/users',
    statusCode: 200,
    responseTime: 45
  },
  {
    id: 'log2',
    timestamp: '2025-03-29T14:35:18Z',
    level: 'error',
    type: 'error',
    source: 'cdn.assets.com',
    message: 'upstream timed out (110: Connection timed out)',
    ip: '203.0.113.42',
    method: 'GET',
    path: '/static/image.png',
    statusCode: 504,
    responseTime: 30000
  },
  {
    id: 'log3',
    timestamp: '2025-03-29T14:35:10Z',
    level: 'warning',
    type: 'access',
    source: 'app.production.com',
    message: 'POST /api/auth/login 401',
    ip: '198.51.100.23',
    method: 'POST',
    path: '/api/auth/login',
    statusCode: 401,
    responseTime: 120
  },
  {
    id: 'log4',
    timestamp: '2025-03-29T14:34:55Z',
    level: 'info',
    type: 'system',
    source: 'system',
    message: 'Configuration reload completed successfully'
  },
  {
    id: 'log5',
    timestamp: '2025-03-29T14:34:42Z',
    level: 'error',
    type: 'error',
    source: 'api.example.com',
    message: 'ModSecurity: SQL injection attempt blocked',
    ip: '198.18.0.100',
    method: 'POST',
    path: '/api/search',
    statusCode: 403
  }
];

export const mockNotificationChannels: NotificationChannel[] = [
  {
    id: 'ch1',
    name: 'Admin Email',
    type: 'email',
    enabled: true,
    config: { email: 'admin@example.com' }
  },
  {
    id: 'ch2',
    name: 'Ops Team Telegram',
    type: 'telegram',
    enabled: true,
    config: { chatId: '-1001234567890', botToken: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz' }
  },
  {
    id: 'ch3',
    name: 'Dev Team Email',
    type: 'email',
    enabled: false,
    config: { email: 'dev-team@example.com' }
  }
];

export const mockAlertRules: AlertRule[] = [
  {
    id: 'ar1',
    name: 'High CPU Usage',
    condition: 'cpu > threshold',
    threshold: 80,
    severity: 'warning',
    channels: ['ch1', 'ch2'],
    enabled: true
  },
  {
    id: 'ar2',
    name: 'Backend Down',
    condition: 'upstream_status == down',
    threshold: 1,
    severity: 'critical',
    channels: ['ch1', 'ch2'],
    enabled: true
  },
  {
    id: 'ar3',
    name: 'SSL Expiring Soon',
    condition: 'ssl_days_remaining < threshold',
    threshold: 30,
    severity: 'warning',
    channels: ['ch1'],
    enabled: true
  }
];

export const mockBackups: BackupConfig[] = [
  {
    id: 'bk1',
    name: 'Daily Full Backup',
    schedule: '0 2 * * *',
    enabled: true,
    lastRun: '2025-03-29T02:00:00Z',
    nextRun: '2025-03-30T02:00:00Z',
    status: 'success',
    size: '45.3 MB'
  },
  {
    id: 'bk2',
    name: 'Weekly Config Backup',
    schedule: '0 3 * * 0',
    enabled: true,
    lastRun: '2025-03-23T03:00:00Z',
    nextRun: '2025-03-30T03:00:00Z',
    status: 'success',
    size: '2.1 MB'
  },
  {
    id: 'bk3',
    name: 'Hourly Incremental',
    schedule: '0 * * * *',
    enabled: false,
    lastRun: '2025-03-28T15:00:00Z',
    status: 'failed'
  }
];

export const mockSlaveNodes: SlaveNode[] = [
  {
    id: 'node1',
    name: 'nginx-slave-01',
    host: '10.0.10.11',
    port: 8088,
    status: 'online',
    lastSeen: '2025-03-29T14:35:00Z',
    version: '1.24.0',
    syncEnabled: true,
    syncInterval: 60,
    configHash: 'a1b2c3d4e5f6',
    lastSyncAt: '2025-03-29T14:30:00Z',
    latency: 15,
    cpuUsage: 25.5,
    memoryUsage: 45.2,
    diskUsage: 60.1,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-03-29T14:35:00Z',
    syncStatus: {
      lastSync: '2025-03-29T14:30:00Z',
      configHash: 'a1b2c3d4e5f6',
      inSync: true
    }
  },
  {
    id: 'node2',
    name: 'nginx-slave-02',
    host: '10.0.10.12',
    port: 8088,
    status: 'online',
    lastSeen: '2025-03-29T14:34:55Z',
    version: '1.24.0',
    syncEnabled: true,
    syncInterval: 60,
    configHash: 'a1b2c3d4e5f5',
    lastSyncAt: '2025-03-29T14:00:00Z',
    latency: 22,
    cpuUsage: 35.8,
    memoryUsage: 52.3,
    diskUsage: 55.7,
    createdAt: '2025-01-20T11:30:00Z',
    updatedAt: '2025-03-29T14:34:55Z',
    syncStatus: {
      lastSync: '2025-03-29T14:00:00Z',
      configHash: 'a1b2c3d4e5f5',
      inSync: false
    }
  },
  {
    id: 'node3',
    name: 'nginx-slave-03',
    host: '10.0.10.13',
    port: 8088,
    status: 'offline',
    lastSeen: '2025-03-28T22:15:00Z',
    version: '1.23.4',
    syncEnabled: false,
    syncInterval: 120,
    configHash: 'x9y8z7w6v5u4',
    lastSyncAt: '2025-03-28T20:00:00Z',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-03-28T22:15:00Z',
    syncStatus: {
      lastSync: '2025-03-28T20:00:00Z',
      configHash: 'x9y8z7w6v5u4',
      inSync: false
    }
  }
];

export const mockPerformanceMetrics: PerformanceMetric[] = Array.from({ length: 20 }, (_, i) => ({
  id: `perf${i + 1}`,
  domain: ['api.example.com', 'app.production.com', 'cdn.assets.com'][i % 3] || 'api.example.com',
  timestamp: new Date(Date.now() - (19 - i) * 300000).toISOString(),
  responseTime: Math.random() * 200 + 50,
  throughput: Math.random() * 1000 + 500,
  errorRate: Math.random() * 5,
  requestCount: Math.floor(Math.random() * 1000 + 100)
}));

export const mockUserProfile: UserProfile = {
  id: 'usr1',
  username: 'admin',
  email: 'admin@example.com',
  fullName: 'System Administrator',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  phone: '+84 123 456 789',
  timezone: 'Asia/Ho_Chi_Minh',
  language: 'vi',
  createdAt: '2024-01-15T08:00:00Z',
  lastLogin: new Date().toISOString()
};

export const mockTwoFactorAuth: TwoFactorAuth = {
  enabled: false,
  method: 'totp',
  secret: 'JBSWY3DPEHPK3PXP',
  qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  backupCodes: [
    '1234-5678-9012',
    '3456-7890-1234',
    '5678-9012-3456',
    '7890-1234-5678',
    '9012-3456-7890'
  ]
};

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'act1',
    userId: 'usr1',
    action: 'User logged in',
    type: 'login',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    success: true
  },
  {
    id: 'act2',
    userId: 'usr1',
    action: 'Updated domain configuration for api.example.com',
    type: 'config_change',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Modified SSL settings and upstream configuration',
    success: true
  },
  {
    id: 'act3',
    userId: 'usr1',
    action: 'Failed login attempt',
    type: 'security',
    ip: '203.0.113.42',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: 'Invalid password',
    success: false
  },
  {
    id: 'act4',
    userId: 'usr1',
    action: 'Created new ACL rule',
    type: 'user_action',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    details: 'Added IP blacklist rule for 192.168.1.200',
    success: true
  },
  {
    id: 'act5',
    userId: 'usr1',
    action: 'Changed account password',
    type: 'security',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    success: true
  },
  {
    id: 'act6',
    userId: 'usr1',
    action: 'Enabled 2FA authentication',
    type: 'security',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    success: true
  },
  {
    id: 'act7',
    userId: 'usr1',
    action: 'User logged out',
    type: 'logout',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    success: true
  }
];


