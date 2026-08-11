import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, HelpCircle, Loader2, MessageSquareText, Send, X } from 'lucide-react'
import { createSupportRequest } from './lib/support'

const options = {
  feedback: {
    icon: MessageSquareText,
    title: 'Enviar feedback',
    description: 'Conte o que você gostou ou o que podemos melhorar.',
    categories: [['suggestion', 'Sugestão'], ['bug', 'Problema'], ['compliment', 'Elogio'], ['other', 'Outro']],
  },
  help: {
    icon: HelpCircle,
    title: 'Pedir ajuda',
    description: 'Explique sua dúvida para nossa equipe analisar.',
    categories: [['technical', 'Problema técnico'], ['download', 'Download/instalação'], ['account', 'Conta ou acesso'], ['other', 'Outro']],
  },
}

const emptyForm = { name: '', email: '', category: '', subject: '', message: '' }

export default function SupportModal({ open, onClose }) {
  const [requestType, setRequestType] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setRequestType('')
      setForm(emptyForm)
      setStatus('idle')
      setError('')
    }
  }, [open])

  if (!open) return null

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const selectType = (type) => {
    setRequestType(type)
    setForm((current) => ({ ...current, category: options[type].categories[0][0] }))
    setError('')
  }
  const submit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await createSupportRequest({ ...form, requestType })
      setStatus('success')
    } catch (submissionError) {
      setError(submissionError.message)
      setStatus('error')
    }
  }

  const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10'

  return <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="support-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#100d17] shadow-2xl shadow-violet-950/40">
      <div className="border-b border-white/[.07] px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {requestType && status !== 'success' && <button type="button" onClick={() => setRequestType('')} className="text-zinc-500 transition hover:text-white" aria-label="Voltar"><ArrowLeft size={20}/></button>}
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-violet-400">Central FlexHub</p><h2 id="support-title" className="mt-1 font-display text-xl font-bold">{requestType ? options[requestType].title : 'Como podemos ajudar?'}</h2></div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white" aria-label="Fechar"><X size={20}/></button>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {status === 'success' ? <div className="py-8 text-center">
          <CheckCircle2 size={52} className="mx-auto text-emerald-400"/>
          <h3 className="mt-5 font-display text-2xl font-bold">Mensagem recebida!</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">Obrigado pelo contato. Sua solicitação entrou na nossa fila de atendimento.</p>
          <button type="button" onClick={onClose} className="mt-7 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">Concluir</button>
        </div> : !requestType ? <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(options).map(([type, item]) => {
            const Icon = item.icon
            return <button key={type} type="button" onClick={() => selectType(type)} className="group rounded-2xl border border-white/[.08] bg-white/[.025] p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-violet-500/[.07]">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-600 group-hover:text-white"><Icon size={21}/></span>
              <strong className="mt-5 block font-display">{item.title}</strong>
              <span className="mt-2 block text-xs leading-5 text-zinc-500">{item.description}</span>
            </button>
          })}
        </div> : <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium text-zinc-400">Seu nome<input className={fieldClass} name="name" value={form.name} onChange={update} maxLength="100" autoComplete="name" required placeholder="Como podemos chamar você?"/></label>
            <label className="text-xs font-medium text-zinc-400">Seu e-mail<input className={fieldClass} name="email" value={form.email} onChange={update} maxLength="255" type="email" autoComplete="email" required placeholder="voce@email.com"/></label>
          </div>
          <label className="block text-xs font-medium text-zinc-400">Assunto<input className={fieldClass} name="subject" value={form.subject} onChange={update} minLength="3" maxLength="160" required placeholder="Resuma sua mensagem"/></label>
          <label className="block text-xs font-medium text-zinc-400">Categoria<select className={fieldClass} name="category" value={form.category} onChange={update} required>{options[requestType].categories.map(([value, label]) => <option className="bg-[#100d17]" value={value} key={value}>{label}</option>)}</select></label>
          <label className="block text-xs font-medium text-zinc-400">Mensagem<textarea className={`${fieldClass} min-h-32 resize-y`} name="message" value={form.message} onChange={update} minLength="10" maxLength="5000" required placeholder="Conte os detalhes para entendermos melhor..."/></label>
          {error && <p className="rounded-xl border border-red-400/20 bg-red-500/[.07] px-4 py-3 text-xs leading-5 text-red-300" role="alert">{error}</p>}
          <button type="submit" disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60">{status === 'loading' ? <><Loader2 size={17} className="animate-spin"/> Enviando...</> : <><Send size={17}/> Enviar mensagem</>}</button>
          <p className="text-center text-[10px] leading-4 text-zinc-600">Use este canal sem incluir senhas, chaves ou dados bancários.</p>
        </form>}
      </div>
    </div>
  </div>
}
