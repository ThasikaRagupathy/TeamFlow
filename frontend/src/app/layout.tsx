import type { Metadata } from 'next';

// @ts-expect-error Next.js handles global CSS imports at build time.
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}