// Simple, dependency-free device/browser/OS detection from navigator.userAgent
export function detectDevice() {
  const ua = navigator.userAgent

  let browser = 'Unknown'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browser = 'Chrome'
  else if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari'

  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Linux')) os = 'Linux'

  let device = 'Desktop'
  if (/Mobi|Android/i.test(ua)) device = 'Mobile'
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet'

  return { browser, os, device }
}

// Free IP-geolocation lookup (no API key needed, ~1000 req/day limit)
export async function detectLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    return {
      ip: data.ip || null,
      country: data.country_name || null,
      city: data.city || null,
    }
  } catch {
    return { ip: null, country: null, city: null }
  }
}
