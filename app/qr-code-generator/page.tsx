'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, Smartphone } from 'lucide-react';

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    
    // Attempting to download SVG as PNG by rendering to canvas first
    const svgElements = qrRef.current.getElementsByTagName('svg');
    if (svgElements.length === 0) return;
    const svgElement = svgElements[0];
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const resetSettings = () => {
    setSize(256);
    setFgColor('#000000');
    setBgColor('#ffffff');
    setQrLevel('M');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#313244] to-[#1e1e2e] py-12 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <section className="mb-8 w-full text-center">
          <h1 className="text-4xl font-bold text-[#cdd6f4] mb-2 flex items-center justify-center gap-2">
            <Smartphone className="text-[#cba6f7]" size={36} /> QR Code Generator
          </h1>
          <p className="text-[#a6adc8]">Create and customize QR codes for links, text, or emails.</p>
        </section>

        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* Settings Column */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {/* Input Section */}
            <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
              <h2 className="text-xl font-semibold text-[#cdd6f4] mb-4">Content</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL or text here..."
                rows={4}
                className="w-full bg-[#1e1e2e] border border-[#45475a] rounded-lg p-4 text-[#cdd6f4] focus:outline-none focus:border-[#cba6f7] transition-colors resize-none"
              />
            </div>

            {/* Customization Section */}
            <div className="bg-[#313244] rounded-2xl p-6 border border-[#45475a] flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#cdd6f4]">Customization</h2>
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-1 text-[#f38ba8] hover:text-[#f28baa] text-sm font-semibold transition-colors"
                  title="Reset Settings"
                >
                  <RefreshCw size={16} /> Reset
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-[#cdd6f4]">
                    <label>Size (px)</label>
                    <span className="text-[#a6adc8]">{size}x{size}</span>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#1e1e2e] rounded-lg appearance-none cursor-pointer accent-[#cba6f7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#cdd6f4] block mb-2">Foreground</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                      />
                      <span className="text-xs text-[#a6adc8] font-mono">{fgColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#cdd6f4] block mb-2">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 border-0 bg-transparent rounded cursor-pointer"
                      />
                      <span className="text-xs text-[#a6adc8] font-mono">{bgColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#cdd6f4] block mb-2">Error Correction Level</label>
                  <div className="flex bg-[#1e1e2e] rounded-lg border border-[#45475a] p-1">
                    {['L', 'M', 'Q', 'H'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setQrLevel(level as 'L' | 'M' | 'Q' | 'H')}
                        className={`flex-1 py-2 text-sm rounded transition-colors ${
                          qrLevel === level
                            ? 'bg-[#cba6f7] text-[#1e1e2e] font-bold'
                            : 'text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="bg-[#313244] rounded-2xl p-8 border border-[#45475a] flex flex-col items-center justify-center flex-1 min-h-[400px]">
              <h2 className="text-xl font-semibold text-[#cdd6f4] mb-8 w-full text-center">Preview</h2>
              <div 
                ref={qrRef} 
                className="bg-white p-4 rounded-xl shadow-lg border border-[#cba6f7]/30 transition-all"
                style={{ backgroundColor: bgColor }}
              >
                {text ? (
                  <QRCodeSVG
                    value={text}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={qrLevel}
                    includeMargin={false}
                  />
                ) : (
                  <div 
                    style={{ width: size, height: size }} 
                    className="flex items-center justify-center border-2 border-dashed border-[#a6adc8] text-[#a6adc8] text-sm text-center p-4 rounded-lg"
                  >
                    Enter text to generate QR code
                  </div>
                )}
              </div>
              
              <button
                onClick={downloadQRCode}
                disabled={!text}
                className="mt-10 px-8 py-4 bg-gradient-to-r from-[#8bd5ca] to-[#a6e3a1] hover:from-[#a6e3a1] hover:to-[#8bd5ca] text-[#1e1e2e] rounded-lg font-bold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-[280px]"
              >
                <Download size={22} />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 w-full bg-[#313244] rounded-2xl p-6 border border-[#45475a]">
          <h3 className="text-lg font-semibold text-[#cdd6f4] mb-3">ℹ️ Error Correction Levels</h3>
          <ul className="text-[#a6adc8] text-sm space-y-2 grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <li><span className="text-[#a6e3a1] font-semibold">L (Low):</span> 7% of data can be restored. Ideal for simple URLs to keep the QR code less dense.</li>
            <li><span className="text-[#a6e3a1] font-semibold">M (Medium):</span> 15% of data can be restored. Good default balance between size and reliability.</li>
            <li><span className="text-[#f5c2e7] font-semibold">Q (Quartile):</span> 25% of data can be restored. For somewhat compromised environments.</li>
            <li><span className="text-[#f38ba8] font-semibold">H (High):</span> 30% of data can be restored. Best for adding logos over the QR code or harsh environments.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
