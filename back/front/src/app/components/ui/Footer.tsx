'use client'

import Link from 'next/link'
import { Twitter, Heart, Info, Mail } from 'lucide-react'

export default function Footer(): JSX.Element {
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/about" className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <Info className="h-5 w-5" />
            <span className="sr-only">About</span>
          </Link>
          <Link href="/contact" className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Contact</span>
          </Link>
        </div>

        <div className="flex items-center justify-center flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Twitter className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">© 2023 Mini Twitter</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/terms" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}