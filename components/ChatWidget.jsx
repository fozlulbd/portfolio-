'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { detectDevice, detectLocation } from './visitorInfo'

const FALLBACK_REPLY = "Thanks for reaching out! We'll get back to you shortly (usually within 24 hours). 😊"
const GREETING = "Hello! 👋 Welcome to SEVENXP! I'm Zara, your AI Assistant. Have a question or need help? Just fill out the short form below, and I'll be here to assist you."

// Update these to match your real numbers / email if they ever change.
const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=8801939828993&text=Hi%21+I+want+to+discuss+a+project+with+SevenXP.+Can+we+talk%3F&type=phone_number&app_absent=0'
const EMAIL_ADDRESS = 'fozlulhoqueinfo@gmail.com'

function getSessionId() {
  let id = localStorage.getItem('sevenxp_chat_session')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('sevenxp_chat_session', id)
  }
  return id
}

async function getAIReply(message, name) {
  try {
    const res = await fetch('/api/chat/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, name }),
    })
    const data = await res.json()
    return data.reply || FALLBACK_REPLY
  } catch {
    return FALLBACK_REPLY
  }
}

// Small pair of quick-contact buttons shown under AI replies.
// WhatsApp opens a pre-filled chat, Email opens the visitor's default mail app.
function ContactButtons() {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 6 }}>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#25D366', color: '#fff', textDecoration: 'none',
          padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
          boxShadow: '0 2px 8px rgba(37,211,102,0.35)',
        }}
      >
        <span style={{ fontSize: 14 }}>💬</span> WhatsApp
      </a>
      <a
        href={`mailto:${EMAIL_ADDRESS}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#2a2a2a', color: '#fff', textDecoration: 'none',
          padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
          border: '1px solid #3a3a3a',
        }}
      >
        <span style={{ fontSize: 14 }}>✉️</span> Email
      </a>
    </div>
  )
}

// pageSource: 'home' | 'product'
export default function ChatWidget({ pageSource = 'home' }) {
  const [open, setOpen] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const [profile, setProfile] = useState(null) // { name, email }
  const [formStep, setFormStep] = useState(true) // show inline form until submitted
  const [form, setForm] = useState({ firstName: '', email: '', address: '', message: '' })
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [aiTyping, setAiTyping] = useState(false)
  const bottomRef = useRef(null)
  const sessionId = useRef(null)

  useEffect(() => {
    sessionId.current = getSessionId()
    const savedProfile = localStorage.getItem('sevenxp_chat_profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
      setFormStep(false)
    }

    // Auto-open with a greeting the first time a visitor lands (only if no profile yet)
    if (!savedProfile) {
      const timer = setTimeout(() => {
        setOpen(true)
        setGreeted(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  const loadMessages = async () => {
    if (!sessionId.current) return
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId.current)
      .order('created_at', { ascending: true })
    if (!error) setMessages(data)
  }

  useEffect(() => {
    if (!open || !profile || formStep) return
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [open, profile, formStep])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, aiTyping])

  // Ensure this visitor exists in the `clients` table (auto-client-on-message)
  const submitForm = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.email.trim() || !form.message.trim()) return

    const p = { name: form.firstName.trim(), email: form.email.trim() }
    const messageText = form.message.trim()
    localStorage.setItem('sevenxp_chat_profile', JSON.stringify(p))

    const device = detectDevice()
    const location = await detectLocation()

    // Create (or find) the client with full tracking info
    const { data: existing } = await supabase
      .from('clients').select('id').eq('email', p.email).maybeSingle()

    if (!existing) {
      await supabase.from('clients').insert([{
        name: p.name,
        email: p.email,
        address: form.address.trim() || null,
        status: 'pending',
        source: 'message',
        page_source: pageSource,
        first_message: messageText,
        ip_address: location.ip,
        country: location.country,
        city: location.city,
        device: device.device,
        browser: device.browser,
        os: device.os,
      }])
    }

    setProfile(p)
    setFormStep(false)

    // Insert the message first (no reply yet), then let the AI generate one
    // so the widget can show messages instantly without waiting for the AI call.
    const { data: inserted } = await supabase.from('messages').insert([{
      session_id: sessionId.current,
      name: p.name,
      email: p.email,
      message: messageText,
      reply: null,
      status: 'new',
    }]).select().single()

    loadMessages()
    setAiTyping(true)
    const reply = await getAIReply(messageText, p.name)
    if (inserted) {
      await supabase.from('messages').update({ reply, status: 'replied', replied_at: new Date().toISOString() }).eq('id', inserted.id)
    }
    setAiTyping(false)
    loadMessages()
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const messageText = text.trim()
    setText('')

    const { data: inserted, error } = await supabase.from('messages').insert([{
      session_id: sessionId.current,
      name: profile.name,
      email: profile.email,
      message: messageText,
      reply: null,
      status: 'new',
    }]).select().single()

    loadMessages()
    setSending(false)

    if (!error && inserted) {
      setAiTyping(true)
      const reply = await getAIReply(messageText, profile.name)
      await supabase.from('messages').update({ reply, status: 'replied', replied_at: new Date().toISOString() }).eq('id', inserted.id)
      setAiTyping(false)
      loadMessages()
    }
  }

  const Avatar = () => (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.3)'
    }}>
      <img src="/chatbot-avatar.webp" alt="Zara" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  )

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, fontFamily: 'inherit' }}>
      {open ? (
        <div style={{
          width: 320, height: 460, background: '#161616', borderRadius: 14,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #2a2a2a'
        }}>
          {/* Header */}
          <div style={{
            background: '#d32f2f', color: '#fff', padding: '12px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Zara</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>SEVENXP Assistant</div>
              </div>
            </div>
            <span onClick={() => setOpen(false)} style={{ cursor: 'pointer', fontSize: 18 }}>✕</span>
          </div>

          {formStep ? (
            <form onSubmit={submitForm} style={{
              flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto'
            }}>
              {greeted && (
                <div style={{
                  background: '#2a2a2a', color: '#eee', padding: '10px 12px',
                  borderRadius: '10px 10px 10px 2px', fontSize: 13, marginBottom: 4
                }}>
                  {GREETING}
                </div>
              )}

              <input
                placeholder="Your Name" required value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#0d0d0d', color: '#fff', fontSize: 13 }}
              />
              <input
                type="email" placeholder="Email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#0d0d0d', color: '#fff', fontSize: 13 }}
              />
              <input
                placeholder="Address (Optional)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#0d0d0d', color: '#fff', fontSize: 13 }}
              />
              <textarea
                placeholder="What would you like to know?" required value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ padding: 10, borderRadius: 6, border: '1px solid #333', background: '#0d0d0d', color: '#fff', fontSize: 13, minHeight: 60 }}
              />
              <button type="submit" style={{
                background: '#d32f2f', color: '#fff', border: 'none', padding: 11,
                borderRadius: 6, fontWeight: 600, cursor: 'pointer'
              }}>
                Send
              </button>
            </form>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map(m => (
                  <div key={m.id}>
                    <div style={{
                      alignSelf: 'flex-end', background: '#d32f2f', color: '#fff',
                      padding: '8px 12px', borderRadius: '10px 10px 2px 10px',
                      fontSize: 13, maxWidth: '80%', marginLeft: 'auto', marginBottom: 6
                    }}>
                      {m.message}
                    </div>
                    {m.reply && (
                      <>
                        <div style={{
                          background: '#2a2a2a', color: '#eee',
                          padding: '8px 12px', borderRadius: '10px 10px 10px 2px',
                          fontSize: 13, maxWidth: '80%'
                        }}>
                          {m.reply}
                        </div>
                        <ContactButtons />
                      </>
                    )}
                  </div>
                ))}
                {aiTyping && (
                  <div style={{
                    background: '#2a2a2a', color: '#888', padding: '8px 12px',
                    borderRadius: '10px 10px 10px 2px', fontSize: 13, maxWidth: '80%'
                  }}>
                    Zara is typing...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #2a2a2a' }}>
                <input
                  placeholder="Write a message..." value={text}
                  onChange={e => setText(e.target.value)}
                  style={{
                    flex: 1, border: 'none', padding: 12, background: '#0d0d0d',
                    color: '#fff', fontSize: 13, outline: 'none'
                  }}
                />
                <button type="submit" disabled={sending} style={{
                  background: '#d32f2f', color: '#fff', border: 'none',
                  padding: '0 18px', cursor: 'pointer', fontWeight: 600
                }}>
                  ➤
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} style={{
          width: 62, height: 62, borderRadius: '50%', border: '3px solid #d32f2f',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(211,47,47,0.6)',
          overflow: 'hidden', padding: 0, background: '#161616'
        }}>
          <img src="/chatbot-avatar.webp" alt="Chat with Zara" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}
    </div>
  )
}