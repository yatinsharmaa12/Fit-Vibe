import { ThemeProvider } from '@/components/dashboard/theme-provider';
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
      {children}
    </ThemeProvider>
  );
}
