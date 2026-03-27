'use client';

import { useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Trash2, Download, Code } from 'lucide-react';

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState<string>('# Xin chào 👋\n\nĐây là công cụ **Markdown to HTML**.\n\n- Hỗ trợ gõ Markdown nhanh\n- Xem trước HTML ngay lập tức\n- Xuất ra file HTML hoặc Markdown\n\n| Tính năng | Trạng thái |\n|-----------|------------|\n| Cú pháp Markdown cơ bản | ✅ |\n| GFM (Bảng, v.v...) | ✅ |\n| Syntax Highlighting | ✅ |\n\n```javascript\nconsole.log("Hello World!");\n```\n\n> Trải nghiệm viết siêu mượt trên giao diện tối ưu không gây chói mắt.\n');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const copyHtml = () => {
    const htmlContent = document.getElementById('markdown-preview-container')?.innerHTML || '';
    handleCopy(htmlContent, 'html');
  };

  const clearInput = () => setMarkdown('');

  const downloadHtml = () => {
    try {
      const htmlContent = document.getElementById('markdown-preview-container')?.innerHTML || '';
      const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Exported Document</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #24292e; background: #ffffff; }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    h3 { font-size: 1.25em; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    p { margin-top: 0; margin-bottom: 16px; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table { border-spacing: 0; border-collapse: collapse; margin-top: 0; margin-bottom: 16px; width: 100%; overflow: auto; }
    table th { font-weight: 600; }
    table th, table td { padding: 6px 13px; border: 1px solid #dfe2e5; }
    table tr { background-color: #fff; border-top: 1px solid #c6cbd1; }
    table tr:nth-child(2n) { background-color: #f6f8fa; }
    blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0 0 16px 0; }
    code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(27,31,35,0.05); border-radius: 3px; font-family: monospace; }
    pre { padding: 16px; overflow: auto; font-size: 85%; line-height: 1.45; background-color: #f6f8fa; border-radius: 3px; }
    pre code { display: inline; max-width: auto; padding: 0; margin: 0; overflow: visible; line-height: inherit; word-wrap: normal; background-color: transparent; border: 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
      const element = document.createElement("a");
      const file = new Blob([htmlTemplate], {type: 'text/html'});
      element.href = URL.createObjectURL(file);
      element.download = "export.html";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadMarkdown = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([markdown], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = "document.md";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      console.error(e);
    }
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const markdownComponents: Components = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4 text-[#cba6f7]" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3 text-[#f5c2e7]" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-[#89b4fa]" {...props} />,
    p: ({node, ...props}) => <p className="mb-4 text-[#cdd6f4] leading-relaxed" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-[#cdd6f4] space-y-1" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-[#cdd6f4] space-y-1" {...props} />,
    li: ({node, ...props}) => <li className="text-[#cdd6f4]" {...props} />,
    a: ({node, ...props}) => <a className="text-[#89b4fa] hover:text-[#b4befe] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#cba6f7] pl-4 py-1 italic text-[#a6adc8] bg-[#313244]/50 rounded-r my-4" {...props} />,
    code: ({node, className, children, ...props}) => {
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <div className="relative group my-4">
          <pre className="bg-[#181825] p-4 rounded-lg overflow-x-auto border border-[#45475a] shadow-inner">
            <code className={`${className} text-[#a6e3a1] font-mono text-sm`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-[#181825] text-[#f38ba8] px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
          {children}
        </code>
      );
    },
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-6 border border-[#45475a] rounded-lg bg-[#313244]/30 shadow-sm">
        <table className="min-w-full divide-y divide-[#45475a] text-[#cdd6f4]" {...props} />
      </div>
    ),
    th: ({node, ...props}) => <th className="bg-[#181825] px-4 py-3 text-left text-sm font-semibold text-[#cdd6f4] uppercase tracking-wider" {...props} />,
    td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-[#bac2de] border-t border-[#45475a]" {...props} />,
    hr: ({node, ...props}) => <hr className="border-[#45475a] my-6" {...props} />,
    // eslint-disable-next-line @next/next/no-img-element
    img: ({node, ...props}) => <img className="rounded-lg max-w-full h-auto my-4 border border-[#45475a]" loading="lazy" {...props} alt='image' />,
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#cdd6f4] flex items-center gap-3">
              <span className="text-4xl">📑</span> Markdown to HTML
            </h1>
            <p className="text-[#a6adc8] mt-2 text-sm md:text-base">
              Soạn thảo Markdown và xem trước kết quả HTML trực tiếp theo thời gian thực.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyHtml}
              className="flex items-center gap-2 px-4 py-2 bg-[#89b4fa] hover:bg-[#74c7ec] text-[#1e1e2e] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Code size={18} />
              {copiedLabel === 'html' ? 'Đã copy HTML!' : 'Copy HTML'}
            </button>
            <button
              onClick={downloadHtml}
              className="flex items-center gap-2 px-4 py-2 bg-[#a6e3a1] hover:bg-[#94e2d5] text-[#1e1e2e] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download size={18} />
              Tải HTML
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Left Panel: Markdown Input */}
          <div className="flex flex-col bg-[#313244]/80 backdrop-blur-md border border-[#45475a] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-[#cba6f7]">
            <div className="bg-[#181825] px-4 py-3 border-b border-[#45475a] flex justify-between items-center z-10">
              <h2 className="text-[#cdd6f4] font-semibold text-lg flex items-center gap-2">
                <span className="text-[#cba6f7]">📝</span> Markdown
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={downloadMarkdown}
                  className="p-1.5 text-[#a6adc8] hover:text-[#a6e3a1] transition-colors rounded-md hover:bg-[#1e1e2e]"
                  title="Tải Markdown"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleCopy(markdown, 'markdown')}
                  className="p-1.5 text-[#a6adc8] hover:text-[#89b4fa] transition-colors rounded-md hover:bg-[#1e1e2e]"
                  title="Copy Markdown"
                >
                  {copiedLabel === 'markdown' ? <span className="text-xs text-[#89b4fa] font-bold">Đã copy!</span> : <Copy size={18} />}
                </button>
                <button
                  onClick={clearInput}
                  className="p-1.5 text-[#a6adc8] hover:text-[#f38ba8] transition-colors rounded-md hover:bg-[#1e1e2e]"
                  title="Xóa tất cả"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent text-[#cdd6f4] p-5 focus:outline-none resize-none font-mono text-sm leading-relaxed custom-scrollbar"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Nhập nội dung Markdown vào đây..."
              spellCheck="false"
            />
          </div>

          {/* Right Panel: HTML Preview */}
          <div className="flex flex-col bg-[#313244]/80 backdrop-blur-md border border-[#45475a] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-[#a6e3a1]">
            <div className="bg-[#181825] px-4 py-3 border-b border-[#45475a] flex justify-between items-center z-10">
              <h2 className="text-[#cdd6f4] font-semibold text-lg flex items-center gap-2">
                <span className="text-[#a6e3a1]">🌐</span> Xem trước (HTML)
              </h2>
            </div>
            <div 
              className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar bg-gradient-to-b from-transparent to-[#1e1e2e]/30"
            >
              <div id="markdown-preview-container" className="prose-container">
                {markdown ? (
                   <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                   >
                     {markdown}
                   </ReactMarkdown>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[#6c7086] space-y-4 pt-20">
                    <span className="text-6xl opacity-50">👀</span>
                    <p className="text-lg">HTML sẽ được hiển thị ở đây</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
