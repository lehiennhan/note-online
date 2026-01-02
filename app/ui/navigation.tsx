'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="bg-[#313244] border-b border-[#45475a] sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-[#cba6f7] hover:text-[#f5c2e7] transition-colors">
                        Portfolio
                    </Link>

                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg transition-colors ${pathname === '/'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                        >
                            My Profile
                        </Link>

                        <Link
                            href="/notes"
                            className={`px-4 py-2 rounded-lg transition-colors ${pathname === '/notes'
                                    ? 'bg-[#cba6f7] text-[#1e1e2e] font-semibold'
                                    : 'text-[#cdd6f4] hover:text-[#cba6f7] hover:bg-[#45475a]'
                                }`}
                        >
                            📝 Note Online
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
