import { useState } from 'react'

type CricketMatch = {
  id: number
  stage: string
  date: string
  home: string
  away: string
  homeFlag: string
  awayFlag: string
  score: string
  status: 'Live' | 'Upcoming' | 'Result'
  detail: string
  innings: { team: 'home' | 'away'; runs: number; wickets: number; overs: string }[]
  highlight: string
}

const MATCHES: CricketMatch[] = [
  {
    id: 1,
    stage: '3rd ODI · Series Decider',
    date: 'Jul 20, 2026',
    home: 'England',
    away: 'India',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🇮🇳',
    score: 'ENG won by 27 runs',
    status: 'Result',
    detail: 'England win the 3-match series 2-1 · Lord\'s',
    innings: [
      { team: 'home', runs: 387, wickets: 3, overs: '50.0' },
      { team: 'away', runs: 360, wickets: 7, overs: '50.0' },
    ],
    highlight: 'England blasted 387/3 behind Ben Duckett\'s 142 and Jacob Bethell\'s 91. India replied with 360/7 — Rohit Sharma 138, Shubman Gill 77, Virat Kohli 74 — but fell 27 short. Bethell was Player of the Match; Joe Root Player of the Series.',
  },
  {
    id: 2,
    stage: '4th ODI',
    date: 'Jul 19, 2026',
    home: 'West Indies',
    away: 'New Zealand',
    homeFlag: '🇧🇧',
    awayFlag: '🇳🇿',
    score: 'NZ won by 1 wicket',
    status: 'Result',
    detail: 'New Zealand lead the series 3-1 · Kensington Oval',
    innings: [
      { team: 'home', runs: 188, wickets: 10, overs: '47.2' },
      { team: 'away', runs: 189, wickets: 9, overs: '48.5' },
    ],
    highlight: 'A low-scoring thriller — Mark Chapman\'s 80 was the backbone of West Indies\' 188 all out. Chasing, skipper Mitchell Santner (34*) held his nerve in a 9-run final-wicket stand with Jayden Lennox to seal a 1-wicket win and an unassailable 3-1 series lead.',
  },
  {
    id: 3,
    stage: '3rd T20I',
    date: 'Jul 19, 2026',
    home: 'Zimbabwe',
    away: 'Bangladesh',
    homeFlag: '🇿🇼',
    awayFlag: '🇧🇩',
    score: 'Series tied 1-1',
    status: 'Result',
    detail: 'Series level after 3 matches',
    innings: [],
    highlight: 'The 3rd T20I concluded yesterday with the series tied 1-1 going into the decider.',
  },
]

const STATS = [
  { label: 'POTM (ENG vs IND)', value: 'J. Bethell', sub: '91 runs · 1 wicket' },
  { label: 'Player of Series', value: 'J. Root', sub: 'England vs India ODI' },
  { label: 'Top Score', value: 'B. Duckett', sub: '142 off 128 balls' },
  { label: 'Series Result', value: 'ENG 2-1 IND', sub: 'Won by 27 runs · Lord\'s' },
]

export default function CricketSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  const statusColor = (s: CricketMatch['status']) =>
    s === 'Live' ? 'bg-red-500 text-white' : s === 'Upcoming' ? 'bg-accent-500 text-white' : 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🏏</span>
        <h3 className="font-display font-bold text-base">International Cricket · Results</h3>
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
                  <span className="text-sm font-medium">{m.home}</span>
                  <span className="text-xl">{m.homeFlag}</span>
                </div>
                <div className="flex flex-col items-center min-w-[110px]">
                  <span className="font-display font-bold text-xs text-center leading-tight">{m.score}</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xl">{m.awayFlag}</span>
                  <span className="text-sm font-medium">{m.away}</span>
                </div>
                <span className={`text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open && (
                <div className="px-4 pb-4 pt-1 border-t border-ink-100 dark:border-ink-800 animate-fade-in">
                  <p className="text-[11px] text-ink-500 dark:text-ink-400 mt-2">{m.stage} · {m.date}</p>
                  <p className="text-sm font-medium mt-1">{m.detail}</p>
                  {m.innings.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {m.innings.map((inn, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-ink-50 dark:bg-ink-800/50 rounded-lg px-3 py-1.5">
                          <span className="font-medium flex items-center gap-1.5">
                            <span className="text-base">{inn.team === 'home' ? m.homeFlag : m.awayFlag}</span>
                            {inn.team === 'home' ? m.home : m.away}
                          </span>
                          <span className="font-mono font-semibold">{inn.runs}/{inn.wickets} <span className="text-ink-400 text-xs">({inn.overs} ov)</span></span>
                        </div>
                      ))}
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
