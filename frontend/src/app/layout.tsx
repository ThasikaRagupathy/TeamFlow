import type { Metadata } from 'next';
// @ts-expect-error Next.js handles global CSS side-effect imports at build time.
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'TeamFlow | Team Project Management',
  description:
    'Organise projects, manage tasks, collaborate with your team, and track progress with TeamFlow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#080812]">
      <body className="min-h-screen bg-[#080812] text-black antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}