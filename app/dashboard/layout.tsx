import { ThemeProvider } from '@/components/dashboard/theme-provider';
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FitVibe',
  description: 'FitVibe dashboard',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-black text-white">
        <DashboardNavbar />
        {children}
      </div>
    </ThemeProvider>
  );
}
