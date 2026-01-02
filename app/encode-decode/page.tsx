'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function EncodeDecodePage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const handleEncode = (text: string) => {
        try {
            setError('');
            const encoded = Buffer.from(text).toString('base64');
            setOutput(encoded);
        } catch (err) {
            setError('Error encoding text');
        }
    };

    const handleDecode = (text: string) => {
        try {
            setError('');
            const decoded = Buffer.from(text, 'base64').toString('utf-8');
            setOutput(decoded);
        } catch (err) {
            setError('Invalid base64 string');
        }
    };

    const handleInputChange = (value: string) => {
        setInput(value);
        if (mode === 'encode') {
            handleEncode(value);
        } else {
            handleDecode(value);
        }
    };

    const handleModeChange = (newMode: 'encode' | 'decode') => {
        setMode(newMode);
        if (newMode === 'encode') {
            handleEncode(input);
        } else {
            handleDecode(input);
        }
    };

    const copyToClipboard = async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapInputOutput = () => {
        setInput(output);
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <section className="mb-8">
                    <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">🔐 Base64 Encoder/Decoder</h1>
                    <p className="text-[#a6adc8]">Encode text to Base64 or decode Base64 strings instantly</p>
                </section>

                {/* Mode Selector */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => handleModeChange('encode')}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${mode === 'encode'
                                ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                    >
                        📝 Encode
                    </button>
                    <button
                        onClick={() => handleModeChange('decode')}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${mode === 'decode'
                                ? 'bg-[#cba6f7] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#cdd6f4] hover:bg-[#585b70]'
                            }`}
                    >
                        🔓 Decode
                    </button>
                </div>

                {/* Input/Output Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Input */}
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">
                            {mode === 'encode' ? '📝 Plain Text' : '🔒 Base64 String'}
                        </h2>
                        <textarea
                            value={input}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
                            className="w-full h-64 bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg p-4 focus:border-[#cba6f7] focus:outline-none resize-none"
                        />
                        <div className="mt-4">
                            <span className="text-sm text-[#a6adc8]">{input.length} characters</span>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                        <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">
                            {mode === 'encode' ? '🔒 Base64 String' : '📝 Plain Text'}
                        </h2>
                        <div className="w-full h-64 bg-[#1e1e2e] text-[#a6adc8] border border-[#45475a] rounded-lg p-4 overflow-y-auto font-mono text-sm break-all">
                            {output || <span className="text-[#45475a]">Output will appear here...</span>}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-[#a6adc8]">{output.length} characters</span>
                            <button
                                onClick={copyToClipboard}
                                disabled={!output}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${output
                                        ? 'bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4]'
                                        : 'bg-[#45475a] text-[#45475a] cursor-not-allowed'
                                    }`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-[#f38ba8] bg-opacity-20 border border-[#f38ba8] rounded-lg p-4 mb-8 text-[#f38ba8]">
                        ❌ {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={swapInputOutput}
                        disabled={!output}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${output
                                ? 'bg-[#89dceb] hover:bg-[#94e2d5] text-[#1e1e2e]'
                                : 'bg-[#45475a] text-[#45475a] cursor-not-allowed'
                            }`}
                    >
                        <RefreshCw size={20} />
                        Swap & Convert
                    </button>
                    <button
                        onClick={clearAll}
                        className="flex-1 bg-[#f38ba8] hover:bg-[#f28baa] text-[#1e1e2e] px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-12 bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
                    <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4">ℹ️ About Base64</h3>
                    <div className="text-[#a6adc8] space-y-2">
                        <p>• Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format.</p>
                        <p>• It uses 64 printable ASCII characters (A-Z, a-z, 0-9, +, /)</p>
                        <p>• Useful for encoding data for transmission over media that only handle text.</p>
                        <p>• Common uses: data URLs, email attachments, API data transfer, token encoding</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
