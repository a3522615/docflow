import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DocFlow - 让AI生成专业级中文PDF',
  description: '专为AI时代设计的中文PDF生成API，支持报告、发票、证书模板，简单3行代码即可集成',
  keywords: 'PDF生成, 中文PDF, AI, API, 发票生成, 报告生成',
  authors: [{ name: 'DocFlow' }],
  openGraph: {
    title: 'DocFlow - 让AI生成专业级中文PDF',
    description: '专为AI时代设计的中文PDF生成API',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
