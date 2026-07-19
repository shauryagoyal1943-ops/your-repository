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
    stage: '3rd Test · Day 4',
    date: 'Jul 19, 2026',
    home: 'England',
    away: 'India',
    homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    awayFlag: '🇮🇳',
    score: 'ENG 427 & 198/4',
    status: 'Live',
    detail: 'India need 312 more to win · Lead 86',
    innings: [
      { team: 'home', runs: 427, wickets: 10, overs: '128.3' },
      { team: 'away', runs: 314, wickets: 10, overs: '104.1' },
      { team: 'home', runs: 198, wickets: 4, overs: '62.0' },
    ],
    highlight: 'Root anchored the 1st innings with 156, while Bumrah took 6/48. India trail by 86 with 6 sessions left at Lord\'s.',
  },
  {
    id: 2,
    stage: '2nd ODI',
    date: 'Jul 20, 2026',
    home: 'Australia',
    away: 'Pakistan',
    homeFlag: '🇦🇺',
    awayFlag: '🇵🇰',
    score: 'vs',
    status: 'Upcoming',
    detail: 'Series tied 1-1 · MCG · 09:30 local',
    innings: [],
    highlight: 'Series decider at the MCG — Australia levelled the series with a 5-wicket win in Adelaide courtesy of Head\'s 112.',
  },
  {
    id: 3,
    stage: '1st ODI',
    date: 'Jul 18, 2026',
    home: 'Sri Lanka',
    away: 'South Africa',
    homeFlag: '🇱🇰',
    awayFlag: '🇿🇦',
    score: 'SL 232 all out',
    status: 'Result',
    detail: 'South Africa won by 4 wickets (23 balls remaining)',
    innings: [
      { team: 'home', runs: 232, wickets: 10, overs: '47.4' },
      { team: 'away', runs: 236, wickets: 6, overs: '46.1' },
    ],
    highlight: 'Markram\'s unbeaten 88 guided the Proteas home after Maharaj\'s 4/33 had restricted Sri Lanka in Colombo.',
  },
]

const STATS = [
  { label: 'Top Run-scorer', value: 'J. Root', sub: '642 runs · avg 91.7' },
  { label: 'Leading Wickets', value: 'J. Bumrah', sub: '24 wickets · 4 maidens' },
  { label: 'Highest Score', value: 'H. Amla Jr.', sub: '184 vs Sri Lanka' },
  { label: 'Live Now', value: 'ENG vs IND', sub: 'Lord\'s · Day 4' },
]

export default function CricketSection() {
  const [openId, setOpenId] = useState<number | null>(1)

  const statusColor = (s: CricketMatch['status']) =>
    s === 'Live' ? 'bg-red-500 text-white' : s === 'Upcoming' ? 'bg-accent-500 text-white' : 'bg-ink-200 dark:bg-ink-700 text-ink-600 dark:text-ink-300'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🏏</span>
        <h3 className="font-display font-bold text-base">Cricket · Latest Scores</h3>
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
                <div className="flex flex-col items-center min-w-[90px]">
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
