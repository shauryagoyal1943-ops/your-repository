import { useState } from 'react'

type TennisMatch = {
  id: number
  stage: string
  date: string
  player1: string
  player2: string
  flag1: string
  flag2: string
  sets: string
  status: 'Live' | 'Upcoming' | 'Result'
  setScores: { p1: string; p2: string }[]
  detail: string
  highlight: string
}

const MATCHES: TennisMatch[] = [
  {
    id: 1,
    stage: 'Gentlemen\'s Singles Final',
    date: 'Jul 19, 2026',
    player1: 'J. Sinner',
    player2: 'A. Zverev',
    flag1: '🇮🇹',
    flag2: '🇩🇪',
    sets: '3 sets to 1',
    status: 'Result',
    setScores: [
      { p1: '6', p2: '7' },
      { p1: '7', p2: '6' },
      { p1: '6', p2: '3' },
      { p1: '6', p2: '4' },
    ],
    detail: 'Sinner won 6-7, 7-6, 6-3, 6-4 · Retained Wimbledon crown',
    highlight: 'Jannik Sinner retained his Wimbledon title with a brutal 4-set baseline war against Alexander Zverev. After dropping the opening tiebreak, Sinner leveled with a tiebreak of his own before pulling away in sets 3 and 4 to seal back-to-back Championships.',
  },
  {
    id: 2,
    stage: 'Ladies\' Singles Final',
    date: 'Jul 18, 2026',
    player1: 'L. Nosková',
    player2: 'K. Muchová',
    flag1: '🇨🇿',
    flag2: '🇨🇿',
    sets: '2 sets to 1',
    status: 'Result',
    setScores: [
      { p1: '6', p2: '2' },
      { p1: '5', p2: '7' },
      { p1: '6', p2: '3' },
    ],
    detail: 'Nosková won 6-2, 5-7, 6-3 · Maiden Grand Slam title',
    highlight: 'Linda Nosková captured her maiden Grand Slam championship, pulling out a 3-set win over Karolína Muchová. After dominating the opener, Nosková regrouped after dropping the 2nd set to close it out 6-3 in the decider.',
  },
  {
    id: 3,
    stage: 'Gentlemen\'s Doubles Final',
    date: 'Jul 19, 2026',
    player1: 'Patten / Heliövaara',
    player2: 'Pavić / Arévalo',
    flag1: '🇬🇧🇫🇮',
    flag2: '🇭🇷🇸🇻',
    sets: '2 sets to 0',
    status: 'Result',
    setScores: [
      { p1: '7', p2: '6' },
      { p1: '7', p2: '6' },
    ],
    detail: 'Won in straight tiebreaks · Both sets 7-6',
    highlight: 'Henry Patten & Harri Heliövaara defeated Mate Pavić & Marcelo Arévalo in straight tiebreaks to claim the Gentlemen\'s Doubles crown.',
  },
  {
    id: 4,
    stage: 'Ladies\' Doubles Final',
    date: 'Jul 18, 2026',
    player1: 'Guo / Mladenovic',
    player2: 'Stefani / Dabrowski',
    flag1: '🇨🇳🇫🇷',
    flag2: '🇧🇷🇨🇦',
    sets: '2 sets to 0',
    status: 'Result',
    setScores: [
      { p1: '7', p2: '5' },
      { p1: '7', p2: '5' },
    ],
    detail: 'Won 7-5, 7-5 · Ladies\' Doubles Champions',
    highlight: 'Guo Hanyu & Kristina Mladenovic defeated Luisa Stefani & Gabriela Dabrowski 7-5, 7-5 to claim the Ladies\' Doubles title at Wimbledon.',
  },
]

const STATS = [
  { label: 'Men\'s Champion', value: 'J. Sinner', sub: 'Retained · 2nd Wimbledon' },
  { label: 'Women\'s Champion', value: 'L. Nosková', sub: 'Maiden Grand Slam title' },
  { label: 'Men\'s Doubles', value: 'Patten / Heliövaara', sub: 'Straight tiebreaks' },
  { label: 'Women\'s Doubles', value: 'Guo / Mladenovic', sub: '7-5, 7-5' },
]

export default function TennisSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  const statusColor = (s: TennisMatch['status']) =>
    s === 'Live' ? 'bg-red-500 text-white' : s === 'Upcoming' ? 'bg-accent-500 text-white' : 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎾</span>
        <h3 className="font-display font-bold text-base">Wimbledon 2026 · Finals Wrap-up</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-ink-500 dark:text-ink-400">{s.label}</p>
            <p className="font-display font-bold text-lg leading-tight mt-0.5">{s.value}</p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {MATCHES.map((m) => {
          const open = openId === m.id
          return (
            <div key={m.id} className="card overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : m.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-ink-50 dark:hover:bg-ink-800/50 transition"
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${statusColor(m.status)}`}>{m.status}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-medium truncate">{m.player1}</span>
                  <span className="text-xl">{m.flag1}</span>
                </div>
                <span className="font-display font-bold text-xs bg-ink-100 dark:bg-ink-800 rounded-lg px-2.5 py-1 min-w-[72px] text-center">{m.sets}</span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl">{m.flag2}</span>
                  <span className="text-sm font-medium truncate">{m.player2}</span>
                </div>
                <span className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open && (
                <div className="px-4 pb-4 pt-1 border-t border-ink-100 dark:border-ink-800 animate-fade-in">
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-2">{m.stage} · {m.date}</p>
                  <p className="text-sm font-medium mt-1">{m.detail}</p>
                  {m.setScores.length > 0 && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-ink-100 dark:border-ink-800">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-2 bg-ink-50 dark:bg-ink-800/50 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                        <span>Player</span>
                        {m.setScores.map((_, i) => (
                          <span key={i} className="text-center w-8">S{i + 1}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-2 text-sm items-center">
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-base">{m.flag1}</span>{m.player1}</span>
                        {m.setScores.map((s, i) => (
                          <span key={i} className="text-center w-8 font-mono font-semibold">{s.p1}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-2 text-sm border-t border-ink-100 dark:border-ink-800 items-center">
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-base">{m.flag2}</span>{m.player2}</span>
                        {m.setScores.map((s, i) => (
                          <span key={i} className="text-center w-8 font-mono font-semibold">{s.p2}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-sm text-ink-600 dark:text-ink-300 italic">{m.highlight}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
