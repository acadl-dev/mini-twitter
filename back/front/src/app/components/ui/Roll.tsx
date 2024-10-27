'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface ScrollIndicatorProps {
  distanceFromFooter?: number // em pixels
}

export default function ScrollIndicator({ distanceFromFooter = 100 }: ScrollIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setShowIndicator(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div 
      className="fixed left-1/2 transform -translate-x-1/2 animate-bounce"
      style={{ bottom: `${distanceFromFooter}px` }}
    >
      <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
        <ChevronDown className="w-6 h-6" />
      </div>
      <p className="text-center mt-2 text-sm font-medium">Role para baixo</p>
    </div>
  )
}