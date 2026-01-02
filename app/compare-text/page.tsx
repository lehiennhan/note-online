'use client';

import { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface Difference {
    type: 'added' | 'removed' | 'unchanged';
    text: string;
}

export default function CompareTextPage() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [copied, setCopied] = useState(false);
    const lineNumbersRef1 = useRef<HTMLDivElement>(null);
    const lineNumbersRef2 = useRef<HTMLDivElement>(null);
    const textarea1Ref = useRef<HTMLTextAreaElement>(null);
    const textarea2Ref = useRef<HTMLTextAreaElement>(null);

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

    const getDifferentLines = (text: string) => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const textLines = text.split('\n');
        const differentLines = new Set<number>();

        const maxLength = Math.max(lines1.length, lines2.length);

        for (let i = 0; i < maxLength; i++) {
            if ((lines1[i] || '') !== (lines2[i] || '')) {
                differentLines.add(i);
            }
        }

        return Array.from(differentLines);
    };

    const getDifferences = (): Difference[] => {
        if (!text1 || !text2) return [];

        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const differences: Difference[] = [];

        const maxLength = Math.max(lines1.length, lines2.length);

        for (let i = 0; i < maxLength; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 === line2) {
                differences.push({ type: 'unchanged', text: line1 || '(empty line)' });
            } else {
                if (line1) differences.push({ type: 'removed', text: line1 });
                if (line2) differences.push({ type: 'added', text: line2 });
            }
        }

        return differences;
    };

    const differences = getDifferences();
    const hasChanges = text1 && text2 && text1 !== text2;

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setText1('');
        setText2('');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <section className="mb-8">
                    <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">🔍 Compare Text</h1>
                    <p className="text-[#a6adc8]">Compare two texts side by side to find differences</p>
                </section>

                {/* Input Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Text 1 */}
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">Text 1</h2>
                        <div className="flex border border-[#45475a] rounded-lg overflow-hidden bg-[#1e1e2e] mb-4">
                            {/* Line Numbers */}
                            <div
                                ref={lineNumbersRef1}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers(text1).map((num) => (
                                    <div
                                        key={num}
                                        className={`h-[1.5em] leading-[1.5em] min-w-[2em] text-right ${getDifferentLines(text1).includes(num - 1)
                                                ? 'bg-[#f38ba8] bg-opacity-30 text-[#f38ba8]'
                                                : ''
                                            }`}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                            {/* Textarea */}
                            <textarea
                                ref={textarea1Ref}
                                value={text1}
                                onChange={(e) => setText1(e.target.value)}
                                onScroll={(e) => handleScroll(e, lineNumbersRef1)}
                                placeholder="Paste first text here..."
                                className="flex-1 bg-[#1e1e2e] text-[#cdd6f4] p-4 focus:border-[#cba6f7] focus:outline-none resize-none font-mono text-sm"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#a6adc8]">{text1.length} characters</span>
                            <button
                                onClick={() => copyToClipboard(text1)}
                                className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-4 py-2 rounded-lg transition-colors"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Text 2 */}
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">Text 2</h2>
                        <div className="flex border border-[#45475a] rounded-lg overflow-hidden bg-[#1e1e2e] mb-4">
                            {/* Line Numbers */}
                            <div
                                ref={lineNumbersRef2}
                                className="flex flex-col items-center bg-[#262735] text-[#a6adc8] text-sm font-mono py-4 px-2 select-none overflow-hidden"
                            >
                                {getLineNumbers(text2).map((num) => (
                                    <div
                                        key={num}
                                        className={`h-[1.5em] leading-[1.5em] min-w-[2em] text-right ${getDifferentLines(text2).includes(num - 1)
                                                ? 'bg-[#a6e3a1] bg-opacity-30 text-[#a6e3a1]'
                                                : ''
                                            }`}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                            {/* Textarea */}
                            <textarea
                                ref={textarea2Ref}
                                value={text2}
                                onChange={(e) => setText2(e.target.value)}
                                onScroll={(e) => handleScroll(e, lineNumbersRef2)}
                                placeholder="Paste second text here..."
                                className="flex-1 bg-[#1e1e2e] text-[#cdd6f4] p-4 focus:border-[#cba6f7] focus:outline-none resize-none font-mono text-sm"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-[#a6adc8]">{text2.length} characters</span>
                            <button
                                onClick={() => copyToClipboard(text2)}
                                className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-4 py-2 rounded-lg transition-colors"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={clearAll}
                        className="bg-[#f38ba8] hover:bg-[#f28baa] text-[#1e1e2e] px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                    {hasChanges && (
                        <div className="flex-1 flex items-center justify-center bg-[#a6e3a1] text-[#1e1e2e] rounded-lg font-semibold">
                            ⚠️ Differences found
                        </div>
                    )}
                </div>

                {/* Comparison Result */}
                {hasChanges && (
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-2xl font-bold text-[#cdd6f4] mb-6">Differences</h2>
                        <div className="space-y-2">
                            {differences.map((diff, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-lg font-mono text-sm break-words ${diff.type === 'removed'
                                            ? 'bg-[#f38ba8] bg-opacity-20 border border-[#f38ba8] text-[#f38ba8]'
                                            : diff.type === 'added'
                                                ? 'bg-[#a6e3a1] bg-opacity-20 border border-[#a6e3a1] text-[#a6e3a1]'
                                                : 'bg-[#45475a] border border-[#585b70] text-[#cdd6f4]'
                                        }`}
                                >
                                    <span className="font-bold">
                                        {diff.type === 'removed' ? '- ' : diff.type === 'added' ? '+ ' : '  '}
                                    </span>
                                    {diff.text}
                                </div>
                            ))}
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-[#1e1e2e] rounded-lg p-4 text-center border border-[#45475a]">
                                <div className="text-sm text-[#a6adc8] mb-2">Same Lines</div>
                                <div className="text-2xl font-bold text-[#89dceb]">
                                    {differences.filter((d) => d.type === 'unchanged').length}
                                </div>
                            </div>
                            <div className="bg-[#1e1e2e] rounded-lg p-4 text-center border border-[#45475a]">
                                <div className="text-sm text-[#a6adc8] mb-2">Removed</div>
                                <div className="text-2xl font-bold text-[#f38ba8]">
                                    {differences.filter((d) => d.type === 'removed').length}
                                </div>
                            </div>
                            <div className="bg-[#1e1e2e] rounded-lg p-4 text-center border border-[#45475a]">
                                <div className="text-sm text-[#a6adc8] mb-2">Added</div>
                                <div className="text-2xl font-bold text-[#a6e3a1]">
                                    {differences.filter((d) => d.type === 'added').length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(!text1 || !text2) && (
                    <div className="bg-[#313244] rounded-2xl p-12 border border-[#45475a] text-center">
                        <p className="text-[#a6adc8] text-lg">
                            👈 Enter text in both fields to compare and see the differences
                        </p>
                    </div>
                )}

                {text1 === text2 && text1 && (
                    <div className="bg-[#313244] rounded-2xl p-12 border border-[#89dceb] text-center">
                        <p className="text-[#89dceb] text-lg font-semibold">✅ Texts are identical</p>
                    </div>
                )}
            </div>
        </main>
    );
}
