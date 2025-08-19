'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (!mounted) {
      return <Monitor className="h-5 w-5" />
    }
    
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getLabel = () => {
    if (!mounted) {
      return 'सिस्टम मोड'
    }
    
    switch (theme) {
      case 'light':
        return 'लाइट मोड'
      case 'dark':
        return 'डार्क मोड'
      default:
        return 'सिस्टम मोड'
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        title={`वर्तमान थीम: ${getLabel()}`}
      >
        {getIcon()}
        <span className="hidden sm:inline-block text-sm font-medium">
          {getLabel()}
        </span>
      </Button>
    </div>
  )
}

// Simplified version for mobile/compact spaces
export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (!mounted) {
      return <Monitor className="h-4 w-4" />
    }
    
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
      title={`थीम बदलें`}
    >
      {getIcon()}
    </Button>
  )
}