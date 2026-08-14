import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ChevronDown, Download, FileBox, HardDrive, Laptop, LoaderCircle, Terminal, X } from 'lucide-react'
import { track } from '@vercel/analytics'
import { DOWNLOAD_CHANNELS, DOWNLOAD_MANIFEST_ENDPOINT } from './downloadConfig'

const LABELS = {
  'windows-x64': ['Windows', 'x64', 'EXE'],
  'linux-x64-deb': ['Chromebook / Linux', 'x64', 'DEB'],
  'linux-x64-appimage': ['Linux portátil', 'x64', 'AppImage'],
  'linux-arm64-deb': ['Chromebook / Linux', 'ARM64', 'DEB'],
  'linux-arm64-appimage': ['Linux portátil', 'ARM64', 'AppImage'],
}

export function parseYaml(source) {
  const version = source.match(/^version:\s*["']?([^\s"']+)/m)?.[1]
  const entries = []
  const lines = source.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s*-?\s*(?:url|path):\s*["']?(.+?)["']?\s*$/)
    if (!match) continue
    const filename = match[1].trim()
    let size
    for (let offset = 1; offset <= 4 && lines[index + offset]; offset += 1) {
      const sizeMatch = lines[index + offset].match(/^\s+size:\s*(\d+)/)
      if (sizeMatch) { size = Number(sizeMatch[1]); break }
      if (/^\s*-?\s*(?:url|path):/.test(lines[index + offset])) break
    }
    if (!entries.some((entry) => entry.filename === filename)) entries.push({ filename, size })
  }
  return { version, entries }
}

function fileType(filename) {
  if (/\.deb$/i.test(filename)) return 'deb'
  if (/\.appimage$/i.test(filename)) return 'appimage'
  if (/\.exe$/i.test(filename)) return 'exe'
  return null
}

function joinUrl(base, filename) {
  if (/^https?:\/\//i.test(filename)) return filename
  return `${base.replace(/\/$/, '')}/${filename.replace(/^\.\//, '')}`
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return 'Tamanho indisponível'
  const units = ['B', 'KB', 'MB', 'GB']
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / (1024 ** unit)).toFixed(unit > 1 ? 1 : 0)} ${units[unit]}`
}

async function loadManifests() {
  if (DOWNLOAD_MANIFEST_ENDPOINT) {
    const response = await fetch(DOWNLOAD_MANIFEST_ENDPOINT)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const payload = await response.json()
    return { version: payload.version, downloads: payload.downloads }
  }

  const channels = [
    ['windows', DOWNLOAD_CHANNELS.windows.x64],
    ['x64', DOWNLOAD_CHANNELS.linux.x64],
    ['arm64', DOWNLOAD_CHANNELS.linux.arm64],
  ]
  const results = await Promise.allSettled(channels.map(async ([arch, channel]) => {
    const response = await fetch(channel.manifest)
    if (!response.ok) throw new Error(`${arch}: HTTP ${response.status}`)
    return [arch, parseYaml(await response.text())]
  }))
  const successful = results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  if (!successful.length) throw new Error('Nenhum manifesto respondeu')

  const downloads = {}
  let version
  for (const [arch, manifest] of successful) {
    version ||= manifest.version
    if (arch === 'windows') {
      const exe = manifest.entries.find((entry) => fileType(entry.filename) === 'exe')
      downloads['windows-x64'] = { url: DOWNLOAD_CHANNELS.windows.x64.url, format: 'exe', size: exe?.size }
      continue
    }
    for (const entry of manifest.entries) {
      const format = fileType(entry.filename)
      if (!['deb', 'appimage'].includes(format)) continue
      downloads[`linux-${arch}-${format}`] = {
        url: joinUrl(DOWNLOAD_CHANNELS.linux[arch].baseUrl, entry.filename), format, size: entry.size,
      }
    }
  }
  downloads['windows-x64'] ||= { url: DOWNLOAD_CHANNELS.windows.x64.url, format: 'exe' }
  return { version, downloads, partial: successful.length !== channels.length }
}

function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase()
  const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase()
  const os = /win/.test(platform) ? 'windows' : (/linux|cros/.test(`${platform} ${ua}`) ? 'linux' : 'unknown')
  const architecture = /aarch64|arm64/.test(ua) ? 'arm64' : (/x86_64|x64|win64|amd64/.test(ua) ? 'x64' : null)
  return { os, architecture, chromeos: /cros/.test(ua) }
}

function usePlatform() {
  const [platform, setPlatform] = useState(() => detectPlatform())
  useEffect(() => {
    if (!navigator.userAgentData?.getHighEntropyValues) return
    navigator.userAgentData.getHighEntropyValues(['architecture']).then(({ architecture }) => {
      setPlatform((current) => ({ ...current, architecture: /arm/i.test(architecture) ? 'arm64' : (/x86/i.test(architecture) ? 'x64' : current.architecture) }))
    }).catch(() => {})
  }, [])
  return platform
}

function DownloadCard({ id, item, version, recommended }) {
  const [platform, architecture, format] = LABELS[id]
  const available = Boolean(item?.url)
  const onDownload = () => track('download_clicked', { platform, architecture, format, version: version || 'unknown' })
  return <article className={`relative rounded-2xl border p-5 transition ${recommended ? 'border-violet-400/50 bg-violet-500/[.1] shadow-[0_18px_60px_rgba(124,58,237,.15)]' : 'border-white/[.08] bg-white/[.025]'}`}>
    {recommended && <span className="absolute right-4 top-4 rounded-full bg-violet-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Recomendado</span>}
    <FileBox className="text-violet-400" size={22}/><h3 className="mt-5 pr-24 font-display text-lg font-bold">{platform}</h3>
    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-500"><div><dt>Arquitetura</dt><dd className="mt-1 text-zinc-200">{architecture}</dd></div><div><dt>Formato</dt><dd className="mt-1 text-zinc-200">{format}</dd></div><div><dt>Versão</dt><dd className="mt-1 text-zinc-200">{version || 'Indisponível'}</dd></div><div><dt>Tamanho</dt><dd className="mt-1 text-zinc-200">{formatBytes(item?.size)}</dd></div></dl>
    {available ? <a href={item.url} onClick={onDownload} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"><Download size={16}/> {format === 'DEB' ? 'Baixar DEB para Chromebook/Linux' : `Baixar ${format}`}</a> : <span className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-500"><AlertCircle size={15}/> Link indisponível</span>}
  </article>
}

function InstallGuides({ version = '{versão}' }) {
  const [open, setOpen] = useState(false)
  const deb = `FlexHub.${version}.{arquitetura}.deb`
  const image = `FlexHub.${version}.{arquitetura}.AppImage`
  return <div className="mt-10">
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-violet-400/25 bg-violet-500/[.08] px-5 py-3 text-sm font-semibold text-violet-200 hover:bg-violet-500/[.14]"><Laptop size={17}/> Como instalar no Chromebook</button>
    <details className="mx-auto mt-4 max-w-4xl rounded-2xl border border-white/[.08] bg-white/[.025] text-left"><summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold"><span className="flex items-center gap-2"><Terminal size={17} className="text-violet-400"/> Instalação no Linux</span><ChevronDown size={17}/></summary><div className="border-t border-white/[.07] p-5 text-sm leading-7 text-zinc-400"><p><strong className="text-white">DEB</strong> é recomendado para Debian, Ubuntu, Linux Mint e derivados.</p><code className="mt-2 block overflow-x-auto rounded-lg bg-black/30 p-3 text-violet-300">sudo apt install ./{deb}</code><p className="mt-5"><strong className="text-white">AppImage</strong> é a opção portátil.</p><code className="mt-2 block overflow-x-auto whitespace-pre rounded-lg bg-black/30 p-3 text-violet-300">chmod +x {image}{'\n'}./{image}</code></div></details>
    {open && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="chromebook-title" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-violet-400/25 bg-[#100d17] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-widest text-violet-400">ChromeOS</span><h3 id="chromebook-title" className="mt-2 font-display text-2xl font-bold">Como instalar no Chromebook</h3></div><button onClick={() => setOpen(false)} aria-label="Fechar instruções" className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"><X/></button></div><ol className="mt-6 space-y-3 text-sm text-zinc-300">{['Abra Configurações do ChromeOS.','Acesse “Sobre o ChromeOS > Desenvolvedores”.','Ative o “Ambiente de desenvolvimento Linux”.','Baixe o pacote DEB correspondente ao processador.','Abra o aplicativo Arquivos e dê dois cliques no pacote DEB.','Clique em “Instalar com Linux”.','Depois da instalação, abra o FlexHub pelo inicializador do ChromeOS.'].map((step, index) => <li className="flex gap-3" key={step}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-300">{index + 1}</span>{step}</li>)}</ol><div className="mt-7 rounded-xl border border-white/[.08] bg-white/[.03] p-4 text-sm leading-6 text-zinc-400"><p><strong className="text-white">Intel/AMD (x64):</strong> a maioria dos Chromebooks com processadores Intel ou AMD.</p><p className="mt-2"><strong className="text-white">ARM64:</strong> modelos com processadores ARM, incluindo alguns MediaTek e Snapdragon.</p><p className="mt-3">Não sabe qual escolher? Abra <code className="rounded bg-black/30 px-1.5 py-0.5 text-violet-300">chrome://system</code> e procure por <strong className="text-zinc-200">cpuinfo</strong> ou pelo nome do processador. Intel/AMD usa x64; MediaTek ou Snapdragon geralmente usa ARM64.</p></div></div></div>}
  </div>
}

export default function DownloadsSection() {
  const platform = usePlatform()
  const [state, setState] = useState({ status: 'loading', data: null })
  const load = () => { setState({ status: 'loading', data: null }); loadManifests().then((data) => setState({ status: 'ready', data })).catch((error) => setState({ status: 'error', error })) }
  useEffect(load, [])
  const recommended = useMemo(() => {
    if (platform.os === 'windows') return 'windows-x64'
    if (platform.os === 'linux' && platform.architecture) return `linux-${platform.architecture}-deb`
    return null
  }, [platform])
  const order = ['windows-x64', 'linux-x64-deb', 'linux-x64-appimage', 'linux-arm64-deb', 'linux-arm64-appimage']
  return <section id="download" className="px-5 py-24 lg:px-8" aria-labelledby="download-title"><div className="mx-auto max-w-6xl"><div className="text-center"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-violet-400"><Laptop size={15}/> Downloads oficiais</span><h2 id="download-title" className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-6xl">Baixar <span className="text-gradient">FlexHub</span></h2><p className="mx-auto mt-5 max-w-2xl text-zinc-400">Escolha sua plataforma. A detecção apenas destaca a opção recomendada e nenhum download começa automaticamente.</p>{!platform.architecture && platform.os === 'linux' && <p className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-400/20 bg-amber-500/[.06] px-4 py-3 text-sm text-amber-100">Não foi possível detectar seu processador. Compare claramente as opções <strong>Intel/AMD (x64)</strong> e <strong>ARM64</strong> abaixo.</p>}</div>
    {state.status === 'loading' && <div className="mt-12 flex items-center justify-center gap-3 text-zinc-400" role="status"><LoaderCircle className="animate-spin"/> Consultando versões e arquivos disponíveis…</div>}
    {state.status === 'error' && <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-400/20 bg-red-500/[.06] p-5 text-center"><AlertCircle className="mx-auto text-red-300"/><p className="mt-3 font-semibold">Não foi possível consultar os manifestos.</p><p className="mt-2 text-sm text-zinc-400">Versão, tamanho e links Linux estão temporariamente indisponíveis. O alias permanente do Windows continua disponível.</p><div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row"><a href={DOWNLOAD_CHANNELS.windows.x64.url} onClick={() => track('download_clicked', { platform: 'Windows', architecture: 'x64', format: 'EXE', version: 'unknown' })} className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"><Download size={15}/> Baixar para Windows</a><button onClick={load} className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">Tentar novamente</button></div></div>}
    {state.status === 'ready' && <><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{order.map((id) => <DownloadCard key={id} id={id} item={state.data.downloads[id]} version={state.data.version} recommended={recommended === id}/>)}</div>{state.data.partial && <p className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-300"><AlertCircle size={14}/> Alguns manifestos não responderam; somente arquivos confirmados estão habilitados.</p>}<InstallGuides version={state.data.version}/></>}
    <div className="mx-auto mt-8 flex max-w-4xl items-start gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-4 text-sm leading-6 text-zinc-400"><HardDrive className="mt-0.5 shrink-0 text-violet-400" size={18}/><p>Algumas ferramentas administrativas do FlexHub são exclusivas do Windows. Recursos como produtividade, notas, agenda, música, backups, cofre, chatbot e organização pessoal estão disponíveis no Linux e Chromebook.</p></div>
  </div></section>
}
