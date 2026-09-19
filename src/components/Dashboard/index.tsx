import { useGoods } from '../../context/GoodsContext'
import './index.scss'

const yuan = (n: number) => `¥${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function Dashboard() {
  const { goods, stats, categoryStats, isLowStock } = useGoods()
  const maxValue = categoryStats[0]?.value || 1
  const lowStockGoods = goods.filter(isLowStock)

  const cards = [
    { label: '货物种类', value: stats.totalKinds, icon: '📦', accent: 'blue' },
    { label: '库存总量', value: stats.totalStock, icon: '🗂️', accent: 'green' },
    { label: '库存总价值', value: yuan(stats.totalValue), icon: '💰', accent: 'gold' },
    { label: '低库存预警', value: stats.lowStockCount, icon: '⚠️', accent: 'red' },
  ]

  return (
    <div className="dashboard">
      <div className="stat-cards">
        {cards.map((c) => (
          <div key={c.label} className={`stat-card ${c.accent}`}>
            <span className="stat-icon">{c.icon}</span>
            <div className="stat-body">
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">分类库存价值</h3>
          {categoryStats.length === 0 ? (
            <p className="empty">暂无数据</p>
          ) : (
            <ul className="bar-list">
              {categoryStats.map((c) => (
                <li key={c.category}>
                  <div className="bar-head">
                    <span>{c.category}</span>
                    <span className="bar-count">
                      {c.count} 种 · {yuan(c.value)}
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(c.value / maxValue) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="card-title">
            补货提醒
            {lowStockGoods.length > 0 && (
              <span className="badge">{lowStockGoods.length}</span>
            )}
          </h3>
          {lowStockGoods.length === 0 ? (
            <p className="empty">库存充足，暂无预警 ✅</p>
          ) : (
            <ul className="alert-list">
              {lowStockGoods.map((g) => (
                <li key={g.id}>
                  <span className="alert-name">{g.name}</span>
                  <span className="alert-stock">
                    剩 {g.stock}
                    {g.unit} / 阈值 {g.threshold}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
