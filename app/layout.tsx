import '@/app/ui/global.css';
import LayoutClient from '@/app/ui/layout-client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#1e1e2e] text-[#cdd6f4]">
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
