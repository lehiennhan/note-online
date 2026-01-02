'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface DateDiffResult {
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
    isPast: boolean;
}

export default function DateDiffPage() {
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [result, setResult] = useState<DateDiffResult | null>(null);
    const [copied, setCopied] = useState('');
    const [error, setError] = useState('');

    const calculateDifference = (d1: string, d2: string) => {
        setError('');
        setResult(null);

        if (!d1 || !d2) return;

        try {
            const date1Obj = new Date(d1);
            const date2Obj = new Date(d2);

            if (isNaN(date1Obj.getTime()) || isNaN(date2Obj.getTime())) {
                setError('Invalid date format. Please enter valid dates.');
                return;
            }

            let diff = date2Obj.getTime() - date1Obj.getTime();
            const isPast = diff < 0;
            diff = Math.abs(diff);

            const totalSeconds = Math.floor(diff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const totalDays = Math.floor(totalHours / 24);

            const days = totalDays;
            const hours = Math.floor((totalHours % 24));
            const minutes = Math.floor((totalMinutes % 60));
            const seconds = totalSeconds % 60;

            const formatted = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

            setResult({
                totalSeconds,
                totalMinutes,
                totalHours,
                totalDays,
                days,
                hours,
                minutes,
                seconds,
                formatted,
                isPast,
            });
        } catch (err) {
            setError('Error calculating difference.');
        }
    };

    const handleDate1Change = (value: string) => {
        setDate1(value);
        calculateDifference(value, date2);
    };

    const handleDate2Change = (value: string) => {
        setDate2(value);
        calculateDifference(date1, value);
    };

    const copyToClipboard = async (text: string, label: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

    const setNow = (which: 'date1' | 'date2') => {
        const now = new Date().toISOString().slice(0, 16);
        if (which === 'date1') {
            setDate1(now);
            calculateDifference(now, date2);
        } else {
            setDate2(now);
            calculateDifference(date1, now);
        }
    };

    const clearAll = () => {
        setDate1('');
        setDate2('');
        setResult(null);
        setError('');
    };

    const swapDates = () => {
        const temp = date1;
        setDate1(date2);
        setDate2(temp);
        calculateDifference(date2, temp);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <section className="mb-8">
                    <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">⏱️ Date Difference Calculator</h1>
                    <p className="text-[#a6adc8]">Calculate the difference between two dates in days, hours, and minutes</p>
                </section>

                {/* Input Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Date 1 */}
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">Start Date</h2>
                        <input
                            type="datetime-local"
                            value={date1}
                            onChange={(e) => handleDate1Change(e.target.value)}
                            className="w-full bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg p-4 focus:border-[#cba6f7] focus:outline-none mb-4"
                        />
                        <button
                            onClick={() => setNow('date1')}
                            className="w-full bg-[#89dceb] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Set Now
                        </button>
                    </div>

                    {/* Date 2 */}
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">End Date</h2>
                        <input
                            type="datetime-local"
                            value={date2}
                            onChange={(e) => handleDate2Change(e.target.value)}
                            className="w-full bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg p-4 focus:border-[#cba6f7] focus:outline-none mb-4"
                        />
                        <button
                            onClick={() => setNow('date2')}
                            className="w-full bg-[#89dceb] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Set Now
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={swapDates}
                        disabled={!date1 || !date2}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${date1 && date2
                                ? 'bg-[#f5c2e7] hover:bg-[#f2b8db] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#45475a] cursor-not-allowed'
                            }`}
                    >
                        <RefreshCw size={20} />
                        Swap Dates
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex-1 bg-[#f38ba8] hover:bg-[#f28baa] text-[#1e1e2e] px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-[#f38ba8] bg-opacity-20 border border-[#f38ba8] rounded-lg p-4 mb-8 text-[#f38ba8]">
                        ❌ {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a] mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#cdd6f4]">Time Difference</h2>
                            {result.isPast && (
                                <span className="bg-[#f38ba8] bg-opacity-20 border border-[#f38ba8] text-[#f38ba8] px-3 py-1 rounded text-sm font-semibold">
                                    Past
                                </span>
                            )}
                        </div>

                        {/* Main Display */}
                        <div className="bg-[#1e1e2e] rounded-xl p-6 mb-6 border border-[#45475a]">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#a6e3a1]">{result.days}</div>
                                    <div className="text-sm text-[#a6adc8] mt-2">Days</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#89dceb]">{result.hours}</div>
                                    <div className="text-sm text-[#a6adc8] mt-2">Hours</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#cba6f7]">{result.minutes}</div>
                                    <div className="text-sm text-[#a6adc8] mt-2">Minutes</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#f5c2e7]">{result.seconds}</div>
                                    <div className="text-sm text-[#a6adc8] mt-2">Seconds</div>
                                </div>
                            </div>
                        </div>

                        {/* Formatted Display */}
                        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a] mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-[#cdd6f4]">Formatted</label>
                                <button
                                    onClick={() => copyToClipboard(result.formatted, 'formatted')}
                                    className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                >
                                    {copied === 'formatted' ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                            <p className="text-[#cdd6f4] font-mono break-all">{result.formatted}</p>
                        </div>

                        {/* Total Units */}
                        <div className="space-y-3">
                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#a6e3a1]">Total Days</label>
                                    <button
                                        onClick={() => copyToClipboard(result.totalDays.toString(), 'days')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'days' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono">{result.totalDays} days</p>
                            </div>

                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#89dceb]">Total Hours</label>
                                    <button
                                        onClick={() => copyToClipboard(result.totalHours.toString(), 'hours')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'hours' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono">{result.totalHours} hours</p>
                            </div>

                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#cba6f7]">Total Minutes</label>
                                    <button
                                        onClick={() => copyToClipboard(result.totalMinutes.toString(), 'minutes')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'minutes' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono">{result.totalMinutes} minutes</p>
                            </div>

                            <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a]">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-semibold text-[#f5c2e7]">Total Seconds</label>
                                    <button
                                        onClick={() => copyToClipboard(result.totalSeconds.toString(), 'seconds')}
                                        className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        {copied === 'seconds' ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="text-[#cdd6f4] font-mono">{result.totalSeconds} seconds</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!result && (
                    <div className="bg-[#313244] rounded-2xl p-12 border border-[#45475a] text-center">
                        <p className="text-[#a6adc8] text-lg">
                            👈 Select two dates to calculate the difference
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
