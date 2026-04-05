// 邮箱注册 + API密钥管理
// POST /api/v1/register - 注册邮箱，生成API密钥，推送微信通知

import { NextRequest, NextResponse } from 'next/server';

// Server酱配置 - 直接硬编码方便测试
const SCKEY = 'SCT334164TIe80koexKFSHZejeOi4PmoHp';

// 内存存储（生产环境应该用数据库）
const apiKeys = new Map<string, any>();

// 生成随机API密钥
function generateAPIKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `docflow_${result}`;
}

// 发送微信通知
async function sendWechatNotification(email: string, apiKey: string) {
  const message = `🎉 新用户注册！

📧 邮箱：${email}
🔑 API密钥：${apiKey}

快去联系用户！`;

  try {
    console.log('发送微信通知...');
    const response = await fetch(`https://sctapi.ftqq.com/${SCKEY}.send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '📢 DocFlow 新用户注册',
        desp: message
      })
    });
    
    const result = await response.json();
    console.log('Server酱响应:', result);
    
    if (result.code === 0) {
      console.log('微信通知发送成功');
      return true;
    } else {
      console.error('微信通知发送失败:', result);
      return false;
    }
  } catch (error) {
    console.error('微信通知失败:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: '请提供有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 2. 检查邮箱是否已注册
    for (const [key, data] of apiKeys.entries()) {
      if (data.email === email) {
        return NextResponse.json({
          success: true,
          message: '该邮箱已注册，密钥如下',
          apiKey: key,
          plan: data.plan
        });
      }
    }

    // 3. 生成新的API密钥（免费版：100次/月）
    const apiKey = generateAPIKey();
    const userData = {
      email,
      plan: 'free',
      requestsUsed: 0,
      requestsLimit: 100,
      createdAt: new Date().toISOString()
    };

    // 4. 保存到内存（生产环境用数据库）
    apiKeys.set(apiKey, userData);

    // 5. 发送微信通知（异步，不阻塞返回）
    sendWechatNotification(email, apiKey).then(success => {
      if (success) {
        console.log(`✅ 已通知: ${email}`);
      }
    });

    // 6. 返回密钥
    return NextResponse.json({
      success: true,
      message: '注册成功！您的API密钥已生成',
      apiKey,
      plan: 'free',
      limits: {
        requests: 100,
        period: '每月',
        features: ['报告模板', '发票模板', '证书模板']
      },
      nextSteps: [
        '复制上方的API密钥',
        '查看文档了解如何使用',
        '联系我们升级付费版'
      ]
    });

  } catch (error: any) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// GET方法 - 返回注册说明
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/register',
    method: 'POST',
    description: '注册邮箱，获取免费API密钥',
    body: {
      email: 'your@email.com'
    },
    response: {
      success: true,
      apiKey: 'docflow_xxxx...',
      plan: 'free',
      limits: {
        requests: 100,
        period: '每月'
      }
    }
  });
}
