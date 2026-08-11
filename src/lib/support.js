const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupportConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export async function createSupportRequest(payload) {
  if (!isSupportConfigured) throw new Error('O canal de atendimento ainda não foi configurado.')

  const response = await fetch(`${SUPABASE_URL}/rest/v1/support_requests`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      request_type: payload.requestType,
      category: payload.category,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      source: 'flexhub-site',
      page_url: window.location.href.slice(0, 1000),
      user_agent: navigator.userAgent.slice(0, 1000),
    }),
  })

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.message || body.error || ''
    } catch {
      // A resposta pode vir sem corpo em falhas de rede ou proxy.
    }
    throw new Error(detail || 'Não foi possível enviar agora. Tente novamente em instantes.')
  }
}
