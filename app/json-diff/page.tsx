'use client';

import { useState, useRef } from 'react';

interface DiffResult {
    type: 'added' | 'removed' | 'modified' | 'unchanged';
    path: string;
    oldValue?: unknown;
    newValue?: unknown;
}

export default function JSONDiff() {
    const [json1, setJson1] = useState('');
    const [json2, setJson2] = useState('');
    const [diffs, setDiffs] = useState<DiffResult[]>([]);
    const [error, setError] = useState('');
    const lineNumbersRef1 = useRef<HTMLDivElement>(null);
    const lineNumbersRef2 = useRef<HTMLDivElement>(null);
    const json1Ref = useRef<HTMLTextAreaElement>(null);
    const json2Ref = useRef<HTMLTextAreaElement>(null);

    const handleScroll = (
        event: React.UIEvent<HTMLTextAreaElement>,
        lineRef: React.RefObject<HTMLDivElement>
    ) => {
        if (lineRef.current && event.currentTarget) {
            lineRef.current.scrollTop = event.currentTarget.scrollTop;
        }
    };

    const getLineNumbers = (text: string) => {
        const lines = text.split('\n').length;
        return Array.from({ length: lines }, (_, i) => i + 1);
    };

    const deepDiff = (
        obj1: unknown,
        obj2: unknown,
        path = ''
    ): DiffResult[] => {
        const results: DiffResult[] = [];

        const type1 = Array.isArray(obj1) ? 'array' : typeof obj1;
        const type2 = Array.isArray(obj2) ? 'array' : typeof obj2;

        if (type1 !== type2) {
            results.push({
                type: 'modified',
                path: path || 'root',
                oldValue: obj1,
                newValue: obj2
            });
            return results;
        }

        if (type1 === 'object' && obj1 !== null && obj2 !== null) {
            const keys1 = new Set(Object.keys(obj1 as Record<string, unknown>));
            const keys2 = new Set(Object.keys(obj2 as Record<string, unknown>));

            for (const key of keys1) {
                const newPath = path ? `${path}.${key}` : key;
                if (!keys2.has(key)) {
                    results.push({
                        type: 'removed',
                        path: newPath,
                        oldValue: (obj1 as Record<string, unknown>)[key]
                    });
                } else {
                    const val1 = (obj1 as Record<string, unknown>)[key];
                    const val2 = (obj2 as Record<string, unknown>)[key];
                    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                        if (typeof val1 === 'object' && val1 !== null) {
                            results.push(...deepDiff(val1, val2, newPath));
                        } else {
                            results.push({
                                type: 'modified',
                                path: newPath,
                                oldValue: val1,
                                newValue: val2
                            });
                        }
                    }
                }
            }

            for (const key of keys2) {
                if (!keys1.has(key)) {
                    const newPath = path ? `${path}.${key}` : key;
                    results.push({
                        type: 'added',
                        path: newPath,
                        newValue: (obj2 as Record<string, unknown>)[key]
                    });
                }
            }
        } else if (obj1 !== obj2) {
            results.push({
                type: 'modified',
                path: path || 'root',
                oldValue: obj1,
                newValue: obj2
            });
        }

        return results;
    };

    const compareJSON = () => {
        try {
            setError('');
            if (!json1.trim() || !json2.trim()) {
                setError('Vui lòng nhập cả 2 JSON');
                setDiffs([]);
                return;
            }

            const obj1 = JSON.parse(json1);
            const obj2 = JSON.parse(json2);
            const diffResults = deepDiff(obj1, obj2);
            setDiffs(diffResults);
        } catch (err: unknown) {
            const errorMessage = err instanceof SyntaxError ? err.message : 'Lỗi không xác định';
            setError(`❌ JSON không hợp lệ: ${errorMessage}`);
            setDiffs([]);
        }
    };

    const clearAll = () => {
        setJson1('');
        setJson2('');
        setDiffs([]);
        setError('');
    };

    const getDiffStats = () => {
        const added = diffs.filter(d => d.type === 'added').length;
        const removed = diffs.filter(d => d.type === 'removed').length;
        const modified = diffs.filter(d => d.type === 'modified').length;
        return { added, removed, modified };
    };

    const stats = getDiffStats();

    return (
        <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-[#cba6f7] mb-8">JSON Diff Tool</h1>

                {/* Controls */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    <button
                        onClick={compareJSON}
                        className="px-6 py-2 bg-[#cba6f7] text-[#1e1e2e] font-semibold rounded-lg hover:bg-[#f5c2e7] transition-colors"
                    >
                        ⚖️ Compare
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

                {/* JSON Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* JSON 1 */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">JSON 1</label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            <div
                                ref={lineNumbersRef1}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers(json1).map((num) => (
                                    <div
                                        key={num}
                                        className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right"
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                ref={json1Ref}
                                value={json1}
                                onChange={(e) => setJson1(e.target.value)}
                                onScroll={(e) => handleScroll(e, lineNumbersRef1)}
                                placeholder="Dán JSON thứ nhất tại đây..."
                                className="flex-1 p-4 bg-[#313244] text-[#cdd6f4] font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* JSON 2 */}
                    <div className="flex flex-col">
                        <label className="mb-2 text-sm font-semibold text-[#cba6f7]">JSON 2</label>
                        <div className="flex flex-1 border border-[#45475a] rounded-lg overflow-hidden bg-[#313244]">
                            <div
                                ref={lineNumbersRef2}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers(json2).map((num) => (
                                    <div
                                        key={num}
                                        className="h-[1.5em] leading-[1.5em] min-w-[2em] text-right"
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                            <textarea
                                ref={json2Ref}
                                value={json2}
                                onChange={(e) => setJson2(e.target.value)}
                                onScroll={(e) => handleScroll(e, lineNumbersRef2)}
                                placeholder="Dán JSON thứ hai tại đây..."
                                className="flex-1 p-4 bg-[#313244] text-[#cdd6f4] font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </div>

                {/* Diff Results */}
                {diffs.length > 0 && (
                    <div className="mb-8">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-[#a6e3a1] bg-opacity-10 border border-[#a6e3a1] rounded-lg">
                                <div className="text-2xl font-bold text-[#a6e3a1]">{stats.added}</div>
                                <div className="text-sm text-[#a6adc8]">Added</div>
                            </div>
                            <div className="p-4 bg-[#f38ba8] bg-opacity-10 border border-[#f38ba8] rounded-lg">
                                <div className="text-2xl font-bold text-[#f38ba8]">{stats.removed}</div>
                                <div className="text-sm text-[#a6adc8]">Removed</div>
                            </div>
                            <div className="p-4 bg-[#f9e2af] bg-opacity-10 border border-[#f9e2af] rounded-lg">
                                <div className="text-2xl font-bold text-[#f9e2af]">{stats.modified}</div>
                                <div className="text-sm text-[#a6adc8]">Modified</div>
                            </div>
                        </div>

                        {/* Diff List */}
                        <div className="space-y-3">
                            {diffs.map((diff, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${
                                        diff.type === 'added'
                                            ? 'bg-[#a6e3a1] bg-opacity-10 border-[#a6e3a1]'
                                            : diff.type === 'removed'
                                            ? 'bg-[#f38ba8] bg-opacity-10 border-[#f38ba8]'
                                            : 'bg-[#f9e2af] bg-opacity-10 border-[#f9e2af]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span
                                            className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                                                diff.type === 'added'
                                                    ? 'bg-[#a6e3a1] text-[#1e1e2e]'
                                                    : diff.type === 'removed'
                                                    ? 'bg-[#f38ba8] text-[#1e1e2e]'
                                                    : 'bg-[#f9e2af] text-[#1e1e2e]'
                                            }`}
                                        >
                                            {diff.type === 'added'
                                                ? '➕ Added'
                                                : diff.type === 'removed'
                                                ? '➖ Removed'
                                                : '🔄 Modified'}
                                        </span>
                                    </div>
                                    <div className="text-sm font-mono text-[#cdd6f4] mb-2 break-all">
                                        <span className="text-[#a6adc8]">Path:</span> {diff.path}
                                    </div>
                                    {diff.oldValue !== undefined && (
                                        <div className="text-sm font-mono text-[#f38ba8] mb-2 break-all">
                                            <span className="text-[#a6adc8]">Old:</span>{' '}
                                            {JSON.stringify(diff.oldValue)}
                                        </div>
                                    )}
                                    {diff.newValue !== undefined && (
                                        <div className="text-sm font-mono text-[#a6e3a1] break-all">
                                            <span className="text-[#a6adc8]">New:</span>{' '}
                                            {JSON.stringify(diff.newValue)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="p-6 bg-[#313244] border border-[#45475a] rounded-lg">
                    <h2 className="text-lg font-semibold text-[#cba6f7] mb-3">💡 Hướng dẫn</h2>
                    <ul className="text-[#cdd6f4] space-y-2 text-sm">
                        <li>
                            • <strong>Paste 2 JSON:</strong> Dán 2 file JSON vào 2 ô input
                        </li>
                        <li>
                            • <strong>Compare:</strong> Click nút Compare để so sánh
                        </li>
                        <li>
                            • <strong>Added:</strong> Những key/property chỉ có trong JSON 2
                        </li>
                        <li>
                            • <strong>Removed:</strong> Những key/property chỉ có trong JSON 1
                        </li>
                        <li>
                            • <strong>Modified:</strong> Những key/property có giá trị khác nhau
                        </li>
                    </ul>
                </div>

                {/* Examples */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-[#cba6f7] mb-4">📚 Ví dụ nhanh</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setJson1(
                                    JSON.stringify(
                                        { name: 'Nhan', age: 25, city: 'Hanoi' },
                                        null,
                                        2
                                    )
                                );
                                setJson2(
                                    JSON.stringify(
                                        { name: 'Nhan', age: 26, country: 'Vietnam' },
                                        null,
                                        2
                                    )
                                );
                            }}
                            className="p-4 bg-[#313244] border border-[#45475a] rounded-lg hover:border-[#cba6f7] transition-colors text-left"
                        >
                            <div className="font-semibold text-[#cba6f7]">Simple Objects</div>
                            <code className="text-xs text-[#a6adc8] mt-1 block">
                                Compare objects with few properties
                            </code>
                        </button>

                        <button
                            onClick={() => {
                                setJson1(
                                    JSON.stringify(
                                        {
                                            users: [
                                                { id: 1, name: 'User 1' },
                                                { id: 2, name: 'User 2' }
                                            ]
                                        },
                                        null,
                                        2
                                    )
                                );
                                setJson2(
                                    JSON.stringify(
                                        {
                                            users: [
                                                { id: 1, name: 'User 1 Updated' },
                                                { id: 2, name: 'User 2' }
                                            ]
                                        },
                                        null,
                                        2
                                    )
                                );
                            }}
                            className="p-4 bg-[#313244] border border-[#45475a] rounded-lg hover:border-[#cba6f7] transition-colors text-left"
                        >
                            <div className="font-semibold text-[#cba6f7]">Arrays of Objects</div>
                            <code className="text-xs text-[#a6adc8] mt-1 block">
                                Compare arrays with modifications
                            </code>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
