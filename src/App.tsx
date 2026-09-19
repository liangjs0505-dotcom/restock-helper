import { useState } from 'react'
import { GoodsProvider, useGoods } from './context/GoodsContext'
import Dashboard from './components/Dashboard'
import GoodsForm from './components/GoodsForm'
import GoodsList from './components/GoodsList'
import type { Goods } from './types'
import './App.css'

type Tab = 'dashboard' | 'entry' | 'list'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'dashboard', label: '数据看板', icon: '📊' },
  { key: 'entry', label: '货物录入', icon: '📝' },
  { key: 'list', label: '库存清单', icon: '📋' },
]

function Workspace() {
  const { stats } = useGoods()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [editing, setEditing] = useState<Goods | null>(null)

  // 从清单点击编辑：填充表单并跳到录入页
  const handleEdit = (item: Goods) => {
    setEditing(item)
    setTab('entry')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">🛒</span>
          <div>
            <h1>Treasure Family</h1>
          </div>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => {
              if (t.key !== 'entry') setEditing(null)
              setTab(t.key)
            }}
          >
            <span>{t.icon}</span>
            {t.label}
            {t.key === 'list' && stats.lowStockCount > 0 && (
              <span className="badge">{stats.lowStockCount}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'entry' && (
          <div className="card form-card">
            <h3 className="card-title">
              {editing ? '编辑货物信息' : '录入新货物'}
            </h3>
            <GoodsForm editing={editing} onDone={() => setEditing(null)} />
          </div>
        )}
        {tab === 'list' && (
          <div className="card">
            <GoodsList onEdit={handleEdit} />
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <GoodsProvider>
      <Workspace />
    </GoodsProvider>
  )
}