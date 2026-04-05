# DocFlow - 中文PDF生成API

让AI生成专业级中文PDF文档。

## 快速开始

### 1. 注册获取API密钥

访问落地页或直接调用注册API：

```bash
curl -X POST https://docflow.vercel.app/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com"}'
```

返回示例：
```json
{
  "success": true,
  "apiKey": "docflow_xxxx...",
  "plan": "free",
  "limits": {
    "requests": 100,
    "period": "每月"
  }
}
```

### 2. 生成PDF

```bash
curl -X POST https://docflow.vercel.app/api/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "template": "report",
    "data": {
      "title": "2024年度工作总结",
      "author": "张三",
      "date": "2024-12-31",
      "content": "本年度工作成果..."
    }
  }'
```

### 3. 支持的模板

| 模板 | 用途 |
|------|------|
| `report` | 年度报告、项目汇报 |
| `invoice` | 发票、收据、账单 |
| `certificate` | 证书、奖状、感谢信 |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/register` | POST | 注册邮箱，获取API密钥 |
| `/api/v1/generate` | POST | 生成PDF文档 |
| `/api/v1/key` | GET | 获取API密钥信息 |

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Puppeteer (PDF生成)
- Tailwind CSS

## 部署

部署到Vercel：

```bash
npm i -g vercel
vercel
```

## 定价

| 套餐 | 价格 | 调用次数 |
|------|------|----------|
| 免费版 | ¥0/月 | 100次 |
| 专业版 | ¥99/月 | 5000次 |
| 企业版 | ¥399/月 | 20000次 |

## 联系我

微信：扫描落地页二维码

---
Made with ❤️ for AI developers
