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
    stage: 'Final · AET',
    date: 'Jul 19, 2026',
    home: 'Spain',
    away: 'Argentina',
    homeFlag: '🇪🇸',
    awayFlag: '🇦🇷',
    score: '1 - 0',
    scorers: [
      { name: 'F. Torres', team: 'home', minute: '106' },
    ],
    highlight: 'Spain are World Champions! Ferran Torres clinically converted a Nico Williams cross in the 106th minute of extra time to break the deadlock. Argentina played with 10 men after Enzo Fernández picked up a second yellow card in the 93rd minute.',
  },
  {
    id: 2,
    stage: '3rd Place',
    date: 'Jul 18, 2026',
    home: 'England',
    away: 'France',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🇫🇷',
    score: '6 - 4',
    scorers: [
      { name: 'Saka', team: 'home', minute: '12' },
      { name: 'Mbappé', team: 'away', minute: '34' },
      { name: 'Saka', team: 'home', minute: '47' },
      { name: 'Mbappé', team: 'away', minute: '58' },
      { name: 'Saka', team: 'home', minute: '71' },
      { name: 'Dembélé', team: 'away', minute: '79' },
      { name: 'Bellingham', team: 'home', minute: '84' },
      { name: 'Olise', team: 'away', minute: '88' },
      { name: 'Kane', team: 'home', minute: '90+3' },
      { name: 'Tchouaméni', team: 'away', minute: '90+6' },
    ],
    highlight: 'An all-time classic 10-goal thriller at Miami Stadium — Bukayo Saka secured a hat-trick, while Kylian Mbappé scored twice to launch an incredible second-half French comeback that ultimately fell just short.',
  },
  {
    id: 3,
    stage: 'Semi-final',
    date: 'Jul 15, 2026',
    home: 'Argentina',
    away: 'England',
    homeFlag: '🇦🇷',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    score: '3 - 2',
    scorers: [
      { name: 'Messi', team: 'home', minute: '23' },
      { name: 'Bellingham', team: 'away', minute: '40' },
      { name: 'Messi', team: 'home', minute: '61' },
      { name: 'Kane', team: 'away', minute: '75' },
      { name: 'Álvarez', team: 'home', minute: '88' },
    ],
    highlight: 'Messi nets a brace as Argentina edge England to reach the final of the first 48-team World Cup.',
  },
]

const STATS = [
  { label: 'Champions', value: '🇪🇸 Spain', sub: 'Beat Argentina 1-0 (AET)' },
  { label: 'Golden Boot', value: 'Mbappé', sub: '10 goals · 4 assists · France' },
  { label: 'All-time WC Scorer', value: 'Mbappé', sub: '22 career WC goals (record)' },
  { label: 'Final Goal', value: 'F. Torres', sub: '106\' · assist N. Williams' },
]

export default function WorldCupSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrophyIcon className="h-5 w-5 text-accent-500" />
        <h3 className="font-display font-bold text-base">FIFA World Cup 2026 · Concluded</h3>
      </div>

      <div className="card p-4 bg-gradient-to-r from-accent-500/10 to-accent-400/5 border-accent-200 dark:border-accent-800/50">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="font-display font-bold text-lg">Spain are World Champions</p>
            <p className="text-sm text-ink-600 dark:text-ink-300">1-0 vs Argentina (AET) · Ferran Torres 106'</p>
          </div>
        </div>
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
