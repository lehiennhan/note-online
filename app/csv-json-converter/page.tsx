'use client';

import { useState, useRef } from 'react';

export default function CSVJSONConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
    const [hasHeaders, setHasHeaders] = useState(true);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleInputScroll = () => {
        if (lineNumbersRef.current && inputRef.current) {
            lineNumbersRef.current.scrollTop = inputRef.current.scrollTop;
        }
    };

    const getLineNumbers = () => {
        const lines = input.split('\n').length;
        return Array.from({ length: lines }, (_, i) => i + 1);
    };

    const csvToJson = (): string => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập CSV');
                return '';
            }

            const lines = input.trim().split('\n');
            if (lines.length === 0) {
                setError('CSV không có dòng nào');
                return '';
            }

            let headers: string[] = [];
            let startIndex = 0;

            if (hasHeaders) {
                headers = parseCSVLine(lines[0]);
                startIndex = 1;
            } else {
                const firstLine = parseCSVLine(lines[0]);
                headers = firstLine.map((_, i) => `Column${i + 1}`);
            }

            const jsonArray: Record<string, string>[] = [];

            for (let i = startIndex; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;

                const values = parseCSVLine(lines[i]);
                const obj: Record<string, string> = {};

                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });

                jsonArray.push(obj);
            }

            return JSON.stringify(jsonArray, null, 2);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(`❌ Lỗi chuyển đổi: ${errorMessage}`);
            return '';
        }
    };

    const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (insideQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    };

    const jsonToCsv = (): string => {
        try {
            setError('');
            if (!input.trim()) {
                setError('Vui lòng nhập JSON');
                return '';
            }

            const parsed = JSON.parse(input);
            
            if (!Array.isArray(parsed)) {
                setError('❌ JSON phải là một mảng các đối tượng');
                return '';
            }

            if (parsed.length === 0) {
                setError('❌ Mảng JSON không có phần tử');
                return '';
            }

            const headers = Object.keys(parsed[0]);
            const csvLines: string[] = [];

            if (hasHeaders) {
                csvLines.push(headers.map(h => escapeCSV(h)).join(','));
            }

            for (const obj of parsed) {
                const values = headers.map(header => {
                    const value = obj[header];
                    if (value === null || value === undefined) return '';
                    return escapeCSV(String(value));
                });
                csvLines.push(values.join(','));
            }

            return csvLines.join('\n');
        } catch (err: unknown) {
            const errorMessage = err instanceof SyntaxError ? err.message : 'Lỗi không xác định';
            setError(`❌ JSON không hợp lệ: ${errorMessage}`);
            return '';
        }
    };

    const escapeCSV = (value: string): string => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    };

    const handleConvert = () => {
        let result = '';
        if (mode === 'csv-to-json') {
            result = csvToJson();
        } else {
            result = jsonToCsv();
        }
        setOutput(result);
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

    const swapMode = () => {
        setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
        setInput('');
        setOutput('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#cba6f7] mb-2">🔄 CSV ↔ JSON Converter</h1>
                <p className="text-[#a6adc8] mb-8">Chuyển đổi giữa CSV và JSON một cách dễ dàng</p>

                {/* Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 flex-wrap">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setMode('csv-to-json')}
                            className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                                mode === 'csv-to-json'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                    : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                        >
                            CSV → JSON
                        </button>

                        <button
                            onClick={() => setMode('json-to-csv')}
                            className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                                mode === 'json-to-csv'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                    : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                        >
                            JSON → CSV
                        </button>

                        <button
                            onClick={swapMode}
                            className="px-4 py-2 bg-[#89b4fa] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#a6d3ff] transition-colors"
                        >
                            ⇄ Swap
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="hasHeaders"
                            checked={hasHeaders}
                            onChange={(e) => setHasHeaders(e.target.checked)}
                            className="w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="hasHeaders" className="text-[#cdd6f4] cursor-pointer">
                            Dòng đầu là Headers
                        </label>
                    </div>
                </div>

                {/* Convert Buttons */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                        onClick={handleConvert}
                        className="px-6 py-2 bg-[#a6e3a1] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#b8e4ac] transition-colors"
                    >
                        ✨ Convert
                    </button>

                    <button
                        onClick={copyToClipboard}
                        disabled={!output}
                        className="px-6 py-2 bg-[#f38ba8] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#f8a9bd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        📋 Copy
                    </button>

                    <button
                        onClick={clearAll}
                        className="px-6 py-2 bg-[#45475a] text-[#cdd6f4] font-semibold rounded-lg hover:bg-[#585b70] transition-colors"
                    >
                        🗑️ Clear
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-[#f38ba8] bg-opacity-10 border border-[#f38ba8] rounded-lg text-[#f38ba8]">
                        {error}
                    </div>
                )}

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh]">
                    {/* Input */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">
                            Input {mode === 'csv-to-json' ? 'CSV' : 'JSON'}
                        </label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            {/* Line Numbers */}
                            <div
                                ref={lineNumbersRef}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers().map((num) => (
                                    <div
                                        key={num}
                                        className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right"
                                    >
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
                                placeholder={
                                    mode === 'csv-to-json'
                                        ? 'Dán CSV của bạn tại đây...'
                                        : 'Dán JSON của bạn tại đây...'
                                }
                                className="flex-1 p-4 bg-[#313244] text-[#cdd6f4] font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">
                            Output {mode === 'csv-to-json' ? 'JSON' : 'CSV'}
                        </label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            {/* Line Numbers */}
                            <div className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden">
                                {output.split('\n').map((_, i) => (
                                    <div
                                        key={i + 1}
                                        className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right"
                                    >
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
                        <li>
                            • <strong>CSV → JSON:</strong> Chuyển đổi file CSV thành mảng JSON objects
                        </li>
                        <li>
                            • <strong>JSON → CSV:</strong> Chuyển đổi mảng JSON objects thành CSV
                        </li>
                        <li>
                            • <strong>Headers:</strong> Tích vào nếu dòng đầu là tên cột
                        </li>
                        <li>
                            • <strong>Swap Mode:</strong> Nhanh chóng chuyển đổi chế độ
                        </li>
                        <li>
                            • <strong>CSV Format:</strong> Hỗ trợ quoted fields và comma escaping
                        </li>
                    </ul>
                </div>

                {/* Examples */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-[#cba6f7] mb-4">📚 Ví dụ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setMode('csv-to-json');
                                setInput(
                                    `name,age,city
Nhan,25,Hanoi
John,30,New York
Jane,28,London`
                                );
                            }}
                            className="p-4 bg-[#313244] border border-[#45475a] rounded-lg hover:border-[#cba6f7] transition-colors text-left"
                        >
                            <div className="font-semibold text-[#cba6f7]">CSV đơn giản</div>
                            <code className="text-xs text-[#a6adc8] mt-1 block">
                                name,age,city
                            </code>
                        </button>

                        <button
                            onClick={() => {
                                setMode('json-to-csv');
                                setInput(
                                    JSON.stringify(
                                        [
                                            { id: 1, name: 'Product 1', price: 100 },
                                            { id: 2, name: 'Product 2', price: 200 }
                                        ],
                                        null,
                                        2
                                    )
                                );
                            }}
                            className="p-4 bg-[#313244] border border-[#45475a] rounded-lg hover:border-[#cba6f7] transition-colors text-left"
                        >
                            <div className="font-semibold text-[#cba6f7]">JSON mảng objects</div>
                            <code className="text-xs text-[#a6adc8] mt-1 block">
                                [{'{id, name, price}'}]
                            </code>
                        </button>

                        <button
                            onClick={() => {
                                setMode('csv-to-json');
                                setInput(
                                    `product,description,price
"Laptop","High-end laptop, 16GB RAM",1500
"Mouse","Wireless mouse, 2.4GHz",25.99`
                                );
                            }}
                            className="p-4 bg-[#313244] border border-[#45475a] rounded-lg hover:border-[#cba6f7] transition-colors text-left"
                        >
                            <div className="font-semibold text-[#cba6f7]">CSV với quoted fields</div>
                            <code className="text-xs text-[#a6adc8] mt-1 block">
                                Hỗ trợ dấu ngoặc kép
                            </code>
                        </button>

                        <button
                            onClick={() => {
                                setMode('json-to-csv');
                                setInput(
                                    JSON.stringify(
                                        [
                                            { name: 'Alice', skills: 'JavaScript, React' },
                                            { name: 'Bob', skills: 'Python, Django' }
                                        ],
                                        null,
                                        2
                                    )
                                );
                            }}
                            className="p-4 bg-[#313244] border border-[#45475a] rounded-lg hover:border-[#cba6f7] transition-colors text-left"
                        >
                            <div className="font-semibold text-[#cba6f7]">JSON với dữ liệu phức tạp</div>
                            <code className="text-xs text-[#a6adc8] mt-1 block">
                                Xử lý giá trị chứa comma
                            </code>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
