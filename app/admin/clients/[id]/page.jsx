'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

const STATUS_COLORS = {
  active: { bg: '#e8f5e9', text: '#2e7d32' },
  completed: { bg: '#e3f2fd', text: '#1976d2' },
  pending: { bg: '#fff3e0', text: '#e65100' },
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyDrafts, setReplyDrafts] = useState({})

  const load = async () => {
    setLoading(true)
    const { data: clientData, error: clientErr } = await supabase
      .from('clients').select('*').eq('id', id).single()

    if (clientErr || !clientData) {
      setLoading(false)
      return
    }
    setClient(clientData)

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('email', clientData.email)
      .order('created_at', { ascending: true })
    setMessages(msgs || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const sendReply = async (msgId) => {
    const replyText = replyDrafts[msgId]
    if (!replyText?.trim()) return
    await supabase.from('messages').update({
      reply: replyText.trim(), status: 'replied', replied_at: new Date().toISOString()
    }).eq('id', msgId)
    setReplyDrafts(prev => ({ ...prev, [msgId]: '' }))
    load()
  }

  const updateStatus = async (status) => {
    await supabase.from('clients').update({ status }).eq('id', id)
    load()
  }

  const deleteClient = async () => {
    if (!confirm('এই client পুরোপুরি ডিলিট করবেন?')) return
    await supabase.from('clients').delete().eq('id', id)
    router.push('/admin/clients')
  }

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>
  if (!client) return <div style={{ padding: 30 }}>Client পাওয়া যায়নি।</div>

  const color = STATUS_COLORS[client.status] || STATUS_COLORS.pending

  return (
    <div style={{ padding: '30px 24px', maxWidth: 900 }}>
      <Link href="/admin/clients" style={{ fontSize: 13, color: '#1976d2', textDecoration: 'none' }}>
        ← All Clients এ ফিরে যান
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>{client.name}</h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={client.status}
            onChange={e => updateStatus(e.target.value)}
            style={{
              background: color.bg, color: color.text, border: 'none',
              borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600
            }}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={deleteClient} style={{
            background: '#d32f2f', color: '#fff', border: 'none',
            padding: '7px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13
          }}>
            Delete
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div style={{
        background: '#fff', borderRadius: 10, padding: 20, marginBottom: 20,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14
      }}>
        <Info label="Email" value={client.email} />
        <Info label="Phone" value={client.phone} />
        <Info label="Company" value={client.company} />
        <Info label="Project" value={client.project} />
        <Info label="Address" value={client.address} />
        <Info label="Source" value={client.source} />
        <Info label="Landed From" value={client.page_source} />
        <Info label="Joined" value={client.created_at ? new Date(client.created_at).toLocaleString('en-GB') : '—'} />
      </div>

      {/* Location + Device card */}
      <div style={{
        background: '#fff', borderRadius: 10, padding: 20, marginBottom: 20
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📍 Visitor Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <Info label="Country" value={client.country} />
          <Info label="City" value={client.city} />
          <Info label="IP Address" value={client.ip_address} />
          <Info label="Device" value={client.device} />
          <Info label="Browser" value={client.browser} />
          <Info label="OS" value={client.os} />
        </div>
      </div>

      {/* Chat history */}
      <div style={{ background: '#fff', borderRadius: 10, padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>💬 Chat History</h3>
        {messages.length === 0 ? (
          <p style={{ color: '#777', fontSize: 13 }}>কোনো মেসেজ নেই।</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(m => (
              <div key={m.id} style={{ borderBottom: '1px solid #eee', paddingBottom: 12 }}>
                <p style={{ background: '#f4f4f4', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 6 }}>
                  {m.message}
                </p>
                {m.reply && (
                  <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: 10, borderRadius: 6, fontSize: 13, marginBottom: 8 }}>
                    <strong>Reply:</strong> {m.reply}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    placeholder="নতুন রিপ্লাই..."
                    value={replyDrafts[m.id] ?? ''}
                    onChange={e => setReplyDrafts(prev => ({ ...prev, [m.id]: e.target.value }))}
                    style={{ flex: 1, padding: 7, borderRadius: 6, border: '1px solid #ddd', fontSize: 13 }}
                  />
                  <button onClick={() => sendReply(m.id)} style={{
                    background: '#1976d2', color: '#fff', border: 'none',
                    padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12
                  }}>
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value || '—'}</div>
    </div>
  )
}
