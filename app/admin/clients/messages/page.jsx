'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ClientMessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [replyDrafts, setReplyDrafts] = useState({})

  const loadMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setMessages(data)
    setLoading(false)
  }

  useEffect(() => { loadMessages() }, [])

  const sendReply = async (id) => {
    const replyText = replyDrafts[id]
    if (!replyText || !replyText.trim()) return

    const { error } = await supabase
      .from('messages')
      .update({ reply: replyText.trim(), status: 'replied', replied_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      alert('Reply failed: ' + error.message)
      return
    }
    setReplyDrafts(prev => ({ ...prev, [id]: '' }))
    loadMessages()
  }

  const deleteMessage = async (id) => {
    if (!confirm('মেসেজটা ডিলিট করবেন?')) return
    await supabase.from('messages').delete().eq('id', id)
    loadMessages()
  }

  const filtered = messages.filter(m => {
    if (filter === 'all') return true
    return m.status === filter
  })

  const newCount = messages.filter(m => m.status === 'new').length

  return (
    <div style={{ padding: '30px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          Client Messages {newCount > 0 && (
            <span style={{
              background: '#d32f2f', color: '#fff', fontSize: 12, padding: '2px 10px',
              borderRadius: 20, marginLeft: 10, verticalAlign: 'middle'
            }}>{newCount} new</span>
          )}
        </h1>

        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'new', 'replied'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filter === f ? '#d32f2f' : '#e0e0e0',
              color: filter === f ? '#fff' : '#333', fontSize: 13, fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#777' }}>কোনো মেসেজ নেই।</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(m => (
            <div key={m.id} style={{
              background: '#fff', borderRadius: 10, padding: 18,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${m.status === 'new' ? '#d32f2f' : '#2e7d32'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <strong>{m.name}</strong>{' '}
                  <span style={{ color: '#777', fontSize: 13 }}>({m.email})</span>
                </div>
                <span style={{ color: '#999', fontSize: 12 }}>
                  {new Date(m.created_at).toLocaleString('en-GB')}
                </span>
              </div>

              <p style={{ background: '#f4f4f4', padding: 10, borderRadius: 6, fontSize: 14, marginBottom: 10 }}>
                {m.message}
              </p>

              {m.status === 'replied' && m.reply && (
                <p style={{
                  background: '#e8f5e9', padding: 10, borderRadius: 6, fontSize: 14,
                  color: '#2e7d32', marginBottom: 10
                }}>
                  <strong>আপনার রিপ্লাই:</strong> {m.reply}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="রিপ্লাই লিখুন..."
                  value={replyDrafts[m.id] ?? ''}
                  onChange={e => setReplyDrafts(prev => ({ ...prev, [m.id]: e.target.value }))}
                  style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                />
                <button onClick={() => sendReply(m.id)} style={{
                  background: '#1976d2', color: '#fff', border: 'none',
                  padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13
                }}>
                  Reply
                </button>
                <button onClick={() => deleteMessage(m.id)} style={{
                  background: '#d32f2f', color: '#fff', border: 'none',
                  padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
