import { useEffect, useRef, useState } from 'react'
import { useLeaderboard, useSubmitScore } from '../lib/hooks'
import { useAuthStore } from '../store/auth'
import { Avatar } from '../components/Avatar'
import { TrophyIcon, GamepadIcon, RefreshIcon } from '../components/icons'
import { Spinner } from '../components/Loaders'

type GameId = 'reaction' | 'memory' | 'tap'

const GAMES: { id: GameId; name: string; desc: string }[] = [
  { id: 'reaction', name: 'Reaction Rush', desc: 'Tap the moment the box turns green.' },
  { id: 'memory', name: 'Memory Match', desc: 'Flip pairs of cards before time runs out.' },
  { id: 'tap', name: 'Tap Frenzy', desc: 'Tap as many dots as you can in 10 seconds.' },
]

export default function GamesPage() {
  const [active, setActive] = useState<GameId | null>(null)

  if (active) {
    return <GameView id={active} onExit={() => setActive(null)} />
  }

  return (
    <div className="px-4 md:px-0 py-4 md:py-0">
      <div className="flex items-center gap-2 mb-4">
        <GamepadIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        <h2 className="font-display font-bold text-xl">Mini Games</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setActive(g.id)} className="card p-5 text-left hover:shadow-pop transition group">
            <div className="h-12 w-12 rounded-xl bg-brand-50 dark:bg-brand-900/40 grid place-items-center mb-3 group-hover:scale-110 transition">
              <GamepadIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="font-display font-bold">{g.name}</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{g.desc}</p>
            <span className="inline-block mt-3 text-sm font-semibold text-brand-600 dark:text-brand-400">Play →</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function GameView({ id, onExit }: { id: GameId; onExit: () => void }) {
  const meta = GAMES.find((g) => g.id === id)!
  const [score, setScore] = useState<number | null>(null)
  const submit = useSubmitScore()

  useEffect(() => {
    if (score !== null) {
      submit.mutate({ game: id, score })
    }
  }, [score, id, submit])

  return (
    <div className="px-4 md:px-0 py-4 md:py-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={onExit} className="text-sm text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100 mb-1">← Back to games</button>
          <h2 className="font-display font-bold text-xl">{meta.name}</h2>
        </div>
        {score !== null && (
          <div className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <TrophyIcon className="h-4 w-4" /> Last score: {score}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {id === 'reaction' && <ReactionGame onScore={setScore} />}
          {id === 'memory' && <MemoryGame onScore={setScore} />}
          {id === 'tap' && <TapGame onScore={setScore} />}
        </div>
        <Leaderboard game={id} />
      </div>
    </div>
  )
}

function Leaderboard({ game }: { game: string }) {
  const { data, isLoading } = useLeaderboard(game)
  const me = useAuthStore((s) => s.user?.id)
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrophyIcon className="h-5 w-5 text-accent-500" />
        <h3 className="font-display font-bold">Leaderboard</h3>
      </div>
      {isLoading ? <div className="py-6 flex justify-center"><Spinner /></div> : null}
      {!isLoading && data && data.length === 0 && <p className="text-sm text-ink-500 dark:text-ink-400">No scores yet. Be the first!</p>}
      <ol className="space-y-2">
        {data?.map((s, i) => (
          <li key={s.id} className={`flex items-center gap-3 px-2 py-2 rounded-lg ${s.user_id === me ? 'bg-brand-50 dark:bg-brand-900/30' : ''}`}>
            <span className={`h-7 w-7 grid place-items-center rounded-full text-xs font-bold ${i === 0 ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300' : i === 1 ? 'bg-ink-200 text-ink-700 dark:bg-ink-700 dark:text-ink-200' : i === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400'}`}>
              {i + 1}
            </span>
            <Avatar url={s.profile?.avatar_url} username={s.profile?.username} size={28} />
            <span className="flex-1 text-sm font-medium truncate">{s.profile?.username}</span>
            <span className="text-sm font-bold">{s.score}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ---------- Reaction Rush ---------- */
function ReactionGame({ onScore }: { onScore: (n: number) => void }) {
  const [state, setState] = useState<'idle' | 'waiting' | 'go' | 'result' | 'tooEarly'>('idle')
  const [start, setStart] = useState(0)
  const [result, setResult] = useState(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function begin() {
    setState('waiting')
    const delay = 1200 + Math.random() * 2500
    timeout.current = setTimeout(() => {
      setStart(Date.now())
      setState('go')
    }, delay)
  }

  function tap() {
    if (state === 'idle' || state === 'result' || state === 'tooEarly') {
      begin()
    } else if (state === 'waiting') {
      if (timeout.current) clearTimeout(timeout.current)
      setState('tooEarly')
    } else if (state === 'go') {
      const ms = Date.now() - start
      setResult(ms)
      onScore(Math.max(1, Math.round(1000 - ms)))
      setState('result')
    }
  }

  const bg = state === 'go' ? 'bg-emerald-500' : state === 'waiting' ? 'bg-brand-600' : state === 'tooEarly' ? 'bg-red-500' : 'bg-ink-100 dark:bg-ink-800'
  const msg = state === 'idle' ? 'Tap to start' : state === 'waiting' ? 'Wait for green…' : state === 'go' ? 'TAP NOW!' : state === 'tooEarly' ? 'Too early! Tap to retry' : `${result} ms — tap to retry`

  return (
    <button onClick={tap} className={`w-full h-72 rounded-2xl ${bg} ${state === 'idle' || state === 'tooEarly' || state === 'result' ? 'text-ink-800 dark:text-ink-100' : 'text-white'} font-display font-bold text-2xl grid place-items-center transition-colors`}>
      {msg}
    </button>
  )
}

/* ---------- Memory Match ---------- */
const EMOJIS = ['🚀', '🌟', '🎯', '🎲', '🧩', '🎨']

function MemoryGame({ onScore }: { onScore: (n: number) => void }) {
  const [cards] = useState(() => {
    const pairs = [...EMOJIS, ...EMOJIS]
    return pairs.sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }))
  })
  const [state, setState] = useState(cards)
  const [open, setOpen] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)
  const lock = useRef(false)

  function flip(i: number) {
    if (lock.current || state[i].flipped || state[i].matched) return
    const next = state.map((c, idx) => (idx === i ? { ...c, flipped: true } : c))
    setState(next)
    const newOpen = [...open, i]
    setOpen(newOpen)
    if (newOpen.length === 2) {
      setMoves((m) => m + 1)
      lock.current = true
      const [a, b] = newOpen
      if (next[a].emoji === next[b].emoji) {
        setTimeout(() => {
          setState((s) => s.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c)))
          setOpen([])
          lock.current = false
        }, 400)
      } else {
        setTimeout(() => {
          setState((s) => s.map((c, idx) => (idx === a || idx === b ? { ...c, flipped: false } : c)))
          setOpen([])
          lock.current = false
        }, 800)
      }
    }
  }

  useEffect(() => {
    if (state.every((c) => c.matched) && !done) {
      setDone(true)
      onScore(Math.max(10, 200 - moves * 10))
    }
  }, [state, done, moves, onScore])

  function reset() {
    setState(cards.map((c) => ({ ...c, flipped: false, matched: false })))
    setMoves(0)
    setDone(false)
    setOpen([])
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-ink-500 dark:text-ink-400">Moves: <b className="text-ink-800 dark:text-ink-100">{moves}</b></span>
        <button onClick={reset} className="icon-btn"><RefreshIcon className="h-5 w-5" /></button>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {state.map((c, i) => (
          <button
            key={c.id}
            onClick={() => flip(i)}
            className={`aspect-square rounded-xl text-2xl grid place-items-center transition-all ${c.flipped || c.matched ? 'bg-white border-2 border-brand-500 dark:bg-ink-800' : 'bg-brand-600 text-transparent'}`}
          >
            <span className={c.flipped || c.matched ? '' : 'opacity-0'}>{c.emoji}</span>
          </button>
        ))}
      </div>
      {done && <p className="text-center mt-4 text-sm font-semibold text-brand-600 dark:text-brand-400">Solved in {moves} moves!</p>}
    </div>
  )
}

/* ---------- Tap Frenzy ---------- */
function TapGame({ onScore }: { onScore: (n: number) => void }) {
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(10)
  const [count, setCount] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  function start() {
    setPlaying(true)
    setCount(0)
    setTime(10)
    timer.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (timer.current) clearInterval(timer.current)
          setPlaying(false)
          onScore(count + 1)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function hit() {
    setCount((c) => c + 1)
    setPos({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 70 })
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-ink-500 dark:text-ink-400">Time: <b className="text-ink-800 dark:text-ink-100">{time}s</b></span>
        <span className="text-sm text-ink-500 dark:text-ink-400">Score: <b className="text-ink-800 dark:text-ink-100">{count}</b></span>
      </div>
      <div className="relative h-72 rounded-xl bg-ink-50 dark:bg-ink-950 overflow-hidden">
        {!playing && count === 0 && (
          <button onClick={start} className="absolute inset-0 grid place-items-center font-display font-bold text-brand-600 dark:text-brand-400">Tap to start</button>
        )}
        {playing && (
          <button
            onClick={hit}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 text-white font-bold shadow-pop active:scale-90 transition"
          >
            TAP
          </button>
        )}
        {!playing && count > 0 && (
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display font-bold text-2xl text-ink-800 dark:text-ink-100">{count} taps</p>
              <button onClick={start} className="btn-primary mt-3">Play again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
