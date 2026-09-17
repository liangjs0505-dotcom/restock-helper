import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Category, Goods, GoodsFormData, GoodsStats } from '../types'

const STORAGE_KEY = 'supermarket_goods'

interface GoodsContextValue {
  goods: Goods[]
  stats: GoodsStats
  categoryStats: { category: Category; count: number; value: number }[]
  addGoods: (data: GoodsFormData) => void
  updateGoods: (id: string, data: GoodsFormData) => void
  removeGoods: (id: string) => void
  clearAll: () => void
  isLowStock: (g: Goods) => boolean
  isOutOfStock: (g: Goods) => boolean
}

const GoodsContext = createContext<GoodsContextValue | null>(null)

const genId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const isLowStock = (g: Goods) =>g.threshold > 0 && g.stock <= g.threshold
// 缺货:库存为 0,比低库存更严重
const isOutOfStock = (g: Goods) => g.stock <= 0

export function GoodsProvider({ children }: { children: ReactNode }) {
  const [goods, setGoods] = useLocalStorage<Goods[]>(STORAGE_KEY, [])

  const addGoods = useCallback(
    (data: GoodsFormData) => {
      const item: Goods = { ...data, id: genId(), createdAt: Date.now() }
      setGoods((prev) => [item, ...prev])
    },
    [setGoods],
  )

  const updateGoods = useCallback(
    (id: string, data: GoodsFormData) => {
      setGoods((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)))
    },
    [setGoods],
  )

  const removeGoods = useCallback(
    (id: string) => setGoods((prev) => prev.filter((g) => g.id !== id)),
    [setGoods],
  )

  const clearAll = useCallback(() => setGoods([]), [setGoods])

  // 全局统计
  const stats = useMemo<GoodsStats>(() => {
    return goods.reduce(
      (acc, g) => {
        acc.totalStock += g.stock
        acc.totalValue += g.price * g.stock
        if (isLowStock(g)) acc.lowStockCount += 1
        return acc
      },
      { totalKinds: goods.length, totalStock: 0, totalValue: 0, lowStockCount: 0 },
    )
  }, [goods])

  // 按分类聚合
  const categoryStats = useMemo(() => {
    const map = new Map<Category, { count: number; value: number }>()
    for (const g of goods) {
      const cur = map.get(g.category) ?? { count: 0, value: 0 }
      cur.count += 1
      cur.value += g.price * g.stock
      map.set(g.category, cur)
    }
    return Array.from(map, ([category, v]) => ({ category, ...v })).sort(
      (a, b) => b.value - a.value,
   )
  }, [goods])

  const value = useMemo(
    () => ({
      goods,
      stats,
      categoryStats,
      addGoods,
      updateGoods,
      removeGoods,
      clearAll,
      isLowStock,
      isOutOfStock,
    }),
    [goods, stats, categoryStats, addGoods, updateGoods, removeGoods, clearAll],
  )

  return <GoodsContext.Provider value={value}>{children}</GoodsContext.Provider>
}

/** 获取货物全局状态 */
export function useGoods() {
  const ctx = useContext(GoodsContext)
  if (!ctx) throw new Error('useGoods 必须在 GoodsProvider 内部使用')
  return ctx
}