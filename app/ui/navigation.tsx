'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const tools = [
        { href: '/compare-text', icon: '🔍', label: 'Compare Text' },
        { href: '/encode-decode', icon: '🔐', label: 'Encode/Decode' },
        { href: '/date-converter', icon: '📅', label: 'Date Converter' },
        { href: '/date-diff', icon: '⏱️', label: 'Date Diff' },
        { href: '/uuid-generator', icon: '🆔', label: 'UUID Generator' },
        { href: '/json-formatter', icon: '📖', label: 'JSON Formatter' },
        { href: '/json-diff', icon: '⚖️', label: 'JSON Diff' },
        { href: '/csv-json-converter', icon: '🔄', label: 'CSV ↔ JSON' }
    ];

    const isToolActive = tools.some(tool => pathname === tool.href);

    return (
        <nav className="bg-[#313244] border-b border-[#45475a] sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl md:text-2xl font-bold text-[#cba6f7] hover:text-[#f5c2e7] transition-colors truncate">
                        Nhan Le
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-8">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${pathname === '/'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                        >
                            Profile
                        </Link>

                        <Link
                            href="/notes"
                            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${pathname === '/notes'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                        >
                            📝 Note Online
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="relative group">
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${isToolActive
                                        ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                        : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                    }`}
                            >
                                🛠️ Tools
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>

                            {/* Dropdown Content */}
                            <div className="absolute left-0 mt-0 w-48 bg-[#1e1e2e] border border-[#45475a] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        className={`block px-4 py-2 transition-colors ${pathname === tool.href
                                                ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                                : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                            }`}
                                    >
                                        {tool.icon} {tool.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-[#45475a] pt-4 space-y-2">
                        <Link
                            href="/"
                            className={`block px-4 py-2 rounded-lg transition-colors ${pathname === '/'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            My Profile
                        </Link>

                        <Link
                            href="/notes"
                            className={`block px-4 py-2 rounded-lg transition-colors ${pathname === '/notes'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            📝 Note Online
                        </Link>

                        {/* Mobile Dropdown Toggle */}
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${isToolActive
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                        >
                            🛠️ Tools
                            <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>

                        {/* Mobile Tools List */}
                        {isDropdownOpen && (
                            <div className="pl-4 space-y-2 mt-2 border-l-2 border-[#45475a]">
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        className={`block px-4 py-2 rounded-lg transition-colors ${pathname === tool.href
                                                ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                                : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                            }`}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {tool.icon} {tool.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
