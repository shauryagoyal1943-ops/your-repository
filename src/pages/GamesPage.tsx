import { useEffect, useRef, useState } from 'react'
import { useLeaderboard, useSubmitScore } from '../lib/hooks'
import { useAuthStore } from '../store/auth'
import { Avatar } from '../components/Avatar'
import { TrophyIcon, GamepadIcon, RefreshIcon } from '../components/icons'
import { Spinner } from '../components/Loaders'

type GameId = 'reaction' | 'memory' | 'tap' | 'guess' | 'simon' | '2048'

const GAMES: { id: GameId; name: string; desc: string }[] = [
  { id: 'reaction', name: 'Reaction Rush', desc: 'Tap the moment the box turns green.' },
  { id: 'memory', name: 'Memory Match', desc: 'Flip pairs of cards before time runs out.' },
  { id: 'tap', name: 'Tap Frenzy', desc: 'Tap as many dots as you can in 10 seconds.' },
  { id: 'guess', name: 'Number Hunt', desc: 'Guess the secret number in the fewest tries.' },
  { id: 'simon', name: 'Echo', desc: 'Repeat the growing sequence of tones.' },
  { id: '2048', name: 'Merge 2048', desc: 'Combine tiles to reach 2048.' },
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
          {id === 'guess' && <GuessGame onScore={setScore} />}
          {id === 'simon' && <SimonGame onScore={setScore} />}
          {id === '2048' && <MergeGame onScore={setScore} />}
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

function GuessGame({ onScore }: { onScore: (n: number) => void }) {
  const [target, setTarget] = useState<number | null>(null)
  const [guess, setGuess] = useState('')
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)

  function start() {
    setTarget(Math.floor(Math.random() * 100) + 1)
    setGuess('')
    setTries(0)
    setMsg('')
    setDone(false)
  }

  function check(e: React.FormEvent) {
    e.preventDefault()
    if (target == null || done) return
    const n = parseInt(guess, 10)
    if (Number.isNaN(n)) return
    const t = tries + 1
    setTries(t)
    if (n === target) {
      setMsg(`Correct! Solved in ${t} tries.`)
      setDone(true)
      onScore(Math.max(1, 100 - t * 10))
    } else if (n < target) {
      setMsg('Higher ↑')
    } else {
      setMsg('Lower ↓')
    }
    setGuess('')
  }

  return (
    <div className="card p-5">
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-3">Guess a number between 1 and 100. Fewer tries = higher score.</p>
      {target == null ? (
        <button onClick={start} className="btn-primary">Start</button>
      ) : (
        <form onSubmit={check} className="flex gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={done}
            className="input flex-1"
            placeholder="Your guess"
            autoFocus
          />
          <button type="submit" disabled={done} className="btn-primary">Guess</button>
        </form>
      )}
      <div className="mt-3 text-sm">
        {tries > 0 && <span className="text-ink-500 dark:text-ink-400">Tries: {tries} · </span>}
        <span className={done ? 'font-bold text-emerald-600' : 'text-ink-700 dark:text-ink-200'}>{msg}</span>
      </div>
      {done && <button onClick={start} className="btn-secondary mt-3">Play again</button>}
    </div>
  )
}

function SimonGame({ onScore }: { onScore: (n: number) => void }) {
  const COLORS = ['bg-red-500', 'bg-emerald-500', 'bg-sky-500', 'bg-amber-500']
  const [seq, setSeq] = useState<number[]>([])
  const [userIdx, setUserIdx] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [msg, setMsg] = useState('Press start')

  async function flash(i: number) {
    setActive(i)
    await new Promise((r) => setTimeout(r, 400))
    setActive(null)
    await new Promise((r) => setTimeout(r, 150))
  }

  async function playSeq(s: number[]) {
    setPlaying(true)
    for (const i of s) await flash(i)
    setPlaying(false)
  }

  function start() {
    const s = [Math.floor(Math.random() * 4)]
    setSeq(s)
    setUserIdx(0)
    setMsg('Watch…')
    playSeq(s).then(() => setMsg('Your turn'))
  }

  async function tap(i: number) {
    if (playing || seq.length === 0) return
    await flash(i)
    if (i === seq[userIdx]) {
      const next = userIdx + 1
      if (next === seq.length) {
        const score = seq.length
        onScore(score * 10)
        const extended = [...seq, Math.floor(Math.random() * 4)]
        setSeq(extended)
        setUserIdx(0)
        setMsg(`Round ${seq.length} cleared! Watch…`)
        setTimeout(() => playSeq(extended).then(() => setMsg('Your turn')), 600)
      } else {
        setUserIdx(next)
      }
    } else {
      setMsg(`Game over! You reached round ${seq.length}.`)
      setSeq([])
      setUserIdx(0)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-ink-500 dark:text-ink-400">Round: <b className="text-ink-800 dark:text-ink-100">{seq.length || 0}</b></span>
        <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{msg}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
        {COLORS.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`h-24 rounded-xl transition ${c} ${active === i ? 'brightness-150 scale-95' : 'opacity-80'} ${playing ? 'cursor-not-allowed' : ''}`}
          />
        ))}
      </div>
      <button onClick={start} className="btn-primary mt-4 mx-auto block">Start</button>
    </div>
  )
}

function MergeGame({ onScore }: { onScore: (n: number) => void }) {
  const SIZE = 4
  const [grid, setGrid] = useState<number[][]>([])
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
  }

  function addTile(g: number[][]) {
    const empties: [number, number][] = []
    g.forEach((row, r) => row.forEach((v, c) => v === 0 && empties.push([r, c])))
    if (empties.length === 0) return g
    const [r, c] = empties[Math.floor(Math.random() * empties.length)]
    g[r][c] = Math.random() < 0.9 ? 2 : 4
    return g
  }

  function start() {
    let g = emptyGrid()
    g = addTile(addTile(g))
    setGrid(g)
    setScore(0)
    setOver(false)
  }

  function slide(row: number[]) {
    const nonZero = row.filter((v) => v)
    const merged: number[] = []
    let gained = 0
    for (let i = 0; i < nonZero.length; i++) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const val = nonZero[i] * 2
        merged.push(val)
        gained += val
        i++
      } else {
        merged.push(nonZero[i])
      }
    }
    while (merged.length < SIZE) merged.push(0)
    return { row: merged, gained }
  }

  function move(dir: 'left' | 'right' | 'up' | 'down') {
    if (over || grid.length === 0) return
    let g = grid.map((r) => [...r])
    let totalGained = 0
    const rotate = (m: number[][]) => m[0].map((_, i) => m.map((row) => row[i]))
    if (dir === 'up') g = rotate(g)
    if (dir === 'down') g = rotate(g).reverse()
    if (dir === 'right') g = g.map((r) => [...r].reverse())

    g = g.map((row) => {
      const { row: nr, gained } = slide(row)
      totalGained += gained
      return nr
    })

    if (dir === 'up') g = rotate(g)
    if (dir === 'down') g = rotate(g.reverse())
    if (dir === 'right') g = g.map((r) => [...r].reverse())

    const moved = JSON.stringify(g) !== JSON.stringify(grid)
    if (moved) {
      g = addTile(g)
      setGrid(g)
      setScore((s) => {
        const ns = s + totalGained
        onScore(ns)
        return ns
      })
      if (!g.some((row) => row.includes(0))) setOver(true)
    }
  }

  const tileColor = (v: number) => {
    if (!v) return 'bg-ink-100 dark:bg-ink-800'
    const colors: Record<number, string> = {
      2: 'bg-amber-100 text-amber-900', 4: 'bg-amber-200 text-amber-900',
      8: 'bg-orange-300 text-white', 16: 'bg-orange-400 text-white',
      32: 'bg-red-400 text-white', 64: 'bg-red-500 text-white',
      128: 'bg-emerald-500 text-white', 256: 'bg-emerald-600 text-white',
      512: 'bg-sky-500 text-white', 1024: 'bg-sky-600 text-white', 2048: 'bg-brand-600 text-white',
    }
    return colors[v] || 'bg-brand-700 text-white'
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-ink-500 dark:text-ink-400">Score: <b className="text-ink-800 dark:text-ink-100">{score}</b></span>
        <button onClick={start} className="btn-secondary text-xs px-3 py-1.5">New game</button>
      </div>
      {grid.length === 0 ? (
        <button onClick={start} className="btn-primary mx-auto block">Start</button>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {grid.flat().map((v, i) => (
              <div key={i} className={`h-16 rounded-lg grid place-items-center font-display font-bold text-lg ${tileColor(v)}`}>
                {v || ''}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto mt-4">
            <div />
            <button onClick={() => move('up')} className="btn-secondary py-2">↑</button>
            <div />
            <button onClick={() => move('left')} className="btn-secondary py-2">←</button>
            <button onClick={() => move('down')} className="btn-secondary py-2">↓</button>
            <button onClick={() => move('right')} className="btn-secondary py-2">→</button>
          </div>
          {over && <p className="text-center text-sm text-red-500 mt-3">No moves left! Final score: {score}</p>}
        </>
      )}
    </div>
  )
}
