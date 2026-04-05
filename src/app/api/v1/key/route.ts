// API密钥管理端点
// POST /api/v1/key - 创建新的API密钥
// GET /api/v1/key - 获取密钥使用统计

import { NextRequest, NextResponse } from 'next/server';
import { createAPIKey, getUsageStats, validateAPIKey } from '@/lib/auth';

// 创建新API密钥
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: '请提供邮箱地址' },
        { status: 400 }
      );
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '邮箱格式不正确' },
        { status: 400 }
      );
    }
    
    // 创建新密钥
    const apiKey = createAPIKey(email);
    
    return NextResponse.json({
      success: true,
      message: 'API密钥创建成功',
      data: {
        api_key: apiKey.key,
        email: apiKey.email,
        limit: apiKey.requestsLimit,
        created_at: apiKey.createdAt
      },
      note: '请妥善保存API密钥，它不会再次显示'
    });
    
  } catch (error: any) {
    console.error('Key creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取密钥使用统计
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: '缺少API密钥' },
      { status: 401 }
    );
  }
  
  const keyData = validateAPIKey(apiKey);
  if (!keyData) {
    return NextResponse.json(
      { success: false, error: '无效的API密钥' },
      { status: 401 }
    );
  }
  
  const stats = getUsageStats(apiKey);
  
  return NextResponse.json({
    success: true,
    data: {
      email: keyData.email,
      used: stats?.used || 0,
      limit: stats?.limit || 100,
      remaining: (stats?.limit || 100) - (stats?.used || 0),
      is_active: keyData.isActive,
      created_at: keyData.createdAt
    }
  });
}
