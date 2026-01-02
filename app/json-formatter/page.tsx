'use client';

import { useState, useRef } from 'react';

export default function JSONFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [indentSize, setIndentSize] = useState(2);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const handleInputScroll = () => {
        if (lineNumbersRef.current && inputRef.current) {
            lineNumbersRef.current.scrollTop = inputRef.current.scrollTop;
        }
    };

    const getLineNumbers = () => {
        const lines = input.split('\n').length;
        return Array.from({ length: lines }, (_, i) => i + 1);
    };

    const formatJSON = () => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập JSON');
                setOutput('');
                return;
            }
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, indentSize);
            setOutput(formatted);
        } catch (err: unknown) {
            const errorMessage = err instanceof SyntaxError ? err.message : 'Lỗi không xác định';
            const match = errorMessage.match(/position (\d+)/);
            let lineNumber = 1;
            
            if (match) {
                const position = parseInt(match[1]);
                lineNumber = input.substring(0, position).split('\n').length;
            }
            
            setError(`❌ JSON không hợp lệ (Dòng ${lineNumber}): ${errorMessage}`);
            setOutput('');
        }
    };

    const minifyJSON = () => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập JSON');
                setOutput('');
                return;
            }
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
        } catch (err: unknown) {
            const errorMessage = err instanceof SyntaxError ? err.message : 'Lỗi không xác định';
            const match = errorMessage.match(/position (\d+)/);
            let lineNumber = 1;
            
            if (match) {
                const position = parseInt(match[1]);
                lineNumber = input.substring(0, position).split('\n').length;
            }
            
            setError(`❌ JSON không hợp lệ (Dòng ${lineNumber}): ${errorMessage}`);
            setOutput('');
        }
    };

    const validateJSON = () => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập JSON');
                return;
            }
            JSON.parse(input);
            setError('');
            setOutput('✓ JSON hợp lệ!');
        } catch (err: unknown) {
            const errorMessage = err instanceof SyntaxError ? err.message : 'Lỗi không xác định';
            const match = errorMessage.match(/position (\d+)/);
            let lineNumber = 1;
            
            if (match) {
                const position = parseInt(match[1]);
                lineNumber = input.substring(0, position).split('\n').length;
            }
            
            setError(`❌ JSON không hợp lệ (Dòng ${lineNumber}): ${errorMessage}`);
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
                <h1 className="text-4xl font-bold text-[#cba6f7] mb-8">JSON Formatter & Validator</h1>

                {/* Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <label className="text-[#cdd6f4]">Indent Size:</label>
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
                            onClick={formatJSON}
                            className="px-4 py-2 bg-[#cba6f7] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#f5c2e7] transition-colors"
                        >
                            ✨ Format
                        </button>

                        <button
                            onClick={minifyJSON}
                            className="px-4 py-2 bg-[#89b4fa] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#a6d3ff] transition-colors"
                        >
                            📦 Minify
                        </button>

                        <button
                            onClick={validateJSON}
                            className="px-4 py-2 bg-[#a6e3a1] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#b8e4ac] transition-colors"
                        >
                            ✓ Validate
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
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">Input JSON</label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            {/* Line Numbers */}
                            <div
                                ref={lineNumbersRef}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers().map((num) => (
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
                                placeholder="Dán JSON của bạn tại đây..."
                                className="flex-1 p-4 bg-[#313244] text-[#cdd6f4] font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">Output</label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            {/* Line Numbers */}
                            <div className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden">
                                {output.split('\n').map((_, i) => (
                                    <div key={i + 1} className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right">
                                        {i + 1}
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
                            />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-8 p-6 bg-[#313244] border border-[#45475a] rounded-lg">
                    <h2 className="text-lg font-semibold text-[#cba6f7] mb-3">💡 Hướng dẫn</h2>
                    <ul className="text-[#cdd6f4] space-y-2 text-sm">
                        <li>• <strong>Format:</strong> Định dạng JSON với indentation để dễ đọc</li>
                        <li>• <strong>Minify:</strong> Nén JSON để giảm kích thước (bỏ khoảng trắng)</li>
                        <li>• <strong>Validate:</strong> Kiểm tra xem JSON có hợp lệ hay không</li>
                        <li>• <strong>Copy:</strong> Sao chép kết quả vào clipboard</li>
                        <li>• <strong>Chọn Indent Size:</strong> Điều chỉnh số khoảng trắng cho từng level</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
