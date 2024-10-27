'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/app/components/ui/button'
import { Moon, Sun, Twitter, User, Users, Home } from 'lucide-react'

export default function Header(): JSX.Element {
  const [mounted, setMounted] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()  

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <Home className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <Link href="/friends" className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <Users className="h-6 w-6" />
            <span className="sr-only">Friends</span>
          </Link>
          <Link href="/profile" className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            <User className="h-6 w-6" />
            <span className="sr-only">Profile</span>
          </Link>
        </div>

        <div className="flex items-center justify-center flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Twitter className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Mini Twitter</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && (
              theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}