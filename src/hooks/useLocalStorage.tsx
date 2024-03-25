/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useCallback, useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLocalStorage<T = any>(key: string, defaultValue?: T) {
  const readStorage = useCallback(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(key) || String(defaultValue)) || null
      )
    } catch (error) {
      return defaultValue
    }
  }, [defaultValue, key])

  const [value, setValueState] = useState<T | null>(() => readStorage())

  const setValue = useCallback(
    (callback: (prev: T | null) => T | null) => {
      setValueState((prev) => {
        const newValue = callback(prev)
        localStorage.setItem(key, JSON.stringify(newValue))
        return newValue
      })
    },
    [key]
  )

  useEffect(() => {
    const updated = readStorage()
    setValueState(updated)
  }, [readStorage, key])

  return [value, setValue] as [T, typeof setValue]
}
