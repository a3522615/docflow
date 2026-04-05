'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiKey(null);

    try {
      const res = await fetch('/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        setApiKey(data.apiKey);
      } else {
        setError(data.error || '注册失败，请稍后重试');
      }
    } catch (err) {
      setError('网络错误，请检查连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white">
              D
            </div>
            <span className="text-xl font-bold text-white">DocFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition">功能</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition">定价</a>
            <a href="#docs" className="text-slate-400 hover:text-white transition">文档</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          中文PDF生成API现已上线
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          让AI生成
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> 专业级中文PDF </span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          一行代码，将JSON数据转换为排版精美的PDF文档。专为AI应用设计，支持中文字体、表格、图片混排。
        </p>

        {/* Registration Form */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 max-w-lg mx-auto backdrop-blur-sm">
          {!apiKey ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">免费注册</h2>
              <p className="text-slate-400 mb-6">输入邮箱，立即获取100次免费调用</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
                
                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      生成中...
                    </span>
                  ) : (
                    '获取免费API密钥'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">注册成功！</h2>
                <p className="text-slate-400">您的API密钥已生成，请妥善保存</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                <p className="text-slate-400 text-sm mb-2">您的API密钥：</p>
                <code className="text-green-400 text-sm break-all">{apiKey}</code>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
              >
                {copied ? '✓ 已复制到剪贴板' : '复制API密钥'}
              </button>

              <p className="text-slate-500 text-sm mt-4 text-center">
                已自动推送到您的微信，请查看通知
              </p>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">为什么选择 DocFlow？</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🇨🇳</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">中文优先</h3>
            <p className="text-slate-400">内置多种中文字体，自动优化中文排版，告别乱码</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI原生</h3>
            <p className="text-slate-400">专为AI应用设计，Cursor、GPT直接调用，轻松集成</p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">极速响应</h3>
            <p className="text-slate-400">边缘节点部署，全球极速响应，平均响应时间&lt;500ms</p>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">内置模板，开箱即用</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition cursor-pointer">
            <div className="bg-white text-slate-900 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-lg mb-2">年度报告</h4>
              <div className="h-px bg-slate-300 my-2"></div>
              <p className="text-sm text-slate-600">2024年度工作总结</p>
            </div>
            <h3 className="text-lg font-bold text-white">报告模板</h3>
            <p className="text-slate-400 text-sm mt-1">适合：年终总结、项目汇报</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition cursor-pointer">
            <div className="bg-white text-slate-900 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-lg mb-2">发票</h4>
              <div className="h-px bg-slate-300 my-2"></div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>商品名称</span>
                <span>¥100.00</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">发票模板</h3>
            <p className="text-slate-400 text-sm mt-1">适合：收据、开票、账单</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/50 transition cursor-pointer">
            <div className="bg-white text-slate-900 rounded-lg p-4 mb-4">
              <h4 className="font-bold text-lg mb-2">荣誉证书</h4>
              <div className="h-px bg-slate-300 my-2"></div>
              <p className="text-sm text-slate-600">授予：张三 同志</p>
            </div>
            <h3 className="text-lg font-bold text-white">证书模板</h3>
            <p className="text-slate-400 text-sm mt-1">适合：奖状、认证、感谢信</p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section id="docs" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">一行代码，快速集成</h2>
        
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-slate-500 text-sm">curl 示例</span>
          </div>
          <pre className="p-6 text-sm overflow-x-auto">
            <code className="text-slate-300">{`curl -X POST https://docflow.vercel.app/api/v1/generate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "template": "report",
    "data": {
      "title": "2024年度工作总结",
      "author": "张三",
      "date": "2024-12-31",
      "content": "本年度工作成果..."
    }
  }'`}</code>
          </pre>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">简单定价</h2>
        <p className="text-slate-400 text-center mb-12">按需付费，无隐藏费用</p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">免费版</h3>
            <div className="text-3xl font-bold text-white mb-4">
              ¥0<span className="text-lg text-slate-400 font-normal">/月</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100次/月
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                3个模板
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                基础支持
              </li>
            </ul>
            <div className="text-center py-2 text-slate-500 border border-slate-600 rounded-xl">
              免费注册
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              推荐
            </div>
            <h3 className="text-lg font-bold text-white mb-2">专业版</h3>
            <div className="text-3xl font-bold text-white mb-4">
              ¥99<span className="text-lg text-slate-400 font-normal">/月</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                5000次/月
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                全部模板
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                优先支持
              </li>
            </ul>
            <div className="text-center py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl">
              联系升级
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">企业版</h3>
            <div className="text-3xl font-bold text-white mb-4">
              ¥399<span className="text-lg text-slate-400 font-normal">/月</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                20000次/月
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                自定义模板
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                专属支持
              </li>
            </ul>
            <div className="text-center py-2 text-slate-500 border border-slate-600 rounded-xl">
              联系升级
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-500">
          <p>© 2024 DocFlow. 让AI生成专业级PDF。</p>
        </div>
      </footer>
    </div>
  );
}
