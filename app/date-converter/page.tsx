'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface ConversionResult {
    unixTimestamp: string;
    localDate: string;
    utcDate: string;
    iso8601: string;
    timezone: string;
}

export default function DateConverterPage() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [mode, setMode] = useState<'timestamp-to-date' | 'date-to-timestamp' | 'local-to-utc' | 'utc-to-local'>('timestamp-to-date');
    const [copied, setCopied] = useState('');
    const [error, setError] = useState('');

    const getTimezoneOffset = () => {
        const offset = new Date().getTimezoneOffset();
        const hours = Math.abs(Math.floor(offset / 60));
        const minutes = Math.abs(offset % 60);
        const sign = offset <= 0 ? '+' : '-';
        return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const handleConvert = (value: string) => {
        setError('');
        setResult(null);

        if (!value.trim()) return;

        try {
            let date: Date;

            if (mode === 'timestamp-to-date') {
                // Unix timestamp (can be seconds or milliseconds)
                const num = parseInt(value);
                if (isNaN(num)) {
                    setError('Invalid timestamp. Please enter a number.');
                    return;
                }
                // If less than year 3000 in seconds, convert to milliseconds
                const timestamp = num < 10000000000 ? num * 1000 : num;
                date = new Date(timestamp);
            } else if (mode === 'date-to-timestamp') {
                // Date string to timestamp
                date = new Date(value);
                if (isNaN(date.getTime())) {
                    setError('Invalid date format. Try: YYYY-MM-DD or YYYY-MM-DD HH:mm:ss');
                    return;
                }
            } else if (mode === 'local-to-utc') {
                // Local time to UTC
                date = new Date(value);
                if (isNaN(date.getTime())) {
                    setError('Invalid date format. Try: YYYY-MM-DD or YYYY-MM-DD HH:mm:ss');
                    return;
                }
            } else {
                // UTC to Local
                date = new Date(value);
                if (isNaN(date.getTime())) {
                    setError('Invalid date format. Try: YYYY-MM-DD or YYYY-MM-DD HH:mm:ss');
                    return;
                }
            }

            const unixSeconds = Math.floor(date.getTime() / 1000);
            const unixMilliseconds = date.getTime();

            setResult({
                unixTimestamp: `${unixSeconds} (${unixMilliseconds}ms)`,
                localDate: date.toLocaleString(),
                utcDate: date.toUTCString(),
                iso8601: date.toISOString(),
                timezone: getTimezoneOffset(),
            });
        } catch (err) {
            setError('Error processing date. Please check your input.');
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

    const setCurrentTime = () => {
        const now = new Date();
        setInput(now.toISOString().slice(0, 19).replace('T', ' '));
        handleConvert(now.toISOString().slice(0, 19).replace('T', ' '));
    };

    const clearAll = () => {
        setInput('');
        setResult(null);
        setError('');
    };

    const getModeDescription = () => {
        switch (mode) {
            case 'timestamp-to-date':
                return 'Convert Unix timestamp to readable date';
            case 'date-to-timestamp':
                return 'Convert date to Unix timestamp';
            case 'local-to-utc':
                return 'Convert local time to UTC';
            case 'utc-to-local':
                return 'Convert UTC time to local time';
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <section className="mb-8">
                    <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">📅 Date Converter</h1>
                    <p className="text-[#a6adc8]">Convert between Unix timestamps, local time, and UTC</p>
                </section>

                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button
                        onClick={() => {
                            setMode('timestamp-to-date');
                            setInput('');
                            setResult(null);
                        }}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors text-sm ${mode === 'timestamp-to-date'
                                ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                    >
                        ⏰ Timestamp → Date
                    </button>
                    <button
                        onClick={() => {
                            setMode('date-to-timestamp');
                            setInput('');
                            setResult(null);
                        }}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors text-sm ${mode === 'date-to-timestamp'
                                ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                    >
                        📅 Date → Timestamp
                    </button>
                    <button
                        onClick={() => {
                            setMode('local-to-utc');
                            setInput('');
                            setResult(null);
                        }}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors text-sm ${mode === 'local-to-utc'
                                ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                    >
                        🌍 Local → UTC
                    </button>
                    <button
                        onClick={() => {
                            setMode('utc-to-local');
                            setInput('');
                            setResult(null);
                        }}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors text-sm ${mode === 'utc-to-local'
                                ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                    >
                        🗺️ UTC → Local
                    </button>
                </div>

                {/* Input Section */}
                <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a] mb-8">
                    <h2 className="text-xl font-semibold text-[#cdd6f4] mb-2">Input</h2>
                    <p className="text-sm text-[#a6adc8] mb-4">{getModeDescription()}</p>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            handleConvert(e.target.value);
                        }}
                        placeholder={
                            mode === 'timestamp-to-date'
                                ? 'Enter Unix timestamp (e.g., 1704153600)'
                                : mode === 'date-to-timestamp'
                                    ? 'Enter date (e.g., 2024-01-02 10:30:00)'
                                    : 'Enter date (e.g., 2024-01-02 10:30:00)'
                        }
                        className="w-full h-32 bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg p-4 focus:border-[#cba6f7] focus:outline-none resize-none"
                    />
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={setCurrentTime}
                            className="bg-[#89dceb] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                        >
                            Now
                        </button>
                        <button
                            onClick={clearAll}
                            className="bg-[#f38ba8] hover:bg-[#f28baa] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-[#f38ba8] bg-opacity-20 border border-[#f38ba8] rounded-lg p-4 mb-8 text-[#f38ba8]">
                        ❌ {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-2xl font-bold text-[#cdd6f4] mb-6">Results</h2>
                        <div className="space-y-4">
                            {/* Unix Timestamp */}
                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#cba6f7]">Unix Timestamp</label>
                                    <button
                                        onClick={() => copyToClipboard(result.unixTimestamp.split(' ')[0], 'timestamp')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'timestamp' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono break-all">{result.unixTimestamp}</p>
                            </div>

                            {/* Local Date */}
                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#a6e3a1]">Local Time</label>
                                    <button
                                        onClick={() => copyToClipboard(result.localDate, 'local')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'local' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono break-all">{result.localDate}</p>
                                <p className="text-xs text-[#a6adc8] mt-2">{result.timezone}</p>
                            </div>

                            {/* UTC Date */}
                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#89dceb]">UTC Time</label>
                                    <button
                                        onClick={() => copyToClipboard(result.utcDate, 'utc')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'utc' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono break-all">{result.utcDate}</p>
                            </div>

                            {/* ISO 8601 */}
                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#f5c2e7]">ISO 8601</label>
                                    <button
                                        onClick={() => copyToClipboard(result.iso8601, 'iso')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'iso' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono break-all">{result.iso8601}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-12 bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                    <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4">ℹ️ Date Format Examples</h3>
                    <div className="text-[#a6adc8] space-y-2 font-mono text-sm">
                        <p>• <span className="text-[#a6e3a1]">Unix Timestamp:</span> 1704153600 (seconds) or 1704153600000 (milliseconds)</p>
                        <p>• <span className="text-[#a6e3a1]">ISO 8601:</span> 2024-01-02T10:30:00.000Z</p>
                        <p>• <span className="text-[#a6e3a1]">Local Date:</span> 1/2/2024, 10:30:00 AM</p>
                        <p>• <span className="text-[#a6e3a1]">UTC Date:</span> Tue, 02 Jan 2024 10:30:00 GMT</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
