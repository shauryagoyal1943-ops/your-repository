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
    stage: 'Wimbledon · Men\'s Final',
    date: 'Jul 19, 2026',
    player1: 'C. Alcaraz',
    player2: 'J. Sinner',
    flag1: '🇪🇸',
    flag2: '🇮🇹',
    sets: '2 sets to 1',
    status: 'Live',
    setScores: [
      { p1: '6', p2: '4' },
      { p1: '3', p2: '6' },
      { p1: '5', p2: '4' },
    ],
    detail: 'Alcaraz serving for the 4th set · Centre Court',
    highlight: 'A rematch of last year\'s epic — Alcaraz took the 1st set before Sinner leveled. The Spaniard broke at 4-4 in the 3rd and is closing in on a 4th set lead.',
  },
  {
    id: 2,
    stage: 'Wimbledon · Women\'s Final',
    date: 'Jul 18, 2026',
    player1: 'A. Sabalenka',
    player2: 'C. Gauff',
    flag1: '🇧🇾',
    flag2: '🇺🇸',
    sets: '2 sets to 0',
    status: 'Result',
    setScores: [
      { p1: '7', p2: '5' },
      { p1: '6', p2: '3' },
    ],
    detail: 'Sabalenka won 7-5, 6-3 · 1h 42m',
    highlight: 'Sabalenka claimed her 2nd Wimbledon title with a dominant serving display, landing 78% of first serves and saving all 4 break points faced.',
  },
  {
    id: 3,
    stage: 'Wimbledon · Men\'s SF',
    date: 'Jul 17, 2026',
    player1: 'J. Sinner',
    player2: 'N. Djokovic',
    flag1: '🇮🇹',
    flag2: '🇷🇸',
    sets: '3 sets to 1',
    status: 'Result',
    setScores: [
      { p1: '6', p2: '7' },
      { p1: '7', p2: '5' },
      { p1: '6', p2: '3' },
      { p1: '7', p2: '6' },
    ],
    detail: 'Sinner won 6-7, 7-5, 6-3, 7-6 · 3h 18m',
    highlight: 'Sinner recovered from dropping the opening tiebreak to end Djokovic\'s Wimbledon campaign in a tense 4-setter on Centre Court.',
  },
  {
    id: 4,
    stage: 'ATP Washington · R16',
    date: 'Jul 21, 2026',
    player1: 'T. Fritz',
    player2: 'B. Shelton',
    flag1: '🇺🇸',
    flag2: '🇺🇸',
    sets: 'vs',
    status: 'Upcoming',
    setScores: [],
    detail: 'All-American clash · 2nd on Stadium Court',
    highlight: 'Fritz leads the head-to-head 3-2 but Shelton took their most recent meeting in Atlanta last month in three tight sets.',
  },
]

const STATS = [
  { label: 'Champion (W)', value: 'Sabalenka', sub: '2nd Wimbledon title' },
  { label: 'Aces Leader', value: 'G. Dimitrov', sub: '127 aces · 81% won' },
  { label: 'Break Points', value: 'C. Alcaraz', sub: '24/38 converted' },
  { label: 'Live Now', value: 'Alcaraz vs Sinner', sub: 'Men\'s Final · Set 4' },
]

export default function TennisSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  const statusColor = (s: TennisMatch['status']) =>
    s === 'Live' ? 'bg-red-500 text-white' : s === 'Upcoming' ? 'bg-accent-500 text-white' : 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎾</span>
        <h3 className="font-display font-bold text-base">Tennis · Latest Scores</h3>
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
                        <span className="text-center w-8">P1</span>
                        <span className="text-center w-8">P2</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-2 text-sm">
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-base">{m.flag1}</span>{m.player1}</span>
                        {m.setScores.map((s, i) => (
                          <span key={i} className="text-center w-8 font-mono font-semibold">{s.p1}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-3 py-2 text-sm border-t border-ink-100 dark:border-ink-800">
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
