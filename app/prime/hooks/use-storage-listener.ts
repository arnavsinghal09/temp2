"use client"

import { useEffect, useState } from "react"

export function useStorageListener(key: string) {
  const [value, setValue] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState(Date.now())

  useEffect(() => {
    // Get initial value
    const initialValue = localStorage.getItem(key)
    setValue(initialValue)

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue)
        setTimestamp(Date.now())
      }
    }

    // Listen for custom events (same tab changes)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setValue(e.detail.newValue)
        setTimestamp(Date.now())
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('customStorageChange', handleCustomStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('customStorageChange', handleCustomStorageChange as EventListener)
    }
  }, [key])

  return { value, timestamp }
}

// Helper function to dispatch custom storage events
export function dispatchStorageChange(key: string, newValue: string | null) {
  const event = new CustomEvent('customStorageChange', {
    detail: { key, newValue }
  })
  window.dispatchEvent(event)
}
