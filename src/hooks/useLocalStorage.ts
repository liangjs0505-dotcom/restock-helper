import { useState, useEffect } from 'react'

/**
 * 与 localStorage 同步的状态 Hook
 * @param key 存储键
 * @param initialValue 初始值
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 存储失败静默处理（如超出配额）
    }
  }, [key, value])

  return [value, setValue] as const
}