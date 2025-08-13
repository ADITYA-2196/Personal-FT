import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Line, Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement)

export default function Dashboard() {
  const { api, user } = useAuth()
  const [overview, setOverview] = useState({ totalIncome:0, totalExpense:0, balance:0 })
  const [cats, setCats] = useState([])
  const [trends, setTrends] = useState([])

  useEffect(() => {
    (async () => {
      const o = await api.get('/analytics/overview'); setOverview(o.data)
      const c = await api.get('/analytics/categories'); setCats(c.data)
      const t = await api.get('/analytics/trends'); setTrends(t.data)
    })()
  }, [api])

  const pieData = useMemo(() => ({
    labels: cats.map(c => c.category),
    datasets: [{ data: cats.map(c => c.expense) }]
  }), [cats])

  const lineData = useMemo(() => ({
    labels: Array.from({length:12}, (_,i)=>i+1),
    datasets: [
      { label: 'Income', data: Array.from({length:12}, (_,i)=> trends.find(t=>t.month===i+1)?.income || 0) },
      { label: 'Expense', data: Array.from({length:12}, (_,i)=> trends.find(t=>t.month===i+1)?.expense || 0) }
    ]
  }), [trends])

  const barData = useMemo(() => ({
    labels: ['Income','Expense'],
    datasets: [{ data: [overview.totalIncome, overview.totalExpense] }]
  }), [overview])

  return (
    <div className="row">
      <div className="card">
        <h3>Overview</h3>
        <p>Total Income: ₹{overview.totalIncome.toFixed(2)}</p>
        <p>Total Expense: ₹{overview.totalExpense.toFixed(2)}</p>
        <p>Balance: ₹{overview.balance.toFixed(2)}</p>
        <p className="badge">All roles can view. Read-only cannot modify data.</p>
      </div>
      <div className="card">
        <h3>Category Distribution</h3>
        <Pie data={pieData} />
      </div>
      <div className="card">
        <h3>Monthly Trends</h3>
        <Line data={lineData} />
      </div>
      <div className="card">
        <h3>Income vs Expenses</h3>
        <Bar data={barData} />
      </div>
    </div>
  )
}
