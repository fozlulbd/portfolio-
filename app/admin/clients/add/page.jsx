'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AddClientPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    project: '', status: 'pending', notes: ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error } = await supabase.from('clients').insert([{ ...form, source: 'manual' }])

    if (error) {
      setError(error.message.includes('duplicate') ? 'এই ইমেইল দিয়ে আগে থেকেই একটা client আছে।' : error.message)
      setSaving(false)
      return
    }

    router.push('/admin/clients')
  }

  return (
    <div style={{ padding: '30px 24px', maxWidth: 600 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Add Client</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: 14,
        background: '#fff', padding: 24, borderRadius: 10
      }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Name *</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email *</label>
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Company</label>
          <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Project Name</label>
          <input value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }} />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd', minHeight: 70 }} />
        </div>

        {error && <p style={{ color: '#d32f2f', fontSize: 13 }}>{error}</p>}

        <button type="submit" disabled={saving} style={{
          background: '#d32f2f', color: '#fff', border: 'none', padding: 12,
          borderRadius: 6, fontWeight: 600, cursor: 'pointer'
        }}>
          {saving ? 'Saving...' : 'Add Client'}
        </button>
      </form>
    </div>
  )
}
