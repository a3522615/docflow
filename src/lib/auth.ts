// API密钥认证模块
// 在Vercel环境下使用环境变量存储API密钥
// 生产环境建议使用Supabase存储

export interface APIKey {
  key: string;
  email: string;
  requestsUsed: number;
  requestsLimit: number;
  createdAt: Date;
  isActive: boolean;
}

// 简单的内存存储（用于MVP演示）
// 生产环境请使用Supabase或Redis
const apiKeys = new Map<string, APIKey>();

// 生成随机API密钥
export function generateAPIKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'docflow_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// 创建新API密钥（用于注册）
export function createAPIKey(email: string): APIKey {
  const key = generateAPIKey();
  const apiKey: APIKey = {
    key,
    email,
    requestsUsed: 0,
    requestsLimit: 100, // 免费版100次/月
    createdAt: new Date(),
    isActive: true
  };
  apiKeys.set(key, apiKey);
  return apiKey;
}

// 验证API密钥
export function validateAPIKey(apiKey: string): APIKey | null {
  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    return null;
  }
  if (!keyData.isActive) {
    return null;
  }
  return keyData;
}

// 增加使用次数
export function incrementUsage(apiKey: string): boolean {
  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    return false;
  }
  keyData.requestsUsed++;
  
  // 检查是否超过限额
  if (keyData.requestsUsed > keyData.requestsLimit) {
    return false;
  }
  
  apiKeys.set(apiKey, keyData);
  return true;
}

// 获取使用统计
export function getUsageStats(apiKey: string): { used: number; limit: number } | null {
  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    return null;
  }
  return {
    used: keyData.requestsUsed,
    limit: keyData.requestsLimit
  };
}

// 升级配额（设置更高限额）
export function upgradeLimit(apiKey: string, newLimit: number): boolean {
  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    return false;
  }
  keyData.requestsLimit = newLimit;
  apiKeys.set(apiKey, keyData);
  return true;
}

// 导出所有密钥（用于管理后台）
export function getAllKeys(): APIKey[] {
  return Array.from(apiKeys.values());
}

// 开发模式：创建默认测试密钥
if (process.env.NODE_ENV === 'development') {
  if (!apiKeys.has('docflow_test_key_12345678901234567890')) {
    createAPIKey('developer@localhost');
  }
}

export default {
  generateAPIKey,
  createAPIKey,
  validateAPIKey,
  incrementUsage,
  getUsageStats,
  upgradeLimit,
  getAllKeys
};
