import { useState } from 'react'

type Resource = {
  id: number
  title: string
  desc: string
  tag: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  type: string
}

const CODING: Resource[] = [
  { id: 1, title: 'Build a REST API with FastAPI', desc: 'Set up endpoints, validation, and async DB access in under an hour.', tag: 'Python', level: 'Intermediate', duration: '45 min', type: 'Tutorial' },
  { id: 2, title: 'React Server Components deep dive', desc: 'Understand the RSC mental model and when to go server vs client.', tag: 'React', level: 'Advanced', duration: '30 min', type: 'Article' },
  { id: 3, title: 'TypeScript generics by example', desc: 'From identity functions to conditional types — 10 hands-on snippets.', tag: 'TypeScript', level: 'Intermediate', duration: '25 min', type: 'Playground' },
  { id: 4, title: 'Docker for frontend devs', desc: 'Containerize a Vite app and hot-reload inside the container.', tag: 'DevOps', level: 'Beginner', duration: '40 min', type: 'Lab' },
]

const SKILLUP: Resource[] = [
  { id: 5, title: 'Mastering public speaking', desc: 'A 5-day sprint to structure talks and command the room.', tag: 'Communication', level: 'Beginner', duration: '5 days', type: 'Course' },
  { id: 6, title: 'Design thinking for product folks', desc: 'Run a real ideation workshop with templates included.', tag: 'Product', level: 'Intermediate', duration: '2 hr', type: 'Workshop' },
  { id: 7, title: 'Negotiation fundamentals', desc: 'BATNA, anchoring, and 6 scripts you can use this week.', tag: 'Career', level: 'Beginner', duration: '1 hr', type: 'Course' },
  { id: 8, title: 'Data storytelling', desc: 'Turn dashboards into decisions with the right narrative arc.', tag: 'Analytics', level: 'Intermediate', duration: '50 min', type: 'Article' },
]

const levelColor: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Intermediate: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  Advanced: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
}

function ResourceCard({ r }: { r: Resource }) {
  const [done, setDone] = useState(false)
  return (
    <div className={`card p-4 transition ${done ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="chip bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">{r.tag}</span>
            <span className={`chip ${levelColor[r.level]}`}>{r.level}</span>
          </div>
          <h4 className="font-semibold text-sm leading-snug">{r.title}</h4>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">{r.desc}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] text-ink-400">{r.type} · {r.duration}</span>
        <button
          onClick={() => setDone((d) => !d)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
        >
          {done ? '✓ Done' : 'Start'}
        </button>
      </div>
    </div>
  )
}

export default function LearnSection() {
  const [tab, setTab] = useState<'coding' | 'skillup'>('coding')
  const list = tab === 'coding' ? CODING : SKILLUP

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-bold text-base">Learn</h3>
        <div className="flex bg-ink-100 dark:bg-ink-800 rounded-lg p-0.5 ml-auto">
          {(['coding', 'skillup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${tab === t ? 'bg-white text-brand-700 shadow-soft dark:bg-ink-900 dark:text-brand-300' : 'text-ink-500 dark:text-ink-400'}`}
            >
              {t === 'coding' ? 'Coding' : 'Skill Up'}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((r) => <ResourceCard key={r.id} r={r} />)}
      </div>
    </div>
  )
}
