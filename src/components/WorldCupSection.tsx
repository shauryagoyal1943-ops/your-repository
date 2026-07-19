import { useState } from 'react'
import { TrophyIcon } from './icons'

type Match = {
  id: number
  stage: string
  date: string
  home: string
  away: string
  homeFlag: string
  awayFlag: string
  score: string
  scorers: { name: string; team: 'home' | 'away'; minute: string }[]
  highlight: string
}

const MATCHES: Match[] = [
  {
    id: 1,
    stage: 'Final',
    date: 'Jul 18, 2026',
    home: 'Argentina',
    away: 'France',
    homeFlag: '🇦🇷',
    awayFlag: '🇫🇷',
    score: '3 - 3',
    scorers: [
      { name: 'Messi', team: 'home', minute: '23' },
      { name: 'Mbappé', team: 'away', minute: '41' },
      { name: 'Di María', team: 'home', minute: '64' },
      { name: 'Mbappé', team: 'away', minute: '81' },
      { name: 'Mbappé', team: 'away', minute: '90+2' },
      { name: 'Messi', team: 'home', minute: '108' },
    ],
    highlight: 'A thrilling rematch of the 2022 final — Messi and Mbappé trade hat-tricks in an all-time classic.',
  },
  {
    id: 2,
    stage: 'Semi-final',
    date: 'Jul 15, 2026',
    home: 'Spain',
    away: 'Brazil',
    homeFlag: '🇪🇸',
    awayFlag: '🇧🇷',
    score: '2 - 1',
    scorers: [
      { name: 'Yamal', team: 'home', minute: '34' },
      { name: 'Vinícius Jr', team: 'away', minute: '67' },
      { name: 'Olmo', team: 'home', minute: '89' },
    ],
    highlight: 'Lamine Yamal lights up the semi with a stunning opener; Olmo nets a late winner.',
  },
  {
    id: 3,
    stage: 'Quarter-final',
    date: 'Jul 11, 2026',
    home: 'England',
    away: 'Portugal',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🇵🇹',
    score: '1 - 1',
    scorers: [
      { name: 'Bellingham', team: 'home', minute: '55' },
      { name: 'Ramos', team: 'away', minute: '78' },
    ],
    highlight: 'England edge through on penalties after a tense 1-1 draw.',
  },
]

const STATS = [
  { label: 'Total Goals', value: '187', sub: 'across 104 matches' },
  { label: 'Top Scorer', value: 'Mbappé', sub: '9 goals · Golden Boot' },
  { label: 'Best Playmaker', value: 'Lamine Yamal', sub: '7 assists · Golden Ball' },
  { label: 'Clean Sheets', value: 'E. Martínez', sub: '5 shutouts · Golden Glove' },
]

export default function WorldCupSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrophyIcon className="h-5 w-5 text-accent-500" />
        <h3 className="font-display font-bold text-base">FIFA World Cup 2026</h3>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-ink-500 dark:text-ink-400">{s.label}</p>
            <p className="font-display font-bold text-lg leading-tight mt-0.5">{s.value}</p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Match cards */}
      <div className="space-y-2">
        {MATCHES.map((m) => {
          const open = openId === m.id
          return (
            <div key={m.id} className="card overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : m.id)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-ink-50 dark:hover:bg-ink-800/50 transition"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400 w-16 shrink-0">{m.stage}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-medium">{m.home}</span>
                  <span className="text-xl">{m.homeFlag}</span>
                </div>
                <span className="font-display font-bold text-sm bg-ink-100 dark:bg-ink-800 rounded-lg px-2.5 py-1 min-w-[56px] text-center">{m.score}</span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl">{m.awayFlag}</span>
                  <span className="text-sm font-medium">{m.away}</span>
                </div>
                <span className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open && (
                <div className="px-4 pb-4 pt-1 border-t border-ink-100 dark:border-ink-800 animate-fade-in">
                  <div className="space-y-1.5 mt-2">
                    {m.scorers.map((sc, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-xs font-mono text-ink-400 w-10">{sc.minute}'</span>
                        <span className={sc.team === 'home' ? 'text-left' : 'text-right flex-1'}>
                          {sc.name} {sc.team === 'home' ? m.homeFlag : m.awayFlag}
                        </span>
                      </div>
                    ))}
                  </div>
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
