// PDF生成API端点
// POST /api/v1/generate

import { NextRequest, NextResponse } from 'next/server';
import { generatePDF, GenerateOptions } from '@/lib/pdf-generator';
import { validateAPIKey, incrementUsage } from '@/lib/auth';

// API配置
const FREE_LIMIT = 100; // 免费版每月100次

export async function POST(request: NextRequest) {
  try {
    // 1. 获取并验证API密钥
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '缺少API密钥，请提供 x-api-key header' },
        { status: 401 }
      );
    }
    
    const keyData = validateAPIKey(apiKey);
    if (!keyData) {
      return NextResponse.json(
        { success: false, error: '无效或已禁用的API密钥' },
        { status: 401 }
      );
    }
    
    // 2. 检查使用限额
    if (keyData.requestsUsed >= keyData.requestsLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: '已达到使用限额，请升级套餐',
          used: keyData.requestsUsed,
          limit: keyData.requestsLimit
        },
        { status: 429 }
      );
    }
    
    // 3. 解析请求体
    const body = await request.json();
    const { template, data, options } = body;
    
    if (!template) {
      return NextResponse.json(
        { success: false, error: '缺少template参数' },
        { status: 400 }
      );
    }
    
    // 4. 生成PDF
    const generateOptions: GenerateOptions = {
      template,
      data: data || {},
      pageSize: options?.page_size || options?.pageSize || 'A4',
      orientation: options?.orientation || 'portrait'
    };
    
    const result = await generatePDF(generateOptions);
    
    if (!result.success || !result.pdf) {
      return NextResponse.json(
        { success: false, error: result.error || 'PDF生成失败' },
        { status: 500 }
      );
    }
    
    // 5. 增加使用次数
    incrementUsage(apiKey);
    
    // 6. 返回PDF
    // 开发环境直接返回PDFbuffer，生产环境可以上传到CDN
    if (process.env.NODE_ENV === 'development') {
      return new NextResponse(new Uint8Array(result.pdf), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="docflow-${Date.now()}.pdf"`,
          'X-Request-ID': `req_${Date.now()}`
        }
      });
    }
    
    // 生产环境返回成功信息和用量
    return NextResponse.json({
      success: true,
      request_id: `req_${Date.now()}`,
      credits_used: 1,
      message: 'PDF生成成功',
      usage: {
        used: keyData.requestsUsed,
        limit: keyData.requestsLimit,
        remaining: keyData.requestsLimit - keyData.requestsUsed
      }
    }, {
      headers: {
        'X-Request-ID': `req_${Date.now()}`
      }
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}

// GET方法返回API信息
export async function GET() {
  return NextResponse.json({
    name: 'DocFlow PDF API',
    version: '1.0.0',
    description: '让AI生成专业级中文PDF',
    endpoints: {
      POST: {
        url: '/api/v1/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY'
        },
        body: {
          template: 'report | invoice | certificate',
          data: {},
          options: {
            page_size: 'A4 | Letter | A3',
            orientation: 'portrait | landscape'
          }
        }
      }
    },
    templates: [
      { name: 'report', description: '通用报告模板' },
      { name: 'invoice', description: '发票模板' },
      { name: 'certificate', description: '证书模板' }
    ],
    documentation: '/docs'
  });
}
