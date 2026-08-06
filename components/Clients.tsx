'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type ClientStatus = 'active' | 'completed' | 'pending';

const STATUS_COLORS = {
  active: { bg: '#e8f5e9', text: '#2e7d32' },
  completed: { bg: '#e3f2fd', text: '#1976d2' },
  pending: { bg: '#fff3e0', text: '#e65100' },
}

export default function ClientsList({ statusFilter, title }: { statusFilter?: string, title: string }) {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadClients = async () => {
    setLoading(true)
    let query = supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (statusFilter) query = query.eq('status', statusFilter)
    const { data, error } = await query
    if (!error) setClients(data)
    setLoading(false)
  }

  useEffect(() => { loadClients() }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('clients').update({ status }).eq('id', id)
    if (error) alert('Update failed: ' + error.message)
    loadClients()
  }

  const deleteClient = async (id: string) => {
    if (!confirm('এই client ডিলিট করবেন?')) return
    await supabase.from('clients').delete().eq('id', id)
    loadClients()
  }

  const filtered = clients.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '30px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{title}</h1>
        <Link href="/admin/clients/add" style={{
          background: '#d32f2f', color: '#fff', padding: '10px 18px',
          borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600
        }}>
          + Add Client
        </Link>
      </div>

      <input
        placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', maxWidth: 320, padding: 10, borderRadius: 6,
          border: '1px solid #ddd', marginBottom: 20
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#777' }}>কোনো client পাওয়া যায়নি।</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10 }}>
            <thead>
              <tr style={{ background: '#000', color: '#fff' }}>
                {['Name', 'Email', 'Country', 'Device', 'Status', 'Source', 'Actions'].map(h => (
                  <th key={h} style={{ padding: 10, textAlign: 'left', fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const color = STATUS_COLORS[c.status as ClientStatus] || STATUS_COLORS.pending
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 10, fontSize: 13 }}>
                      <Link href={`/admin/clients/${c.id}`} style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>
                        {c.name}
                      </Link>
                    </td>
                    <td style={{ padding: 10, fontSize: 13 }}>{c.email}</td>
                    <td style={{ padding: 10, fontSize: 13 }}>{c.country || '—'}</td>
                    <td style={{ padding: 10, fontSize: 13 }}>{c.device || '—'}</td>
                    <td style={{ padding: 10 }}>
                      <select
                        value={c.status}
                        onChange={e => updateStatus(c.id, e.target.value)}
                        style={{
                          background: color.bg, color: color.text, border: 'none',
                          borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ padding: 10, fontSize: 12, color: '#999' }}>{c.source || 'manual'}</td>
                    <td style={{ padding: 10 }}>
                      <button onClick={() => deleteClient(c.id)} style={{
                        background: '#d32f2f', color: '#fff', border: 'none',
                        padding: '5px 12px', borderRadius: 5, cursor: 'pointer', fontSize: 12
                      }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}