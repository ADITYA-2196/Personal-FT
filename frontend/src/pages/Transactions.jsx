import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import { useAuth } from '../context/AuthContext.jsx'
import TransactionForm from '../components/TransactionForm.jsx'

export default function Transactions() {
  const { api, user } = useAuth()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({ page:1, limit:20, q:'', type:'', category:'', sort:'date_desc' })
  const [editing, setEditing] = useState(null)

  const canEdit = user?.role !== 'read-only'

  const fetchData = useCallback(async () => {
    const { data } = await api.get('/transactions', { params: query })
    setItems(data.items); setTotal(data.total)
  }, [api, query])

  useEffect(() => { fetchData() }, [fetchData])

  const onSaved = useCallback(() => { setEditing(null); fetchData() }, [fetchData])

  const Row = ({ index, style }) => {
    const tx = items[index]
    return (
      <div style={{...style, display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', padding:'0 .5rem', alignItems:'center', borderBottom:'1px solid #1f2937'}}>
        <div>{tx.date}</div>
        <div>{tx.type}</div>
        <div>{tx.category}</div>
        <div>₹{Number(tx.amount).toFixed(2)}</div>
        <div style={{display:'flex', gap:6, justifyContent:'flex-end'}}>
          <button className="btn" onClick={() => setEditing(tx)} disabled={!canEdit}>Edit</button>
          <button className="btn" onClick={async () => { await api.delete(`/transactions/${tx.id}`); fetchData() }} disabled={!canEdit}>Delete</button>
        </div>
      </div>
    )
  }

  const pageCount = Math.ceil(total / query.limit)

  return (
    <div className="card">
      <h2>Transactions</h2>
      <div className="row" style={{gridTemplateColumns:'2fr 1fr'}}>
        <div>
          <div className="row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', marginBottom:8}}>
            <input className="input" placeholder="Search note..." value={query.q} onChange={e=>setQuery(q=>({...q, q:e.target.value, page:1}))} />
            <select className="input" value={query.type} onChange={e=>setQuery(q=>({...q, type:e.target.value, page:1}))}>
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input className="input" placeholder="Category (e.g., Food)" value={query.category} onChange={e=>setQuery(q=>({...q, category:e.target.value, page:1}))} />
            <select className="input" value={query.sort} onChange={e=>setQuery(q=>({...q, sort:e.target.value}))}>
              <option value="date_desc">Date ↓</option>
              <option value="date_asc">Date ↑</option>
              <option value="amount_desc">Amount ↓</option>
              <option value="amount_asc">Amount ↑</option>
            </select>
            <select className="input" value={query.limit} onChange={e=>setQuery(q=>({...q, limit:Number(e.target.value), page:1}))}>
              <option>10</option><option>20</option><option>50</option><option>100</option>
            </select>
          </div>
          <div style={{height:400, border:'1px solid #1f2937', borderRadius:8}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', padding:'0 .5rem', fontWeight:'bold', borderBottom:'1px solid #1f2937'}}>
              <div>Date</div><div>Type</div><div>Category</div><div>Amount</div><div style={{textAlign:'right'}}>Actions</div>
            </div>
            <List height={360} itemCount={items.length} itemSize={44} width={'100%'}>
              {Row}
            </List>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
            <div>Page {query.page} / {pageCount || 1}</div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn" onClick={()=>setQuery(q=>({...q, page: Math.max(1, q.page-1)}))} disabled={query.page<=1}>Prev</button>
              <button className="btn" onClick={()=>setQuery(q=>({...q, page: Math.min(pageCount, q.page+1)}))} disabled={query.page>=pageCount}>Next</button>
            </div>
          </div>
        </div>
        <div>
          <TransactionForm initial={editing} onSaved={onSaved} disabled={!canEdit} />
        </div>
      </div>
    </div>
  )
}
