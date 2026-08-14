import { useCallback, useEffect, useState } from 'react'
import {
  Activity, ArrowRight, Bot, Box, Check, ChevronRight, Clock3, CloudDownload,
  Command, Download, Fingerprint, FolderSearch, Gauge, Gift,
  Grid2X2, Heart, Languages, LayoutDashboard, LockKeyhole, Menu, MousePointer2,
  PlugZap, Rocket, Search, ShieldAlert, ShieldCheck, Sparkles, Target, TimerReset, Trash2,
  MessageSquareText, TrendingUp, WandSparkles, X, Zap
} from 'lucide-react'
import SupportModal from './SupportModal'
import DownloadsSection from './DownloadsSection'

const nav = [['experiencia','Experiência'],['recursos','Recursos'],['seguranca','Segurança'],['download','Downloads'],['apoie','Apoie']]
const LAUNCH_AT = new Date(import.meta.env.VITE_LAUNCH_AT || '2026-08-11T13:00:00-03:00')

function getTimeLeft() {
  const remaining = Math.max(0, LAUNCH_AT.getTime() - Date.now())
  return {
    remaining,
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  }
}

function LaunchScreen({ timeLeft }) {
  const units = [
    ['Dias', timeLeft.days],
    ['Horas', timeLeft.hours],
    ['Minutos', timeLeft.minutes],
    ['Segundos', timeLeft.seconds],
  ]

  return <main className="launch-screen relative grid min-h-screen place-items-center overflow-hidden px-5 py-12 text-center">
    <div className="fixed inset-0 -z-30 bg-[#09070f]"/>
    <div className="noise pointer-events-none fixed inset-0 -z-20 opacity-[.025]"/>
    <div className="orb fixed -left-32 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-violet-700"/>
    <div className="orb fixed -right-48 bottom-0 -z-10 h-[620px] w-[620px] rounded-full bg-fuchsia-800"/>
    <div className="dot-grid absolute inset-0 -z-10 opacity-50"/>

    <div className="reveal mx-auto w-full max-w-4xl">
      <div className="mx-auto mb-10 flex w-fit items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 shadow-[0_0_30px_rgba(139,92,246,.55)]"><Command size={21}/></span>
        <span>Flex<span className="text-violet-400">Hub</span></span>
      </div>
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[.08] px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-violet-200">
        <Rocket size={14}/> Estamos quase prontos
      </div>
      <h1 className="font-display text-4xl font-extrabold leading-[1.06] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">
        Uma nova experiência<br/><span className="text-gradient">está chegando.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
        O FlexHub será lançado hoje, às 13h. Prepare-se para transformar o seu Windows.
      </p>

      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" aria-label="Contagem regressiva para o lançamento">
        {units.map(([label,value]) => <div key={label} className="glass rounded-2xl px-3 py-5 sm:py-7">
          <strong className="font-display text-3xl font-bold tabular-nums text-white sm:text-5xl">{String(value).padStart(2, '0')}</strong>
          <span className="mt-2 block text-[10px] font-bold uppercase tracking-[.16em] text-zinc-500">{label}</span>
        </div>)}
      </div>
      <div className="mt-9 flex items-center justify-center gap-2 text-sm text-zinc-500"><Sparkles size={15} className="text-violet-400"/> A página será liberada automaticamente.</div>
    </div>
  </main>
}

function Logo() {
  return <a href="#inicio" className="flex items-center gap-2.5 font-display font-bold tracking-tight text-white">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 shadow-[0_0_24px_rgba(139,92,246,.5)]"><Command size={18}/></span>
    <span>Flex<span className="text-violet-400">Hub</span></span>
  </a>
}

function Button({ children, variant='primary', href='#download', className='', download }) {
  const styles = variant === 'primary'
    ? 'bg-violet-600 text-white shadow-[0_12px_36px_rgba(124,58,237,.3)] hover:bg-violet-500 hover:-translate-y-0.5'
    : 'glass text-zinc-200 hover:bg-white/[.07] hover:text-white'
  return <a href={href} download={download} target={download ? '_self' : undefined} className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition duration-300 ${styles} ${className}`}>{children}</a>
}

function SectionLabel({ icon: Icon=Sparkles, children }) {
  return <div className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-violet-400"><Icon size={14}/>{children}</div>
}

function AppMockup() {
  const side = [LayoutDashboard, Grid2X2, Zap, FolderSearch, Bot]
  return <div className="purple-shadow relative mx-auto max-w-5xl overflow-hidden rounded-[22px] border border-violet-400/20 bg-[#111019] p-2 sm:p-3">
    {/* SUBSTITUA ESTE BLOCO por uma captura real do dashboard quando disponível. */}
    <div className="overflow-hidden rounded-[15px] border border-white/[.07] bg-[#0c0b12]">
      <div className="flex h-10 items-center border-b border-white/[.06] px-4">
        <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"/><i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]"/><i className="h-2.5 w-2.5 rounded-full bg-[#28c840]"/></div>
        <div className="mx-auto flex items-center gap-2 text-[10px] text-zinc-600"><ShieldCheck size={11}/> Ambiente seguro</div>
      </div>
      <div className="flex min-h-[330px] sm:min-h-[440px]">
        <aside className="hidden w-48 shrink-0 border-r border-white/[.06] p-4 sm:block">
          <Logo/><div className="mt-7 space-y-2">{['Visão geral','Widgets','Automações','Arquivos','Flex AI'].map((x,i)=><div key={x} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[11px] ${i===0?'bg-violet-500/15 text-violet-300':'text-zinc-600'}`}>{(() => { const I=side[i]; return <I size={14}/> })()}{x}</div>)}</div>
          <div className="mt-8 rounded-xl border border-violet-400/15 bg-violet-500/[.07] p-3"><div className="text-[10px] text-zinc-500">Seu plano</div><div className="mt-1 text-xs font-semibold text-white">Flex Free</div><div className="mt-3 h-1 rounded bg-white/5"><div className="h-full w-3/5 rounded bg-violet-500"/></div></div>
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-[10px] text-zinc-500">DOMINGO, 9 DE AGOSTO</p><h3 className="mt-1 font-display text-lg font-bold sm:text-2xl">Olá, Lucas <span>👋</span></h3><p className="mt-1 text-[11px] text-zinc-500">Seu espaço está pronto para produzir.</p></div><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 text-[10px] font-bold">LH</div></div>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">{[['7','Tarefas hoje',Check],['3h 24','Foco total',TimerReset],['86%','Performance',TrendingUp],['12','Automações',Zap]].map(([v,l,I])=><div className="rounded-xl border border-white/[.06] bg-white/[.025] p-3" key={l}><I size={14} className="mb-4 text-violet-400"/><strong className="text-sm sm:text-lg">{v}</strong><div className="mt-1 truncate text-[9px] text-zinc-600">{l}</div></div>)}</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1.45fr_1fr]">
            <div className="rounded-xl border border-white/[.06] bg-white/[.025] p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold">Meu workspace</span><span className="text-[9px] text-violet-400">Personalizar</span></div><div className="mt-5 flex items-end gap-2">{[35,53,42,70,58,84,68,94,73].map((h,i)=><i key={i} className={`flex-1 rounded-t ${i===7?'bg-violet-500':'bg-violet-500/20'}`} style={{height:`${h}px`}}/>)}</div><div className="mt-3 flex justify-between text-[8px] text-zinc-700"><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span></div></div>
            <div className="rounded-xl border border-white/[.06] bg-white/[.025] p-4"><div className="flex items-center gap-2 text-xs font-semibold"><Bot size={14} className="text-violet-400"/>Flex AI</div><div className="mt-4 rounded-lg bg-violet-500/10 p-3 text-[9px] leading-relaxed text-zinc-400">Posso organizar seu dia e abrir seu workspace de design.</div><div className="mt-4 flex gap-2"><div className="flex-1 rounded-lg border border-white/[.06] px-3 py-2 text-[8px] text-zinc-700">Pergunte qualquer coisa...</div><div className="grid w-8 place-items-center rounded-lg bg-violet-600"><ArrowRight size={12}/></div></div></div>
          </div>
        </main>
      </div>
    </div>
  </div>
}

const productivity = [
  [LayoutDashboard,'Dashboard & Widgets','Monte seu painel com arrastar e soltar, galeria completa e quatro tamanhos flexíveis.'],
  [Bot,'Chatbot com IA integrada','Um assistente no desktop: 15 mensagens por dia no plano free e cota ampliada para apoiadores.'],
  [Rocket,'Workspaces inteligentes','Abra programas, pastas, URLs e comandos em conjunto com um único clique.'],
  [Search,'Busca Universal','Pressione Ctrl + K e encontre apps, ações e arquivos indexados no Windows em segundos.'],
  [Clock3,'Ferramentas do dia a dia','Pomodoro, modo foco, notas, agenda, lembretes e player/Spotify no mesmo lugar.']
]

const extras = [
  [Clock3,'Automações agendadas','Deixe tarefas recorrentes rodarem no horário certo.','md:col-span-2'],
  [Gauge,'Inicialização sob controle','Escolha o que abre com o Windows.',''],
  [PlugZap,'Plugins locais','Expanda o hub com manifestos seguros.',''],
  [Languages,'Feito para o seu idioma','i18n e atalhos totalmente personalizados.','md:col-span-2'],
  [Target,'Progresso que motiva','Metas, conquistas, estatísticas e relatórios em CSV.','md:col-span-2'],
  [Activity,'Sempre leve e atualizado','Atualizações automáticas e acesso pela bandeja com baixo consumo.','md:col-span-2']
]

function SmartScreenGuide() {
  const steps = [
    ['01', 'Baixe o instalador', 'Salve o arquivo FlexHub-Setup.exe normalmente pelo navegador.', Download],
    ['02', 'Abra “Mais informações”', 'Se o SmartScreen aparecer, confira o nome do aplicativo e clique em “Mais informações”.', Search],
    ['03', 'Confirme a instalação', 'Depois de verificar a origem do arquivo, escolha “Executar assim mesmo”.', MousePointer2],
  ]

  return <section className="px-5 py-20 lg:px-8" aria-labelledby="smartscreen-title">
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-white/[.08] bg-[#0d0b13]">
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-white/[.07] p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <SectionLabel icon={ShieldAlert}>Antes de instalar</SectionLabel>
          <h2 id="smartscreen-title" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">O Windows exibiu um alerta?</h2>
          <p className="mt-5 text-sm leading-7 text-zinc-400">Aplicativos novos ou ainda sem reputação suficiente podem acionar o Microsoft Defender SmartScreen. Isso não substitui sua verificação: baixe apenas pelo site oficial e confira o arquivo antes de continuar.</p>
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-emerald-400/15 bg-emerald-500/[.06] p-4">
            <ShieldCheck className="mt-0.5 shrink-0 text-emerald-400" size={18}/>
            <p className="text-xs leading-5 text-zinc-400"><strong className="text-emerald-300">Dica de segurança:</strong> confirme que o arquivo se chama <span className="text-zinc-200">FlexHub-Setup.exe</span> e valide o hash SHA-256 publicado nesta página.</p>
          </div>
        </div>
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="space-y-7">{steps.map(([n,title,text,I],i)=><div key={n} className="relative flex gap-4 sm:gap-5">
            {i < steps.length-1 && <span className="absolute left-[19px] top-11 h-[calc(100%+4px)] w-px bg-gradient-to-b from-violet-500/40 to-transparent"/>}
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300"><I size={17}/></div>
            <div className="pt-0.5"><span className="text-[10px] font-bold tracking-widest text-violet-500">PASSO {n}</span><h3 className="mt-1 font-display font-bold text-white">{title}</h3><p className="mt-1.5 text-sm leading-6 text-zinc-500">{text}</p></div>
          </div>)}</div>
          <p className="mt-8 border-t border-white/[.06] pt-6 text-[11px] leading-5 text-zinc-600">O texto e a aparência do SmartScreen podem variar conforme a versão e o idioma do Windows 10 ou 11.</p>
        </div>
      </div>
    </div>
  </section>
}

function App() {
  const [timeLeft,setTimeLeft] = useState(getTimeLeft)
  const [menu,setMenu] = useState(false)
  const [supportOpen,setSupportOpen] = useState(false)
  const closeSupport = useCallback(() => setSupportOpen(false), [])
  useEffect(() => {
    if (timeLeft.remaining === 0) return undefined
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => window.clearInterval(timer)
  }, [timeLeft.remaining])

  if (timeLeft.remaining > 0) return <LaunchScreen timeLeft={timeLeft}/>

  return <div className="relative overflow-hidden">
    <div className="fixed inset-0 -z-30 bg-[#09070f]"/><div className="noise pointer-events-none fixed inset-0 -z-20 opacity-[.025]"/>
    <div className="orb fixed -left-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-violet-700"/><div className="orb fixed -right-64 top-[45%] -z-10 h-[600px] w-[600px] rounded-full bg-fuchsia-800"/>

    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.06] bg-[#09070f]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8"><Logo/>
        <div className="hidden items-center gap-8 md:flex">{nav.map(([id,label])=><a className="text-sm text-zinc-500 transition hover:text-white" href={`#${id}`} key={id}>{label}</a>)}</div>
        <div className="hidden md:block"><Button href="#download" className="!px-4 !py-2.5">Baixar grátis <Download size={15}/></Button></div>
        <button onClick={()=>setMenu(!menu)} aria-label="Abrir menu" className="text-zinc-300 md:hidden">{menu?<X/>:<Menu/>}</button>
      </nav>
      {menu&&<div className="border-t border-white/[.06] bg-[#0c0912] px-5 py-4 md:hidden">{nav.map(([id,label])=><a onClick={()=>setMenu(false)} className="block py-3 text-zinc-300" href={`#${id}`} key={id}>{label}</a>)}<Button href="#download" className="mt-2 w-full">Baixar grátis <Download size={15}/></Button></div>}
    </header>

    <main>
      <section id="inicio" className="dot-grid relative px-5 pb-20 pt-36 sm:pt-44 lg:px-8">
        <div className="mx-auto max-w-5xl text-center reveal">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[.08] px-4 py-2 text-xs font-medium text-violet-200 shadow-[0_0_30px_rgba(139,92,246,.1)]"><Rocket size={14}/> O ecossistema definitivo para o seu Windows</div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-.045em] text-white sm:text-6xl lg:text-[76px]">O seu Windows, do seu jeito.<br/><span className="text-gradient">Conheça o SeuNomeHub.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">Personalize seu workspace, automatize rotinas, gerencie arquivos, utilize IA e baixe programas com segurança — em um app feito sob medida para você.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Button href="#download" className="sm:min-w-60"><Download size={17}/> Ver downloads <span className="text-violet-200">— Grátis</span></Button><Button href="#recursos" variant="secondary" className="sm:min-w-44">Explorar recursos <ChevronRight size={16}/></Button></div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-600"><span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500"/>Windows 10 e 11</span><span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500"/>Instalação segura</span><span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500"/>Sem cartão</span></div>
        </div>
        <div className="mx-auto mt-16 max-w-6xl reveal" style={{animationDelay:'.15s'}}><AppMockup/></div>
      </section>

      <section id="experiencia" className="px-5 py-24 lg:px-8"><div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div><SectionLabel icon={Fingerprint}>Identidade única</SectionLabel><h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Um hub que leva<br/><span className="text-violet-400">o seu nome.</span></h2><p className="mt-6 max-w-xl leading-7 text-zinc-400">Na instalação, o FlexHub aprende quem você é e transforma a experiência em um painel pessoal exclusivo. Seu nome, suas rotinas e seu jeito de trabalhar — desde o primeiro acesso.</p><div className="mt-8 flex flex-wrap gap-2">{['JoseHub','LucasHub','AnaHub'].map((x,i)=><span key={x} className={`rounded-full border px-4 py-2 text-sm ${i===1?'border-violet-400/40 bg-violet-500/15 text-violet-200':'border-white/10 text-zinc-600'}`}>{x}</span>)}</div></div>
        <div className="glass relative rounded-3xl p-6 sm:p-9"><div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-violet-600/20 blur-3xl"/><p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Personalização em tempo real</p><div className="mt-8 space-y-4">{[['Como podemos chamar você?','Lucas'],['Nome do seu espaço','LucasHub'],['Estilo do painel','Produtividade']].map(([l,v],i)=><div key={l} className="rounded-xl border border-white/[.07] bg-black/20 p-4"><span className="text-xs text-zinc-600">{l}</span><div className="mt-2 flex items-center justify-between font-semibold"><span>{v}</span>{i===1?<Sparkles size={16} className="text-violet-400"/>:<Check size={16} className="text-emerald-500"/>}</div></div>)}</div></div>
      </div></section>

      <section className="border-y border-white/[.06] bg-white/[.018] px-5 py-24 lg:px-8"><div className="mx-auto max-w-6xl">
        <div className="max-w-3xl"><SectionLabel icon={WandSparkles}>Instalador mágico</SectionLabel><h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Seus programas. <span className="text-gradient">Só de fontes seguras.</span></h2><p className="mt-5 text-zinc-400">Do download à limpeza, controle tudo sem navegar por sites duvidosos ou deixar resíduos no sistema.</p></div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-2"><CloudDownload className="text-violet-400"/><h3 className="mt-8 font-display text-xl font-bold">Catálogo oficial e completo</h3><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Baixe pacotes de até 10 GB com segurança e acompanhamento em tempo real.</p><div className="mt-6 flex flex-wrap gap-2">{['EXE','MSI','MSIX','APPX','ZIP','7Z','RAR'].map(x=><span key={x} className="rounded-md border border-white/[.07] bg-white/[.03] px-2.5 py-1 text-[10px] font-bold text-zinc-500">{x}</span>)}</div></div>
          <div className="glass rounded-2xl p-6"><ShieldCheck className="text-emerald-400"/><h3 className="mt-8 font-display text-xl font-bold">VirusTotal integrado</h3><p className="mt-3 text-sm leading-6 text-zinc-500">Arquivos verificados automaticamente antes de chegar ao seu PC.</p><div className="mt-6 flex items-center gap-2 text-xs text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400 pulse-soft"/> Verificação concluída</div></div>
          <div className="glass rounded-2xl p-6"><Trash2 className="text-fuchsia-400"/><h3 className="mt-8 font-display text-xl font-bold">Desinstalador Mágico</h3><p className="mt-3 text-sm leading-6 text-zinc-500">Remova programas e resíduos com precisão.</p></div>
          <div className="glass rounded-2xl p-6"><Activity className="text-orange-400"/><h3 className="mt-8 font-display text-xl font-bold">Monitor inteligente</h3><p className="mt-3 text-sm leading-6 text-zinc-500">Encontre processos pesados e recupere memória.</p></div>
          <div className="rounded-2xl border border-violet-400/20 bg-violet-500/[.08] p-6"><Gift className="text-violet-400"/><h3 className="mt-8 font-display text-xl font-bold">Freemium transparente</h3><p className="mt-3 text-sm leading-6 text-zinc-400"><strong className="text-white">5 downloads por dia</strong> no plano grátis. Ilimitados para quem apoia.</p></div>
        </div>
      </div></section>

      <section id="recursos" className="px-5 py-24 lg:px-8"><div className="mx-auto max-w-6xl"><div className="text-center"><SectionLabel icon={Bot}>Produtividade & IA</SectionLabel><h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Tudo flui em um só lugar.</h2><p className="mx-auto mt-5 max-w-2xl text-zinc-500">Menos janelas, menos interrupções e mais tempo para o que realmente importa.</p></div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{productivity.map(([I,t,d],i)=><div key={t} className={`glass group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 ${i===0||i===4?'lg:col-span-2':''}`}><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500 group-hover:text-white"><I size={20}/></div><h3 className="mt-7 font-display text-lg font-bold">{t}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">{d}</p></div>)}</div>
      </div></section>

      <section id="seguranca" className="px-5 py-20 lg:px-8"><div className="purple-shadow relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-violet-400/20 bg-gradient-to-br from-violet-950/50 to-[#0d0a14] p-7 sm:p-12 lg:p-16"><div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]"/>
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_.8fr]"><div><SectionLabel icon={LockKeyhole}>Cofre & Privacidade</SectionLabel><h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Seus dados ficam seus.<br/><span className="text-violet-400">Ponto final.</span></h2><p className="mt-6 max-w-xl leading-7 text-zinc-400">Proteção de nível avançado, pensada para funcionar de forma silenciosa enquanto você produz.</p><div className="mt-8 space-y-4">{['Cofre criptografado com AES-256-GCM','Backup, exportação e importação segura','Dados protegidos localmente'].map(x=><div key={x} className="flex items-center gap-3 text-sm text-zinc-300"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-400"><Check size={13}/></span>{x}</div>)}</div></div>
          <div className="glass rounded-2xl p-6 sm:p-8"><div className="flex items-center justify-between"><span className="font-display font-bold">Clipboard inteligente</span><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400">PROTEGIDO</span></div><div className="mt-8 space-y-3">{[['Texto copiado','Disponível no histórico',Check,'text-emerald-400'],['•••• •••• •••• 4242','Dado sensível ignorado',LockKeyhole,'text-violet-400'],['sk_live_••••••••','Token ignorado',LockKeyhole,'text-violet-400']].map(([a,b,I,c])=><div key={a} className="flex items-center justify-between rounded-xl border border-white/[.06] bg-black/20 p-4"><div><div className="text-xs font-medium">{a}</div><div className="mt-1 text-[10px] text-zinc-600">{b}</div></div><I size={15} className={c}/></div>)}</div></div>
        </div></div></section>

      <section className="px-5 py-24 lg:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><SectionLabel icon={Box}>Ecossistema completo</SectionLabel><h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Pequenos detalhes.<br/>Um ganho enorme.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-4">{extras.map(([I,t,d,span])=><div key={t} className={`glass rounded-2xl p-6 ${span}`}><I size={20} className="text-violet-400"/><h3 className="mt-6 font-display font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{d}</p></div>)}</div></div></section>

      <section id="apoie" className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-5xl rounded-[30px] border border-violet-400/20 bg-[radial-gradient(circle_at_top,#4c1d95_0%,#151020_52%,#0d0b12_100%)] p-7 text-center sm:p-14"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-500 text-white shadow-[0_0_40px_rgba(139,92,246,.4)]"><Heart size={25} fill="currentColor"/></div><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-violet-300">Desenvolvimento independente</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">Apoie uma vez.<br/>Ganhe mais, <span className="text-violet-400">para sempre.</span></h2><p className="mx-auto mt-6 max-w-2xl leading-7 text-zinc-400">Contribua com qualquer valor a partir de <strong className="text-white">R$ 5 via PIX</strong> no próprio app e libere downloads ilimitados no Instalador Mágico + cota expandida no Chatbot.</p><Button className="mt-9"><Heart size={16}/> Quero apoiar o FlexHub</Button><p className="mt-4 text-[11px] text-zinc-600">Pagamento único · Sem assinatura · Ativação imediata</p></div></section>

      <DownloadsSection/>

      <SmartScreenGuide/>
    </main>

    <footer className="border-t border-white/[.06] px-5 py-9 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row"><Logo/><div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600"><a href="#seguranca" className="hover:text-white">Segurança</a><a href="#download" className="hover:text-white">Downloads</a><button type="button" onClick={() => setSupportOpen(true)} className="hover:text-white">Feedback e ajuda</button><a href="#" className="hover:text-white">Privacidade</a><a href="#" className="hover:text-white">Termos</a></div><div className="text-center text-xs text-zinc-700 sm:text-right"><p>© 2026 FlexHub. Todos os direitos reservados.</p><p className="mt-1">Feito por <a href="mailto:gml.developer.br@gmail.com" className="transition hover:text-violet-400">gml.developer.br@gmail.com</a></p></div></div></footer>
    <button type="button" onClick={() => setSupportOpen(true)} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(124,58,237,.4)] transition hover:-translate-y-0.5 hover:bg-violet-500" aria-label="Abrir feedback e ajuda"><MessageSquareText size={18}/> <span className="hidden sm:inline">Feedback e ajuda</span></button>
    <SupportModal open={supportOpen} onClose={closeSupport}/>
  </div>
}

export default App
