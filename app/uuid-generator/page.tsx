'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, Trash2 } from 'lucide-react';

interface GeneratedUUID {
  id: string;
  timestamp: Date;
}

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<GeneratedUUID[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState('');

  const generateUUID = (): string => {
    return crypto.randomUUID();
  };

  const handleGenerate = () => {
    const newUUIDs: GeneratedUUID[] = [];
    for (let i = 0; i < count; i++) {
      newUUIDs.push({
        id: generateUUID(),
        timestamp: new Date(),
      });
    }
    setUuids([...newUUIDs, ...uuids]);
  };

  const handleGenerateSingle = () => {
    const newUUID: GeneratedUUID = {
      id: generateUUID(),
      timestamp: new Date(),
    };
    setUuids([newUUID, ...uuids]);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const copyAllToClipboard = async () => {
    const allUUIDs = uuids.map((u) => u.id).join('\n');
    await navigator.clipboard.writeText(allUUIDs);
    setCopied('all');
    setTimeout(() => setCopied(''), 2000);
  };

  const deleteUUID = (id: string) => {
    setUuids(uuids.filter((u) => u.id !== id));
  };

  const clearAll = () => {
    setUuids([]);
  };

  const downloadAsJSON = () => {
    const data = {
      generated_at: new Date().toISOString(),
      count: uuids.length,
      uuids: uuids.map((u) => u.id),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsCSV = () => {
    const csv = 'UUID,Generated At\n' + uuids.map((u) => `${u.id},${u.timestamp.toISOString()}`).join('\n');
    const dataBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2">🆔 UUID v4 Generator</h1>
          <p className="text-[#a6adc8]">Generate unique identifiers (UUIDv4) for your projects</p>
        </section>

        {/* Generate Section */}
        <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a] mb-8">
          <h2 className="text-xl font-semibold text-[#cdd6f4] mb-6">Generate UUIDs</h2>

          {/* Quick Generate */}
          <div className="mb-6">
            <button
              onClick={handleGenerateSingle}
              className="w-full bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] hover:from-[#f5c2e7] hover:to-[#cba6f7] text-[#1e1e2e] px-6 py-4 rounded-lg font-bold transition-all text-lg"
            >
              ➕ Generate 1 UUID
            </button>
          </div>

          {/* Batch Generate */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#cdd6f4] block">Generate Multiple UUIDs</label>
            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                className="flex-1 bg-[#1e1e2e] text-[#cdd6f4] border border-[#45475a] rounded-lg p-3 focus:border-[#cba6f7] focus:outline-none"
              />
              <button
                onClick={handleGenerate}
                className="flex-1 bg-[#a6e3a1] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Generate {count}
              </button>
            </div>
            <p className="text-xs text-[#a6adc8]">Max: 1000 UUIDs at once</p>
          </div>
        </div>

        {/* Results Section */}
        {uuids.length > 0 && (
          <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a] mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#cdd6f4]">
                Generated UUIDs <span className="text-[#cba6f7]">({uuids.length})</span>
              </h2>
              {uuids.length > 0 && (
                <button
                  onClick={copyAllToClipboard}
                  className="flex items-center gap-2 bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] px-4 py-2 rounded-lg transition-colors"
                >
                  {copied === 'all' ? <Check size={18} /> : <Copy size={18} />}
                  {copied === 'all' ? 'Copied All' : 'Copy All'}
                </button>
              )}
            </div>

            {/* UUID List */}
            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              {uuids.map((uuid) => (
                <div
                  key={uuid.id}
                  className="bg-[#1e1e2e] rounded-lg p-4 border border-[#45475a] flex items-center justify-between gap-4 hover:border-[#cba6f7] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[#cdd6f4] font-mono text-sm break-all">{uuid.id}</p>
                    <p className="text-xs text-[#a6adc8] mt-1">{uuid.timestamp.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(uuid.id, uuid.id)}
                      className="bg-[#45475a] hover:bg-[#585b70] text-[#cdd6f4] p-2 rounded transition-colors"
                      title="Copy"
                    >
                      {copied === uuid.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <button
                      onClick={() => deleteUUID(uuid.id)}
                      className="bg-[#f38ba8] hover:bg-[#f28baa] text-[#1e1e2e] p-2 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={downloadAsJSON}
                className="bg-[#89dceb] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                📥 JSON
              </button>
              <button
                onClick={downloadAsCSV}
                className="bg-[#89dceb] hover:bg-[#94e2d5] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                📊 CSV
              </button>
              <button
                onClick={copyAllToClipboard}
                className="bg-[#cba6f7] hover:bg-[#f5c2e7] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                📋 Copy All
              </button>
              <button
                onClick={clearAll}
                className="bg-[#f38ba8] hover:bg-[#f28baa] text-[#1e1e2e] px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {uuids.length === 0 && (
          <div className="bg-[#313244] rounded-2xl p-12 border border-[#45475a] text-center">
            <p className="text-[#a6adc8] text-lg">👆 Generate your first UUID to get started</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
          <h3 className="text-lg font-semibold text-[#cdd6f4] mb-4">ℹ️ About UUID v4</h3>
          <div className="text-[#a6adc8] space-y-3">
            <p>
              <span className="text-[#a6e3a1] font-semibold">UUID v4</span> is a universally unique identifier generated using random numbers. It's perfect for ensuring unique values across distributed systems.
            </p>
            <p>
              <span className="text-[#a6e3a1] font-semibold">Format:</span> A UUID consists of 32 hexadecimal digits displayed in 5 groups separated by hyphens (8-4-4-4-12).
            </p>
            <p>
              <span className="text-[#a6e3a1] font-semibold">Use cases:</span> Database primary keys, session identifiers, request IDs, message IDs, user identifiers, and more.
            </p>
            <p>
              <span className="text-[#a6e3a1] font-semibold">Probability of collision:</span> Extremely low (1 in 5.3 × 10³⁶ with 1 billion UUIDs).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
