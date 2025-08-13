import React, { useCallback, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const CATEGORIES = ['Food','Transport','Entertainment','Salary','Rent','Utilities','Shopping','Health','Other']

export default function TransactionForm({ initial, onSaved, disabled }) {
  const { api } = useAuth()
  const [form, setForm] = useState(initial || { type:'expense', category:'Food', amount:0, date:new Date().toISOString().slice(0,10), note:'' })
  const canSubmit = useMemo(() => !disabled && Number(form.amount) > 0, [disabled, form.amount])

  const onChange = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), [])

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    if (initial?.id) {
      await api.put(`/transactions/${initial.id}`, form)
    } else {
      await api.post('/transactions', form)
    }
    onSaved && onSaved()
  }, [api, form, canSubmit, onSaved, initial])

  return (
    <form onSubmit={onSubmit} className="card">
      <div className="row" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr'}}>
        <select className="input" value={form.type} onChange={e=>onChange('type', e.target.value)} disabled={disabled}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="input" value={form.category} onChange={e=>onChange('category', e.target.value)} disabled={disabled}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" type="number" value={form.amount} onChange={e=>onChange('amount', e.target.value)} disabled={disabled} />
        <input className="input" type="date" value={form.date} onChange={e=>onChange('date', e.target.value)} disabled={disabled} />
      </div>
      <input className="input" placeholder="Note" value={form.note} onChange={e=>onChange('note', e.target.value)} disabled={disabled} style={{marginTop:8}} />
      <button className="btn" style={{marginTop:8}} disabled={!canSubmit}>{initial?.id ? 'Update' : 'Add'} Transaction</button>
      {disabled && <p className="badge" style={{marginTop:8}}>You are read-only. Actions are disabled.</p>}
    </form>
  )
}
