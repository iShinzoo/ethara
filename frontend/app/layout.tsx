'use client';

import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/auth-context'
import { ErrorBoundary } from '@/components/common/error-boundary'
import './globals.css'
import { useState } from 'react'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            {/* Force light theme for this assessment UI */}
            <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false}>
              <AuthProvider>
                {children}
                <Toaster />
                {process.env.NODE_ENV === 'production' && <Analytics />}
              </AuthProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
