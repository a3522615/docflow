// 邮箱注册 + API密钥管理
import { NextRequest, NextResponse } from 'next/server';

const SCKEY = 'SCT334164TIe80koexKFSHZejeOi4PmoHp';
const apiKeys = new Map<string, any>();

function generateAPIKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `docflow_${result}`;
}

async function sendWechatNotification(email: string, apiKey: string) {
  const title = encodeURIComponent('📢 DocFlow 新用户注册');
  const message = `🎉 新用户注册！

📧 邮箱：${email}
🔑 API密钥：${apiKey}

快去联系用户！`;
  const desp = encodeURIComponent(message);
  const url = `https://sctapi.ftqq.com/${SCKEY}.send?title=${title}&desp=${desp}`;
  const response = await fetch(url);
  const result = await response.text();
  return result.includes('"code":0') || result.includes('"errno":0');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: '请提供有效的邮箱地址' },
        { status: 400 }
      );
    }

    const existingEntries = Array.from(apiKeys.entries());
    for (const [key, data] of existingEntries) {
      if (data.email === email) {
        return NextResponse.json({
          success: true,
          message: '该邮箱已注册，密钥如下',
          apiKey: key,
          plan: data.plan
        });
      }
    }

    const apiKey = generateAPIKey();
    const userData = {
      email,
      plan: 'free',
      requestsUsed: 0,
      requestsLimit: 100,
      createdAt: new Date().toISOString()
    };

    apiKeys.set(apiKey, userData);

    sendWechatNotification(email, apiKey).then(success => {
      if (success) {
        console.log(`✅ 已通知: ${email}`);
      }
    });

    return NextResponse.json({
      success: true,
      message: '注册成功！您的API密钥已生成',
      apiKey,
      plan: 'free'
    });

  } catch (error: any) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/v1/register',
    method: 'POST',
    description: '注册邮箱，获取免费API密钥'
  });
}
