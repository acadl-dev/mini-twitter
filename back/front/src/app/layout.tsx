import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/app/components/ui/theme-provider'
import Header from '@/app/components/ui/Header'

import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

const geistSans = localFont({
  src: "fonts/GeistVF.woff", // Ajuste o caminho conforme necessário
  variable: "--font-geist-sans",
  display: 'swap',
});

const geistMono = localFont({
  src: "fonts/GeistMonoVF.woff", // Ajuste o caminho conforme necessário
  variable: "--font-geist-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mini Twitter",
  description: "A Twitter-like social media platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}