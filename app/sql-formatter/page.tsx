'use client';

import { useState, useRef } from 'react';
import { format, SqlLanguage, KeywordCase } from 'sql-formatter';

export default function SQLFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [indentSize, setIndentSize] = useState(2);
    const [dialect, setDialect] = useState('sql');
    const [keywordCase, setKeywordCase] = useState('upper');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const handleInputScroll = () => {
        if (lineNumbersRef.current && inputRef.current) {
            lineNumbersRef.current.scrollTop = inputRef.current.scrollTop;
        }
    };

    const getLineNumbers = (text: string) => {
        const lines = text.split('\n').length;
        return Array.from({ length: lines || 1 }, (_, i) => i + 1);
    };

    const formatSQL = () => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập SQL');
                setOutput('');
                return;
            }
            
            const formatted = format(input, {
                language: dialect as SqlLanguage,
                keywordCase: keywordCase as KeywordCase,
                tabWidth: indentSize,
                linesBetweenQueries: 2,
            });
            
            setOutput(formatted);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(`❌ Lỗi format SQL: ${errorMessage}`);
            setOutput('');
        }
    };

    const minifySQL = () => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập SQL');
                setOutput('');
                return;
            }
            // Simple minify: remove formatting and condense spaces
            const minified = input
                .replace(/--.*$/gm, '') // remove single-line comments
                .replace(/\/\*[\s\S]*?\*\//g, '') // remove multi-line comments
                .replace(/\s+/g, ' ') // replace multiple whitespace
                .trim();
            setOutput(minified);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(`❌ Lỗi: ${errorMessage}`);
            setOutput('');
        }
    };

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            alert('Đã sao chép vào clipboard!');
        }
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#cba6f7] mb-8">SQL Formatter</h1>

                {/* Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-[#cdd6f4]">Ngôn ngữ (Dialect):</label>
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value)}
                            className="px-3 py-2 bg-[#313244] border border-[#45475a] rounded-lg text-[#cdd6f4] focus:outline-none focus:border-[#cba6f7]"
                        >
                            <option value="sql">Standard SQL</option>
                            <option value="postgresql">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="mariadb">MariaDB</option>
                            <option value="sqlite">SQLite</option>
                            <option value="tsql">T-SQL (SQL Server)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-[#cdd6f4]">Chữ hoa/thường:</label>
                        <select
                            value={keywordCase}
                            onChange={(e) => setKeywordCase(e.target.value)}
                            className="px-3 py-2 bg-[#313244] border border-[#45475a] rounded-lg text-[#cdd6f4] focus:outline-none focus:border-[#cba6f7]"
                        >
                            <option value="upper">UPPERCASE</option>
                            <option value="lower">lowercase</option>
                            <option value="preserve">Preserve</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-[#cdd6f4]">Indent:</label>
                        <select
                            value={indentSize}
                            onChange={(e) => setIndentSize(parseInt(e.target.value))}
                            className="px-3 py-2 bg-[#313244] border border-[#45475a] rounded-lg text-[#cdd6f4] focus:outline-none focus:border-[#cba6f7]"
                        >
                            <option value={2}>2 spaces</option>
                            <option value={4}>4 spaces</option>
                            <option value={8}>8 spaces</option>
                        </select>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={formatSQL}
                            className="px-4 py-2 bg-[#cba6f7] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#f5c2e7] transition-colors"
                        >
                            ✨ Format
                        </button>

                        <button
                            onClick={minifySQL}
                            className="px-4 py-2 bg-[#89b4fa] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#a6d3ff] transition-colors"
                        >
                            📦 Minify
                        </button>

                        <button
                            onClick={copyToClipboard}
                            disabled={!output}
                            className="px-4 py-2 bg-[#f38ba8] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#f8a9bd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            📋 Copy
                        </button>

                        <button
                            onClick={clearAll}
                            className="px-4 py-2 bg-[#45475a] text-[#cdd6f4] font-semibold rounded-lg hover:bg-[#585b70] transition-colors"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-[#f38ba8] bg-opacity-10 border border-[#f38ba8] rounded-lg text-[#f38ba8]">
                        {error}
                    </div>
                )}

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">Input SQL</label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            {/* Line Numbers */}
                            <div
                                ref={lineNumbersRef}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers(input).map((num) => (
                                    <div key={num} className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right">
                                        {num}
                                    </div>
                                ))}
                            </div>
                            {/* Textarea */}
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onScroll={handleInputScroll}
                                placeholder="Dán SQL của bạn tại đây..."
                                className="flex-1 p-4 bg-[#313244] text-[#cdd6f4] font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                                rows={20}
                            />
                        </div>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">Output</label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            {/* Line Numbers */}
                            <div className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden">
                                {getLineNumbers(output).map((num) => (
                                    <div key={num} className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right">
                                        {num}
                                    </div>
                                ))}
                            </div>
                            {/* Textarea */}
                            <textarea
                                value={output}
                                readOnly
                                placeholder="Kết quả sẽ hiển thị ở đây..."
                                className="flex-1 p-4 bg-[#313244] text-[#cdd6f4] font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                                rows={20}
                            />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-8 p-6 bg-[#313244] border border-[#45475a] rounded-lg">
                    <h2 className="text-lg font-semibold text-[#cba6f7] mb-3">💡 Hướng dẫn</h2>
                    <ul className="text-[#cdd6f4] space-y-2 text-sm">
                        <li>• <strong>Format:</strong> Làm đẹp query SQL để dễ đọc hơn với nhiều hệ quản trị CSDL hỗ trợ.</li>
                        <li>• <strong>Minify:</strong> Nén SQL bằng cách xóa bỏ khoảng trắng thừa và comment.</li>
                        <li>• <strong>Copy:</strong> Sao chép nhanh kết quả vào clipboard.</li>
                        <li>• Chọn <strong>Ngôn ngữ</strong> phù hợp với hệ CSDL bạn đang dùng để format chính xác cú pháp.</li>
                        <li>• Tuỳ chỉnh tùy chọn in hoa/in thường cho các keyword (SELECT, FROM, v.v.).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
